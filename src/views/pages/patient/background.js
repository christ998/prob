import React, { useState } from 'react'
import {
    Button, Col, Container, Form, FormGroup, Input, Row, InputGroup,
    InputGroupText, InputGroupAddon, Card, CardBody, Label, ListGroup, lisgro
} from 'reactstrap'

import Axios from '../../../helpers/axiosConfig'
import { Redirect } from 'react-router-dom';

const Background = ({location}) => {

    const [alcohol, setAlcohol] = useState(false)
    const [lastTime, setLastTime] = useState("")
    const [drugs, setDrugs] = useState(false)
    const [smoke, setSmoke] = useState(false)
    const [smokeCuantity, setSmokeCuantity]= useState(0)
    const [badHabits, setBadHabits] = useState("")   
    const [bruxismo, setBruxismo] = useState(false)
    const [anam_id, setAnamId] = useState(0)
 
    const [next, setNext]=useState(false)

    const addSmoke= () =>{
        setSmoke(!smoke)
        setSmokeCuantity(0)

    }

    const addBackground = async (e) => {
        e.preventDefault()
        const res = await Axios.post("geriatrical-odonto-anamnesis/background",
          {
            personId : location.state.id,
            alcohol: alcohol,
            lastTime: lastTime,
            drugs:drugs,
            smoke:smoke,
            smokeCuantity:smokeCuantity,
            badHabits:badHabits,
            bruxismo:bruxismo
          }
        )
        if (!res.data.error)
            setAnamId(res.data.result.insertId); 
            setNext(true); 
         
      }


    return (
        <Container>
            <Card>
                <CardBody>
                    <h3>{location.state.run}, {location.state.name} {location.state.apellido}</h3>
                    <h1>
                        Anamnesis Odonto-geriátrica
                    </h1>
                    <h5 className="heading-small" >Antecedentes</h5>
                    
                    <Form  onSubmit={addBackground} role="form">
                        <FormGroup className="row">
                            <Col>
                            <Label
                                className="form-control-label"
                            >
                                ¿Cuando fue la última vez que vine al dentista?
                            </Label>
                            
                                <Input
                                    defaultValue=""
                                    id="example-text-input"
                                    type="textarea"
                                    onChange={(e) => { setLastTime(e.target.value) }}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col md="2">
                                ¿Bebe alcohol?
                            </Col>
                            <Col md="10">
                                <label className="custom-toggle custom-toggle-warning mr-1">
                                    <Input type="checkbox" onChange={(e) => { setAlcohol(!alcohol) }} />
                                    <span
                                        className="custom-toggle-slider rounded-circle"
                                        data-label-off="No"
                                        data-label-on="Sí"
                                    />
                                </label>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col md="2">
                            ¿Consume drogas?
                            </Col>
                            <Col md="10">
                                <label className="custom-toggle custom-toggle-warning mr-1">
                                    <Input type="checkbox" onChange={(e) => { setDrugs(!drugs) }} />
                                    <span
                                        className="custom-toggle-slider rounded-circle"
                                        data-label-off="No"
                                        data-label-on="Sí"
                                    />
                                </label>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col md="2">
                                ¿Fuma?
                            </Col>
                            <Col md="2">
                                <label className="custom-toggle custom-toggle-warning mr-1">
                                    <Input type="checkbox" onChange={(e) => { addSmoke() }} />
                                    <span
                                        className="custom-toggle-slider rounded-circle"
                                        data-label-off="No"
                                        data-label-on="Sí"
                                    />
                                </label>
                            </Col>
                            {smoke &&
                            <>
                            <Col md="2">
                            Cantidad
                            </Col> 
                            <Col md="2">
                            <label className="">
                                <Input type="number" onChange={(e) => { setSmokeCuantity(e.target.value) }} />
                               
                            </label>
                            </Col>
                            </>
                            
                            }
                        </FormGroup>
                        <FormGroup className="row">
                            <Col >
                            <Label
                                className="form-control-label"
                                htmlFor="exampleFormControlSelect3"
                                
                            >
                                Observaciones
                            </Label>
                            
                                <Input
                                    defaultValue=""
                                    id="example-text-input"
                                    type="textarea"
                                    onChange={(e) => { setBadHabits(e.target.value) }}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col md="2">
                                ¿Bruxismo?
                            </Col>
                            <Col md="10">
                                <label className="custom-toggle custom-toggle-warning mr-1">
                                    <Input type="checkbox" onChange={(e) => { setBruxismo(!bruxismo) }} />
                                    <span
                                        className="custom-toggle-slider rounded-circle"
                                        data-label-off="No"
                                        data-label-on="Sí"
                                    />
                                </label>
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
                    pathname: "/admin/muscular-exam",
                    state: { id: location.state.id, run: location.state.run, name: location.state.name, apellido : location.state.apellido, anamId: anam_id} 
                    }} /> } 
                </CardBody>
            </Card>
        </Container>
    )
}

export default Background
