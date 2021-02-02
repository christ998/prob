import React, {useState} from 'react'
import {
    Button, Col, Container, Form, FormGroup, Input, Card, CardBody, Label
} from 'reactstrap'

import Axios from '../../../helpers/axiosConfig'
import {Redirect} from 'react-router-dom';
import useList from 'hooks/useList';

const CovidRisk = ({location}) => {
    const [covidRiskId, setcovidRiskId] = useState(1)
    const casos = useList("list/covid-risk")
    const [next, setNext] = useState(false)

    const addCovidRisk = async (e) => {
        e.preventDefault()
        const res = await Axios.post("person/trigae-covid19",
            {
                personId: location.state.id,
                covidRiskId: covidRiskId
            }
        )
        if (!res.data.error)
            setNext(true)

    }
    
    const reqTag = <span style={{color:"#DC3545"}}>*</span>

    return (
        <Container>
            <Card>
                <CardBody>
                    <h3>{location.state.run}, {location.state.name} {location.state.apellido}</h3>
                    <h1>
                        Riesgo Covid
                    </h1>
                    <h5 style={{color:"#DC3545"}}>* Existen campos obligatorios</h5>
                    <Form onSubmit={addCovidRisk} role="form">
                        <FormGroup className="row">
                            <Col>
                                <Label className="form-control-label" htmlFor="exampleFormControlSelect3"
                                    >Encuesta Caso Covid (
                                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSf7GsvK4AVlSlzQ8dFXcouJeNhKWzbHkjU78WTD7p92gNUpYg/viewform"
                                        target="_blank">
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
                            <Col md="10">

                            </Col>
                            <Col md="2">

                                <Button type="submit" color="primary">Registrar</Button>

                            </Col>
                        </FormGroup>
                    </Form>
                    {next && <Redirect to={{
                        pathname: "/admin/informed-consent",
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
