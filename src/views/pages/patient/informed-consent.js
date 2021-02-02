import React, { useState,useEffect } from 'react'
import {
    Button, Col, Container, Form, FormGroup, Input, Row, InputGroup,
    InputGroupText, InputGroupAddon, Card, CardBody, Label, Progress
} from 'reactstrap'
import classnames from "classnames";
import Axios from '../../../helpers/axiosConfig'
import { Redirect } from 'react-router-dom';
import { getList } from 'helpers/ListHelper';
const InformedConsent = ({location}) => {
    const [consentRead, setConsentRead] = useState(true)   
    const [next, setNext]=useState(false)
    const [observations, setObservations]=useState("")

    
    const [acceptedConcentId, setAcceptedConcentId] = useState(1)
    const [acceptedConcents, setAcceptedConcents] = useState([]);
    const getData = async (set, route) => {
        const e = await getList(route)
        set(e)
    }
    useEffect(() => { 
        getData(setAcceptedConcents, "list/consent")
    }, [])


    const addInformedConsent = async (e) => {
        e.preventDefault()
        const res = await Axios.post("person/informed-consent",
          { 
            personId : location.state.id,
            informed_consent_answer_id: acceptedConcentId,
            observations: observations,
            consentRead:consentRead
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
                        Consentimiento Informado
                    </h1>
                    <Form onSubmit={addInformedConsent} role="form">
                    <FormGroup className="row">
                            
                            <Col md="10">
                                <b>Por favor, lea con detención el consentimiento informado{" "}
                                <a href="https://drive.google.com/drive/u/4/folders/1Tg7sQlE7y9l4TqlJ3dXc7cY807qXKf5C" rel="noopener noreferrer" target="_blank">
                                    disponible aquí.</a></b>
                            </Col>                 
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                                
                                <Label
                                    className="form-control-label"
                                    htmlFor="exampleFormControlSelect3"
                                >
                                    ¿Tomó conocimiento del consentimiento?
                                </Label>
                                <div><label className="custom-toggle custom-toggle-success mr-1">
                                    <input type="checkbox" checked={consentRead} onChange={(e) => setConsentRead(!consentRead)} />
                                    <span
                                        className="custom-toggle-slider rounded-circle"
                                        data-label-off="No"
                                        data-label-on="Sí"
                                    />
                                </label></div>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                                <Label
                                    className="form-control-label"
                                    htmlFor="exampleFormControlSelect3"
                                >
                                    ¿Acepta el consentimiento?
                                </Label>
                                <Input id="exampleFormControlSelect3" type="select" onChange={(e) => { setAcceptedConcentId(e.target.value) }}>
                                    {acceptedConcents.map(consent=> (
                                        <option key={consent.informed_consent_answer_id} value={consent.informed_consent_answer_id}>{consent.answer}</option>
                                    ))}
                                </Input>
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
                                    onChange={(e) => { setObservations(e.target.value) }}
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
                    { next && <Redirect to={{
                    pathname: "/admin/sociodemographic-data",
                    state: { id: location.state.id, run: location.state.run, name: location.state.name, apellido : location.state.apellido} 
                    }} /> }
                </CardBody>
            </Card>
        </Container>
    )
}

export default InformedConsent
