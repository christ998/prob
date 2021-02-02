import React, { useState } from 'react'
import {Button, Col, Container, Form, FormGroup, Input, Card, CardBody, Label} from 'reactstrap'
import Axios from '../../../helpers/axiosConfig'
import { Redirect } from 'react-router-dom';
import useList from 'hooks/useList';


const SociodemographicData = ({location}) => {
    const defaultSocio = {occupation: "", birth_commune: "", prevision_id: 1, marital_status_id: 1, native_origin_id: 1, educational_level_id: 1, lives_with_id: 1}
    const [socio, setSocio] = useState(defaultSocio);
    const [next, setNext]=useState(false)

    const previsions = useList("list/prevision");
    const maritalStatus = useList("list/marital-status");  
    const nativeOrigins = useList("list/native-origin");  
    const educationLevels = useList("list/education-level");  
    const livesWith = useList("list/lives-with");
    
    const handleInputChange = e => {
        setSocio({
            ...socio,
            [e.target.name]: e.target.value
        });
    };
    
    const addSocialdemographicDataToPerson = async e => {
        e.preventDefault()
        const res = await Axios.post("person/sociodemographic-data",
            {
                personId :location.state.id,
                occupation: socio.occupation,
                previsionId: socio.prevision_id,
                maritalStatusId: socio.marital_status_id,
                birthCommune: socio.birth_commune,
                nativeOriginId: socio.native_origin_id,
                educationalLevelId: socio.educational_level_id,
                livesWithId: socio.lives_with_id
            }
        );

        if (!res.data.error){
            setNext(true);
        };  
    };

    return (
        <Container>
            <Card>
                <CardBody>
                    <h3>{location.state.run}, {location.state.name} {location.state.apellido}</h3>
                    <h1> Datos Sociodemográficos</h1>
                    <Form onSubmit={addSocialdemographicDataToPerson} role="form">
                        <FormGroup className="row">
                            <Col>
                            <Label className="form-control-label" htmlFor="example-text-input">Ocupación</Label>
                                <Input
                                    placeholder="Trabajador Social"
                                    id="example-text-input"
                                    type="text"
                                    name="occupation"
                                    onChange={e => handleInputChange(e)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                            <Label className="form-control-label" htmlFor="example-text-input">Previsión</Label>
                                <Input 
                                    id="exampleFormControlSelect3" 
                                    type="select" 
                                    name="prevision_id"
                                    onChange={e => handleInputChange(e)}>
                                        {previsions.map(e=> (<option key={e.prevision_id} value={e.prevision_id}>{e.name}</option>))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                            <Label className="form-control-label" htmlFor="example-text-input">Estado conyugal</Label>
                                <Input 
                                    id="exampleFormControlSelect3" 
                                    type="select" 
                                    name="marital_status_id"
                                    onChange={e => handleInputChange(e)}>
                                        {maritalStatus.map(e=> (<option key={e.marital_status_id} value={e.marital_status_id}>{e.name}</option>))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                            <Label className="form-control-label" htmlFor="example-text-input">Comuna de nacimiento</Label>
                                <Input
                                    placeholder="Temuco"
                                    id="example-text-input"
                                    type="text"
                                    name="birth_commune"
                                    onChange={e => handleInputChange(e)}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                            <Label className="form-control-label" htmlFor="example-text-input">Pueblo Originario</Label>
                                <Input 
                                    id="exampleFormControlSelect3" 
                                    type="select" 
                                    name="native_origin_id"
                                    onChange={e => handleInputChange(e)}>
                                        {nativeOrigins.map(e=> (<option key={e.native_origin_id} value={e.native_origin_id}>{e.name}</option>))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                            <Label className="form-control-label" htmlFor="example-text-input">Nivel educacional</Label>
                                <Input 
                                    id="exampleFormControlSelect3" 
                                    type="select" 
                                    name="educational_level_id"
                                    onChange={e => handleInputChange(e)}>
                                        {educationLevels.map(e=> (<option key={e.educational_level_id} value={e.educational_level_id}>{e.name}</option>))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                            <Label className="form-control-label" htmlFor="example-text-input">Red familiar</Label>
                                <Input 
                                    id="exampleFormControlSelect3" 
                                    type="select" 
                                    name="lives_with_id"
                                    onChange={e => handleInputChange(e)}>
                                        {livesWith.map(e=> (<option key={e.lives_with_id} value={e.lives_with_id}>{e.name}</option>))}
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
                    { next && <Redirect to={{
                    pathname: "/admin/consultation-appointment",
                    state: { id: location.state.id, run: location.state.run, name: location.state.name, apellido : location.state.apellido, ingresado: true} 
                    }} /> }
                </CardBody>
            </Card>
        </Container>
    )
}

export default SociodemographicData
