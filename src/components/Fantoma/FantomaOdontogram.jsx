import React, { useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei/useGLTF'
import * as THREE from 'three'

export default function Model(props) {

    const group = useRef()

    const { nodes, materials } = useGLTF('/mesh/fantoma.gltf')
    console.log(props.teeth)
    
    const TeethMeshes =(e) =>{
        if (typeof props.teeth  !== 'undefined' ){
            return(
                Object.keys(props.teeth).map((item, i) => ( 
                        (() => {
                            switch (Object.values(props.teeth)[i].teeth_state_id) {
                
                                case 1:
                                    return (console.log('Ausente'))
                                    break;
                                case 2:
                                    return (
                                         <mesh
                                            key={Object.values(props.teeth)[i].fdi_name}
                                            material={materials.esmalte}
                                            geometry={nodes[Object.values(props.teeth)[i].fdi_name].geometry}
                                            position={nodes[Object.values(props.teeth)[i].fdi_name].position}
                                            rotation={nodes[Object.values(props.teeth)[i].fdi_name].rotation}
                                            scale={nodes[Object.values(props.teeth)[i].fdi_name].scale}
                                        /> 
                                    )
                                    break
                                case 3:
                                    return (
                                        <mesh
                                            key={Object.values(props.teeth)[i].fdi_name+'DF'}
                                            material={materials.esmalte}
                                            geometry={nodes[Object.values(props.teeth)[i].fdi_name+'DF'].geometry}
                                            position={nodes[Object.values(props.teeth)[i].fdi_name+'DF'].position}
                                            rotation={nodes[Object.values(props.teeth)[i].fdi_name+'DF'].rotation}
                                            scale={nodes[Object.values(props.teeth)[i].fdi_name+'DF'].scale}
                                        />
                                    )
                                    break
                                case 4:
                                    return (
                                        <mesh
                                            key={Object.values(props.teeth)[i].fdi_name+'RR'}
                                            material={materials.esmalte}
                                            geometry={nodes[Object.values(props.teeth)[i].fdi_name+'RR'].geometry}
                                            position={nodes[Object.values(props.teeth)[i].fdi_name+'RR'].position}
                                            rotation={nodes[Object.values(props.teeth)[i].fdi_name+'RR'].rotation}
                                            scale={nodes[Object.values(props.teeth)[i].fdi_name+'RR'].scale}
                                        />
                                    )
                                    break;
                                case 5:
                                    return (console.log('Implante'))
                                    break;
                                default:
                                    return (console.log('Default'))
                                
                            }
                        })()
                    )
                ) 
            )
        }
        e.stopPropagation()
    }  

    return (

        <group ref={group} {...props}>        

            <mesh
                material={materials.encia}
                geometry={nodes.reb_alv_inf_papilas.geometry}
                position={[-0.000799172383267432, -0.009652681648731232, 0.03410725295543671]}
                rotation={[1.8928228644193699, 0, 0]}
                scale={[0.2582273781299591, 0.2582273781299591, 0.2582273781299591]}
                material-opacity={props.opacity}
                material-transparent={true}
                material-side={THREE.FrontSide}
            />
            <mesh
                material={materials.encia}
                geometry={nodes.reb_alv_sup_papilas.geometry}
                position={[0.000345383945386857, 0.025681160390377045, 0.050578609108924866]}
                rotation={[1.7410711657057512, 0, 0]}
                scale={[0.27773573994636536, 0.35650089383125305, 0.2803818881511688]}
            />
            {
            <TeethMeshes/>
            }
        </group>
    )

}

useGLTF.preload('/mesh/fantoma.gltf')
