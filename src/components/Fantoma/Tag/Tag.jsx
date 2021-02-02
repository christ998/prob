import React, { useState, useEffect, useRef} from 'react'
import { Html } from "@react-three/drei";
import { useThree } from "react-three-fiber";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardImg,
    CardTitle,
    CardText,
    CardFooter,
    Row,
    Col,
    CardImgOverlay, 
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";
import { useGLTF } from '@react-three/drei/useGLTF'
import { getList } from 'helpers/ListHelper';


const Tag = (props) => {
    
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false) 
    const { nodes, materials } = useGLTF('/mesh/lesiones.gltf')
    const htmlref = useRef()


    const [modalDelete, setModalDelete] = useState(false);
    const toggleDelete = () => setModalDelete(!modalDelete);

    const [formData, setFormData] = useState([]);
    const [colorData, setColorData] = useState([]);
    const [surfaceData, setSurfaceData] = useState([]);
    const [consistencyData, setConsistencyData] = useState([]);
    const [evolutionFormData, setEvolutionFormData] =useState([]);
    const [symptomatologyData, setSymptomatologyData] = useState([]);
    const [edgeData, setEdgeData] = useState([]);
    const [localizationData, setLocalizationData] = useState([]);

    const getData = async (set, route) => {
        const e = await getList(route)
        set(e)
    }

    const [form, setForm] = useState()
    const [color, setColor] = useState()
    const [surface, setSurface] = useState()
    const [consistency, setConsistency] = useState()
    const [evolutionForm, setEvolutionForm] = useState()
    const [symptomatology, setSymptomatology] = useState()
    const [edge, setEdge] = useState()
    const [localization, setLocalization] = useState()


    const position=[props.marker.position_x, props.marker.position_y, props.marker.position_z]
    const orientation=[props.marker.orientation_x, props.marker.orientation_y, props.marker.orientation_z, "XYZ"]

    const styleTd={
        whiteSpace: 'normal' , 
        paddingRight: "0.5rem",
        paddingLeft: "0.5rem",
        textAlign: 'justify',
        textJustify: 'inter-word',
        maxWidth: '50%',
    }
    const styleTh={
        paddingRight: "0.5rem",
        paddingLeft: "0.5rem",
        textAlign: 'justify',
        textJustify: 'inter-word',
        maxWidth: '50%',
    }
    
    const getTranslate3d = (element) =>  {
        const values = element.style.transform.split(/\w+\(|\);?/);
        if (!values[1] || !values[1].length) {
            return [];
        }
        console.log(values[1].split(/,\s?/g))
        return values[1].split(/,\s?/g);
        
    }

    const handleClick = (e) => {
        if(props.adding=== 2){
        setActive(!active)
        active ? console.log(getTranslate3d(htmlref.current.offsetParent)): getTranslate3d(htmlref.current.offsetParent)}

        setForm(formData.find(x => x.form_id == props.marker.form).name)
        setColor(colorData.find(x => x.color_id == props.marker.color).value)
        setSurface(surfaceData.find(x => x.surface_id == props.marker.surface).value)
        setConsistency(consistencyData.find(x => x.consistency_id == props.marker.consistency).name)
        setEvolutionForm(evolutionFormData.find(x => x.evolution_form_id == props.marker.evolution_form).value)
        setSymptomatology(symptomatologyData.find(x => x.symptomatology_id == props.marker.symptomatology).value)
        setEdge(edgeData.find(x => x.edge_id == props.marker.edge).name)
        setLocalization(localizationData.find(x => x.localization_id == props.marker.localization).value)


    }

    useEffect(() => {
        const canvas= document.getElementsByClassName('canvas')[0];
        const htmlDrei= document.getElementsByClassName('html-drei')[0];
        getData(setFormData, "list/forms")
        getData(setColorData, "list/colors")
        getData(setSurfaceData, "list/surfaces")
        getData(setConsistencyData, "list/consistencies")
        getData(setEvolutionFormData, "list/evolution-forms")
        getData(setSymptomatologyData, "list/symptomatologies")
        getData(setEdgeData, "list/edges")
        getData(setLocalizationData, "list/localizations")
        
	}, []);


    
    return (
        
        <mesh
           {...props}
           material={materials.fibroma_traumatico}
           geometry={nodes.fibroma_traumatico.geometry}
           scale={[props.marker.length*0.001,props.marker.width*0.003, props.marker.height*0.003]}
           /* scale={active ? [0.04, 0.04, 0.04] : [0.03, 0.03, 0.03]} */
           onClick={(e) => handleClick(e)}
           onPointerOver={() => setHover(true)}
           onPointerOut={() => setHover(false)}
           position={position}
           rotation={orientation}
           name='marker'
           >
              {/*  <sphereBufferGeometry  args={[0.5, 32, 32]} />
               <meshStandardMaterial color={hovered ? 'yellow' : 'lime'} emissive="blue" roughness="0" /> */}
               <Html ref={htmlref} className='html-drei' style={{transform: 'translate3d(15%,-50%, 0)'}} zIndexRange={[90, 0]} >
                   <Card style={{display: active ? 'block' : 'none', width: "21rem", wordWrap: 'inherit'}}>
                            <Button  onClick={() => {setActive(!active)}} className="close"color="primary" size="lg" style={{ zIndex: 100, position: 'absolute', right: "0px", top: "0.4rem" }}><span aria-hidden="true">&times;</span></Button>
                        <ButtonGroup  size="lg" style={{ zIndex: 100, position: 'absolute', left: "0px", top: "0px" }}>
                           <Button  color="primary" size="lg" onClick={() => {props.editMarker(props.marker)}}><i className="fas fa-pencil-alt"></i></Button>
                           <Button color="danger" size="sm" onClick={toggleDelete}><i className="far fa-trash-alt"></i></Button>
                       </ButtonGroup>
                       <CardImgOverlay onClick={() =>{console.log('abrir imagen')}}>
                           {/* <CardTitle className="text-white">Fibroma traumático</CardTitle> */}
                       </CardImgOverlay>
                       <CardImg
                           alt="..."
                           src={require("assets/img/image-placeholder.png")}
                           top
                       />   
                       <CardBody style={{padding: "5px"}}>
                                <Table className="table table-sm" >
                                    <tbody>
                                        <tr>
                                            <th style={styleTh} scope="row">Forma:</th>
                                            <td style={styleTd}>{form}</td>
                                        </tr>
                                        <tr>
                                            <th style={styleTh} scope="row">Tamaño:</th>
                                            <td style={styleTd}>{props.marker.length} x {props.marker.width} x {props.marker.height} mm</td>
                                        </tr>
                                        <tr>
                                            <th style={styleTh} scope="row">Color:</th>
                                            <td style={styleTd}>{color}</td>
                                        </tr>
                                        <tr>
                                            <th style={styleTh} scope="row">Superficie:</th>
                                            <td style={styleTd}>{surface}</td>
                                        </tr>
                                        <tr>
                                            <th style={styleTh} scope="row">Consistencia:</th>
                                            <td style={styleTd}>{consistency}</td>
                                        </tr>
                                        <tr>
                                            <th style={styleTh} scope="row">Tiempo de evolución:</th>
                                            <td style={styleTd}>{props.marker.evolution_time}</td>
                                        </tr>
                                        <tr>
                                            <th style={styleTh} scope="row">Forma de evolución:</th>
                                            <td style={styleTd}>{evolutionForm}</td>
                                        </tr>
                                        <tr>
                                            <th style={styleTh} scope="row">Sintomatología:</th>
                                            <td style={styleTd}>{symptomatology}</td>
                                        </tr>
                                        <tr>
                                            <th style={styleTh} scope="row">Bordes:</th>
                                            <td style={styleTd}>{edge}</td>
                                        </tr>
                                        <tr>
                                            <th style={styleTh} scope="row">Localización:</th>
                                            <td style={styleTd}>{localization}</td>
                                        </tr>
                                        <tr>
                                            <th style={styleTh} scope="row">Observaciones:</th>
                                            <td style={styleTd}>{props.marker.observation}</td>
                                        </tr>                 
                                    </tbody>
                                </Table>
                       </CardBody>
                   </Card>
                   <Modal isOpen={modalDelete} toggle={toggleDelete}>
                        <ModalHeader toggle={toggleDelete} >Eliminar</ModalHeader>
                        <ModalBody>¿Seguro que desea eliminar el marcador?</ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={() => {props.deleteMarker(props.marker.id)}}>Eliminar marcador</Button>{' '}
                            <Button color="secundary" onClick={toggleDelete}>Cancelar</Button>
                        </ModalFooter>
                    </Modal>
               </Html>   
           </mesh >
         
        )
}
export default Tag

useGLTF.preload('/mesh/lesiones.gltf')