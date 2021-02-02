import React, { useState, useEffect } from 'react'
import {
    Button,
    FormGroup,
    Form,
    Input,
    Modal,
    Label,
    Col,
    Row,
    ModalHeader,
    ModalBody,
    ModalFooter,
    InputGroup,
    InputGroupAddon
} from "reactstrap";
import { getList } from 'helpers/ListHelper';

const EditMarkerForm = props => {
    const [marker, setMarker] = useState(props.currentMarker)

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

    useEffect(() => {
        getData(setFormData, "list/forms")
        getData(setColorData, "list/colors")
        getData(setSurfaceData, "list/surfaces")
        getData(setConsistencyData, "list/consistencies")
        getData(setEvolutionFormData, "list/evolution-forms")
        getData(setSymptomatologyData, "list/symptomatologies")
        getData(setEdgeData, "list/edges")
        getData(setLocalizationData, "list/localizations")
        setMarker(props.currentMarker)
    }, [props])

    const handleInputChange = event => {
        const { name, value } = event.target

        setMarker({ ...marker, [name]: value })
    }


    return (
        <>
            <Modal
                className="modal-dialog-centered"
                isOpen={props.editing}
                size="lg">
                <ModalHeader>
                    {/* {marker.id +" "+ marker.idAnamnesis } */}
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={event => {
                        event.preventDefault()
                        props.updateMarker(marker.id, marker)
                    }} 
                    role="form">
                        <FormGroup className="row">
                            <Col>
                                <Label className="form-control-label">Forma</Label>
                                <Input
                                    id="form"
                                    type="select"
                                    name="form"
                                    value={marker.form}
                                    onChange={handleInputChange}
                                >
                                    {formData.map(form => (
                                        <option 
                                            key={form.name} 
                                            value={form.form_id} 
                                            onFocus={(e)=>console.log(e.target) } 
                                            id={form.name}  
                                            data-toggle="tooltip" 
                                            title={form.description}
                                            >
                                                {form.name}
                                        </option>
                                    ))}
                                </Input>
                            </Col>
                            <Col>
                                <Label className="form-control-label">Color</Label>
                                <Input
                                    id="color"
                                    type="select"
                                    name="color"
                                    value={marker.color}
                                    onChange={handleInputChange}
                                >
                                    {colorData.map(color => (
                                        <option key={color.value} value={color.color_id} id={color.value} >{color.value}</option>
                                    ))}
                                    
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col md='12'>
                                <Label className="form-control-label" >Tamaño</Label>
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <InputGroup>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={150}
                                                step="1"
                                                name="length"
                                                placeholder="largo"
                                                defaultValue={marker.length}
                                                onChange={(e) => { handleInputChange(e) }}
                                                required
                                            />
                                            <InputGroupAddon addonType="append">mm</InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <InputGroup>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={150}
                                                step="1"
                                                name="width"
                                                placeholder="ancho"
                                                defaultValue={marker.width}
                                                onChange={(e) => { handleInputChange(e) }}
                                                required
                                            />
                                            <InputGroupAddon addonType="append">mm</InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <InputGroup>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={150}
                                                step="1"
                                                name="height"
                                                placeholder="alto"
                                                defaultValue={marker.height}
                                                onChange={(e) => { handleInputChange(e) }}
                                            />
                                            <InputGroupAddon addonType="append">mm</InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Col>
                        </FormGroup>                      
                        <FormGroup className="row">
                            <Col>
                            <Label className="form-control-label">Superficie</Label>
                                <Input
                                    id="surface"
                                    type="select"
                                    name="surface"
                                    value={marker.surface}
                                    onChange={handleInputChange}
                                >
                                    {surfaceData.map(surface => (
                                        <option key={surface.value} value={surface.surface_id}>{surface.value}</option>
                                    ))}
                                </Input>
                            </Col>
                            <Col>
                                <Label className="form-control-label">Consistencia</Label>
                                <Input
                                    id="consistency"
                                    type="select"
                                    name="consistency"
                                    value={marker.consistency}
                                    onChange={handleInputChange}
                                >
                                    {consistencyData.map(consistency => (
                                        <option key={consistency.name} value={consistency.consistency_id}>{consistency.name}</option>
                                    ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                            <Label className="form-control-label">Bordes</Label>
                                <Input
                                    id="edge"
                                    type="select"
                                    name="edge"
                                    value={marker.edge}
                                    onChange={handleInputChange}
                                >
                                    {edgeData.map(edge => (
                                        <option key={edge.name} value={edge.edge_id}>{edge.name}</option>
                                    ))}
                                </Input>
                            </Col>
                            <Col>
                                <Label className="form-control-label">Sintomatología</Label>
                                <Input
                                    id="symptomatology"
                                    type="select"
                                    name="symptomatology"
                                    value={marker.symptomatology}
                                    onChange={handleInputChange}
                                >
                                    {symptomatologyData.map(symptomatology => (
                                        <option key={symptomatology.value} value={symptomatology.symptomatology_id}>{symptomatology.value}</option>
                                    ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                                <Label className="form-control-label">Forma evolución</Label>
                                <Input
                                    id="evolution_form"
                                    type="select"
                                    name="evolution_form"
                                    value={marker.evolution_form}
                                    onChange={handleInputChange}>
                                     {evolutionFormData.map(evolutionForm => (
                                        <option key={evolutionForm.value} value={evolutionForm.evolution_form_id}>{evolutionForm.value}</option>
                                    ))}
                                </Input>
                            </Col>
                            <Col>
                                <Label className="form-control-label">Localización</Label>
                                <Input
                                    id="localization"
                                    type="select"
                                    name="localization"
                                    value={marker.localization}
                                    //pattern="^[ñA-Za-z]*[ñA-Za-z][ñA-Za-z]*$"
                                    //required
                                    onChange={handleInputChange}
                                >
                                {localizationData.map(localization => (
                                        <option key={localization.value} value={localization.localization_id}>{localization.value}</option>
                                    ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                                <Label className="form-control-label">Tiempo evolución</Label>
                                <Input
                                    id="evolution_time"
                                    type="text"
                                    name="evolution_time"
                                    maxLength="20"
                                    defaultValue={marker.evolution_time}
                                    //pattern="^[ñA-Za-z]*[ñA-Za-z][ñA-Za-z]*$"
                                    //required
                                    onChange={handleInputChange}>
                                </Input>
                            </Col>
                            <Col>
                                <Label className="form-control-label">Observaciones</Label>
                                <Input
                                    id="example-text-input1"
                                    type="textarea"
                                    name="observation"
                                    maxLength="200"
                                    defaultValue={marker.observation}
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
export default EditMarkerForm