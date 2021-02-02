import React, { useRef } from "react";
import { extend, useThree, useFrame } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

const CameraControls = (props) => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  const controls = useRef();

  useFrame(() => controls.current.update());

  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      autoRotate={false}
      enableZoom={true}
      minDistance={props.minDistance}
      maxDistance={props.maxDistance}
      enableDamping={true}
      dampingFactor={0.1}
      enablePan={true}
      maxAzimuthAngle={Math.PI/2}
      minAzimuthAngle={-Math.PI/2}
      maxPolarAngle={Math.PI-1}
      minPolarAngle={1}
    />
  );
};

export default CameraControls;