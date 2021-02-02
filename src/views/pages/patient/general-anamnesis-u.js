import React, {useState, useEffect} from 'react';
import {Button, Col, Container, Form, FormGroup, Input, Card, CardBody, ModalHeader, Label} from 'reactstrap';
import axios from '../../../helpers/axiosConfig';
import {getList} from 'helpers/ListHelper'; 
import useList from 'hooks/useList';

const GeneralAnamnesis = ({location}) => {
    const [has, setHas] = useState(false);
    //LOCATION###############################################################
    useEffect(() => {
        if (!location?.state?.id) { 
            //location.state.id = 11;
            fetchLastGeneral(0);
        } else {
            fetchLastGeneral(location.state.id);
        };        
    }, []);

    //GENERAL###############################################################
    const defaultGeneral = {general_anamnesis_id: 0, person_id: 0, allergies: "", other_disease: "", under_treatment: 0, previous_surgeries: "", medicine_dose: "", medicine_allergies: "", radio_chemo_therapy: "", consult_motive: "", consult_motive_history: "", medic_alert: ""};
    const [general, setGeneral] = useState(defaultGeneral);
    const fetchLastGeneral = async (person_id) => {
        const res = await getList("general-anamnesis/" + person_id);
        if (res.length === 1) {
            setGeneral(res[0]);
            fetchDiseases(res[0].general_anamnesis_id);
            setHas(true);
        }; 
    }; 

    const handleInputChange = e => {
        setGeneral({
            ...general,
            [e.target.name]: e.target.value
        });
    };

    const handleInputCheckedChange = e => {
        setGeneral({
            ...general,
            [e.target.name]: e.target.checked
        });
    };

    const handleCurrentDiseases = e => {
        setDiseases({
            ...diseases,
            [e.target.name]: e.target.checked
        });
    };

    //DISEASES##############################################################
    const prmDiseases = useList("list/diseases");
    const [diseases, setDiseases] = useState([]);
    const fetchDiseases = async (general_anamnesis_id) => {
        const obj = {};
        const res = await getList("general-anamnesis/crud/" + general_anamnesis_id);
        for (let i = 0; i < res.length; i++) {
            obj[res[i]['disease_id']] = res[i]['has_disease'];
        }
        setDiseases(obj);
    };  
    
    //CRUD##################################################################
    const saveChanges = async (e) => {
        e.preventDefault();
        const d = [];
        for(var i in diseases){
            if(diseases[i]) {
                d.push(i);
            }; 
        };
        try {
            const res = await axios.post("general-anamnesis/crud", {...general, d});
            if (!res.data.error) {
                console.log('Cambios guardados correctamente!');
            } else {
                console.log('Err: ' + res.data.result.code + ' ' + res.data.result.sqlMessage);
            };
        } catch(e) {
            console.log('Err: ' + e);
        };
    };

    //GROUP#################################################################
    const [group, setGroup] = useState('motive');

    //JSX##################################################################
    return (
        <Container>
            <h1>Anamnesis general</h1>
                {!has 
                    ? <Card><h4>El paciente no tiene registros en Anamnesis general.</h4></Card> 
                    : <Card>
                        <CardBody className="pb-0 pt-1">
                            <ModalHeader className="pb-5 pl-0">
                                <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'motive' ? {color:"#11cdef"} : {})}} onClick={() => setGroup('motive')}>Motivo de consulta</a>
                                <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'background' ? {color:"#11cdef"} : {})}} onClick={() => setGroup('background')}>Antecedentes mórbidos personales</a>
                            </ModalHeader>
                            <Form id="id-form-update" onSubmit={(e) => saveChanges(e)} role="form">
                                {group === 'motive' && <>
                                    <FormGroup className="row">
                                        <Col>
                                            <Label className="form-control-label">Motivo Consulta</Label>
                                            <Input
                                                autoComplete="off" maxLength="250"
                                                type="text"
                                                name="consult_motive"
                                                value={general.consult_motive}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="row">
                                        <Col>
                                            <Label className="form-control-label">Historial del motivo de Consulta</Label>
                                            <Input
                                                autoComplete="off" maxLength="250"
                                                type="text"
                                                name="consult_motive_history"
                                                value={general.consult_motive_history}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="row">
                                        <Col>
                                            <Label className="form-control-label">Alerta médica especial y comentarios relevantes sobre el paciente</Label>
                                            <Input
                                                autoComplete="off" maxLength="250"
                                                type="text"
                                                name="medic_alert"
                                                value={general.medic_alert}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="row">
                                        <Col className="d-flex">
                                            <Label className="form-control-label">Está bajo tratamiento</Label>
                                            <label className="custom-toggle custom-toggle-warning ml-3">
                                                <Input
                                                    type="checkbox"
                                                    name="under_treatment"
                                                    checked={general.under_treatment}
                                                    onChange={e => {handleInputCheckedChange(e)}}
                                                />
                                                <span className="custom-toggle-slider rounded-circle" data-label-off="No" data-label-on="Sí"/>
                                            </label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="row">
                                        <Col>
                                            <Label className="form-control-label">Alergias</Label>
                                            <Input
                                                autoComplete="off" maxLength="250"
                                                type="text"
                                                name="allergies"
                                                value={general.allergies}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="row">
                                        <Col>
                                            <Label className="form-control-label">Cirugías previas/ Hospitalización/</Label>
                                            <Input
                                                autoComplete="off" maxLength="250"
                                                type="text"
                                                name="previous_surgeries"
                                                value={general.previous_surgeries}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="row">
                                        <Col>
                                            <Label className="form-control-label">Fármacos y Posología</Label>
                                            <Input
                                                autoComplete="off" maxLength="250"
                                                type="text"
                                                name="medicine_dose"
                                                value={general.medicine_dose}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="row">
                                        <Col>
                                            <Label className="form-control-label">Alergia a Fármacos (especificar cuál)</Label>
                                            <Input
                                                autoComplete="off" maxLength="250"
                                                type="text"
                                                name="medicine_allergies"
                                                value={general.medicine_allergies}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="row">
                                        <Col>
                                            <Label className="form-control-label">Radioterapia / Quimioterapia</Label>
                                            <Input
                                                autoComplete="off" maxLength="250"
                                                type="text"
                                                name="radio_chemo_therapy"
                                                value={general.radio_chemo_therapy}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </Col>
                                    </FormGroup>
                                </>}    
                                {group === 'background' && <>
                                    <FormGroup className="row">
                                        <Col md="10">
                                            {prmDiseases.map(prm => (
                                                <div key={prm.disease_id} className="custom-control custom-checkbox custom-checkbox-primary">
                                                    <Input
                                                        type="checkbox"
                                                        id={prm.disease_id}
                                                        name={prm.disease_id}
                                                        className="custom-control-input"
                                                        checked={diseases[prm.disease_id]}
                                                        onChange={e => handleCurrentDiseases(e)}
                                                    />
                                                    <label className="custom-control-label" htmlFor={prm.disease_id}>{prm.name}</label>
                                                </div>
                                            ))}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="row">
                                        <Col>
                                            <Label className="form-control-label">Otros / Observaciones</Label>
                                            <Input
                                                autoComplete="off" maxLength="250"
                                                type="text"
                                                name="other_disease"
                                                value={general.other_disease}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </Col>
                                    </FormGroup>
                                </>}
                                <div className= "float-right mb-4 mr-2">
                                    <Button type="submit" id="id-btn-save" color="primary">Guardar</Button>{' '}
                                    {/* <Button onClick={() => {setDisplayModal(!displayModal)}} color="secondary">Cancelar</Button> */}
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                }
        </Container>
    );
};

export default GeneralAnamnesis;
