import React, { useState } from 'react'
import {
    Button,
    FormGroup,
    Form,
    Input,
    Modal,
    Label,
    Col,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";


 const AddMarkerForm = (props) => {
     
    const initialFormState = { 
        id: null, 
        idAnamnesis: null,
        inspection:'',
        palpation: '',
        position_x: 0,
        position_y: 0,
        position_z: 0        
    }
    const [marker, setMarker] = useState(initialFormState)
  
    const handleInputChange = event => {
        const { name, value } = event.target

        setMarker({ ...marker, [name]: value })
    }
    

    return(
        <>
             <Modal
                className="modal-dialog-centered"
                isOpen={props.adding}>
                <ModalHeader>
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={event => {
                        event.preventDefault()
                        props.addMarker(marker)
				        setMarker(initialFormState)
                    }} 
                    role="form">
                        <FormGroup className="row">
                            <Col>
                                <Label className="form-control-label" >Inspección</Label>
                                <Input
                                    id="example-text-input1"
                                    type="text"
                                    name="inspection"
                                    defaultValue={marker.inspection}
                                    //pattern="^[ñA-Za-z]*[ñA-Za-z][ñA-Za-z]*$"
                                    //required
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                                <Label className="form-control-label">Palpación</Label>
                                <Input
                                    id="example-text-input1"
                                    type="text"
                                    name="palpation"
                                    defaultValue={marker.palpation}
                                    //pattern="^[ñA-Za-z]*[ñA-Za-z][ñA-Za-z]*$"
                                    //required
                                    onChange={handleInputChange}
                                />
                            </Col>
                        </FormGroup>
                        <ModalFooter>
                            <Button type="submit" color="primary" >
                                Guardar
                            </Button>
                            <Button color="secondary"
                                onClick={() => props.setAdding(false)}>Cancelar
                             </Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    )
    
}
export default AddMarkerForm