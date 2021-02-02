import React, { useState } from 'react'
import { Html } from "@react-three/drei";
import { useThree } from "react-three-fiber";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardImg,
    Row,
    Col,
    CardImgOverlay,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Popover,
    PopoverHeader,
    PopoverBody
} from "reactstrap";

const TagExtraOral = (props) => {
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    const [modalDelete, setModalDelete] = useState(false);
    const toggleDelete = () => setModalDelete(!modalDelete);
    

    const [popoverOpen, setPopoverOpen] = useState(false);

    const toggle = () => setPopoverOpen(!popoverOpen);
  

    const handleClick = (e) => {
        if(props.adding === 2){
        setActive(!active)
        }
    }



    return (
        
        <mesh
           {...props}
           scale={active ? [0.06, 0.06, 0.06] : [0.04, 0.04, 0.04]}
           onClick={(e) => handleClick(e)}
           onPointerOver={() => setHover(true)}
           onPointerOut={() => setHover(false)}
           position={[props.marker.position_x, props.marker.position_y, props.marker.position_z]/* scene.getObjectByName('mouseHelper').position */}
           name='marker'
           >
               <sphereBufferGeometry args={[1, 32, 32]} />
               <meshStandardMaterial color={hovered ? 'yellow' : 'lime'} emissive="blue" roughness="0" />
               <Html center={false} style={{transform: 'translate3d(25%,-50%, 0)'}} zIndexRange={[90, 0]}>
                   <Card style={{display: active ? 'block' : 'none', width: "20rem"}}>
                        <ButtonGroup  size="lg" style={{ zIndex: 100, position: 'absolute', right: "0px", top: "0px" }}>
                           <Button  color="primary" size="lg" onClick={() => {props.editMarker(props.marker)}}><i className="fas fa-pencil-alt"></i></Button>
                           <Button color="danger" size="sm" onClick={toggleDelete}><i className="far fa-trash-alt"></i></Button>
                       </ButtonGroup>
                       <CardImgOverlay onClick={() =>{console.log('abrir imagen')}}></CardImgOverlay>
                       <CardImg
                           alt="..."
                           src={require("assets/img/image-placeholder.png")}
                           top
                       />   
                       <CardBody style={{padding: "10px"}}>
                              
                                   <div className="small" style={{padding: "5px"}} >
                                   <Row >
                                       <Col sm="5"><h5>Inspección:</h5></Col>
                                            <Col sm="7">{props.marker.inspection}</Col>
                                        <Col sm="5"><h5>Palpación:</h5></Col>
                                            <Col sm="7">{props.marker.palpation}</Col>
                                   </Row>
                                   </div>
                               
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
export default TagExtraOral