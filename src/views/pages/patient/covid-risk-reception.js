import React, {useState} from 'react'
import {
    Button, Col, Container, Form, FormGroup, Input, Card, CardBody, Label, Alert
} from 'reactstrap'

import Axios from '../../../helpers/axiosConfig'
import {Redirect} from 'react-router-dom';
import useList from 'hooks/useList';

const CovidRisk = ({location}) => {
    const [covidRiskId, setcovidRiskId] = useState(1)
    const [temperature, setTemperature] = useState()
    const casos = useList("list/covid-risk")
    const [next, setNext] = useState(false)
    const [valor, setValor] = useState(0)

    const addCovidRisk = async (e) => {
        e.preventDefault()
        const res = await Axios.post("person/trigae-covid19/update",
            {
                personId: location.state.id,
                covidRiskId: covidRiskId,
                temperatura: temperature
            }
        )
        if (!res.data.error)
            setNext(true)

    }

    const reqTag = <span style={{color: "#DC3545"}}>*</span>

    return (
        <Container>
            <Card>
                <CardBody>
                    <h3>{location.state.run}, {location.state.name} {location.state.apellido}</h3>
                    <h1>
                        Riesgo Covid
                    </h1>
                    <h5 style={{color: "#DC3545"}}>* Existen campos obligatorios</h5>
                    <Form onSubmit={addCovidRisk} role="form">
                        <FormGroup className="row">
                            <Col>
                                <Label className="form-control-label" htmlFor="exampleFormControlSelect3"
                                    >Encuesta Caso Covid (
                                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSf7GsvK4AVlSlzQ8dFXcouJeNhKWzbHkjU78WTD7p92gNUpYg/viewform">
                                            ver</a>) {reqTag}</Label>
                                <Input
                                    id="exampleFormControlSelect3"
                                    type="select"
                                    required
                                    onChange={e => setcovidRiskId(e.target.value)}>
                                    <option hidden value="">Seleccione...</option>
                                    {casos.map(condicion => (<option key={condicion.covid19_risk_id}
                                                                     value={condicion.covid19_risk_id}>{condicion.covid_risk}</option>))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                                <Label
                                    className="form-control-label"
                                    htmslFor="example-text-input"
                                >
                                    TEMPERATURA {reqTag}
                                </Label>
                                <Input
                                    placeholder="3"
                                    id="example-text-input"
                                    type="text"
                                    pattern="{0-9}*"
                                    min="30"
                                    max="50"
                                    step=".1"
                                    onChange={(e) => {
                                        setTemperature(e.target.value)
                                    }}
                                    required
                                />
                            </Col>
                        </FormGroup>
                        {temperature && <div>
                            {temperature <= 35 && <Alert color="primary">
                                <strong>Hipotermia!</strong>
                            </Alert>}
                            {temperature < 37.8 && temperature > 35 && <Alert color="success">
                                Temperatura normal
                            </Alert>}
                            {temperature >= 37.8 && <Alert color="danger">
                                <strong>Derivar a hospital</strong>
                            </Alert>}
                        </div>}
                        <FormGroup className="row">
                            <Col md="10">

                            </Col>
                            <Col md="2">

                                <Button type="submit" color="primary">Registrar</Button>


                            </Col>
                        </FormGroup>
                    </Form>
                    {next && <Redirect to={{
                        pathname: "/admin/informed-consent-reception",
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

export default CovidRisk
