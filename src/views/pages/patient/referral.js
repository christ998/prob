// import "assets/css/custom-style.css";
import {Redirect} from 'react-router-dom';
import React, {useState, useEffect, useRef} from 'react';
import {Button, Col, Container, FormGroup, Input, Card, CardBody, Label, Table, Modal, ModalHeader, ModalBody, InputGroup, InputGroupAddon} from 'reactstrap';
import {getList} from 'helpers/ListHelper';
import moment from 'moment';
import axios from '../../../helpers/axiosConfig';
import SimpleModal from "../components/SimpleModal";

const Referral = ({location}) => {

    const [cleanLocation, setCleanLocation] = useState(false)
    let l_run = ""
    if(location?.state?.run) {
        l_run = location.state.run;
    }
    
    const [searchTermPerson, setSearchTermPerson] = useState(l_run);
    const [loading, setLoading] = useState(true);
    const [persons, setPersons] = useState([]);
    const [person, setPerson] = useState({});

    const fetchPersons = async () => {
        const res = await getList("list/person");
        setLoading(false)
        setPersons(res);
    };

    useEffect(() => { 
        setTimeout(fetchPersons, 1000);
        return () => {
            setCleanLocation(true);
        }
    }, []);

    const modalRef = useRef()
    const setSimpleModal = (options) => {
        modalRef.current.setModal(options);
    };

    /*Referrals###############################################################################*/ 
    const [displayModalReferrals, setDisplayModalReferrals] = useState(false);
    const [referrals, setReferrals] = useState([]);
    const showModalReferrals = async (person) => {
        setPerson(person);
        fetchReferrals(person.person_id);
        setDisplayModalReferrals(!displayModalReferrals);
    }
    const fetchReferrals = async person_id => {
        const res = await getList("referral/" + person_id);
        setReferrals(res);
    };  
    /*Referrals###############################################################################*/ 

    /*Professionals###########################################################################*/ 
    const defaultProfessional = {professional_id: 0, professional_fullname: "", professional_run: "", professional_email: "", professional_medical_area_id: 0, professional_medical_area_name: ""};
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

    /*Referral################################################################################*/
    const defaultReferral = {referral_id: 0, referral_description: ""};
    const [displayModalReferral, setDisplayModalReferral] = useState(false);
    const [referral, setReferral] = useState(defaultReferral);
    
    const showModalReferralToCreate = (person) => {
        setPerson(person);
        setReferral(defaultReferral);
        setProfessional(defaultProfessional);
        setDisplayModalReferral(!displayModalReferral);
    };

    const showModalReferralToUpdate = referral => {
        setReferral(referral);
        setProfessional(referral);
        setDisplayModalReferral(!displayModalReferral);
    };

    const handleInputChangeReferral = e => {
        setReferral({
            ...referral,
            [e.target.name]: e.target.value
        });
    };
    /*Referral################################################################################*/ 
    
    /*Crud####################################################################################*/ 
    const disableReferral = async id => {
        await axios.put("referral/" + id);
        setSimpleModal({})
        fetchReferrals(person.person_id);
    };

    const updateReferral = async () => {
        try {
            const res = await axios.post("referral/" + referral.referral_id,
            {   professional_id: professional.professional_id, 
                professional_medical_area_id: professional.professional_medical_area_id, 
                referral_description: referral.referral_description
            });
            if (!res.data.error) {
                setDisplayModalReferral(!displayModalReferral);
                fetchReferrals(person.person_id);
            } else {
                console.log('Err: ' + res.data.result.code + ' ' + res.data.result.sqlMessage);
            };
        } catch(e) {
            console.log('Err: ' + e);
        };
    };

    const emailBody = 
    `
        <html>
            <h2>Interconsulta</h2>
            <ul>
                <li>Paciente: ${person.names + ' ' + person.lastnames}</li>
                <li>Rut: ${person.run}</li>
                <li>Profesional: ${professional.professional_fullname}</li>
                <li>Area: ${professional.professional_medical_area_name}</li>
                <li>Descripcion: ${referral.referral_description}</li>
            </ul>
            <br></br>
            <em>Este email fue generado automaticamente, por favor no responder</em>
        </html>    
    `
    const saveReferral = async () => {
        try {
            const res = await axios.post(process.env.REACT_APP_API_URL + "referral",
            {   person_id: person.person_id,
                professional_id: professional.professional_id, 
                professional_medical_area_id: professional.professional_medical_area_id, 
                referral_description: referral.referral_description,
                professional_email: professional.professional_email,
                emailBody: emailBody
            });
            if (!res.data.error) {
                setDisplayModalReferral(!displayModalReferral);
            } else {
                console.log('Err: ' + res.data.result.code + ' ' + res.data.result.sqlMessage);
            };
        } catch(e) {
            console.log('Err: ' + e);
        };
    };
    /*Crud####################################################################################*/ 

    return (
        <Container className="mt-3">
            <SimpleModal ref={modalRef}/>
            <Card>
                <CardBody>
                    {location?.state?.run && <h3>{location.state.run}, {location.state.name} {location.state.apellido}</h3>}
                    <h1>Interconsulta</h1>
                    <Input 
                        type="text" 
                        placeholder="Buscar paciente..."
                        value={searchTermPerson}
                        onChange={e => setSearchTermPerson(e.target.value)}
                    />
                    <br/>
                    {loading 
                        ?<div className="w-100 d-flex justify-content-center">
                            <div className="loader"></div>
                        </div>
                        :<Table className="align-items-center" responsive>
                            <thead className="thead-light">
                                <tr className="text-center">
                                    <th scope="col">Run</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Apellidos</th>    
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {persons.filter(val => {
                                    if(searchTermPerson == "") {
                                        return val;
                                    } else if (val.run.includes(searchTermPerson) || val.fullname.toLowerCase().includes(searchTermPerson.toLowerCase())) {
                                        return val;
                                    }
                                }).map(e_person => (
                                    <tr className="text-center" key={e_person.person_id}>
                                        <td>{e_person.run}</td>
                                        <td>{e_person.names}</td>
                                        <td>{e_person.lastnames}</td>
                                        <td>
                                            <Button color="primary" onClick={() => showModalReferralToCreate(e_person)}>Nuevo</Button>
                                        </td>
                                        <td>
                                            <Button onClick={() => showModalReferrals(e_person)}>Listado</Button>
                                        </td>                                    
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    }
                </CardBody>
            </Card>
            <Modal isOpen={displayModalReferral}>
                <ModalHeader toggle={() => {setDisplayModalReferral(!displayModalReferral)}}>
                    Interconsulta
                </ModalHeader>
                <ModalBody className= "pt-1">
                    <FormGroup className="row">
                        <Col>
                            <Label className="form-control-label">Profesional</Label>
                            <InputGroup>
                                <Input
                                    style={{backgroundColor: "white"}}
                                    readOnly
                                    type="text"
                                    name="referral_user_fullname"
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
                            <Label className="form-control-label">Área de Especialidad Odontológica/Médica</Label>
                            <Input 
                                style={{backgroundColor: "white"}}
                                readOnly
                                type="text"
                                name="professional_medical_area_name"
                                value={professional.professional_medical_area_name}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup className="row">
                        <Col>
                            <Label className="form-control-label">Email</Label>
                            <Input 
                                style={{backgroundColor: "white"}}
                                readOnly
                                type="email"
                                name="professional_email"
                                value={professional.professional_email}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup className="row">
                        <Col>
                            <Label className="form-control-label">Descripción</Label>
                            <Input 
                                autoComplete="off" maxLength="250"
                                type="textarea"
                                name="referral_description"
                                value={referral.referral_description}
                                onChange={e => handleInputChangeReferral(e)}
                            />
                        </Col>
                    </FormGroup>
                    <div className= "float-right mb-2 mr-2">
                        {referral.referral_id == 0 
                            ? <Button color="primary" onClick={() => {saveReferral()}}>Guardar</Button>
                            : <Button color="primary" onClick={() => {updateReferral()}}>Editar</Button>
                        }
                    </div>
                </ModalBody>
            </Modal>
            <Modal size="lg" isOpen={displayModalProfessionals}>
                <ModalHeader toggle={() => {setDisplayModalProfessionals(!displayModalProfessionals)}}>
                    Interconsulta
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
            <Modal size="lg" isOpen={displayModalReferrals}>
                <ModalHeader toggle={() => {setDisplayModalReferrals(!displayModalReferrals)}}>
                    Interconsulta
                </ModalHeader>
                <ModalBody className= "pt-1">
                    <Table className="align-items-center" responsive>
                        <thead className="thead-light">
                            <tr className="text-center">
                                <th scope="col">Fecha Creacion</th>
                                <th scope="col">Profesional</th>
                                <th scope="col">Área de Especialidad</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {referrals.map(referral => (
                                <tr className="text-center" key={referral.referral_id}>
                                    <td>{moment(referral.referral_created_date).format('DD-MM-YYYY')}</td>
                                    <td>{referral.professional_fullname}</td>
                                    <td>{referral.professional_medical_area_name}</td>
                                    <td>
                                        <Button color="primary" onClick={() => showModalReferralToUpdate(referral)}>Editar</Button>
                                    </td>
                                    <td>
                                        <Button onClick={() => setSimpleModal({title: 'Interconsulta', text : '¿Desea eliminar la interconsulta con el profesional ' + referral.professional_fullname + '?', type: 2, fx: () => disableReferral(referral.referral_id)})}>Eliminar</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </ModalBody>
            </Modal>
            {cleanLocation && 
                <Redirect to={
                    {pathname: "/admin/consultation-referral",
                    state: {}}
                }/> 
            }
        </Container>
    );
};

export default Referral;