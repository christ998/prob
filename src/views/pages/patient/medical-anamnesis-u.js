import React, {useState, useEffect, useRef} from 'react';
import {Button, Col, Container, Form, FormGroup, Input, Card, CardBody, ModalHeader, Label, InputGroup, InputGroupAddon, InputGroupText, CardHeader} from 'reactstrap';
import axios from '../../../helpers/axiosConfig';
import {getList} from 'helpers/ListHelper'; 
import SimpleModal from "../components/SimpleModal";

const MedicalAnamnesis = ({location}) => {
    const [has, setHas] = useState(false);

    const modalRef = useRef()
    const setModal = (options) => {
        modalRef.current.setModal(options);
    };

    //LOCATION###############################################################
    useEffect(() => {
        if (!location?.state?.id) { 
            location.state.id = 0;
        }
        fetchLastMedical(location.state.id);
    }, []);

    //FILE###################################################################
    const [fileName, setFileName] = useState("");
    const [fileType, setFileType] = useState("");
    const [file, setFile] = useState({});
    const [hasFile, setHasFile] = useState(false);
    const [files, setFiles] = useState([]);
    const extAllowed = "jpeg jpg png pdf";
    const sizAllowed = 100000000;
    const defaultHelpText = extAllowed + " (max: " + sizAllowed / 1000000 + " MB)";
    const [helpText, setHelpText] =useState(defaultHelpText);

    const handleHasFile = () => {
        setHasFile(!hasFile);
        cleanFile();
        setHelpText(defaultHelpText);
    };

    const fetchFiles= async () => {
        const res = await axios.post("photo/medico_geriatra/obtain", {anamnId: medical.geriatric_medical_anamnesis_id})
        if (!res.data.error) {
            setFiles(res.data.result);
            setModal({});
        };       
    };

    const loadFile = (file) => {
        if (file[0]?.name) {
            const size = file[0].size;
            const full = file[0]?.name;
            const type = full.slice((full.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
            if (extAllowed.indexOf(type) >= 0) {
                if (size <= sizAllowed) {
                    setFileName(full.slice(0, (full.lastIndexOf('.'))));
                    setFileType(type);
                    setFile(file);
                    setHelpText(full);
                    return;
                } else {
                    cleanFile();
                    setHelpText("Tamaño de archivo invalido");
                    return;
                };
            };
            cleanFile();
            setHelpText("Formato de archivo invalido");
        };
    };

    const cleanFile = () => {
        setFileName("");
        setFileType("");
        setFile({});
    };

    const uploadFile = () => {
        if (fileName) {
            const f = new FormData();
            f.append("file", file[0], fileName + '.' + fileType);
            axios.post("file/img_medico/" + location.state.run, f)
            .then(response => {
                saveFile();
            }).catch(error => {
                console.log(error);
            });
        };
    };

    const saveFile = async () => {
        const res = await axios.post("photo/medico_geriatra",
            {anamnId : medical.geriatric_medical_anamnesis_id,
            nombreImagen: fileName + '.' + fileType,
            ruta: "static/images_anam_medico/" + location.state.run}
        );
        if (!res.data.error) {
            fetchFiles();
            cleanFile();
            setHelpText(defaultHelpText);
            setHasFile(false);
        }; 
    };    

    const removeFile = async (fId, name) => {
        const res = await axios.post("photo/medico_geriatra/rm/", {
            fId : fId,
            route : location.state.run + '/' + name
        });
        if (!res.data.error) {
            fetchFiles();
        }; 
    };

    //CRUD###################################################################
    const saveChanges = async () => {
        try {
            const res = await axios.put("geriatrical-medical-anamnesis/crud", medical);
            if (!res.data.error) {
                console.log('Cambios guardados correctamente!');
            } else {
                console.log('Err: ' + res.data.result.code + ' ' + res.data.result.sqlMessage);
            };

        } catch(e) {
            console.log('Err: ' + e);
        };
    };

    const saveChangesFromButton = async e => {
        e.preventDefault();
        saveChanges();
    };    

    //GROUP#################################################################
    const [group, setGroup] = useState('fisical');
    const changeGroup = (group) => {
        var form = document.getElementById('id-form-update');
        if(form.checkValidity()) {
            saveChanges();
            setGroup(group);
        } else {
            document.getElementById('id-btn-save').click();
        };
        fetchFiles();
    };

    //MEDICAL###############################################################
    const defaultMedical = {geriatric_medical_anamnesis_id: 0, person_id: 0, walking_speed: 0, weight: 0, heigth: 0, bmi: 0, blood_pressure: "", temperature: 0, heart_rate: 0, oxygen_saturation: 0, muscular_strength: "s/e", glycemia: 0, extra_info: "", folestein_mmse: 0, pfeiffer_test: 0, yesavage_test: 0};
    const [medical, setMedical] = useState(defaultMedical);
    
    const handleInputChange = e => {
        setMedical({
            ...medical,
            [e.target.name]: e.target.value
        });
    };

    const fetchLastMedical = async (person_id) => {
        const res = await getList("geriatrical-medical-anamnesis/crud/" + person_id);
        if (res.length === 1) {
            setMedical(res[0]);
            setHas(true);
        } else {
            setHas(false);
        };        
    };  

    //JSX####################################################################
    return (
        <Container>
            <SimpleModal ref={modalRef}/>
            <h1>Anamnesis Médico-geriátrica</h1>
            {!has 
                ? <Card><h4>El paciente no tiene registros en Anamnesis Médico-geriátrica.</h4></Card> 
                : <Card>
                    <CardBody className="pb-0 pt-1">
                        {/* {location?.state?.run && <h3>{location.state.run} {location.state.name} {location.state.apellido}</h3>} */}
                        <ModalHeader className="pb-5 pl-0">
                            <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'fisical' ? {color:"#11cdef"} : {})}} onClick={() => changeGroup('fisical')}>Parametros físicos</a>
                            <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'test' ? {color:"#11cdef"} : {})}} onClick={() => changeGroup('test')}>Evaluaciones</a>
                            <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'repo' ? {color:"#11cdef"} : {})}} onClick={() => changeGroup('repo')}>Repositorio</a>
                        </ModalHeader>

                        <Form id="id-form-update" onSubmit={(e) => {saveChangesFromButton(e)}} role="form">
                            {group === 'fisical' && <>
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">Velocidad de marcha</Label>
                                        <InputGroup>
                                            <Input
                                                name="walking_speed"
                                                value={medical.walking_speed}
                                                onChange={e => handleInputChange(e)}
                                                type="number" step="0.1" autoComplete="off"
                                            />
                                            <InputGroupAddon addonType="append"><InputGroupText>m/s</InputGroupText></InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <Label className="form-control-label">Peso</Label>
                                        <InputGroup>
                                            <Input
                                                name="weight"
                                                value={medical.weight}
                                                onChange={e => handleInputChange(e)}
                                                type="number" step="1"  autoComplete="off"
                                            />
                                            <InputGroupAddon addonType="append"><InputGroupText>Kg</InputGroupText></InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <Label className="form-control-label">Altura</Label>
                                        <InputGroup>
                                            <Input
                                                name="heigth"
                                                value={medical.heigth}
                                                onChange={e => handleInputChange(e)}
                                                type="number" step="0.01" autoComplete="off"
                                            />
                                            <InputGroupAddon addonType="append"><InputGroupText>m</InputGroupText></InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">Presión Arterial (Sistólica / Diastólica)</Label>
                                        <InputGroup>
                                            <Input
                                                name="blood_pressure"
                                                value={medical.blood_pressure}
                                                onChange={e => handleInputChange(e)}
                                                autoComplete="off" type="text"
                                            />
                                        <InputGroupAddon addonType="append"><InputGroupText>mmHg</InputGroupText></InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <Label className="form-control-label">Temperatura</Label>
                                        <InputGroup>
                                            <Input
                                                name="temperature"
                                                value={medical.temperature}
                                                onChange={e => handleInputChange(e)}
                                                type="number" step="1" autoComplete="off"
                                            />
                                            <InputGroupAddon addonType="append"><InputGroupText>ºC</InputGroupText></InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <Label className="form-control-label">Frecuencia Caríaca</Label>
                                        <InputGroup>
                                            <Input
                                                name="heart_rate"
                                                value={medical.heart_rate}
                                                onChange={e => handleInputChange(e)}
                                                type="number" step="1" autoComplete="off"
                                            />
                                            <InputGroupAddon addonType="append"><InputGroupText>lat/m</InputGroupText></InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">Saturación de Oxígeno</Label>
                                        <InputGroup>
                                            <Input
                                                name="oxygen_saturation"
                                                value={medical.oxygen_saturation}
                                                onChange={e => handleInputChange(e)}
                                                type="number" step="1" autoComplete="off"
                                            />
                                            <InputGroupAddon addonType="append"><InputGroupText>%SpO2</InputGroupText></InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <Label className="form-control-label">Fuerza Muscular</Label>
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend"><InputGroupText>Grado</InputGroupText></InputGroupAddon>
                                            <Input
                                                name="muscular_strength"
                                                value={medical.muscular_strength}
                                                onChange={e => handleInputChange(e)}
                                                type="select" autoComplete="off"><option>s/e</option><option>1</option><option>2</option><option>3</option><option>4-</option><option>4</option><option>4+</option><option>5</option>
                                            </Input>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <Label className="form-control-label">Glicemia</Label>
                                        <InputGroup>
                                            <Input
                                                name="glycemia"
                                                value={medical.glycemia}
                                                onChange={e => handleInputChange(e)}
                                                type="number" step="1" autoComplete="off"
                                            />
                                            <InputGroupAddon addonType="append"><InputGroupText>mg/dl</InputGroupText></InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">Información Adicional</Label>
                                        <Input
                                            type="textarea" autoComplete="off" maxLength="250"
                                            name="extra_info"
                                            value={medical.extra_info}
                                            onChange={e => handleInputChange(e)}
                                        />
                                    </Col>
                                </FormGroup>
                            </>}
                            {group === 'test' && <>
                                <Label className="form-control-label">Evaluaciones cognitivas</Label>
                                <Col>
                                    <Label className="form-control-label">
                                        Cuestionario Minimental de Folstein (
                                            <a href="https://docs.google.com/forms/d/e/1FAIpQLScOfJZpOKaTXd2OQ6RkgpvhByXY51RzeNtlH24rkiQJ1DCZiw/viewform" target="_blank">ver</a>)
                                    </Label>
                                    <Input
                                        max="9999" min="-9999"
                                        value={medical.folestein_mmse}
                                        name="folestein_mmse"
                                        type="number"
                                        onChange={e => {handleInputChange(e)}}
                                    />
                                </Col>
                                <Col>
                                    <Label className="form-control-label">
                                        Test de Pfeiffer (
                                            <a href="https://docs.google.com/forms/d/e/1FAIpQLScOfJZpOKaTXd2OQ6RkgpvhByXY51RzeNtlH24rkiQJ1DCZiw/viewform" target="_blank">ver</a>)
                                    </Label>
                                    <Input
                                        max="9999" min="-9999"
                                        value={medical.pfeiffer_test}
                                        name="pfeiffer_test"
                                        type="number"
                                        onChange={e => {handleInputChange(e)}}
                                    />
                                </Col>
                                <br/>
                                <br/>
                                <Label className="form-control-label">Evaluación anímica</Label>
                                <Col>
                                    <Label className="form-control-label">
                                        Cuestionario de Yesavage (
                                            <a href="https://docs.google.com/forms/d/e/1FAIpQLScmoS5sWNzDJG9k7ssG4D4M_2jCT8IqplAQ8beLLPZNqfPSjg/viewform" target="_blank">ver</a>)
                                    </Label>
                                    <Input
                                        max="9999" min="-9999"
                                        value={medical.yesavage_test}
                                        name="yesavage_test"
                                        type="number"
                                        onChange={e => {handleInputChange(e)}}
                                    />
                                </Col>
                                <br/>
                            </>}
                            {group === 'repo' && <>
                                <FormGroup className="row">
                                    <Col md="6">
                                        <Label className="form-control-label mb-3">Archivos disponibles</Label>
                                        {files.map((file) => (
                                            <div key={file.foto_id} className="list-group mb-2">
                                                <InputGroup>
                                                    <Button className="mr-2" color="danger" size="sm" outline onClick={() => setModal({title: 'Confirmación', text: 'Desea eliminar ' + file.foto_nombre + '?', type: 2, fx: () => removeFile(file.foto_id, file.foto_nombre)})}><i className="far fa-trash-alt"/></Button>
                                                    <a rel="noopener noreferrer" target="_blank" href={process.env.REACT_APP_API_URL + `${file.url}` + "/" + `${file.foto_nombre}`}>{file.foto_nombre}</a>
                                                </InputGroup>
                                            </div>
                                        ))}
                                    </Col>
                                    <Col md="6">
                                        <Card>
                                            <CardHeader>
                                                <FormGroup className="row">
                                                    <Col className="d-flex">
                                                        <Label className="form-control-label">¿Subir una nuevo archivo?</Label>
                                                        <label className="custom-toggle custom-toggle-info ml-3">
                                                            <Input type="checkbox" checked={hasFile} onChange={() => handleHasFile()}/>
                                                            <span className="custom-toggle-slider rounded-circle" data-label-off="No" data-label-on="Sí"/>
                                                        </label>
                                                    </Col>
                                                </FormGroup>
                                            </CardHeader>
                                            {hasFile &&
                                                <CardBody>
                                                    <FormGroup>
                                                        <InputGroup>
                                                            <InputGroupAddon addonType="prepend">
                                                                <Button 
                                                                    type="button" color="primary"
                                                                    onClick={() => uploadFile()}>
                                                                    Agregar 
                                                                </Button>
                                                            </InputGroupAddon>
                                                            <Input
                                                                autoComplete="off"
                                                                type="text"
                                                                name="treatment_plan"
                                                                value={fileName}
                                                                onChange={e => setFileName(e.target.value)}
                                                            />
                                                            <InputGroupAddon addonType="append">
                                                                <Button 
                                                                    type="button" color="primary" 
                                                                    onClick={() => {document.getElementById('files').click()}}>
                                                                    Buscar
                                                                </Button>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                        <h5 align="right" style={{marginRight: "10px", marginBottom: "0px"}}>{helpText}</h5>
                                                        <input 
                                                            type="file" 
                                                            accept="image/*, .pdf"
                                                            id="files" 
                                                            style={{visibility: 'hidden'}} 
                                                            onChange={e => loadFile(e.target.files)}
                                                        />
                                                    </FormGroup>
                                                </CardBody>
                                            }
                                        </Card>
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

export default MedicalAnamnesis;
