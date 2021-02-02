import React, {useState, useEffect, useRef} from 'react';
import {Button, Col, Container, Form, FormGroup, Input, Card, CardBody, ModalHeader, Label, InputGroup, InputGroupAddon} from 'reactstrap';
import axios from '../../../helpers/axiosConfig';
import {getList} from 'helpers/ListHelper'; 
import CardHeader from 'reactstrap/lib/CardHeader';
import SimpleModal from "../components/SimpleModal";

const DentalAnamnesis = ({location}) => {
    //MODAL}}}###############################################################
    const modalRef = useRef()
    const setModal = (options) => {
        modalRef.current.setModal(options);
    };

    //LOCATION###############################################################
    useEffect(() => {
        if (!location?.state?.id) { 
            location.state.id = 0;
        }
        fetchLastDental(location.state.id);
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
        const res = await axios.post("photo/odonto_geriatra/obtain", {anamnId: dental.dental_anamnesis_id})
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
            axios.post("file/img_odonto/" + location.state.run, f)
            .then(response => {
                saveFile();
            }).catch(error => {
                console.log(error);
            });
        };
    };

    const saveFile = async () => {
        const res = await axios.post("photo/odonto_geriatra",
            {anamnId : dental.dental_anamnesis_id,
            nombreImagen: fileName + '.' + fileType,
            ruta: "static/images_anam_odonto/" + location.state.run}
        );
        if (!res.data.error) {
            fetchFiles();
            cleanFile();
            setHelpText(defaultHelpText);
            setHasFile(false);
        }; 
    };    

    const removeFile = async (fId, name) => {
        const res = await axios.post("photo/odonto_geriatra/rm/", {
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
            const res = await axios.post("geriatrical-odonto-anamnesis/crud", dental);
            if (res.data.result[0][0].cod == 0) {
                console.log('Cambios guardados correctamente!');
                setDental({...dental, dental_anamnesis_id: res.data.result[0][0].id});
            } else {
                console.log('Err: ' + res.data.result[0][0].msg);
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
    const [group, setGroup] = useState('background');
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

    //DENTAL#################################################################
    const defaultDental = {dental_anamnesis_id: 0, /*person_id: 0,*/ /**/last_dental_visit: "", alcohol: 0, drugs: 0, tabacco: 0, tabacco_cuantity: 0, other_bad_habit:"", bruxism: 0, /**/painpr: 0, painfr: 0, clickr: 0, crepr: 0, painpl: 0, painfl: 0, clickl: 0, crepl: 0, masetero_d: 0, masetero_i: 0, temporal_d: 0, temporal_i: 0, pterigoideo_internoi: 0, pterigoideo_internod: 0, pterigoideo_externoi: 0, pterigoideo_externod: 0, neck_muscles: "", bloqueo_ar: "", diag: "", obs: "", /**/parcial_teeth: 0, total_teeth: 0, parcial_removable_prostheses: 0, total_removable_prostheses: 0, fixed_prostheses: 0, fixed_prostheses_implants: 0, prostheses_material: '', defreal: 0, ausencia_encia: 0, recesiones_gingivales: 0, posicion_aberrante: 0, profundidad: 0, other_mucogingival_alteration: 0, periodontal_diag: "", odontological_diag: "", treatment_plan: "", icdas2_index: "", cpod_index: ""};
    const [dental, setDental] = useState(defaultDental);
    const [has, setHas] = useState(false);
    
    const handleInputChange = e => {
        setDental({
            ...dental,
            [e.target.name]: e.target.value
        });
    };

    const handleInputCheckedChange = e => {
        setDental({
            ...dental,
            [e.target.name]: e.target.checked
        });
    };

    const fetchLastDental = async (person_id) => {
        const res = await getList("geriatrical-odonto-anamnesis/crud/" + person_id);
        if (res.length === 1) {
            setDental(res[0]);
            setHas(true);
        }; 
        // if (res.length === 1) {
        //     setDental(res[0]);
        //     //setHasDental(true);
        // } else {
        //     setDental({...defaultDental, person_id: person_id});
        // };        
    };  

    //JSX####################################################################
    return (
        <Container>
            <SimpleModal ref={modalRef}/>
            <h4 className="heading-small text-muted mb-2 mt-2">Anamnesis Odonto-geriátrica</h4>
            {!has
                ? <Card><h4>El paciente no tiene registros en Anamnesis Odonto-geriátrica.</h4></Card> 
                : <Card>
                    <CardBody className="pb-0 pt-1">
                        <ModalHeader className="pb-5 pl-0">
                            <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'background' ? {color:"#11cdef"} : {})}} onClick={() => changeGroup('background')}>Antecedentes</a>
                            <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'muscular' ? {color:"#11cdef"} : {})}} onClick={() => changeGroup('muscular')}>Examen Muscular y ATM</a>
                            <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'prostheses' ? {color:"#11cdef"} : {})}} onClick={() => changeGroup('prostheses')}>Examen Protésico</a>
                            <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'test' ? {color:"#11cdef"} : {})}} onClick={() => changeGroup('test')}>Evaluación cariológica</a>
                            <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'periodon' ? {color:"#11cdef"} : {})}} onClick={() => changeGroup('periodon')}>Periodontograma</a>
                            <a style={{paddingRight: "15px", cursor: "pointer", ...(group === 'repo' ? {color:"#11cdef"} : {})}} onClick={() => changeGroup('repo')}>Repositorio</a>
                        </ModalHeader>
                        <Form id="id-form-update" onSubmit={(e) => {saveChangesFromButton(e)}} role="form">
                            {group === 'background' && <>
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">¿Cuando fue la última vez que vine al dentista?</Label>
                                        <Input
                                            autoComplete="off" maxLength="250"
                                            type="textarea"
                                            name="last_dental_visit"
                                            value={dental.last_dental_visit}
                                            onChange={e => handleInputChange(e)}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col className="d-flex">
                                        <Label className="form-control-label">¿Bebe alcohol?</Label>
                                        <label className="custom-toggle custom-toggle-warning ml-3">
                                            <Input
                                                type="checkbox"
                                                name="alcohol"
                                                checked={dental.alcohol}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <span className="custom-toggle-slider rounded-circle" data-label-off="No" data-label-on="Sí"/>
                                        </label>
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col className="d-flex">
                                        <Label className="form-control-label">¿Consume drogas?</Label>
                                        <label className="custom-toggle custom-toggle-warning ml-3">
                                            <Input
                                                type="checkbox"
                                                name="drugs"
                                                checked={dental.drugs}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <span className="custom-toggle-slider rounded-circle" data-label-off="No" data-label-on="Sí"/>
                                        </label>
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col className="d-flex">
                                        <Label className="form-control-label">¿Fuma?</Label>
                                        <label className="custom-toggle custom-toggle-warning ml-3">
                                            <Input
                                                type="checkbox"
                                                name="tabacco"
                                                checked={dental.tabacco}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <span className="custom-toggle-slider rounded-circle" data-label-off="No" data-label-on="Sí"/>
                                        </label>
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">Cantidad de cigarros al dia</Label>
                                        <Input
                                            autoComplete="off" type="number" step="1"
                                            name="tabacco_cuantity"
                                            value={dental.tabacco_cuantity}
                                            onChange={e => handleInputChange(e)}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">Observaciones</Label>
                                        <Input
                                            autoComplete="off" maxLength="250"
                                            type="textarea"
                                            name="other_bad_habit"
                                            value={dental.other_bad_habit}
                                            onChange={e => handleInputChange(e)}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col className="d-flex">
                                        <Label className="form-control-label">¿Bruxismo?</Label>
                                        <label className="custom-toggle custom-toggle-warning ml-3">
                                            <Input
                                                type="checkbox"
                                                name="bruxism"
                                                checked={dental.bruxism}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <span className="custom-toggle-slider rounded-circle" data-label-off="No" data-label-on="Sí"/>
                                        </label>
                                    </Col>
                                </FormGroup>
                            </>}
                            {group === 'muscular' && <>
                                <FormGroup className="row">
                                    <Col md="6">
                                        <Label className="form-control-label">ATM Derecha</Label>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="painpr"   
                                                name="painpr"                                                                        
                                                className="custom-control-input"
                                                checked={dental.painpr}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="painpr">Dolor a la palpación</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="painfr"   
                                                name="painfr"                                                                        
                                                className="custom-control-input"
                                                checked={dental.painfr}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="painfr">Dolor funcional</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="clickr"   
                                                name="clickr"                                                                        
                                                className="custom-control-input"
                                                checked={dental.clickr}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="clickr">Click</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="crepr"   
                                                name="crepr"                                                                        
                                                className="custom-control-input"
                                                checked={dental.crepr}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="crepr">Crepitación</label>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <Label className="form-control-label">ATM Izquierda</Label>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="painpl"   
                                                name="painpl"                                                                        
                                                className="custom-control-input"
                                                checked={dental.painpl}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="painpl">Dolor a la palpación</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="painfl"   
                                                name="painfl"                                                                        
                                                className="custom-control-input"
                                                checked={dental.painfl}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="painfl">Dolor funcional</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="clickl"   
                                                name="clickl"                                                                        
                                                className="custom-control-input"
                                                checked={dental.clickl}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="clickl">Click</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="crepl"   
                                                name="crepl"                                                                        
                                                className="custom-control-input"
                                                checked={dental.crepl}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="crepl">Crepitación</label>
                                        </div>
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col md="6">
                                        <Label className="form-control-label">Dolor</Label>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="masetero_d"   
                                                name="masetero_d"                                                                        
                                                className="custom-control-input"
                                                checked={dental.masetero_d}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="masetero_d">Masétero derecho</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="masetero_i"   
                                                name="masetero_i"                                                                        
                                                className="custom-control-input"
                                                checked={dental.masetero_i}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="masetero_i">Masétero izquierdo</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="temporal_d"   
                                                name="temporal_d"                                                                        
                                                className="custom-control-input"
                                                checked={dental.temporal_d}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="temporal_d">Temporal derecho</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="temporal_i"   
                                                name="temporal_i"                                                                        
                                                className="custom-control-input"
                                                checked={dental.temporal_i}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="temporal_i">Temporal Izquierdo</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="pterigoideo_internoi"   
                                                name="pterigoideo_internoi"                                                                        
                                                className="custom-control-input"
                                                checked={dental.pterigoideo_internoi}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="pterigoideo_internoi">Pterigoideo interno derecho</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="pterigoideo_internod"   
                                                name="pterigoideo_internod"                                                                        
                                                className="custom-control-input"
                                                checked={dental.pterigoideo_internod}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="pterigoideo_internod">Pterigoideo interno izquierdo</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="pterigoideo_externoi"   
                                                name="pterigoideo_externoi"                                                                        
                                                className="custom-control-input"
                                                checked={dental.pterigoideo_externoi}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="pterigoideo_externoi">Pterigoideo externo derecho</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="pterigoideo_externod"   
                                                name="pterigoideo_externod"                                                                        
                                                className="custom-control-input"
                                                checked={dental.pterigoideo_externod}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="pterigoideo_externod">Pterigoideo externo izquierdo</label>
                                        </div>
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">Musculos del cuello</Label>
                                        <Input
                                            autoComplete="off" maxLength="250"
                                            type="textarea"
                                            name="neck_muscles"
                                            value={dental.neck_muscles}
                                            onChange={e => handleInputChange(e)}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">Bloqueo articular</Label>
                                        <Input
                                            autoComplete="off" maxLength="250"
                                            type="textarea"
                                            name="bloqueo_ar"
                                            value={dental.bloqueo_ar}
                                            onChange={e => handleInputChange(e)}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">Diagnostico</Label>
                                        <Input
                                            autoComplete="off" maxLength="250"
                                            type="textarea"
                                            name="diag"
                                            value={dental.diag}
                                            onChange={e => handleInputChange(e)}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">Observaciones</Label>
                                        <Input
                                            autoComplete="off" maxLength="250"
                                            type="textarea"
                                            name="obs"
                                            value={dental.obs}
                                            onChange={e => handleInputChange(e)}
                                        />
                                    </Col>
                                </FormGroup>
                            </>}
                            {group === 'prostheses' && <>
                                <FormGroup className="row">
                                    <Col md="6">
                                        <Label className="form-control-label">Examen protésico</Label>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="parcial_teeth"   
                                                name="parcial_teeth"                                                                        
                                                className="custom-control-input"
                                                checked={dental.parcial_teeth}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="parcial_teeth">¿Dentado parcial?</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="total_teeth"   
                                                name="total_teeth"                                                                        
                                                className="custom-control-input"
                                                checked={dental.total_teeth}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="total_teeth">¿Dentado total?</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="parcial_removable_prostheses"   
                                                name="parcial_removable_prostheses"                                                                        
                                                className="custom-control-input"
                                                checked={dental.parcial_removable_prostheses}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="parcial_removable_prostheses">¿Prótesis removible parcial?</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="total_removable_prostheses"   
                                                name="total_removable_prostheses"                                                                        
                                                className="custom-control-input"
                                                checked={dental.total_removable_prostheses}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="total_removable_prostheses">¿Prótesis removible total?</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="fixed_prostheses"   
                                                name="fixed_prostheses"                                                                        
                                                className="custom-control-input"
                                                checked={dental.fixed_prostheses}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="fixed_prostheses">¿Prótesis fija?</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="fixed_prostheses_implants"   
                                                name="fixed_prostheses_implants"                                                                        
                                                className="custom-control-input"
                                                checked={dental.fixed_prostheses_implants}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="fixed_prostheses_implants">¿Prótesis fija sobre implantes?</label>
                                        </div>
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">Tipo de prótesis (Material)</Label>
                                        <Input
                                            autoComplete="off" maxLength="250"
                                            type="textarea"
                                            name="prostheses_material"
                                            value={dental.prostheses_material}
                                            onChange={e => handleInputChange(e)}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col md="6">
                                        <Label className="form-control-label">Examen clínico de la encía (Alteraciones mucogingivales)</Label>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="defreal"   
                                                name="defreal"                                                                        
                                                className="custom-control-input"
                                                checked={dental.defreal}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="defreal">Deficiencia reborde alveolar (horizontal y/o vertical)</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="ausencia_encia"   
                                                name="ausencia_encia"                                                                        
                                                className="custom-control-input"
                                                checked={dental.ausencia_encia}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="ausencia_encia">Ausencia de encía adherida/mucosa queratinizada</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="recesiones_gingivales"   
                                                name="recesiones_gingivales"                                                                        
                                                className="custom-control-input"
                                                checked={dental.recesiones_gingivales}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="recesiones_gingivales">Recesiones gingivales</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="posicion_aberrante"   
                                                name="posicion_aberrante"                                                                        
                                                className="custom-control-input"
                                                checked={dental.posicion_aberrante}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="posicion_aberrante">Inserción de frenillo en posición aberrante</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="profundidad"   
                                                name="profundidad"                                                                        
                                                className="custom-control-input"
                                                checked={dental.profundidad}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="profundidad">Profundidad de fondo de vestíbulo disminuida</label>
                                        </div>
                                        <div className="custom-control custom-checkbox custom-checkbox-primary">
                                            <Input
                                                type="checkbox"
                                                id="other_mucogingival_alteration"   
                                                name="other_mucogingival_alteration"                                                                        
                                                className="custom-control-input"
                                                checked={dental.other_mucogingival_alteration}
                                                onChange={e => {handleInputCheckedChange(e)}}
                                            />
                                            <label className="custom-control-label" htmlFor="other_mucogingival_alteration">Otra</label>
                                        </div>
                                    </Col>
                                </FormGroup>
                            </>}
                            {group === 'test' && <>
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">
                                            ICDAS 2 (
                                                <a href="https://drive.google.com/drive/u/4/folders/1TX99pqC0ptNFf86B8iEPb0gTsC0VDkOX" target="_blank">ver</a>)
                                        </Label>
                                        <Input
                                            max="9999" min="-9999"
                                            value={dental.icdas2_index}
                                            name="icdas2_index"
                                            type="number"
                                            onChange={e => {handleInputChange(e)}}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">
                                            CPOD (
                                                <a href="https://drive.google.com/drive/u/4/folders/1TX99pqC0ptNFf86B8iEPb0gTsC0VDkOX" target="_blank">ver</a>)
                                        </Label>
                                        <Input
                                            max="9999" min="-9999"
                                            value={dental.cpod_index}
                                            name="cpod_index"
                                            type="number"
                                            onChange={e => {handleInputChange(e)}}
                                        />
                                    </Col>
                                </FormGroup>
                            </>}
                            {group === 'periodon' && <>
                                <FormGroup className="row">
                                    <Col md="6">
                                        <Label className="form-control-label mb-3">Periodontograma (<a href="https://sepa.es/periodontograma/index.html" target="_blank">Link a SEPA</a>)</Label>
                                    </Col>
                                </FormGroup> 
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">Diagnostico periodontal</Label>
                                        <Input
                                            autoComplete="off" maxLength="250"
                                            type="textarea"
                                            name="periodontal_diag"
                                            value={dental.periodontal_diag}
                                            onChange={e => handleInputChange(e)}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">Diagnostico Odontologico</Label>
                                        <Input
                                            autoComplete="off" maxLength="250"
                                            type="textarea"
                                            name="odontological_diag"
                                            value={dental.odontological_diag}
                                            onChange={e => handleInputChange(e)}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">Plan de tratamiento</Label>
                                        <Input
                                            autoComplete="off" maxLength="250"
                                            type="textarea"
                                            name="treatment_plan"
                                            value={dental.treatment_plan}
                                            onChange={e => handleInputChange(e)}
                                        />
                                    </Col>
                                </FormGroup>
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
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            }
        </Container>
    );
};

export default DentalAnamnesis;
