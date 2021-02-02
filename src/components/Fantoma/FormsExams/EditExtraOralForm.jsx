import React, { useState, useEffect } from 'react'
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

const EditExtraOralForm = props => {
    const [marker, setMarker] = useState(props.currentMarker)

    const handleInputChange = event => {
        const { name, value } = event.target

        setMarker({ ...marker, [name]: value })
    }

    useEffect(() => {
                setMarker(props.currentMarker)
    },[props])

    return (
        <>
            <Modal
                className="modal-dialog-centered"
                isOpen={props.editing}>
                <ModalHeader>
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={event => {
                        event.preventDefault()
                        props.updateMarker(marker.id, marker)
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
                                onClick={() => props.setEditing(false)}>Cancelar
                             </Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    )
}
export default EditExtraOralForm