import React, {useState, useRef} from 'react'
import {Button, Col, Container, Form, FormGroup, Input, Card, CardBody, Label} from 'reactstrap'
import axios from "../../../helpers/axiosConfig"
import useList from '../../../hooks/useList';
import {Redirect} from 'react-router-dom';
import SimpleModal from "../components/SimpleModal";

const PatientAdmission = () => {
    const regions = useList("list/region");
    const towns = useList("list/town");
    const carerTowns = towns; 
    const registereds = useList("list/registered-by")  
    const [toggle, setToggle] = useState(false);
    const [next, setNext] = useState(false);
    const [createdPersonId, setCreatedPersonId] = useState(0);
    const defaultPerson = {run: '', names: '', paternal_lastname: '', maternal_lastname: '', birthdate: '', address: '', is_retired: 0, region_id: 0, town_id: 0, registered_by_id: 0, phone: '', cellphone: '', email: ''}
    const defaultCarer = {carer_names: '', carer_paternal_lastname: '', carer_maternal_lastname: '', carer_town_id: 7, carer_phone: '', carer_cellphone: '', carer_email: ''}
    const[newCarer, setNewCarer] = useState(defaultCarer);
    const[newPerson, setNewPerson] = useState(defaultPerson);

    //SimpleModal######################################################################################################
    const modalRef = useRef()
    const setModal = (options) => {
        modalRef.current.setModal(options)
    };
    //SimpleModal######################################################################################################


    const handleToggle = () => {
        if(toggle){
            setNewCarer(defaultCarer);
        }
        setToggle(!toggle);
    };

    const handleInputChangePerson = e => {
        setNewPerson({
            ...newPerson,
            [e.target.name]: e.target.value
        });
    };

    const handleInputCheckedChange = e => {
        setNewPerson({
            ...newPerson,
            [e.target.name]: e.target.checked
        });
    };

    const handleInputChangeCarer = e => {
        setNewCarer({
            ...newCarer,
            [e.target.name]: e.target.value
        });
    };

    const addPerson = async e => {
        e.preventDefault();
        try {
            const res = await axios.post("person", {
                run: newPerson.run,
                names: newPerson.names,
                lastnames: newPerson.paternal_lastname + " " + newPerson.maternal_lastname,
                birthdate: newPerson.birthdate,
                address: newPerson.address,
                is_retired: newPerson.is_retired,
                region_id: newPerson.region_id,
                town_id: newPerson.town_id,
                registered_by_id: newPerson.registered_by_id,
                phone: newPerson.phone,
                cellphone: newPerson.cellphone,
                email: newPerson.email,
                carer_names: newCarer.carer_names,
                carer_lastnames: newCarer.carer_paternal_lastname + " " + newCarer.carer_maternal_lastname,
                carer_town_id: newCarer.carer_town_id,
                carer_phone: newCarer.carer_phone,
                carer_cellphone: newCarer.carer_cellphone,
                carer_email: newCarer.carer_email
            }, {withCredentials:true});
            switch(res.data.result[0][0].cod) {
                case 0: 
                    setCreatedPersonId(res.data.result[0][0].id);
                    setNext(true);
                    break;
                case 1: 
                    setModal({title: 'Paciente', text : 'El paciente ' + newPerson.run + ' ya existe.', type: 1});
                    break;
                case 2: 
                    setModal({title: 'Paciente', text : 'El paciente ' + newPerson.run + ' ya existe pero esta inactivo. ¿Desea activarlo?', type: 2, fx: updateStatePerson});
                    break;
                default:
                    setModal({title: 'Error', text : 'Despierte al administrador de sistemas' + res.data.result[0][0].msg, type: 1});
                    break;
            };
        } catch(e) {
            console.log('Err: ' + e);
            alert("Err: " + e);
        };
    };

    const updateStatePerson = async () => {
        const res = await axios.put("person/" + newPerson.run);
        if (!res.data.error) {
            setModal({title: 'Paciente', text : 'El paciente ' + newPerson.run + ' fue activado correctamente', type: 1});
        };
    };
  
    const hoy = new Date()
    const reqTag = <span style={{color: "#DC3545"}}>*</span>
    
    return (
        <Container className="mt-3">
            <SimpleModal ref={modalRef}/>
            <Card>
                <CardBody>
                    <h1>Ingreso de Paciente</h1>
                    <h5 style={{color: "#DC3545"}}>* Existen campos obligatorios</h5>
                    <Form onSubmit={addPerson} role="form">
                        <FormGroup className="row">
                            <Col md="6">
                                <Label className="form-control-label pt-3">Nombres {reqTag}</Label>
                                <Input
                                    placeholder="Debe colocar primera letra en Mayúscula"
                                    type="text"
                                    name="names"
                                    pattern="^[ña-zÑA-Z ]*$"
                                    onChange={e => {handleInputChangePerson(e)}}
                                    required
                                />
                                <Label className="form-control-label pt-3">Apellido Paterno {reqTag}</Label>
                                <Input
                                    placeholder="Debe colocar primera letra en Mayúscula"
                                    type="text"
                                    name="paternal_lastname"
                                    pattern="^[ÑA-Zña-z ]*$"
                                    onChange={e => {handleInputChangePerson(e)}}
                                    required
                                />
                                <Label className="form-control-label pt-3">Apellido Materno {reqTag}</Label>
                                <Input
                                    placeholder="Debe colocar primera letra en Mayúscula"
                                    type="text"
                                    name="maternal_lastname"
                                    pattern="^[ÑA-Zña-z ]*$"
                                    onChange={e => {handleInputChangePerson(e)}}
                                    required
                                />
                                <Label className="form-control-label pt-3">Número de Identidad (sin puntos y con un guión antes del último digito) {reqTag}</Label>
                                <Input
                                    placeholder="12345678-9"
                                    type="text"
                                    name="run"
                                    // pattern="^[ÑA-Zña-z ]*$"
                                    onChange={e => {handleInputChangePerson(e)}}
                                    required
                                />
                                <Label className="form-control-label pt-3">Fecha de nacimiento {reqTag}</Label>
                                <Input
                                    placeholder="2018-11-23"
                                    type="date"
                                    name="birthdate"
                                    min="1910-01-01"
                                    max={""+hoy.getFullYear()+"-"+hoy.getMonth()+"-"+hoy.getDate()}
                                    onChange={e => {handleInputChangePerson(e)}}
                                    required
                                />
                                <Label className="form-control-label pt-3">Dirección</Label>
                                <Input
                                    type="text" maxLength="250"
                                    placeholder="Dirección"
                                    name="address"
                                    onChange={e => {handleInputChangePerson(e)}}
                                />
                                <br></br>
                                <Col className="d-flex p-0">
                                    <Label className="form-control-label">¿Paciente esta pensionado?</Label>
                                    <label className="custom-toggle custom-toggle-warning ml-3">
                                        <Input 
                                            type="checkbox"
                                            name="is_retired"
                                            onChange={e => {handleInputCheckedChange(e)}}
                                        />
                                        <span className="custom-toggle-slider rounded-circle" data-label-off="No" data-label-on="Sí"/>
                                    </label>
                                </Col>
                            </Col>
                            <Col md="6">
                                <Label className="form-control-label pt-3">Region {reqTag}</Label>
                                <Input 
                                    type="select"
                                    name="region_id"
                                    required
                                    onChange={e => handleInputChangePerson(e)}>
                                        <option hidden value="">Seleccione...</option>
                                        {regions.map(e => (<option key={e.region_id} value={e.region_id}>{e.name}</option>))}
                                </Input>
                                <Label className="form-control-label pt-3">Comuna de procedencia {reqTag}</Label>
                                <Input 
                                    type="select"
                                    name="town_id"
                                    required
                                    onChange={e => handleInputChangePerson(e)}>
                                        <option hidden value="">Seleccione...</option>
                                        {towns.map(e => (<option key={e.town_id} value={e.town_id}>{e.name}</option>))}
                                </Input>
                                <Label className="form-control-label pt-3">Enrolado por {reqTag}</Label>
                                <Input 
                                    type="select"
                                    name="registered_by_id"
                                    required
                                    onChange={e => handleInputChangePerson(e)}>
                                        <option hidden value="">Seleccione...</option>
                                        {registereds.map(e => (<option key={e.registered_by_id} value={e.registered_by_id}>{e.name}</option>))}
                                </Input>
                                <Label className="form-control-label pt-3">Teléfono fijo</Label>
                                <Input
                                    placeholder="+56 9 2299 7066"
                                    type="tel"
                                    name="phone"
                                    pattenr="[0-9]*"
                                    onChange={e => {handleInputChangePerson(e)}}
                                />
                                <Label className="form-control-label pt-3">Teléfono celular</Label>
                                <Input
                                    placeholder="+56 9 2299 7066"
                                    type="tel"
                                    name="cellphone"
                                    pattenr="[+]569[0-9]{8}"
                                    onChange={e => {handleInputChangePerson(e)}}
                                />
                                <Label className="form-control-label pt-3">Email</Label>
                                <Input
                                    placeholder="correo@dominio.cl"
                                    name="email"
                                    type="email"
                                    onChange={e => {handleInputChangePerson(e)}}
                                />
                                <br></br>
                                <Col className="d-flex p-0">
                                    <Label className="form-control-label">¿Paciente posee un cuidador?</Label>
                                    <label className="custom-toggle custom-toggle-warning ml-3">
                                        <Input 
                                            type="checkbox"
                                            onChange={() => handleToggle()}
                                        />
                                        <span className="custom-toggle-slider rounded-circle" data-label-off="No" data-label-on="Sí"/>
                                    </label>
                                </Col>
                            </Col>
                        </FormGroup>
                        {toggle === true &&
                            <>
                                {/* <h6 className="heading-small text-muted mb-4">Cuidador</h6> */}
                                <FormGroup className="row">
                                    <Col md="6">
                                        <Label className="form-control-label pt-3">Nombres {reqTag}</Label>
                                        <Input
                                            required
                                            placeholder="Debe colocar primera letra en Mayúscula"
                                            name="carer_names"
                                            type="text"
                                            pattern="^[ña-zÑA-Z ]*$"
                                            onChange={e => {handleInputChangeCarer(e)}}
                                            value={newCarer.carer_names}
                                        />
                                        <Label className="form-control-label pt-3">Apellido Paterno {reqTag}</Label>
                                        <Input
                                            required
                                            placeholder="Debe colocar primera letra en Mayúscula"
                                            name="carer_paternal_lastname"
                                            type="text"
                                            pattern="^[ÑA-Z ña-z]*$"
                                            onChange={e => {handleInputChangeCarer(e)}}
                                            value={newCarer.carer_paternal_lastname}
                                        />
                                        <Label className="form-control-label pt-3">Apellido Materno {reqTag}</Label>
                                        <Input
                                            required
                                            placeholder="Debe colocar primera letra en Mayúscula"
                                            name="carer_maternal_lastname"
                                            type="text"
                                            pattern="^[ÑA-Z ña-z]*$"
                                            onChange={e => {handleInputChangeCarer(e)}}
                                            value={newCarer.carer_maternal_lastname}
                                        />
                                        <Label className="form-control-label pt-3">Comuna de procedencia {reqTag}</Label>
                                        <Input 
                                            type="select"
                                            name="carer_town_id"
                                            required
                                            onChange={e => handleInputChangeCarer(e)}>
                                                <option hidden value="">Seleccione...</option>
                                                {carerTowns.map(e => (<option key={e.town_id} value={e.town_id}>{e.name}</option>))}
                                        </Input>
                                    </Col> 
                                    <Col md="6">
                                        <Label className="form-control-label pt-3">Teléfono fijo</Label>
                                        <Input
                                            placeholder="+56 9 2299 7066"
                                            name="carer_phone"
                                            type="tel"
                                            onChange={e => {handleInputChangeCarer(e)}}
                                            value={newCarer.carer_phone}
                                        />
                                        <Label className="form-control-label pt-3">Teléfono celular</Label>
                                        <Input
                                            placeholder="+56 9 2299 7066"
                                            name="carer_cellphone"
                                            type="tel"
                                            onChange={e => {handleInputChangeCarer(e)}}
                                            value={newCarer.carer_cellphone}
                                        />
                                        <Label className="form-control-label pt-3">Email</Label>
                                        <Input
                                            type="email"
                                            name="carer_email"
                                            placeholder="correo@dominio.cl"
                                            value={newCarer.carer_email}
                                            onChange={e => {handleInputChangeCarer(e)}}
                                        />
                                    </Col>
                                </FormGroup>
                            </>
                        }
                        <Button className= "float-right" type="submit" color="primary" >Registrar</Button>
                    </Form>
                </CardBody>
            </Card>
            {next && 
                <Redirect to={{
                    pathname: "/admin/consultation-motive",
                    state: { id: createdPersonId, run: newPerson.run, name: newPerson.names, apellido : newPerson.paternal_lastname + " " + newPerson.maternal_lastname} 
                }}/> 
            }
    </Container>
  )
};

export default PatientAdmission;