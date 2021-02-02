import React, { useState, useRef, useEffect } from 'react'
import { useThree } from 'react-three-fiber'

const MouseHelper = (props) => {

    const {intersect} = useThree();

    const helper = useRef();

    const onMouseMove = () => {
        if (intersect()[0]=== undefined) {return}
        if (intersect().length > 0 && intersect()[0].object.name !== "marker") {
            const p = helper.current.position.copy(intersect()[0].point)
            const n = intersect()[0].face.normal.clone()
            const mesh= intersect()[0].object
            n.transformDirection( mesh.matrixWorld )
            
            n.multiplyScalar( 10 );
            n.add( intersect()[0].point );
            

            helper.current.lookAt( n )
            

            if(props.typeExam === "soft-tissues-exam")
             {props.handleOrientation(helper.current.rotation)}
            
    
            props.handlePosition(helper.current.position)
            
            //console.log(helper.current.rotation)
            
        }
    }

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);        
        return () => {
        window.removeEventListener('mousemove', onMouseMove);
        }
    }, [])


    

    return (
        <mesh name={'mouseHelper'} ref={helper} visible={false} position={[0, 0, 0]} rotation={[0, 0, 0]}  >
            <boxGeometry attach="geometry" args={[0.01, 0.01, 0.02]} />
            <meshStandardMaterial
                attach="material"
                color="green"
            />
            {/* <axesHelper args={[0.3, 0.3, 0.3]} /> */}
        </mesh>
    );
}


export default MouseHelper;