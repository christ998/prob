import React, {useState} from 'react'
import {
    Button, Col, Container, Form, FormGroup, Input, Card, CardHeader, CardBody, Label, Alert
} from 'reactstrap'
import Axios from '../../../helpers/axiosConfig'
import {Redirect} from 'react-router-dom';
import useList from 'hooks/useList';

const CovidRisk = ({location}) => {

    const casos = useList("list/covid-risk")
    const [next, setNext] = useState(false)
    const [datos, setDatos] = useState({
        folstein_value: null,
        pfeiffer_value: null,
        yesavage_value: null,
    });

    const [boton, setBoton] = useState(0)

    const [nombreImagen, setNombreImagen] = useState("")
    const [file, setFile] = useState()
    const [fotos, setFotos] = useState([])


    const ruta = "static/images_anam_medico/" + location.state.run

    const addPhoto = async (e) => {
        e.preventDefault()
        const res = await Axios.post("photo/medico_geriatra",
            {

                anamnId: location.state.anamId,
                nombreImagen: nombreImagen,
                ruta: ruta,
            })


    }

    const archivo = (e) => {
        const f = new FormData();

        f.append("file", file[0], nombreImagen)
        e.preventDefault()
        Axios.post("file/img_medico/" + location.state.run, f)
            .then(response => {
                console.log(response)

            }).catch(error => {
            console.log(error)
        })
    }


    const onSubmit = e => {
        e.preventDefault();
        if (boton === 1) {
            addEvaluations(e);
        }
        if (boton === 2) {
            enviar(e);
            addPhoto(e);
            obtainPhoto(e);
        }
    }
    const enviar = async (e) => {

        await archivo(e)
    }

    const handleInputChange = (e) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        })
        console.log(datos)
    }

    const addEvaluations = async (e) => {
        e.preventDefault()
        const res = await Axios.post("geriatrical-medical-anamnesis/evaluations",
            {
                anamnId: location.state.anamId,
                folstein_value: datos.folstein_value,
                pfeiffer_value: datos.pfeiffer_value,
                yesavage_value: datos.yesavage_value,
            })
        if (!res.data.error)
            setNext(true)
    }


    const obtainPhoto = async (e) => {
        e.preventDefault()
        const res = await Axios.post("photo/medico_geriatra/obtain",
            {
                anamnId: location.state.anamId,
            })
        if (!res.data.error)
            setFotos(res.data.result)
        console.log(res.data.result)

    }

    const url = (array) => {


    }

    const reqTag = <span style={{color: "#DC3545"}}>*</span>

    return (
        <Container>
            <Card>
                <CardBody>
                    <h3>{location.state.run}, {location.state.name} {location.state.apellido}</h3>
                    <h1>
                        Anamnesis Médico - Geriatra
                    </h1>
                    
                    <h5 className="heading-small">Evaluaciones Cognitivas</h5>

                    <Form onSubmit={onSubmit} role="form">
                        <FormGroup className="row">
                            <Col md="4">
                                <Label
                                    className="form-control-label"
                                    htmlFor="exampleFormControlSelect3"
                                >
                                    Cuestionario Minimental de Folstein (
                                    <a href="https://docs.google.com/forms/d/e/1FAIpQLScRtpK-rWTYO1W2BrPXahVfY_YZ5aQ8Hf3NlrKnWvt4UAV8JQ/viewform"
                                       target="_blank">
                                        ver</a>) 
                                </Label>
                                <Input
                                    placeholder=""
                                    id="example-text-input"
                                    name="folstein_value"
                                    type="number"
                                    onChange={(e) => {
                                        handleInputChange(e)
                                    }}
                                    
                                />
                            </Col>
                            <Col md="4">
                                <Label
                                    className="form-control-label"
                                    htmlFor="exampleFormControlSelect3"
                                >
                                    Test de Pfeiffer (
                                    <a href="https://docs.google.com/forms/d/e/1FAIpQLScOfJZpOKaTXd2OQ6RkgpvhByXY51RzeNtlH24rkiQJ1DCZiw/viewform"
                                       target="_blank">
                                        ver</a>) 
                                </Label>
                                <Input
                                    placeholder=""
                                    id="example-text-input"
                                    name="pfeiffer_value"
                                    type="number"
                                    onChange={(e) => {
                                        handleInputChange(e)
                                    }}
                                    
                                />
                            </Col>
                            
                        </FormGroup>
                        <h5 className="heading-small">Evaluación Anímica</h5>

                        <FormGroup className="row">
                        <Col md="4">
                                <Label
                                    className="form-control-label"
                                    htmlFor="exampleFormControlSelect3"
                                >
                                    Cuestionario de Yesavage (
                                    <a href="https://docs.google.com/forms/d/e/1FAIpQLScmoS5sWNzDJG9k7ssG4D4M_2jCT8IqplAQ8beLLPZNqfPSjg/viewform"
                                       target="_blank">
                                        ver</a>) 
                                </Label>
                                <Input
                                    placeholder=""
                                    id="example-text-input"
                                    name="yesavage_value"
                                    type="number"
                                    onChange={(e) => {
                                        handleInputChange(e)
                                    }}
                                    
                                />
                            </Col> 
                        </FormGroup>
                        <Card>
                            <CardHeader>
                                <h3>Ingreso de imagenes</h3>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={enviar} role="form">
                                    <FormGroup className="row">
                                        <Col md="4">
                                            <Label
                                                className="form-control-label"
                                            >
                                                Nombre Imagen
                                            </Label>
                                            <Input
                                                defaultValue=""
                                                id="example-text-input"
                                                type="text"
                                                onChange={(e) => {
                                                    setNombreImagen(e.target.value + ".jpg")
                                                }}
                                            />
                                        </Col>
                                        <Col md="4">
                                            <input type="file" accept="image/*"
                                                   onChange={(e) => setFile(e.target.files)}
                                                   required/>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup>

                                        {fotos.map((foto, i) => (
                                            <tr><a rel="noopener noreferrer" target="_blank"
                                                   href={`${process.env.REACT_APP_API_URL}` + `${foto.url}` + "/" + `${foto.foto_nombre}`}> {foto.foto_nombre}</a>
                                            </tr>
                                        ))}

                                    </FormGroup>
                                    <FormGroup className="row">
                                        <Col md="10">
                                            <Button type="submit" onClick={() => (setBoton(2))}
                                                    color="primary">Guardar</Button>
                                        </Col>
                                    </FormGroup>
                                </Form>

                            </CardBody>
                        </Card>
                        <FormGroup className="row">
                            <Col md="10">
                               
                            </Col>
                            <Col md="2">
                                <Button type="submit" onClick={() => (setBoton(1))} color="primary">Guardar</Button>
                            </Col>
                            {next && <Redirect to={{
                                pathname: "/admin/list-patient-anamnesis",
                                state: {id: location.state.id, run: location.state.run, name: location.state.name, medicalAnamnesis:true}
                            }}/>}
                        </FormGroup>
                    </Form>
                </CardBody>
            </Card>
        </Container>
    )
}

export default CovidRisk
