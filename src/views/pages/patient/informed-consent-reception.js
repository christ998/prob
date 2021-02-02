import React, {useState, useEffect} from 'react'
import {
    Button, Col, Container, Form, FormGroup, Input, Card, CardBody, Label
} from 'reactstrap'

import Axios from '../../../helpers/axiosConfig'
import {Redirect} from 'react-router-dom';
import {getList} from 'helpers/ListHelper';

const InformedConsent = ({location}) => {
    const [file, setFile] = useState()
    const [next, setNext] = useState(false)

    async function load(fx, route) {
        const response = await getList(route)
        if (response.status === 200) {
            fx(response.data.result)
        }
    }

    const enviar = async (e) => {
        e.preventDefault()
        if (file !== undefined) await archivo()
        setNext(true)
    }

    const archivo = () => {
        const f = new FormData();

        f.append("file", file[0])

        Axios.post("file/" + location.state.run, f)
            .then(response => {
                console.log(response)

            }).catch(error => {
                console.log(error)
            })


    }
    // useEffect(() => { 
    //     load(setAcceptedConcent, "list/consent")
    // }, [])


    // const addInformedConsent = async (e) => {
    //     e.preventDefault()
    //     const res = await Axios.post(process.env.REACT_APP_API_URL + "person/informed-consent",
    //       { 
    //         personId : location.state.id,
    //         informed_consent_answer_id: acceptedConcentId,
    //         observations: observations,
    //         consentRead:consentRead
    //       }
    //     )
    //     if (!res.data.error)
    //      setNext(true) 
    //      

    //   }

    return (
        <Container>
            <Card>
                <CardBody>
                    <h3>{location.state.run}, {location.state.name} {location.state.apellido}</h3>
                    <h1>
                        Consentimiento Informado
                    </h1>
                    <Form onSubmit={enviar} role="form">
                        <FormGroup className="row">
                            <Col>
                                <b>Por favor, lea con detención el consentimiento informado{" "}
                                <a href="https://drive.google.com/drive/u/4/folders/1Tg7sQlE7y9l4TqlJ3dXc7cY807qXKf5C" rel="noopener noreferrer" target="_blank">
                                    disponible aquí.</a></b>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col md="6">
                                <Label
                                    className="form-control-label"
                                    htmslFor="example-text-input"
                                >
                                    Subir archivo PDF
                                </Label><br/>
                                <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files)}
                                       /><br/><br/>
                                       
                            </Col>
                            <Col md="6">
                                <Label
                                    className="form-control-label"
                                    htmslFor="example-text-input"
                                >
                                    Aceptación
                                </Label>
                                <div><label className="custom-toggle custom-toggle-warning mr-1">
                                    <Input type="checkbox" onChange={(e) => {
                                    }}/>
                                    <span
                                        className="custom-toggle-slider rounded-circle"
                                        data-label-off="No"
                                        data-label-on="Sí"
                                    />
                                </label></div>
                            </Col>
                        </FormGroup>

                        <FormGroup className="row">
                            <Col md="10">

                            </Col>
                            <Col md="0,5">
                                <Button color="primary" type="submit">Guardar</Button>
                            </Col>

                        </FormGroup>

                    </Form>
                    {next && <Redirect to={{
                        pathname: "/admin/list-patient-anamnesis",
                        state: {id: location.state.id, run: location.state.run, name: location.state.name, reception:true}
                    }}/>}
                </CardBody>
            </Card>
        </Container>
    )
}

export default InformedConsent
