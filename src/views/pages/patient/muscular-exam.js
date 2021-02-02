import React, {useState} from 'react'
import {
    Button, Col, Container, Form, FormGroup, Input, Card, CardBody, Label
} from 'reactstrap'

import Axios from '../../../helpers/axiosConfig'
import {Redirect} from 'react-router-dom';

const MuscularExam = ({location}) => {

    const [painpr, setPainpr] = useState(false)
    const [painfr, setPainfr] = useState(false)
    const [clickr, setClickr] = useState(false)
    const [crepr, setCrepr] = useState(false)
    const [painpl, setPainpl] = useState(false)
    const [painfl, setPainfl] = useState(false)
    const [clickl, setClickl] = useState(false)
    const [crepl, setCrepl] = useState(false)
    const [maseterod, setMaseterod] = useState(false)
    const [maseteroi, setMaseteroi] = useState(false)
    const [temporald, setTemporald] = useState(false)
    const [temporali, setTemporali] = useState(false)
    const [pterigoideoInternoi, setPterigoideoInternoi] = useState(false)
    const [pterigoideoInternod, setPterigoideoInternod] = useState(false)
    const [pterigoideoExternoi, setPterigoideoExternoi] = useState(false)
    const [pterigoideoExternod, setPterigoideoExternod] = useState(false)
    const [musculosCuello, setMusculosCuello] = useState("")
    const [bloqueoAr, setBloqueoAr] = useState("")

    const [diagnostico, setDiagnostico] = useState("")
    const [observaciones, setObservaciones] = useState("")

    const [next, setNext] = useState(false)

    const addMuscularExam = async (e) => {
        e.preventDefault()
        const res = await Axios.post("geriatrical-odonto-anamnesis/muscular-exam",
            {
                anamId: location.state.anamId,
                painpr: painpr,
                painfr: painfr,
                clickr: clickr,
                crepr: crepr,
                painpl: painpl,
                painfl: painfl,
                clickl: clickl,
                crepl: crepl,
                maseterod: maseterod,
                maseteroi: maseteroi,
                temporald: temporald,
                temporali: temporali,
                pterigoideoInternoi: pterigoideoInternoi,
                pterigoideoInternod: pterigoideoInternod,
                pterigoideoExternoi: pterigoideoExternoi,
                pterigoideoExternod: pterigoideoExternod,
                musculosCuello: musculosCuello,
                bloqueoAr: bloqueoAr,

                diagnostico: diagnostico,
                observaciones: observaciones
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
                        Anamnesis Odonto-geriátrica
                    </h1>
                    <h5 className="heading-small">Examen muscular</h5>
                    <Form onSubmit={addMuscularExam} role="form">
                        <FormGroup className="row">
                            <Col md="4">
                                <Label
                                    className="form-control-label"
                                    htmlFor="exampleFormControlSelect3"
                                >
                                    ATM Derecha
                                </Label>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="pain-pr"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setPainpr(!painpr)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="pain-pr"
                                    >Dolor a la palpación </label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="pain-fr"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setPainfr(!painfr)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="pain-fr"
                                    >Dolor función</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="click-r"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setClickr(!clickr)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="click-r"
                                    >Click</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="crep-r"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setCrepr(!crepr)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="crep-r"
                                    >Crepitación</label>
                                </div>
                            </Col>
                            <Col md="4">
                                <Label
                                    className="form-control-label"
                                    htmlFor="exampleFormControlSelect3"
                                >
                                    ATM Izquierda
                                </Label>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="pain-pl"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setPainpl(!painpl)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="pain-pl"
                                    >Dolor a la palpación </label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="pain-fl"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setPainfl(!painfl)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="pain-fl"
                                    >Dolor función</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="click-l"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setClickl(!clickl)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="click-l"
                                    >Click</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="crep"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setCrepl(!crepl)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="crep"
                                    >Crepitación</label>
                                </div>
                            </Col>
                            <Col md="4">
                                <Label
                                    className="form-control-label"
                                    htmlFor="exampleFormControlSelect3"
                                >
                                    Dolor
                                </Label>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="masetero-d"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setMaseterod(!maseterod)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="masetero-d"
                                    >Masétero derecho</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="masetero-i"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setMaseteroi(!maseteroi)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="masetero-i"
                                    >Masétero izquierdo</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="temporal-d"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setTemporald(!temporald)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="temporal-d"
                                    >Temporal derecho</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="temporal-i"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setTemporali(!temporali)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="temporal-i"
                                    >Temporal Izquierdo</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="pterigoideo-interno-d"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setPterigoideoInternod(!pterigoideoInternod)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="pterigoideo-interno-d"
                                    >Pterigoideo interno derecho</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="pterigoideo-interno-i"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setPterigoideoInternoi(!pterigoideoInternoi)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="pterigoideo-interno-i"
                                    >Pterigoideo interno izquierdo</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="pterigoideo-externo-d"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setPterigoideoExternod(!pterigoideoExternod)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="pterigoideo-externo-d"
                                    >Pterigoideo externo derecho</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="pterigoideo-externo-i"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setPterigoideoExternoi(!pterigoideoExternoi)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="pterigoideo-externo-i"
                                    >Pterigoideo externo izquierdo</label>
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                                <Label
                                    className="form-control-label"
                                    htmlFor="exampleFormControlSelect3"
                                >
                                    Musculos del cuello
                                </Label>
                                <Input
                                    defaultValue=""
                                    id="example-text-input"
                                    type="text"
                                    onChange={(e) => {
                                        setMusculosCuello(e.target.value)
                                    }}

                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                                <Label
                                    className="form-control-label"
                                    htmlFor="exampleFormControlSelect3"
                                >
                                    Bloqueo articular
                                </Label>
                                <Input
                                    defaultValue=""
                                    id="example-text-input"
                                    type="text"
                                    onChange={(e) => {
                                        setBloqueoAr(e.target.value)
                                    }}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup className="row">
                            <Col>
                                <Label
                                    className="form-control-label"
                                    htmlFor="exampleFormControlSelect3"
                                >
                                    Diagnóstico
                                </Label>
                                <Input
                                    defaultValue=""
                                    id="example-text-input"
                                    type="text"
                                    onChange={(e) => {
                                        setDiagnostico(e.target.value)
                                    }}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                                <Label
                                    className="form-control-label"
                                    htmlFor="exampleFormControlSelect3"
                                >
                                    Observaciones
                                </Label>
                                <Input
                                    defaultValue=""
                                    id="example-text-input"
                                    type="text"
                                    onChange={(e) => {
                                        setObservaciones(e.target.value)
                                    }}

                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col md="10"></Col>
                            <Col md="2">
                                <Button type="submit" color="primary">Guardar</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                    {next && <Redirect to={{
                        pathname: "/admin/dental-anamnesis",
                        state: {
                            id: location.state.id,
                            run: location.state.run,
                            name: location.state.name,
                            apellido: location.state.apellido,
                            anamId: location.state.anamId
                        }
                    }}/>}
                </CardBody>
            </Card>
        </Container>
    )
}


export default MuscularExam