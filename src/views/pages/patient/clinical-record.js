import Axios from '../../../helpers/axiosConfig';
import AuthHelper from 'helpers/AuthHelper';
import {getList} from 'helpers/ListHelper';
import useList from 'hooks/useList';
import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {
    Button, Col, Container, Form, FormGroup, Input, Row, InputGroup,
    InputGroupText, InputGroupAddon, Card, CardBody, Table,
    UncontrolledTooltip, UncontrolledPopover, PopoverBody,
    CardHeader
} from 'reactstrap'
import Label from 'reactstrap/lib/Label';

const FileView = props => {
    const [fileInfo, setFileInfo] = useState();

    useEffect(() => {
        fileById()
    }, [])

    const openFile = url => {
        var win = window.open(process.env.REACT_APP_API_URL + "static/" + url, '_blank');
        win.focus();
    }

    const fileById = async () => {
        const res = await Axios.get("review/file/" + props.id);
        if (res.data.result?.length) {
            setFileInfo(res.data.result[0])
        }
    }
    return <div>{fileInfo && <Button outline color="info" onClick={() => {
        openFile(fileInfo.url)
    }}>{fileInfo.name}</Button>}</div>
}

const Reviews = props => {
    const [revText, setRevText] = useState("");
    const [file, setFile] = useState(null);
    const reviewTypes = useList('review/types');
    const [reviews, setReviews] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("-1");
    const [rtId, setRtId] = useState(-1);
    const [fileWillPost, setFileWillPost] = useState(false);

    useEffect(() => {
        fetchReviews()
    }, [])

    const rut = props.rut

    const fetchReviews = async () => {
        const res = await getList("review/get/" + props.id);
        setReviews(res);
    };

    const handleFileChange = e => {
        setFile(e.target.files[0])
    }

    const resetFile = () => {
        setFile(null);
    }

    const postReview = (e) => {
        e.preventDefault();
        if (fileWillPost && file) {
            withFile()
        } else {
            noFile()
        }
    }

    const noFile = async () => {
        const res = await Axios.post("review", {
            personId: props.id,/* Id del paciente en atención */
            userId: AuthHelper.getUserId(),/* Id del usuario en sesión */
            reviewTypeId: rtId,
            description: revText
        });
        if (!res.data.error) {
            fetchReviews();
            setRevText("");
        }
    }

    const withFile = async () => {
        const res = await Axios.post("review/file/", {
            personId: props.id,/* Id del paciente en atención */
            userId: AuthHelper.getUserId(),/* Id del usuario en sesión */
            reviewTypeId: rtId,
            description: revText,
            url: rut + "/" + file.name,
            fileName: file.name
        });
        if (!res.data.error) {
            const f = new FormData();
            f.append("file", file, file.name)
            await Axios.post("file/review/" + rut, f)
                .then(response => {
                    console.log(response)
                    resetFile();
                    setFileWillPost(false);
                }).catch(error => {
                console.log(error)
            })
            fetchReviews();
            setRevText("");
        }
    }

    const reviewType = rTypeId => {
        let rt = reviewTypes.filter(rt => rt.id === rTypeId);
        return rt[0]?.name
    }

    const filterRevs = () => {
        return selectedFilter === "-1" ? reviews : reviews.filter(rev => String(rev.review_type_id) === selectedFilter)
    }

    return ((!reviewTypes) ? <div></div> :
        <div>
            <strong>Filtros:{"  "}</strong>
            <FormGroup check inline>
                <Label check>
                    <input type="radio" value="-1" checked={selectedFilter === "-1"}
                                onChange={e => setSelectedFilter(e.target.value)}/> Todos
                </Label>
            </FormGroup>
            {reviewTypes.map(rt => (
            <FormGroup check inline key={rt.id}>
                <Label check>
                    <input type="radio" value={rt.id} checked={selectedFilter == rt.id}
                            onChange={e => setSelectedFilter(e.target.value)}/> {rt.name}
                </Label>
            </FormGroup>
            ))}
            <hr/>
            <div
                className="timeline timeline-one-side"
                data-timeline-axis-style="none"
                data-timeline-content="axis"
                style={{overflow: 'scroll', height: '450px'}}
            >
                {filterRevs().map(rev =>
                    <div key={rev.review_id} className="timeline-block">
            <span className="timeline-step">
                <small className="text-muted font-weight-bold" id="rev_date">
                    {rev.c_time}<br/>{rev.c_date}
                </small>
                <UncontrolledTooltip target="rev_date">
                    {rev.c_date}/{rev.c_year}
                </UncontrolledTooltip>
            </span>
                        <div className="timeline-content">
                            <h5 className="mt-2 mb-0">{rev.names} en {reviewType(rev.review_type_id)}</h5>
                            <p className="text-sm mt-1 mb-0">
                                {rev.description}
                            </p>
                            {Boolean(rev.has_file) && <FileView id={rev.review_id}/>}
                        </div>
                    </div>)}
            </div>
            <Form onSubmit={postReview}>
                {rtId == 4 && <div><br/>
                    Revise la plantilla principal de recetas <a target="_blank" without rel="noopener noreferrer" href="https://drive.google.com/drive/u/4/folders/1QyKDDUkRrbq4DIaseKIuaoba9XraAA96">aquí</a>
                </div>}
                <br/>
                <FormGroup className="row">
                    <Label className="form-control-label pt-3" md="2"><b>Tipo de comentario</b></Label>
                    <Col md="10">
                        <Input type="select" onChange={e => {
                            setRtId(e.target.value)
                        }} required>
                            <option hidden value={-1}>(Seleccione)</option>
                            {reviewTypes.map(rt =>
                                <option key={rt.id} value={rt.id}>{rt.name}</option>
                            )}
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup className="row">
                    <Label md="3">Adjuntar archivo?{" "}
                    <label className="custom-toggle custom-toggle-info mr-1">
                        <Input type="checkbox" checked={fileWillPost} onChange={() => {
                            setFileWillPost(!fileWillPost)
                        }}/>
                        <span
                            className="custom-toggle-slider rounded-circle" data-label-off="No" data-label-on="Sí"
                        />
                    </label></Label>
                    <Col md="9">
                    {fileWillPost &&
                    <InputGroup>
                        <Input
                            autoComplete="off"
                            type="text"
                            name="treatment_plan"
                            readOnly
                            placeholder="Elija archivo"
                            value={file ? file.name : ""}
                        />
                        <InputGroupAddon addonType="append">
                            {file ?  <Button 
                                type="button" color="danger" 
                                onClick={resetFile}>
                                Deshacer
                            </Button>:
                            <Button 
                                type="button" color="info" 
                                onClick={() => {document.getElementById('rFile').click()}}>
                                Elegir archivo
                            </Button>}
                        </InputGroupAddon>
                    </InputGroup>}
                    <input 
                        type="file" 
                        id="rFile" 
                        style={{visibility: 'hidden'}} 
                        onChange={handleFileChange}
                        required={fileWillPost}
                    />
                    </Col>
                </FormGroup>
                <InputGroup>
                    <Input type="textarea" value={revText} onChange={e => {
                        setRevText(e.target.value)
                    }} placeholder="Escriba aquí su comentario" required={!fileWillPost}/>
                    <Button color="primary" disabled={rtId == -1} type="submit">Subir</Button>
                </InputGroup>
            </Form>
        </div>
    )
}

