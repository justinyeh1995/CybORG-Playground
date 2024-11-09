"use client";
import ForceGraph3D, {NodeObject}  from 'react-force-graph-3d';
import * as THREE from 'three';
import React, {useEffect, useRef} from 'react';
import { gData } from '@/constants/react-forced-graph';

// Define the base ForceGraph component, which will be used for rendering both red and blue graphs
interface ForcedGraphBaseProps {
    gData: gData;
    width: number;
    height: number;
    getNodeImage: (img: string) => string;
  }
  
const ForcedGraphBase = ({
    gData,
    width,
    height,
    getNodeImage
  }
  : ForcedGraphBaseProps
  ) => {
    
    return (
      <>
        <ForceGraph3D
          graphData={gData}
          nodeLabel={(node) => `Node: ${node.label}`} // Display the label instead of the unique ID
          linkLabel={(link) =>
            `Link: ${(link.source as NodeObject).label} → ${(link.target as NodeObject).label}`
          }
          nodeThreeObject={({ img, label, color, borderColor }) => {
            const actualImg = getNodeImage(label);

  
            const imgTexture = new THREE.TextureLoader().load(`/imgs/${actualImg}`);
            imgTexture.colorSpace = THREE.SRGBColorSpace;
            
            const material = new THREE.SpriteMaterial({ 
              map: imgTexture,
              color: new THREE.Color(color), 
            });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(15, 15, 1);
  
            const sphereGeometry = new THREE.SphereGeometry(10, 32, 32);
            const sphereMaterial = new THREE.MeshBasicMaterial({
              color: borderColor || "white",
              transparent: true,
              opacity: 0.3, // Adjust opacity for a soft glow effect
              side: THREE.DoubleSide,
            });
  
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.scale.set(1.1, 1.1, 1.1); // Scale slightly larger than the sprite
            sphere.position.set(0, 0, 0); // Center it on the sprite
  
            // Group the sprite and the sphere together
            const group = new THREE.Group();
            group.add(sprite);
            group.add(sphere);
  
            return group;
          }}
          linkWidth={1}
          linkColor="green"
          linkOpacity={0.5}
          backgroundColor="aliceblue"
          width={1.0*width}
          height={0.5*height}
        />
      </>
    )
}

export default ForcedGraphBase;