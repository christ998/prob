import React, {useState, useEffect, useRef} from 'react'
import {Button, Col, Container, Form, FormGroup, Input, InputGroup,Card, CardBody, Label, Table, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import axios from '../../../helpers/axiosConfig'
import {Link} from 'react-router-dom';
import useList from 'hooks/useList';
import {getList} from 'helpers/ListHelper'; 
import moment from 'moment';
import SimpleModal from "../components/SimpleModal";

const ListPatient = () => {
    useEffect(() => {fetchPersons()}, []);  
    const [persons, setPersons] = useState([]);
    const [currentPerson, setCurrentPerson] = useState({});
    const [group, setGroup] = useState('person');
    const maritalStatus = useList("list/marital-status");
    const livesWith = useList("list/lives-with");
    const nativeOrigins = useList("list/native-origin");
    const previsions = useList("list/prevision");
    const educationLevels = useList("list/education-level");
    const covidRisks = useList("list/covid-risk");
    const acceptedConcents = useList("list/consent");
    const regions = useList("list/region");
    const towns = useList("list/town");
    const registereds = useList("list/registered-by") 

    //SimpleModal######################################################################################################
    const modalRef = useRef()
    const setModal = (options) => {
        modalRef.current.setModal(options)
    };
    //SimpleModal######################################################################################################
    
    const fetchPersons = async () => {
        const res = await getList("person/listpatient");
        setPersons(res);
    };  
    
    const handleInputChange = e => {
        setCurrentPerson({
            ...currentPerson,
            [e.target.name]: e.target.value
        });
    };

    const handleInputCheckedChange = e => {
        setCurrentPerson({
            ...currentPerson,
            [e.target.name]: e.target.checked
        });
    };

    const [displayModal, setDisplayModal] = useState(false);
    const showModal = (person) => {
        setGroup("person");
        setCurrentPerson(person);
        setDisplayModal(!displayModal);
    }

    const changeGroup = (group) => {
        var form = document.getElementById('id-form-update');
        if(form.checkValidity()) {
            setGroup(group);
        } else {
            document.getElementById('id-btn-save').click();
        };
    };

    const updatePerson = async e => {
        e.preventDefault();
        //alert('Funcionalidad en mantencion!!!!');
        try {
            const res = await axios.put("person", currentPerson);
            switch(res.data.result[0][0].cod) {
                case 0: 
                    //window.location.reload();
                    fetchPersons();
                    setDisplayModal(!displayModal);
                    break;
                case 1: 
                    setModal({title: 'Usuario', text : 'El usuario ' + currentPerson.run + ' ya existe.', type: 1});
                    break;
                case 2:
                    setModal({title: 'Usuario', text : 'El usuario ' + currentPerson.run + ' ya existe pero esta inactivo', type: 1});
                    break;
                default:
                    setModal({title: 'Error', text : 'Despierte al administrador de sistemas ' + res.data.result[0][0].msg, type: 1});
                    break;
            };
        } catch(e) {
            console.log('Err: ' + e);
        };
    };

    const updateStatePerson = async run => {
        const res = await axios.put("person/" + run);
        if (!res.data.error) {
            fetchPersons();
        };
    };

    const reqTag = <span style={{color: "#DC3545"}}>*</span>

    return (
        <Container className="mt-3">
            <Card>
                <CardBody>
                    <h1>Listado de pacientes</h1>
                    <Table className="align-items-center" responsive>
                        <thead className="thead-light">
                            <tr className="text-center">
                                <th scope="col">N°</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Apellido</th>
                                <th scope="col">Run</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                           {persons.map(
                                (person, i) =>
                                    <tr className="text-center" key={person.person_id}>
                                        <td>{i + 1}</td>
                                        <td>{person.names}</td>
                                        <td>{person.lastnames}</td>
                                        <td>{person.run}</td>
                                        <td>
                                            <Button color="primary" onClick={() => showModal(person)}>Editar</Button>
                                            <Modal size="lg" isOpen={displayModal}>
                                                <Form id="id-form-update" role="form" onSubmit={e => updatePerson(e)}>
                                                    <ModalHeader toggle={() => {setDisplayModal(!displayModal)}}>
                                                        <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'person' ? {color:"#11cdef"} : {})}} onClick={() => changeGroup('person')}>Paciente</a>
                                                        <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'carer' ? {color:"#11cdef"} : {})}} onClick={() => changeGroup('carer')}>Cuidador</a>
                                                        <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'motive' ? {color:"#11cdef"} : {})}} onClick={() => changeGroup('motive')}>Motivo consulta</a>
                                                        <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'sociodemo' ? {color:"#11cdef"} : {})}} onClick={() => changeGroup('sociodemo')}>Sociodemográficos</a>
                                                        <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'consent' ? {color:"#11cdef"} : {})}} onClick={() => changeGroup('consent')}>Consentimiento</a>
                                                        <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'covid' ? {color:"#11cdef"} : {})}} onClick={() => changeGroup('covid')}>Covid</a>
                                                    </ModalHeader>
                                                    <ModalBody className="pt-1">
                                                        {group === 'person' && <>
                                                            <h5 style={{color: "#DC3545"}}>* Existen campos obligatorios</h5>
                                                            <FormGroup className="row">
                                                                <Col md="6">
                                                                    <Label className="form-control-label pt-3">Nombres {reqTag}</Label>
                                                                    <Input
                                                                        required autoComplete="off"
                                                                        type="text"
                                                                        value={currentPerson.names}
                                                                        name="names"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                    />
                                                                    <Label className="form-control-label pt-3">Apellidos {reqTag}</Label>
                                                                    <Input
                                                                        required autoComplete="off"
                                                                        type="text"
                                                                        value={currentPerson.lastnames}
                                                                        name="lastnames"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                    />
                                                                    <Label className="form-control-label pt-3">Número de Identidad {reqTag}</Label>
                                                                    <InputGroup>
                                                                        <Input
                                                                            required autoComplete="off"
                                                                            type="text"
                                                                            value={currentPerson.run}
                                                                            name="run"
                                                                            onChange={e => {handleInputChange(e)}}
                                                                        />
                                                                    </InputGroup>
                                                                    <Label className="form-control-label pt-3">Fecha de nacimiento {reqTag}</Label>
                                                                    <Input
                                                                        required
                                                                        type="date"
                                                                        value={moment(currentPerson.birthdate).format('YYYY-MM-DD')}
                                                                        name="birthdate"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                    />
                                                                    <Label className="form-control-label pt-3">Dirección</Label>
                                                                    <Input
                                                                        type="text" maxLength="250" autoComplete="off"
                                                                        placeholder="Dirección"
                                                                        name="address"
                                                                        value={currentPerson.address}
                                                                        onChange={e => {handleInputChange(e)}}
                                                                    />
                                                                    <Label className="form-control-label pt-3">Region {reqTag}</Label>
                                                                    <Input 
                                                                        type="select"
                                                                        name="region_id"
                                                                        required
                                                                        value={currentPerson.region_id}
                                                                        onChange={e => handleInputChange(e)}>
                                                                            <option hidden value="">Seleccione...</option>
                                                                            {regions.map(e => (<option key={e.region_id} value={e.region_id}>{e.name}</option>))}
                                                                    </Input>
                                                                </Col>
                                                                <Col md="6">
                                                                    <Label className="form-control-label pt-3">Comuna de procedencia {reqTag}</Label>
                                                                    <Input 
                                                                        type="select"
                                                                        name="town_id"
                                                                        required
                                                                        value={currentPerson.town_id}
                                                                        onChange={e => handleInputChange(e)}>
                                                                            <option hidden value="">Seleccione...</option>
                                                                            {towns.map(e => (<option key={e.town_id} value={e.town_id}>{e.name}</option>))}
                                                                    </Input>
                                                                    <Label className="form-control-label pt-3">Enrolado por {reqTag}</Label>
                                                                    <Input 
                                                                        type="select"
                                                                        name="registered_by_id"
                                                                        required
                                                                        value={currentPerson.registered_by_id}
                                                                        onChange={e => handleInputChange(e)}>
                                                                            <option hidden value="">Seleccione...</option>
                                                                            {registereds.map(e => (<option key={e.registered_by_id} value={e.registered_by_id}>{e.name}</option>))}
                                                                    </Input>
                                                                    <Label className="form-control-label pt-3">Teléfono fijo</Label>
                                                                    <Input
                                                                        type="tel" autoComplete="off"
                                                                        value={currentPerson.phone}
                                                                        name="phone"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                    />
                                                                    <Label className="form-control-label pt-3">Teléfono celular</Label>
                                                                    <Input
                                                                        type="tel" autoComplete="off"
                                                                        value={currentPerson.cellphone}
                                                                        name="cellphone"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                    />
                                                                    <Label className="form-control-label pt-3">Email</Label>
                                                                    <Input
                                                                        name="email" autoComplete="off"
                                                                        value={currentPerson.email}
                                                                        type="email"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                    />
                                                                    <br/><br/>
                                                                    <Col className="d-flex p-0">
                                                                        <Label className="form-control-label">¿Paciente esta pensionado?</Label>
                                                                        <label className="custom-toggle custom-toggle-warning ml-3">
                                                                            <Input 
                                                                                type="checkbox"
                                                                                name="is_retired"
                                                                                checked={currentPerson.is_retired}
                                                                                onChange={e => {handleInputCheckedChange(e)}}
                                                                            />
                                                                            <span className="custom-toggle-slider rounded-circle" data-label-off="No" data-label-on="Sí"/>
                                                                        </label>
                                                                    </Col>
                                                                </Col>
                                                            </FormGroup>
                                                        </>}
                                                        {group === 'carer' && <>
                                                            <FormGroup className="row">
                                                                <Col md="6">
                                                                    <Label className="form-control-label pt-3">Nombres</Label>
                                                                    <Input
                                                                        name="carer_names" autoComplete="off"
                                                                        type="text"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                        value={currentPerson.carer_names}
                                                                    />
                                                                    <Label className="form-control-label pt-3">Apellidos</Label>
                                                                    <Input
                                                                        name="carer_lastnames" autoComplete="off"
                                                                        type="text"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                        value={currentPerson.carer_lastnames}
                                                                    />
                                                                    <Label className="form-control-label pt-3">Comuna de procedencia</Label>
                                                                    <Input 
                                                                        type="select"
                                                                        name="carer_town_id"
                                                                        required
                                                                        value={currentPerson.carer_town_id}
                                                                        onChange={e => handleInputChange(e)}>
                                                                            <option hidden value="">Seleccione...</option>
                                                                            {towns.map(e => (<option key={e.town_id} value={e.town_id}>{e.name}</option>))}
                                                                    </Input>
                                                                </Col>
                                                                <Col md="6">
                                                                    <Label className="form-control-label pt-3">Teléfono fijo</Label>
                                                                    <Input
                                                                        name="carer_phone" autoComplete="off"
                                                                        type="tel"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                        value={currentPerson.carer_phone}
                                                                    />
                                                                    <Label className="form-control-label pt-3">Teléfono celular</Label>
                                                                    <Input
                                                                        name="carer_cellphone" autoComplete="off"
                                                                        type="tel"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                        value={currentPerson.carer_cellphone}
                                                                    />
                                                                    <Label className="form-control-label pt-3">Email</Label>
                                                                    <Input
                                                                        type="email" autoComplete="off"
                                                                        name="carer_email"
                                                                        value={currentPerson.carer_email}
                                                                        onChange={e => {handleInputChange(e)}}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </>}
                                                        {group === 'motive' && <>
                                                            <FormGroup className="row">
                                                                <Col className="d-flex">
                                                                        <Label className="form-control-label pt-3">¿Urgencia dental?</Label>
                                                                        <label className="custom-toggle custom-toggle-warning ml-3 mt-3">
                                                                            <Input 
                                                                                type="checkbox"
                                                                                name="urgency"
                                                                                checked={currentPerson.urgency}
                                                                                onChange={e => {handleInputCheckedChange(e)}}
                                                                            />
                                                                            <span className="custom-toggle-slider rounded-circle" data-label-off="No" data-label-on="Sí"/>
                                                                        </label>
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup className="row">
                                                                <Col>
                                                                    <Label className="form-control-label">Motivo</Label>
                                                                    <div className="custom-control custom-checkbox custom-checkbox-primary">
                                                                        <Input
                                                                            type="checkbox"
                                                                            id="pain"   
                                                                            name="pain"                                                                        
                                                                            className="custom-control-input"
                                                                            checked={currentPerson.pain}
                                                                            onChange={e => {handleInputCheckedChange(e)}}
                                                                        />
                                                                        <label className="custom-control-label" htmlFor="pain"><strong>Dolor severo de causa dentaria</strong>, que no ceda a analgésicos.</label>
                                                                    </div>
                                                                    <div className="custom-control custom-checkbox custom-checkbox-primary">
                                                                        <Input
                                                                            type="checkbox"
                                                                            id="cavities"  
                                                                            name="cavities"                                                                        
                                                                            className="custom-control-input"
                                                                            checked={currentPerson.cavities}
                                                                            onChange={e => {handleInputCheckedChange(e)}}
                                                                        />
                                                                        <label className="custom-control-label" htmlFor="cavities"><strong>Manchas o heridas en cualquier parte de la boca</strong> que no desaparecen en 1 mes.</label>
                                                                    </div>
                                                                    <div className="custom-control custom-checkbox custom-checkbox-primary">
                                                                        <Input
                                                                            type="checkbox"
                                                                            id="wounds"  
                                                                            name="wounds"                                                                        
                                                                            className="custom-control-input"
                                                                            checked={currentPerson.wounds}
                                                                            onChange={e => {handleInputCheckedChange(e)}}
                                                                        />
                                                                        <label className="custom-control-label" htmlFor="wounds"><strong>Lesiones en mucosa/encía</strong>, debido a desajuste de prótesis dental.</label>
                                                                    </div>
                                                                    <div className="custom-control custom-checkbox custom-checkbox-primary">
                                                                        <Input
                                                                            type="checkbox"
                                                                            id="bleeding"   
                                                                            name="bleeding"                                                                        
                                                                            className="custom-control-input"
                                                                            checked={currentPerson.bleeding}
                                                                            onChange={e => {handleInputCheckedChange(e)}}
                                                                        />
                                                                        <label className="custom-control-label" htmlFor="bleeding"><strong>Hemorragia bucal.</strong></label>
                                                                    </div>
                                                                    <div className="custom-control custom-checkbox custom-checkbox-primary">
                                                                        <Input
                                                                            type="checkbox"
                                                                            id="fracture"   
                                                                            name="fracture"                                                                        
                                                                            className="custom-control-input"
                                                                            checked={currentPerson.fracture}
                                                                            onChange={e => {handleInputCheckedChange(e)}}
                                                                        />
                                                                        <label className="custom-control-label" htmlFor="fracture"><strong>Pérdida o fractura de restauraciones</strong> (tapaduras) o <strong>prótesis dentales.</strong></label>
                                                                    </div>
                                                                    <div className="custom-control custom-checkbox custom-checkbox-primary">
                                                                        <Input
                                                                            type="checkbox"
                                                                            id="trauma"   
                                                                            name="trauma"                                                                        
                                                                            className="custom-control-input"
                                                                            checked={currentPerson.trauma}
                                                                            onChange={e => {handleInputCheckedChange(e)}}
                                                                        />
                                                                        <label className="custom-control-label" htmlFor="trauma"><strong>Trauma reciente.</strong></label>
                                                                    </div>
                                                                    <div className="custom-control custom-checkbox custom-checkbox-primary">
                                                                        <Input
                                                                            type="checkbox"
                                                                            id="swelling"   
                                                                            name="swelling"                                                                        
                                                                            className="custom-control-input"
                                                                            checked={currentPerson.swelling}
                                                                            onChange={e => {handleInputCheckedChange(e)}}
                                                                        />
                                                                        <label className="custom-control-label" htmlFor="swelling"><strong>Hinchazón importante de boca</strong>, cara o cuello.</label>
                                                                    </div>
                                                                    <div className="custom-control custom-checkbox custom-checkbox-primary">
                                                                        <Input
                                                                            type="checkbox"
                                                                            id="treatment"   
                                                                            name="treatment"                                                                        
                                                                            className="custom-control-input"
                                                                            checked={currentPerson.treatment}
                                                                            onChange={e => {handleInputCheckedChange(e)}}
                                                                        />
                                                                        <label className="custom-control-label" htmlFor="treatment"><strong>Tratamiento dental requerido previo a procedimientos médicos</strong> críticos impostergables.</label>
                                                                    </div>
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup className="row">
                                                                <Col>
                                                                    <Label className="form-control-label">Otro</Label>
                                                                    <Input
                                                                        name="other" maxLength="250" autoComplete="off"
                                                                        type="textarea"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                        value={currentPerson.other}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                            <br/>
                                                            <FormGroup className="row">
                                                                <Col md="6">
                                                                    <Label className="form-control-label" htmlFor="exampleFormControlSelect3">
                                                                        Encuesta OHIP-14Sp (
                                                                            <a href="https://docs.google.com/forms/d/e/1FAIpQLSetI2HQMrH1lhqeQBUZT1ks2KKpxrhIpL-ceOm3jYEyIY_gwQ/viewform" target="_blank">ver</a>)
                                                                    </Label>
                                                                    <Input
                                                                        max="9999" min="-9999"
                                                                        value={currentPerson.ohip14sp_result}
                                                                        name="ohip14sp_result"
                                                                        type="number"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                    />
                                                                </Col>
                                                                <Col md="6">
                                                                    <Label className="form-control-label" htmlFor="exampleFormControlSelect3">
                                                                        Índice de Barthel (
                                                                            <a href="https://docs.google.com/forms/d/e/1FAIpQLSemuQyOJFSXvhQYjtf_ZKziNjYgvgKGFDTSMU1UlzffJzahPA/viewform" target="_blank">ver</a>)
                                                                    </Label>
                                                                    <Input
                                                                        max="9999" min="-9999"
                                                                        value={currentPerson.dependency_level}
                                                                        name="dependency_level"
                                                                        type="number"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                    />
                                                                </Col>
                                                            </FormGroup>

                                                        </>}
                                                        {group === 'sociodemo' && <>
                                                            <FormGroup className="row">
                                                                <Col md="6">
                                                                    <Label className="form-control-label pt-3">Ocupacion</Label>
                                                                    <Input
                                                                        name="occupation" autoComplete="off"
                                                                        type="text"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                        value={currentPerson.occupation}
                                                                    />
                                                                    <Label className="form-control-label pt-3">Previsión</Label>
                                                                    <Input 
                                                                        type="select" 
                                                                        name="prevision_id"
                                                                        value={currentPerson.prevision_id}
                                                                        onChange={e => handleInputChange(e)}>
                                                                            {previsions.map(e=> (<option key={e.prevision_id} value={e.prevision_id}>{e.name}</option>))}
                                                                    </Input>
                                                                    <Label className="form-control-label pt-3">Estado conyugal</Label>
                                                                    <Input 
                                                                        type="select" 
                                                                        name="marital_status_id"
                                                                        value={currentPerson.marital_status_id}
                                                                        onChange={e => handleInputChange(e)}>
                                                                            {maritalStatus.map(e=> (<option key={e.marital_status_id} value={e.marital_status_id}>{e.name}</option>))}
                                                                    </Input>
                                                                    <Label className="form-control-label pt-3">Comuna de nacimiento</Label>
                                                                    <Input
                                                                        name="birth_commune" autoComplete="off"
                                                                        type="text"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                        value={currentPerson.birth_commune}
                                                                    />
                                                                </Col>
                                                                <Col md="6">
                                                                    <Label className="form-control-label pt-3">Pueblo Originario</Label>
                                                                    <Input 
                                                                        type="select" 
                                                                        name="native_origin_id"
                                                                        value={currentPerson.native_origin_id}
                                                                        onChange={e => handleInputChange(e)}>
                                                                            {nativeOrigins.map(e=> (<option key={e.native_origin_id} value={e.native_origin_id}>{e.name}</option>))}
                                                                    </Input>
                                                                    <Label className="form-control-label pt-3">Nivel educacional</Label>
                                                                    <Input 
                                                                        type="select" 
                                                                        name="educational_level_id"
                                                                        value={currentPerson.educational_level_id}
                                                                        onChange={e => handleInputChange(e)}>
                                                                            {educationLevels.map(e=> (<option key={e.educational_level_id} value={e.educational_level_id}>{e.name}</option>))}
                                                                    </Input>
                                                                    <Label className="form-control-label pt-3">Red familiar</Label>
                                                                    <Input 
                                                                        type="select" 
                                                                        name="lives_with_id"
                                                                        value={currentPerson.lives_with_id}
                                                                        onChange={e => handleInputChange(e)}>
                                                                            {livesWith.map(e=> (<option key={e.lives_with_id} value={e.lives_with_id}>{e.name}</option>))}
                                                                    </Input>
                                                                </Col>
                                                            </FormGroup>
                                                        </>}
                                                        {group === 'consent' && <>
                                                            <FormGroup className="row">
                                                                <Col className="d-flex">
                                                                    <Label className="form-control-label pt-3">¿Leyo el consentimiento?</Label>
                                                                    <label className="custom-toggle custom-toggle-warning ml-3 mt-3">
                                                                        <Input 
                                                                            type="checkbox"
                                                                            name="consent_read"
                                                                            checked={currentPerson.consent_read}
                                                                            onChange={e => {handleInputCheckedChange(e)}}
                                                                        />
                                                                        <span className="custom-toggle-slider rounded-circle" data-label-off="No" data-label-on="Sí"/>
                                                                    </label>
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup className="row">
                                                                <Col>
                                                                    <Label className="form-control-label pt-3">¿Acepta el consentimiento? (
                                                                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSemuQyOJFSXvhQYjtf_ZKziNjYgvgKGFDTSMU1UlzffJzahPA/viewform" target="_blank">ver</a>)
                                                                    </Label>
                                                                    <Input 
                                                                        type="select" 
                                                                        name="informed_consent_answer_id"
                                                                        value={currentPerson.informed_consent_answer_id}
                                                                        onChange={e => handleInputChange(e)}>
                                                                            {acceptedConcents.map(e=> (<option key={e.informed_consent_answer_id} value={e.informed_consent_answer_id}>{e.answer}</option>))}
                                                                    </Input>
                                                                    <Label className="form-control-label pt-3">Observaciones</Label>
                                                                    <Input
                                                                        name="observations" autoComplete="off" maxLength="250"
                                                                        type="textarea"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                        value={currentPerson.observations}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </>}
                                                        {group === 'covid' && <>
                                                            <FormGroup className="row">
                                                                <Col>
                                                                    <Label className="form-control-label pt-3">Encuesta caso COVID (
                                                                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSf7GsvK4AVlSlzQ8dFXcouJeNhKWzbHkjU78WTD7p92gNUpYg/viewform" target="_blank">ver</a>)
                                                                    </Label>
                                                                    <Input 
                                                                        type="select" 
                                                                        name="covid19_risk_id"
                                                                        value={currentPerson.covid19_risk_id}
                                                                        onChange={e => handleInputChange(e)}>
                                                                            {covidRisks.map(e=> (<option key={e.covid19_risk_id} value={e.covid19_risk_id}>{e.covid_risk}</option>))}
                                                                    </Input>
                                                                    <Label className="form-control-label pt-3">Temperatura</Label>
                                                                    <Input
                                                                        step="0.1"
                                                                        name="temperature"
                                                                        type="number"
                                                                        onChange={e => {handleInputChange(e)}}
                                                                        value={currentPerson.temperature}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </>}
                                                        <div className= "float-right mb-4 mr-2">
                                                            <Button type="submit" id="id-btn-save" color="primary">Guardar</Button>{' '}
                                                            <Button onClick={() => {setDisplayModal(!displayModal)}} color="secondary">Cancelar</Button>
                                                        </div>
                                                    </ModalBody>
                                                </Form>
                                            </Modal>
                                        </td>
                                        <td>
                                            <Button color="primary">
                                                <Link 
                                                    style={{color: "white"}} 
                                                    to={{
                                                        pathname: "/admin/covid-risk-reception",
                                                        state: {id: person.person_id, run: person.run, name: person.names, apellido: person.lastnames}
                                                    }}>Recepcionar
                                                </Link>                
                                            </Button>
                                        </td> 
                                        <td>
                                            <SimpleModal ref={modalRef}/>
                                            <Button color="danger" size="sm" onClick={() => setModal({title: 'Paciente', text: 'Desea eliminar al paciente ' + person.run + '?', type: 2, fx: () => updateStatePerson(person.run)})}>
                                                <i className="far fa-trash-alt"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </Container>
    );
};

export default ListPatient;