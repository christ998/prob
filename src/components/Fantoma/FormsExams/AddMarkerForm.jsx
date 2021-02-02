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



const AddMarkerForm = (props) => {
    const initialFormState = {
        id: null,
        idAnamnesis: null,
        form: 1,
        length: 0,
        width: 0,
        height: 0,
        color: 1,
        surface: 1,
        consistency: 1,
        evolution_time: null,
        evolution_form: 1,
        symptomatology: 1,
        edge: 1,
        localization: 1,
        observation: '',
        position_x: 0,
        position_y: 0,
        position_z: 0,
    }
    const [marker, setMarker] = useState(initialFormState)

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
    }, [])



    const handleInputChange = event => {
        const { name, value } = event.target

        setMarker({ ...marker, [name]: value })
        console.log(marker.orientation_x)
    }


    return (
        <>
            <Modal
                className="modal-dialog-centered"
                isOpen={props.adding}
                size="xl"
            >
                <ModalHeader >
                   Descripción de la lesión
                </ModalHeader>
                <ModalBody className="pt-1">
                    <Form onSubmit={event => {
                        event.preventDefault()
                        props.addMarker(marker)
                        setMarker(initialFormState)
                    }}
                        role="form">
                        <FormGroup className="row">
                            <Col>
                                <Label className="form-control-label">Forma</Label>
                                <Input
                                    id="form"
                                    type="select"
                                    name="form"
                                    defaultValue={marker.form}
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
                                    defaultValue={marker.color}
                                    onChange={handleInputChange}
                                >
                                    {colorData.map(color => (
                                        <option key={color.value} value={color.color_id} id={color.value} >{color.value}</option>
                                    ))}
                                    
                                </Input>
                            </Col>
                            <Col>
                            <Label className="form-control-label">Superficie</Label>
                                <Input
                                    id="surface"
                                    type="select"
                                    name="surface"
                                    defaultValue={marker.surface}
                                    onChange={handleInputChange}
                                >
                                    {surfaceData.map(surface => (
                                        <option key={surface.value} value={surface.surface_id}>{surface.value}</option>
                                    ))}
                                </Input>
                            </Col>
                        </FormGroup> 
                        <FormGroup className="row">
                            <Col>
                                <Label className="form-control-label" >Tamaño</Label>
                                <InputGroup>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={150}
                                        step="1"
                                        name="length"
                                        placeholder="largo"
                                        /* defaultValue={0} */
                                        onChange={(e) => { handleInputChange(e) }}
                                        required
                                    />
                                        <Input
                                        type="number"
                                        min={1}
                                        max={150}
                                        step="1"
                                        name="width"
                                        placeholder="ancho"
                                        /* defaultValue={0} */
                                        onChange={(e) => { handleInputChange(e) }}
                                        required
                                    />
                                    <Input
                                        type="number"
                                        min={0}
                                        max={150}
                                        step="1"
                                        name="height"
                                        placeholder="alto"
                                        /* defaultValue={0} */
                                        onChange={(e) => { handleInputChange(e) }}
                                    />
                                    <InputGroupAddon addonType="append">mm</InputGroupAddon>
                                </InputGroup>
                            </Col>
                            <Col>
                                <Label className="form-control-label">Consistencia</Label>
                                <Input
                                    id="consistency"
                                    type="select"
                                    name="consistency"
                                    defaultValue={marker.consistency}
                                    onChange={handleInputChange}
                                >
                                    {consistencyData.map(consistency => (
                                        <option key={consistency.name} value={consistency.consistency_id}>{consistency.name}</option>
                                    ))}
                                </Input>
                            </Col>
                            <Col>
                            <Label className="form-control-label">Bordes</Label>
                                <Input
                                    id="edge"
                                    type="select"
                                    name="edge"
                                    defaultValue={marker.edge}
                                    onChange={handleInputChange}
                                >
                                    {edgeData.map(edge => (
                                        <option key={edge.name} value={edge.edge_id}>{edge.name}</option>
                                    ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                                <Label className="form-control-label">Sintomatología</Label>
                                <Input
                                    id="symptomatology"
                                    type="select"
                                    name="symptomatology"
                                    defaultValue={marker.symptomatology}
                                    onChange={handleInputChange}>
                                    {symptomatologyData.map(symptomatology => (
                                        <option key={symptomatology.value} value={symptomatology.symptomatology_id}>{symptomatology.value}</option>
                                    ))}
                                </Input>
                            </Col>
                            <Col>
                                <Label className="form-control-label">Forma de evolución</Label>
                                <Input
                                    id="evolution_form"
                                    type="select"
                                    name="evolution_form"
                                    defaultValue={marker.evolution_form}
                                    onChange={handleInputChange}>
                                     {evolutionFormData.map(evolutionForm => (
                                        <option key={evolutionForm.value} value={evolutionForm.evolution_form_id}>{evolutionForm.value}</option>
                                    ))}
                                </Input>
                            </Col>
                            <Col>
                                <Label className="form-control-label">Tiempo de evolución</Label>
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
                        </FormGroup>               
                        <FormGroup className="row"> 
                           
                            <Col>
                                <Label className="form-control-label">Localización</Label>
                                <Input
                                    id="localization"
                                    type="select"
                                    name="localization"
                                    defaultValue={marker.localization}
                                    //pattern="^[ñA-Za-z]*[ñA-Za-z][ñA-Za-z]*$"
                                    //required
                                    onChange={handleInputChange}
                                >
                                {localizationData.map(localization => (
                                        <option key={localization.value} value={localization.localization_id}>{localization.value}</option>
                                    ))}
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