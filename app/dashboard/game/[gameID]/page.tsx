'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import React, {useState, useEffect} from 'react';
 
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation'
import { NextStepResponse, StateSnapshot } from '@/constants/react-forced-graph';
import ReactForcedGraphComponent from '@/components/simulation/react-forced-graph';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
 
import {
  useWindowSize,
} from '@react-hook/window-size'
import { useMediaQuery } from '@/hooks/use-media-query';

const TerminalComponent = dynamic(
  () => import('@/components/simulation/terminal'),
  { ssr: false }
);

export default function page () {
  
  const [simulationRunning, setSimulationRunning] = useState(true);
  const [stateSnapshot, setStateSnapshot] = useState<StateSnapshot | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [latestStep, setLatestStep] = useState(0);
  const [maxStep, setMaxStep] = useState(10);
  const [width, height] = useWindowSize();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  
  // const { gameID } = params;
  const param = useParams<{gameID: string}>()
  const gameID = param.gameID

  const breadcrumbItems = [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Simulation', link: '/dashboard/simulation' },
        { title: `${gameID}`, link: `/dashboard/scan/${gameID}` }
  ];
  
  useEffect(() => {
    const fetchSimulationData = async () => {
      const res = await fetch(
        `http://localhost:5555/api/games/${gameID}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error('Failed to fetch game status')
      }
      const data = await res.json();
      const summary = data.summary;

      const currentStep: number = summary.steps;
      setCurrentStep(currentStep);
      setLatestStep(currentStep);
      console.log(currentStep);
      const completed: boolean = summary.completed;

      const configuration = data.configuration;
      const maxSteps: number = configuration.steps;
      setMaxStep(maxSteps);

      const state = await fetch(
        `http://localhost:5555/api/games/${gameID}/step/${currentStep}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error('Failed to fetch game status')
      }
      const snapshot: StateSnapshot = await state.json();
      setStateSnapshot(snapshot);
      if (completed) {
        setSimulationRunning(false);
        return;
      } 
    };
    fetchSimulationData();
  }, []);

  // use react query to fetch game configuration
  // const { data: gameConfig } = useQuery<GameConfig>(['gameConfig', gameID]);

  // if (!gameConfig) return <Loading />;

  // render the page
  // const { name, description, nodes, edges } = gameConfig;

  // const handleStartSimulation = () => {
  //   setSimulationRunning(true);
  // };

  const handleStopSimulation = () => {
    setSimulationRunning(false);
  };

  const handleNextStep = async (gameID: string) => {
    // Logic to proceed to the next step in the simulation
    console.log("Next step");
    if (currentStep >= maxStep ) 
      return;
    if (currentStep < latestStep) {
      const res = await fetch(
        `http://localhost:5555/api/games/${gameID}/step/${currentStep + 1}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error('Failed to fetch game status')
      }
      const snapshot: StateSnapshot = await res.json();
      setStateSnapshot(snapshot);
    } else {
      // Post request
      const res = await fetch(
        `http://localhost:5555/api/games/${gameID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "next_step",
          }),
        }
      );
      if (!res.ok) {
        setSimulationRunning(false);
        throw new Error('Failed to run the next step in the backend service:\n Runner process not running')
      }
      const data: NextStepResponse = await res.json();
      console.log(data);
      
      if (data.Completed) {
        setSimulationRunning(false);
      } else {
        setStateSnapshot(data.StateSnapshot);
      }
      setLatestStep(currentStep + 1);
    }

    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = async () => {
    // Logic to go back to the previous step in the simulation
    console.log("Previous step");
    if (currentStep > 0) {
      const res = await fetch(
        `http://localhost:5555/api/games/${gameID}/step/${currentStep - 1}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error('Failed to fetch game status')
      }
      const snapshot: StateSnapshot = await res.json();
      setStateSnapshot(snapshot);
      setCurrentStep(currentStep - 1);
    }

  };


  return (
    <div className="flex-1 space-y-4 p-8">
      <Breadcrumbs items={breadcrumbItems} />
      { isSmallScreen ? ( 
          <ResizablePanelGroup direction="vertical" 
          className="rounded-lg border" 
          style={{
            width: 0.8*width, 
            height: 0.7*height, 
          }}
          > 
            <ResizablePanel defaultSize={70}>  
              <ReactForcedGraphComponent
                gameID={gameID}
                width={0.8*width} 
                height={0.7*height}
                simulationRunning={simulationRunning}
                currentStep={currentStep}
                maxStep={maxStep}
                stateSnapshot={stateSnapshot}
                handleNextStep={handleNextStep}
                handlePreviousStep={handlePreviousStep}
                handleStopSimulation={handleStopSimulation}  
              /> 
              </ResizablePanel> 
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30}>
                <TerminalComponent gameID={gameID} />
            </ResizablePanel > 
        </ResizablePanelGroup>
        ) : (
          <ResizablePanelGroup direction="vertical" 
            className="rounded-lg border" 
            style={{
              width: 0.5*width, 
              height: 0.8*height
            }}
          > 
            <ResizablePanel defaultSize={70}>  
              <ReactForcedGraphComponent
                gameID={gameID}
                width={0.5*width} 
                height={0.8*height}
                simulationRunning={simulationRunning}
                currentStep={currentStep}
                maxStep={maxStep}
                stateSnapshot={stateSnapshot}
                handleNextStep={handleNextStep}
                handlePreviousStep={handlePreviousStep}
                handleStopSimulation={handleStopSimulation}  
              /> 
              </ResizablePanel> 
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30}>
                <TerminalComponent gameID={gameID} />
            </ResizablePanel > 
          </ResizablePanelGroup> 
        )
      }
    </div>
  );
}