const ClinicalRecord = ({location}) => {

    // location.state = {
    //     id: 1,
    //     name: "Manuel Garros",
    //     apellido: "Rojas Suazo",
    //     run: "19999999-2"
    // }

    const blankMotive = {
        "id_pre_medical_consultation": null,
        "person_id": null,
        "urgency": 0,
        "pain": 0,
        "cavities": 0,
        "wounds": 0,
        "bleeding": 0,
        "fracture": 0,
        "trauma": 0,
        "swelling": 0,
        "treatment": 0,
        "other": ""
    }

    const [consultationMotive, setConsultationMotive] = useState(blankMotive);
    const [diagsTreats, setDiagsTreats] = useState([]);
    const [medicalData, setMedicalData] = useState();
    const diseases = useList("general-anamnesis/disease/" + location?.state?.id)
    const [anamnId, setAnamnId] = useState(-1);


    const getConsultationMotive = async () => {
        const res = await Axios.get(process.env.REACT_APP_API_URL + "person/pre-medical-consultation/" + location?.state?.id);
        let motive = res.data.result?.length ? res.data.result[0] : blankMotive
        setConsultationMotive(motive);
    }

    const getDiagnosisAndTreatment = async () => {
        const res = await Axios.get(process.env.REACT_APP_API_URL + "geriatrical-odonto-anamnesis/diag-treat/" + location?.state?.id);
        if (res.data.result?.length) {
            setDiagsTreats(res.data.result)
        }
    }

    const getMedicalData = async () => {
        const res = await Axios.get(process.env.REACT_APP_API_URL + "general-anamnesis/data/" + location?.state?.id);
        if (res.data.result?.length) {
            setMedicalData(res.data.result[0])
        }
    }

    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    const motiveList = () => {
        let motives = []
        if (consultationMotive.pain) motives.push("dolor severo")
        if (consultationMotive.cavities) motives.push(" caries o manchas")
        if (consultationMotive.wounds) motives.push(" lesiones dentales")
        if (consultationMotive.bleeding) motives.push(" sangrado bucal")
        if (consultationMotive.fracture) motives.push(" fractura de prótesis")
        if (consultationMotive.trauma) motives.push(" trauma")
        if (consultationMotive.swelling) motives.push(" hinchazón oral")
        if (consultationMotive.treatment) motives.push(" requiere tratamiento")
        return motives ? capitalize(String(motives).trim()) : "N/A"
    }

    const fetchLastDental = async () => {
        const res = await getList("geriatrical-odonto-anamnesis/crud/" + location?.state?.id);
        setAnamnId((res.length) ? res[0].dental_anamnesis_id : -1)      
    };  

    useEffect(() => {
        getConsultationMotive();
        fetchLastDental();
        motiveList();
        getMedicalData();
        getDiagnosisAndTreatment();
    }, [])

    // const reviewByType = type => {
    //     let rt = reviewTypes.filter(rt => rt.name === type);
    //     return rt[0] ? {revs: reviews.filter(r => r.review_type_id === rt[0].id), rtId: rt[0].id} : {revs: [], rtId: -1}
    // }



    return (
        <Container>
            <h2>
                Ficha clínica del paciente
            </h2>
            <Row>
                <Col md="4">
                    <Card>
                        <CardHeader>
                            <h5 className="h3 mb-0">Info. del paciente</h5>
                        </CardHeader>
                        <CardBody>
                            <Table borderless>
                                <tbody>
                                <tr>
                                    <th scope="row">Nombre</th>
                                    <td>{location?.state?.name}</td>
                                </tr>
                                </tbody>
                                <tbody>
                                <tr>
                                    <th scope="row">Apellido(s)</th>
                                    <td>{location?.state?.apellido}</td>
                                </tr>
                                </tbody>
                                <tbody>
                                <tr>
                                    <th scope="row">RUN</th>
                                    <td>{location?.state?.run}</td>
                                </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="8">
                    <Card>
                        <CardHeader>
                            <h5 className="h3 mb-0">Alertas médicas</h5>
                        </CardHeader>
                        <CardBody>
                            Urgencia dental: {consultationMotive.urgency ? 'Sí' : 'No'}<br/>
                            Motivo Consulta: {motiveList()}<br/>
                            Otros: {consultationMotive.other}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md="4">
                    <Card>
                        <CardHeader>
                            <h5 className="h3 mb-0">Exámenes orales 3D</h5>
                        </CardHeader>
                        <CardBody>
                            <Button id="models" color="primary" disabled={anamnId===-1}>
                                {anamnId!==-1 ? <Link style={{color: "white"}} to={{
                                    state: {
                                        id: location?.state?.id,
                                        run: location?.state?.run,
                                        name: location?.state?.name,
                                        apellido: location?.state?.apellido,
                                        anamId: anamnId
                                    },
                                    pathname: "/admin/extra-oral"
                                    }}>
                                    <i className="ni ni-app"></i> Ir a los modelos
                                </Link>: <span><i className="ni ni-app"></i> Ir a los modelos</span>}
                            </Button>
                            {anamnId===-1 && <UncontrolledTooltip target="models">
                                Se requiere haber registrado la Anamnésis Odonto - Geriatra
                            </UncontrolledTooltip>}
                            <div><br/></div>
                            
                        </CardBody>
                    </Card>
                </Col>
                <Col md="8">
                    <Card>
                        <CardHeader>
                            <h5 className="h3 mb-0">Links rápidos</h5>
                        </CardHeader>
                        <CardBody>
                            <Link to={{
                                state: {
                                    id: location?.state?.id,
                                    run: location?.state?.run,
                                    name: location?.state?.name,
                                    pellido: location?.state?.apellido
                                },
                                pathname: "/admin/general-anamnesis-u"
                            }}>
                                <i className="ni ni-bold-right"></i>Anamnesis General
                            </Link><br/>
                            <Link to={{
                                state: {
                                    id: location?.state?.id,
                                    run: location?.state?.run,
                                    name: location?.state?.name,
                                    apellido: location?.state?.apellido
                                },
                                pathname: "/admin/medical-anamnesis-u"
                            }}>
                                <i className="ni ni-bold-right"></i>Anamnesis Médico Geriatra
                            </Link><br/>
                            <Link to={{
                                state: {
                                    id: location?.state?.id,
                                    run: location?.state?.run,
                                    name: location?.state?.name,
                                    apellido: location?.state?.apellido
                                },
                                pathname: "/admin/dental-anamnesis-u"
                            }}>
                                <i className="ni ni-bold-right"></i>Anamnesis Odonto Geriatra
                            </Link><br/>
                            <Link to={{
                                state: {
                                    id: location?.state?.id,
                                    run: location?.state?.run,
                                    name: location?.state?.name,
                                    apellido: location?.state?.apellido
                                },
                                pathname: "/admin/referral"
                            }}>
                                <i className="ni ni-bold-right"></i>Interconsultas
                            </Link>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md="4"><Card>
                    <CardHeader>
                        <h5 className="h3 mb-0">Enfermedades</h5>
                    </CardHeader>
                    <CardBody>
                        <ul>
                        {diseases.map((d, i) => 
                            <li key={i}>{d.name}</li>
                        )}
                        </ul>
                    </CardBody>
                </Card></Col>
                <Col md="4"><Card>
                    <CardHeader>
                        <h5 className="h3 mb-0">Alergias</h5>
                    </CardHeader>
                    <CardBody>
                        {medicalData?.allergies}<hr/>
                        Alergias a fármacos: {medicalData?.medicine_allergies}
                    </CardBody>
                </Card></Col>
                <Col md="4"><Card>
                    <CardHeader>
                        <h5 className="h3 mb-0">Fármacos y Posología</h5>
                    </CardHeader>
                    <CardBody>
                        {medicalData?.medicine_dose}
                    </CardBody>
                </Card></Col>
            </Row>
            <Row>
                <Col><Card>
                    <CardHeader>
                        <h5 className="h3 mb-0">Diagnóstico odontológico</h5>
                    </CardHeader>
                    <CardBody>
                        <ul>
                        {diagsTreats.map((dT, i) => 
                            Boolean(dT.odontological_diag.trim()) && <li key={i}>{dT.odontological_diag}</li>
                        )}
                        </ul>
                    </CardBody>
                </Card></Col>
            </Row>
            <Row>
                <Col><Card>
                    <CardHeader>
                        <h5 className="h3 mb-0">Plan de tratamiendo</h5>
                    </CardHeader>
                    <CardBody>
                        <ul>
                        {diagsTreats.map((dT, i) => 
                            Boolean(dT.treatment_plan.trim()) && <li key={i}>{dT.treatment_plan}</li>
                        )}
                        </ul>
                    </CardBody>
                </Card></Col>
            </Row>
            <Row>
                <Col><Card>
                    <CardHeader>
                        <h5 className="h3 mb-0">Comentarios</h5>
                    </CardHeader>
                    <CardBody>
                        <Reviews id={location?.state?.id} rut={location?.state?.run}/>
                    </CardBody>
                </Card></Col>
            </Row>
        </Container>
    );
}

export default ClinicalRecord
