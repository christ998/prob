import React, {useState, useEffect,useRef} from 'react'
import {
    Button, Col, Container, Form, FormGroup, Input, Row, InputGroup,
    InputGroupText, InputGroupAddon, Card, CardBody, Label
} from 'reactstrap'
import classnames from "classnames";
import CardHeader from 'reactstrap/lib/CardHeader';
import Axios from '../../../helpers/axiosConfig'
import {Redirect} from 'react-router-dom';
import SimpleModal from "../components/SimpleModal";

const Periodontogram = ({location}) => {
    
    const modalRef = useRef()
    const setModal = (options) => {
        modalRef.current.setModal(options);
    };
    
    const [next, setNext] = useState(false)
    const [periodontalDiagnosis, setPeriodontalDiagnosis] = useState("")
    const [odontologicalDiagnosis, setOdontologicalDiagnosis] = useState("")
    const [treatmentPlan, setTreatmentPlan] = useState("")

    //LOCATION###############################################################
    useEffect(() => {
        fetchFiles();
    }, []);
   
    //FILE###################################################################
    const [fileName, setFileName] = useState("");
    const [fileType, setFileType] = useState("");
    const [file, setFile] = useState({});
    const [hasFile, setHasFile] = useState(false);
    const [files, setFiles] =useState([]);
    const extAllowed = "pdf";
    const sizAllowed = 10000000;
    const defaultHelpText = extAllowed + " (max: " + sizAllowed / 1000000 + " MB)";
    const [helpText, setHelpText] =useState(defaultHelpText);

    const handleHasFile = () => {
        setHasFile(!hasFile);
        cleanFile();
        setHelpText(defaultHelpText);
    };

    const fetchFiles= async () => {
        const res = await Axios.post("photo/odonto_geriatra/obtain", {anamnId: location.state.anamId})
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
            Axios.post("file/img_odonto/" + location.state.run, f)
            .then(response => {
                saveFile();
            }).catch(error => {
                console.log(error);
            });
        };
    };

    const saveFile = async () => {
        const res = await Axios.post("photo/odonto_geriatra",
            {anamnId : location.state.anamId,
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
        const res = await Axios.post("photo/odonto_geriatra/rm/", {
            fId : fId,
            route : location.state.run + '/' + name
        });
        if (!res.data.error) {
            fetchFiles();
        }; 
    };

    const addDiagnosticos = async e => {
        e.preventDefault()
        const res = await Axios.post("geriatrical-odonto-anamnesis/periodontograma",
            {
                anamId: location.state.anamId,
                periodontalDiagnosis:periodontalDiagnosis,
                odontologicalDiagnosis:odontologicalDiagnosis,
                treatmentPlan:treatmentPlan
            }
        );

        if (!res.data.error){
            setNext(true);
        };  
    };
   
    return (
        <Container>
            <SimpleModal ref={modalRef}/>
            <Card>
                <CardBody>
                <h3>{location.state.run}, {location.state.name} {location.state.apellido}</h3>
                    <h1>
                        Anamnesis Odonto-geriátrica 
                    </h1>
                    <h6 className="heading-small text-muted mb-4">
                        Periodontograma
                    </h6>
                    <Form  onSubmit={addDiagnosticos} role="form">
                    <FormGroup className="row">
                        <Col>
                            <Label className="form-control-label mb-3">Periodontograma (<a href="https://sepa.es/periodontograma/index.html" target="_blank">Link a SEPA</a>)</Label>
                        </Col>
                    </FormGroup>
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
                                            <Label className="form-control-label">¿Subir periodontograma?</Label>
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
                    <FormGroup className="row">
                            <Col>
                                <Label
                                    className="form-control-label"
                                >
                                    Diagnostico periodontal
                                </Label>

                                <Input
                                    defaultValue=""
                                    id="example-text-input"
                                    type="textarea"
                                    onChange={(e) => {
                                        setPeriodontalDiagnosis(e.target.value)
                                    }}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                                <Label
                                    className="form-control-label"
                                >
                                    Diagnostico Odontologico
                                </Label>

                                <Input
                                    defaultValue=""
                                    id="example-text-input"
                                    type="textarea"
                                    onChange={(e) => {
                                        setOdontologicalDiagnosis(e.target.value)
                                    }}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                                <Label
                                    className="form-control-label"
                                >
                                    Plan de tratamiento
                                </Label>

                                <Input
                                    defaultValue=""
                                    id="example-text-input"
                                    type="textarea"
                                    onChange={(e) => {
                                        setTreatmentPlan(e.target.value)
                                    }}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col md="10">
                               
                            </Col>
                            <Col md="2">
                           
                              <Button type="submit" color="primary">Guardar</Button>
                             
                            </Col>
                        </FormGroup>
                    </Form> 





                    { next && <Redirect to={{
                    pathname: "/admin/list-patient-anamnesis",
                    state: { id: location.state.id, run: location.state.run, name: location.state.name, apellido : location.state.apellido, anamId:location.state.anamId, dentalAnamnesis:true} 
                    }} /> } 
                </CardBody>
            </Card>
        </Container>
    )
}

export default Periodontogram
