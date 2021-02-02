import React, {useState} from 'react'
import {
    Button, Col, Container, Form, FormGroup, Input, Row, InputGroup,
    InputGroupText, InputGroupAddon, Card, CardBody, Label, ListGroup, lisgro
} from 'reactstrap'

import Axios from '../../../helpers/axiosConfig'
import {Redirect} from 'react-router-dom';

const ConsultationMotive = ({location}) => {

    const [urgency, setUrgency] = useState(true)
    const [pain, setPain] = useState(false)
    const [cavities, setCavities] = useState(false)
    const [wounds, setWounds] = useState(false)
    const [bleeding, setBleeding] = useState(false)
    const [fracture, setFracture] = useState(false)

    const [trauma, setTrauma] = useState(false)
    const [swelling, setSwelling] = useState(false)
    const [treatment, setTreatment] = useState(false)


    const [other, setOther] = useState('')
    const [next, setNext] = useState(false)
    const [ohip, setOhip] =useState('')
    const [barthel, setBarthel] =useState('')

    const addPreConsultationMotive = async (e) => {
        e.preventDefault()
        const res = await Axios.post("person/pre-medical-consultation",
            {
                personId: location.state.id,
                urgency: urgency,
                pain: pain,
                cavities: cavities,
                wounds: wounds,
                bleeding: bleeding,
                fracture: fracture,
                trauma: trauma,
                swelling: swelling,
                treatment: treatment,
                other: other,
                ohip:ohip,
                barthel:barthel
            }
        )
        if (!res.data.error)
            setNext(true)

    }


    return (
        <Container>
            <Card>
                <CardBody>
                    <h3>{location.state.run}, {location.state.name} {location.state.apellido}</h3>
                    <h1>
                        Motivo Ingreso
                    </h1>
                    <Form onSubmit={addPreConsultationMotive} role="form">
                        <FormGroup className="row">
                            <Col md="8">
                                <Label
                                    className="form-control-label"
                                >
                                    ¿Urgencia dental?
                                </Label>
                                <div><label className="custom-toggle custom-toggle-warning mr-1">
                                    <Input checked={urgency} type="checkbox" onChange={(e) => {
                                        setUrgency(!urgency)
                                    }}/>
                                    <span
                                        className="custom-toggle-slider rounded-circle"
                                        data-label-off="No"
                                        data-label-on="Sí"
                                    />
                                </label></div>
                                <Label
                                    className="form-control-label"
                                >
                                    Motivo
                                </Label>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="pain"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setPain(!pain)
                                        }}
                                    />
                                    <label className="custom-control-label" htmlFor="pain"><strong>Dolor severo de causa dentaria</strong>, que no ceda a analgésicos.</label>
                                </div>


                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="cavities"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setCavities(!cavities)
                                        }}
                                    />
                                    <label className="custom-control-label" htmlFor="cavities"><strong>Manchas o heridas en cualquier parte de la boca</strong> que no desaparecen en 1 mes.</label>
                                </div>

                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="wounds"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setWounds(!wounds)
                                        }}
                                    />
                                    <label className="custom-control-label" htmlFor="wounds"><strong>Lesiones en mucosa/encía</strong>, debido a desajuste de prótesis dental.</label>
                                </div>

                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="bleeding"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setBleeding(!bleeding)
                                        }}
                                    />
                                    <label className="custom-control-label" htmlFor="bleeding"><strong>Hemorragia bucal.</strong></label>
                                </div>

                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="fracture"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setFracture(!fracture)
                                        }}
                                    />
                                    <label className="custom-control-label" htmlFor="fracture"><strong>Pérdida o fractura de restauraciones</strong> (tapaduras) o <strong>prótesis dentales.</strong></label>
                                </div>


                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="trauma"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setTrauma(!trauma)
                                        }}
                                    />
                                    <label className="custom-control-label" htmlFor="trauma"><strong>Trauma reciente.</strong></label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="swelling"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setSwelling(!swelling)
                                        }}
                                    />
                                    <label className="custom-control-label" htmlFor="swelling"><strong>Hinchazón importante de boca</strong>, cara o cuello.</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="treatment"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setTreatment(!treatment)
                                        }}
                                    />
                                    <label className="custom-control-label" htmlFor="treatment"><strong>Tratamiento dental requerido previo a procedimientos médicos</strong> críticos impostergables.</label>
                                </div>


                                <Label
                                    className="form-control-label"
                                    htmlFor="exampleFormControlSelect3"
                                >
                                    Otro
                                </Label>
                                <Input
                                    defaultValue=""
                                    id="example-text-input"
                                    type="text"
                                    onChange={(e) => {
                                        setOther(e.target.value)
                                    }}
                                />
                            </Col>
                        </FormGroup>
                        <h5 className="heading-small" >Cuestionarios</h5>
                        <FormGroup className="row">
                            <Col md="3">
                                <Label  
                                    className="form-control-label"
                                    htmlFor="exampleFormControlSelect3"
                                    > Encuesta OHIP-14Sp (
                                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSetI2HQMrH1lhqeQBUZT1ks2KKpxrhIpL-ceOm3jYEyIY_gwQ/viewform"
                                        target="_blank">
                                            ver</a>)
                                </Label>
                                <Input
                                    placeholder=""
                                    id="example-text-input"
                                    name="folstein_value"
                                    type="number"
                                    onChange={(e) => {setOhip(e.target.value) }}
                                    // required
                                />
                            </Col>
                            <Col md="1">
                            </Col>
                            <Col md="3">
                                <Label  
                                    className="form-control-label"
                                    htmlFor="exampleFormControlSelect3"
                                    > Índice de Barthel (
                                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSemuQyOJFSXvhQYjtf_ZKziNjYgvgKGFDTSMU1UlzffJzahPA/viewform"
                                        target="_blank">
                                            ver</a>)
                                </Label>
                                <Input
                                    placeholder=""  
                                    id="example-text-input"
                                    name="pfeiffer_value"
                                    type="number"
                                    onChange={(e) => { setBarthel(e.target.value) }}
                                    // required
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col md="10">

                            </Col>
                            <Col md="2">

                                <Button type="submit" color="primary">Registrar</Button>

                            </Col>
                        </FormGroup>
                    </Form>
                    {next && <Redirect to={{
                        pathname: "/admin/covid-risk",
                        state: {
                            id: location.state.id,
                            run: location.state.run,
                            name: location.state.name,
                            apellido: location.state.apellido
                        }
                    }}/>}
                </CardBody>
            </Card>
        </Container>
    )
}

export default ConsultationMotive
