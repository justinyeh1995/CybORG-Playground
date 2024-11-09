"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import ForcedGraphBase from './forced-graph-base';
import { StateSnapshot, NextStepResponse } from '@/constants/react-forced-graph';
import { TabsWrapperProvider } from './tab-wrapper';

interface ReactForcedGraphComponentProps { 
  gameID: string;
  width: number;
  height: number;
  simulationRunning: boolean;
  currentStep: number;
  maxStep: number;
  stateSnapshot: StateSnapshot | null;
  handleNextStep: (gameID: string) => void;
  handlePreviousStep: (gameID: string) => void;
  handleStopSimulation: (gameID: string) => void;
}

export default function ReactForcedGraphComponent({
  gameID,
  width, 
  height,
  simulationRunning,
  currentStep,
  maxStep,
  stateSnapshot,
  handleNextStep,
  handlePreviousStep,
  handleStopSimulation
}: ReactForcedGraphComponentProps) {

  const imgs = ["Defender", "Enterprise0", "Enterprise1", "Enterprise2", "Enterprise_router", 
    "Op_Host0", "Op_Host1", "Op_Host2", "Op_Server0", "Operational_router", 
    "User0", "User1", "User2", "User3", "User4", "User_router"];
  const defaultColor = ["white", "white", "white", "white", "white", 
    "white", "white", "white", "white", "white", 
    "red", "white", "white", "white", "white", "white"]
  const links = [
      {
          "source": "Defender",
          "target": "Enterprise_router"
      },
      {
          "source": "Enterprise0",
          "target": "Enterprise_router"
      },
      {
          "source": "Enterprise1",
          "target": "Enterprise_router"
      },
      {
          "source": "Enterprise2",
          "target": "Enterprise_router"
      },
      {
          "source": "Op_Host0",
          "target": "Operational_router"
      },
      {
          "source": "Op_Host1",
          "target": "Operational_router"
      },
      {
          "source": "Op_Host2",
          "target": "Operational_router"
      },
      {
          "source": "Op_Server0",
          "target": "Operational_router"
      },
      {
          "source": "User0",
          "target": "User_router"
      },
      {
          "source": "User1",
          "target": "User_router"
      },
      {
          "source": "User2",
          "target": "User_router"
      },
      {
          "source": "User3",
          "target": "User_router"
      },
      {
          "source": "User4",
          "target": "User_router"
      },
      {
          "source": "Enterprise_router",
          "target": "Operational_router"
      },
      {
          "source": "Enterprise_router",
          "target": "User_router"
      },
      {
          "source": "Operational_router",
          "target": "User_router"
      }
  ]
  // connected graph
  const gDataRed = {
    nodes: imgs.map((img, index) => {
      return {
        id: `${img}-red`, // Unique ID for internal use
        label: img, // Display label, can be the same across different nodes
        img: img,
        color: stateSnapshot?.Red?.node_colors[index] || defaultColor[index],
        borderColor: stateSnapshot?.Red?.node_borders[index]?.color || "white",
      };
    }),
    links: links.map((link, index) => ({
      source: `${link.source}-red`, // Update to match the red nodes' unique IDs
      target: `${link.target}-red`,
      id: `link-red-${index}`, // Unique ID for each link
    })),
  };
  
  const gDataBlue = {
    nodes: imgs.map((img, index) => {
      return {
        id: `${img}-blue`, // Unique ID for internal use
        label: img, // Display label, can be the same across different nodes
        img: img,
        color: stateSnapshot?.Blue?.node_colors[index] || defaultColor[index],
        borderColor: stateSnapshot?.Blue?.node_borders[index]?.color || "white",
      };
    }),
    links: links.map((link, index) => ({
      source: `${link.source}-blue`, // Update to match the red nodes' unique IDs
      target: `${link.target}-blue`,
      id: `link-blue-${index}`, // Unique ID for each link
    })),
  };
  
  
  // we have three types of images, host, server and router
  // if the img contains "router" then we map it to the router.png file
  // if the img contains "server" then we map it to the server.png file
  // else we map it to the host.png file
  const getNodeImage = (img: string) => {
    if (img.toLowerCase().includes("router")) return "router.png";
    if (img.toLowerCase().includes("server")) return "server.png";
    return "host.png";
  };

  // useEffect to track changes in currentStep and maxStep
  useEffect(() => {
    console.log("currentStep:", currentStep, "maxStep:", maxStep);
  }, [currentStep, maxStep]);
  
  // Add tab to the card to switch between Red and Blue team
  return (
    <Card className='h-full w-full'>
      <CardHeader>
        <h2 className="text-lg font-semibold">CybORG State Visualization</h2>
      </CardHeader>
      <CardContent className='p-0'>      
        <TabsWrapperProvider
          children = {{
            red: (
              <ForcedGraphBase
                gData={gDataRed}
                width={width}
                height={height}
                getNodeImage={getNodeImage}
              /> 
            ),
            blue: (
              <ForcedGraphBase
                gData={gDataBlue}
                width={width}
                height={height}
                getNodeImage={getNodeImage}
              />
            )
          }}
        />
        <div className="flex p-4 justify-center space-x-2">
          {/* <Button onClick={handleStartSimulation} disabled={simulationRunning}>Start Simulation</Button> */}
          <Button onClick={() => {handleNextStep(gameID)}} disabled={currentStep >= maxStep}>Next Step</Button>
          <Button onClick={() => handlePreviousStep(gameID)} disabled={currentStep <= 0}>Previous Step</Button>
          <Button onClick={() => handleStopSimulation(gameID)} disabled={!simulationRunning}>End Simulation</Button>
        </div>
      </CardContent>
    </Card>
  );
}
