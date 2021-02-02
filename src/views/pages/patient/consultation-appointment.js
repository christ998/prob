// import "assets/css/custom-style.css";
import {Redirect} from 'react-router-dom';
import React, {useState, useEffect, useRef} from 'react';
import {Alert, Button, Col, Container, FormGroup, Input, Card, CardBody, Label, Table, Modal, ModalHeader, ModalBody, InputGroupAddon, InputGroup} from 'reactstrap';
import {getList} from 'helpers/ListHelper';
import moment from 'moment';
import axios from '../../../helpers/axiosConfig';
import SimpleModal from "../components/SimpleModal";

const ConsultationAppointment = ({location}) => {
    
    const [cleanLocation, setCleanLocation] = useState(false)
    const [newAppointment, setNewAppointment] = useState(false);
    const reqTag = <span style={{color:"#DC3545"}}>*</span>
    let l_run = ""
    if(location?.state?.run) {
        l_run = location.state.run;
    }

    const modalRef = useRef()
    const setSimpleModal = (options) => {
        modalRef.current.setModal(options);
    };  

    const [searchTerm, setSearchTerm] = useState(l_run);
    const [person, setPerson] = useState({});
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPersons = async () => {
        const res = await getList("list/person");
        setLoading(false)
        setPersons(res);
    };

    useEffect(() => { 
        setTimeout(fetchPersons, 1000);
        cambiar();
        return () => {
            setCleanLocation(true);
        }
        
    }, []);

    /*Professionals###########################################################################*/ 
    const defaultProfessional = {professional_id: 0, professional_fullname: ""};
    const [professional, setProfessional] = useState(defaultProfessional);
    const [professionals, setProfessionals] = useState([]);
    const [displayModalProfessionals, setDisplayModalProfessionals] = useState(false);
    const [searchTermProfessional, setSearchTermProfessional] = useState("");

    const showModalProfessionals = async () => {
        fetchProfessionals();
        setDisplayModalProfessionals(!displayModalProfessionals);
        setSearchTermProfessional("");
    }

    const obtener = async professional => {
        setProfessional(professional)
        setDisplayModalProfessionals(!displayModalProfessionals);
    };

    const fetchProfessionals = async () => {
        const res = await getList("user/user-professional");
        setProfessionals(res);
    };
    /*Professionals###########################################################################*/ 

    /*Appointments###############################################################################*/ 
    const [displayModalAppointments, setDisplayModalAppointments] = useState(false);
    const [appointments, setAppointments] = useState([]);
    
    const showModalAppointments = async (person) => {
        setPerson(person);
        fetchAppointments(person.person_id);
        setDisplayModalAppointments(!displayModalAppointments);
    }

    const fetchAppointments = async person_id => {
        const res = await getList("consultation-appointment/" + person_id);
        setAppointments(res);
    }; 
    /*Appointments###############################################################################*/ 

    /*Appointment################################################################################*/ 
    const defaultAppointment = {cons_appo_id: 0, cons_appo_date: moment(), cons_appo_time: "09:00", professional_id: "", cons_appo_place: "", cons_appo_description: ""};
    const [displayModalAppointment, setDisplayModalAppointment] = useState(false);
    const [appointment, setAppointment] = useState(defaultAppointment);

    const showModalAppointmentToCreate = person => {
        setPerson(person);
        setAppointment(defaultAppointment);
        setProfessional(defaultProfessional);
        setDisplayModalAppointment(!displayModalAppointment);
    };

    const showModalAppointmentToUpdate = appointment => {
        setAppointment(appointment);
        setProfessional({professional_id: appointment.professional_id, professional_fullname: appointment.professional_fullname})
        setDisplayModalAppointment(!displayModalAppointment);
    }

    const handleInputChange = e => {
        setAppointment({
            ...appointment,
            [e.target.name]: e.target.value
        });
    };
    /*Appointment################################################################################*/ 

    /*Crud#######################################################################################*/ 
    const disableAppointment = async id => {
        await axios.put("consultation-appointment/" + id);
        setSimpleModal({})
        fetchAppointments(person.person_id);
    };

    const updateAppointment = async () => {
        try {
            const res = await axios.post( "consultation-appointment/" + appointment.cons_appo_id,
            {   
                cons_appo_date: appointment.cons_appo_date, 
                cons_appo_time: appointment.cons_appo_time,
                professional_id: professional.professional_id,
                cons_appo_place: appointment.cons_appo_place,
                cons_appo_description: appointment.cons_appo_description
            });

            if (!res.data.error) {
                setDisplayModalAppointment(!displayModalAppointment);
                fetchAppointments(person.person_id);
            } else {
                console.log('Err: ' + res.data.result.code + ' ' + res.data.result.sqlMessage);
            };
        } catch(e) {
            console.log('Err: ' + e);
        };
    };

    const saveAppointment = async () => {
        try {
            const res = await axios.post("consultation-appointment",
            {   person_id: person.person_id, 
                cons_appo_date: appointment.cons_appo_date , 
                cons_appo_time: appointment.cons_appo_time,
                professional_id: professional.professional_id,
                cons_appo_place: appointment.cons_appo_place,
                cons_appo_description: appointment.cons_appo_description
            });
            if (!res.data.error) {
                setDisplayModalAppointment(!displayModalAppointment);
                setNewAppointment(true);
                //showModalAppointments(person);
            } else {
                console.log('Err: ' + res.data.result.code + ' ' + res.data.result.sqlMessage);
            };
        } catch(e) {
            console.log('Err: ' + e);
        };
    };
    /*Crud#######################################################################################*/ 
    
    const [ingresado, setIngresado]=useState(false)

    const cambiar =()=>{
        if(location?.state?.ingresado){
              setIngresado(!ingresado)
            }
        }

    return (
        <Container className="mt-3">
            <SimpleModal ref={modalRef}/>
            
            {location?.state?.ingresado && <Alert color="success" isOpen={ingresado} toggle={() => {setIngresado(false)}}>
                Paciente ingresado exitosamente
            </Alert> }
            <Alert color="success" isOpen={newAppointment} toggle={() => {setNewAppointment(false)}}>
                La consulta fue agendada exitosamente
            </Alert>
            <Card>
                <CardBody>
                    
                    <h1>Agendar Consulta</h1>
                    <Input 
                        type="text" 
                        placeholder="Buscar..."
                        name="look_for"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <br/>
                    {loading 
                        ?<div className="w-100 d-flex justify-content-center">
                            <div className="loader"></div>
                        </div>
                        :<Table className="align-items-center" responsive>
                            <thead className="thead-light">
                                <tr className="text-center">
                                    <th scope="col">ID</th>
                                    <th scope="col">Rut</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Apellidos</th>    
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {persons.filter(val => {
                                    if(searchTerm == "") {
                                        return val;
                                    } else if (val.run.includes(searchTerm) || val.fullname.toLowerCase().includes(searchTerm.toLowerCase())) {
                                        return val;
                                    }
                                }).map(e_person => (
                                    <tr className="text-center" key={e_person.person_id}>
                                        <td>{e_person.person_id}</td>
                                        <td>{e_person.run}</td>
                                        <td>{e_person.names}</td>
                                        <td>{e_person.lastnames}</td>
                                        <td><Button color="primary" onClick={() => showModalAppointmentToCreate(e_person)}>Nuevo</Button></td>
                                        <td><Button onClick={() => showModalAppointments(e_person)}>Listado</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    }
                </CardBody>
            </Card>
            <Modal isOpen={displayModalAppointment}>
                <ModalHeader toggle={() => {setDisplayModalAppointment(!displayModalAppointment)}}>
                    Agenda
                </ModalHeader>
                <ModalBody className= "pt-2">
                    <FormGroup className="row">
                        <Col>
                            <Label className="form-control-label">Fecha {reqTag}</Label>
                            <Input
                                value={moment(appointment.cons_appo_date).format('YYYY-MM-DD')}
                                type="date"
                                name="cons_appo_date"
                                onChange={e => {handleInputChange(e)}}
                                required
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup className="row">
                        <Col>
                            <Label className="form-control-label">Hora {reqTag}</Label>
                            <Input
                                value={appointment.cons_appo_time}
                                type="time"
                                name="cons_appo_time"
                                onChange={e => {handleInputChange(e)}}
                                required
                            />
                            <h5 align="right" style={{marginRight: "10px", marginBottom: "0px"}}>La cita posee una duración de 2 horas</h5>
                        </Col>
                    </FormGroup>
                    <FormGroup className="row">
                        <Col>
                            <Label className="form-control-label">Profesional {reqTag}</Label>
                            <InputGroup>
                                <Input
                                    style={{backgroundColor: "white"}}
                                    required
                                    readOnly
                                    type="text"
                                    name="professional_fullname"
                                    value={professional.professional_fullname}
                                />
                                <InputGroupAddon addonType="append">
                                    <i className="fas fa-search btn btn-primary" onClick={() => showModalProfessionals()}></i>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </FormGroup>
                    <FormGroup className="row">
                        <Col>
                            <Label className="form-control-label">Lugar</Label>
                            <Input 
                                autoComplete="off" maxLength="250" type="textarea"
                                name="cons_appo_place"
                                value={appointment.cons_appo_place}
                                onChange={e => handleInputChange(e)}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup className="row">
                        <Col>
                            <Label className="form-control-label">Descripción</Label>
                            <Input 
                                autoComplete="off" maxLength="250"
                                type="textarea"
                                name="cons_appo_description"
                                value={appointment.cons_appo_description}
                                onChange={e => handleInputChange(e)}
                            />
                        </Col>
                    </FormGroup>
                    <div className= "float-right mb-2 mr-2">
                        {appointment.cons_appo_id == 0 
                            ? <Button color="primary" onClick={() => {saveAppointment()}}>Guardar</Button>
                            : <Button color="primary" onClick={() => {updateAppointment()}}>Modificar</Button>
                        }
                    </div>
                    <h5 style={{color:"#DC3545"}}>* Existen campos obligatorios</h5>
                </ModalBody>
            </Modal>
            <Modal size="lg" isOpen={displayModalAppointments}>
                <ModalHeader toggle={() => {setDisplayModalAppointments(!displayModalAppointments)}}>
                    Agenda
                </ModalHeader>
                <ModalBody className= "pt-1">
                    <Table className="align-items-center" responsive>
                        <thead className="thead-light">
                            <tr className="text-center">
                                <th scope="col">Paciente</th>
                                <th scope="col">Dia / Hora</th>
                                <th scope="col">Profesional</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(appointment => (
                                <tr className="text-center" key={appointment.cons_appo_id}>
                                    <td>{appointment.run}</td>
                                    <td>{moment(appointment.cons_appo_date).format('DD-MM-YYYY')} / {moment(appointment.cons_appo_time,"HH:mm").format('HH:mm')}</td>
                                    <td>{appointment.professional_fullname}</td>
                                    <td>
                                        <Button color="primary" onClick={() => showModalAppointmentToUpdate(appointment)}>Editar</Button>
                                    </td>
                                    <td>
                                        <Button color="danger" size="sm" onClick={
                                            () => setSimpleModal({title: 'Agenda', text : '¿Desea eliminar agenda del ' + moment(appointment.cons_appo_date).format('DD-MM-YYYY') + ' a las ' + moment(appointment.cons_appo_time,"HH:mm").format('HH:mm') + '?', type: 2, fx: () => disableAppointment(appointment.cons_appo_id)})
                                        }><i className="far fa-trash-alt"></i></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </ModalBody>
            </Modal>
            <Modal size="lg" isOpen={displayModalProfessionals}>
                <ModalHeader toggle={() => {setDisplayModalProfessionals(!displayModalProfessionals)}}>
                    Profesionales
                </ModalHeader>
                <ModalBody className= "pt-1">
                    <Input 
                        type="text" 
                        placeholder="Buscar profesional..."
                        value={searchTermProfessional}
                        onChange={e => setSearchTermProfessional(e.target.value)}
                    />
                    <br/>
                    <Table className="align-items-center" responsive>
                        <thead className="thead-light">
                            <tr className="text-center">
                                <th scope="col">Profesional</th>
                                <th scope="col">Área de Especialidad</th>
                                <th scope="col">Email</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {professionals.filter(val => {
                                if(searchTermProfessional == "") {
                                    return val;
                                } else if (val.professional_run.includes(searchTermProfessional) || val.professional_fullname.toLowerCase().includes(searchTermProfessional.toLowerCase()) || val.professional_medical_area_name.toLowerCase().includes(searchTermProfessional.toLowerCase())) {
                                    return val;
                                }
                            }).map(professional => (
                                <tr className="text-center" key={professional.professional_id + '' + professional.professional_medical_area_id}>
                                    <td>{professional.professional_fullname}</td>
                                    <td>{professional.professional_medical_area_name}</td>
                                    <td>{professional.professional_email}</td>
                                    <td>
                                        <Button onClick={() => obtener(professional)} color="primary">Seleccionar</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </ModalBody>
            </Modal>
            {cleanLocation && 
                <Redirect to={
                    {pathname: "/admin/consultation-appointment",
                    state: {}}
                }/> 
            }
        </Container>
    )
}

export default ConsultationAppointment;