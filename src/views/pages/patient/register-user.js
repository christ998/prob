import React, { useState, useRef } from 'react'
import {Button, Col, Container, Form, FormGroup, Input, Card, CardBody, Label, Alert} from 'reactstrap'
import Axios from '../../../helpers/axiosConfig'
import useList from 'hooks/useList';
import SimpleModal from "../components/SimpleModal";

const RegisterUser = () => {
    const types = useList("list/user-type")
    const [user, setUser] = useState({email: ""});
    const [add, setAdded] = useState(false)

    const modalRef = useRef()
    const setModal = (options) => {
        modalRef.current.setModal(options)
    };

    const handleInputChange = e => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        document.getElementById("main-form").reset();
        setUser({});
        setModal({});
    }

    const addUser = async e => {
        e.preventDefault()
        window.scrollTo({top: 0})
        try {
            const res = await Axios.post("user", {
                user_id: 0,
                run: user.run,
                names: user.names,
                lastnames: user.paternal_last_name + " " + user.maternal_last_name,
                user_type_id: user.user_type_id,
                email: user.email
            });

            switch(res.data.result[0][0].cod) {
                case 0:
                    //setModal({title: 'Usuario', text : 'Usuario ' + user.run + ' registrado correctamente!', type: 1});
                    setAdded(true)
                    setTimeout(()=>setAdded(false),3000)
                    resetForm();
                    break;
                case 1:
                    setModal({title: 'Usuario', text : 'El usuario ' + user.run + ' ya existe.', type: 1});
                    break;
                case 2:
                    setModal({title: 'Usuario', text : 'El usuario ' + user.run + ' ya existe pero esta inactivo. ¿Desea activarlo?', type: 2, fx: updateStateUser});
                    break;
                default:
                    setModal({title: 'Error', text : 'Despierte al administrador de sistemas' + res.data.result[0][0].msg, type: 1});
                    break;
              };
        } catch(e) {
            console.log('Err: ' + e);
        }
    }

    const updateStateUser = async () => {
        const res = await Axios.put("user/" + user.run)
        if (!res.data.error) {
            //handleModal({title: 'Usuario', text : 'Usuario ' + user.run + ' activado exitosamente!', type: 1});
            resetForm();
        }
    }

    const reqTag = <span style={{color:"#DC3545"}}>*</span>

    return (
        <Container className="mt-3" id="inicio">
            <SimpleModal ref={modalRef}/>
            {add &&
            <Alert color="success"><strong>Usuario agregado exitosamente</strong></Alert>
            }
            <Card>
                <CardBody>
                    <h1>Registrar Usuario</h1>
                    <h5 style={{color:"#DC3545"}}>* Existen campos obligatorios</h5>
                    <Form onSubmit={addUser} role="form" id="main-form">
                        <FormGroup className="row">
                            <Col>
                            <Label className="form-control-label">Nombres {reqTag}</Label>
                                <Input
                                    autoComplete="off"
                                    placeholder="Debe colocar primera letra en Mayúscula"
                                    type="text"
                                    name="names"
                                    onChange={e => handleInputChange(e)}
                                    required
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                            <Label className="form-control-label">Apellido paterno {reqTag}</Label>
                                <Input
                                    autoComplete="off"
                                    placeholder="Debe colocar primera letra en Mayúscula"
                                    type="text"
                                    name="paternal_last_name"
                                    onChange={e => handleInputChange(e)}
                                    required
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                            <Label className="form-control-label">Apellido materno {reqTag}</Label>
                                <Input
                                    autoComplete="off"
                                    placeholder="Debe colocar primera letra en Mayúscula"
                                    type="text"
                                    name="maternal_last_name"
                                    onChange={e => handleInputChange(e)}
                                    required
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                            <Label className="form-control-label">Número de Identidad {reqTag}</Label>
                                <Input
                                    placeholder="12345678-9"
                                    autoComplete="off"
                                    type="text"
                                    name="run"
                                    onChange={e => handleInputChange(e)}
                                    required
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                            <Label className="form-control-label">Rol {reqTag}</Label>
                                <Input
                                    type="select"
                                    name="user_type_id"
                                    required
                                    onChange={e => handleInputChange(e)}>
                                        <option hidden value="">Seleccione...</option>
                                        {types.map(e=> (<option key={e.user_type_id} value={e.user_type_id}>{e.name}</option>))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                            <Label className="form-control-label">Email</Label>
                                <Input
                                    autoComplete="off"
                                    placeholder="correo@dominio.cl"
                                    type="email"
                                    name="email"
                                    onChange={e => handleInputChange(e)}
                                />
                            </Col>
                        </FormGroup>
                        <br></br>
                        <Button className= "float-right" type="submit" color="primary">Registrar Usuario</Button>
                    </Form>
                </CardBody>
            </Card>
        </Container>
    )

}


export default RegisterUser