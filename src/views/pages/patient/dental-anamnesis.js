import React, {useState} from 'react'
import {
    Button, Col, Container, Form, FormGroup, Input, Card, CardBody, Label
} from 'reactstrap'


import Axios from '../../../helpers/axiosConfig'
import {Redirect} from 'react-router-dom';

const DentalAnamnesis = ({location}) => {


    const [defreal, setDefreaL] = useState(false)
    const [ausenciaEncia, setAusenciaEncia] = useState(false)
    const [recesionesGingivales, setRecesionesGingivales] = useState(false)
    const [posicionAberrante, setPosicionAberrante] = useState(false)
    const [profundidad, setProfundidad] = useState(false)
    const [other, setOther] = useState(false)

    const [parcialTeeth, setParcialTeeth] = useState(false)
    const [totalTeeth, setTotalTeeth] = useState(false)
    const [parcialRemovableProstheses, setParcialRemovableProstheses] = useState(false)
    const [totalRemovableProstheses, setTotalRemovableProstheses] = useState(false)
    const [fixedProstheses, setFixedProstheses] = useState(false)
    const [fixedProsthesesImplants, setFixedProsthesesImplants] = useState(false)
    const [prosthesesMaterial, setProsthesesMaterial] = useState("")

    const [icdas2Index, setIcdas2Index]=useState(0)
    const [cpodIndex, setCpodIndex]=useState(0)
    const [next, setNext] = useState(false)


    const [boton, setBoton] = useState(0)

    const [nombreImagen, setNombreImagen] = useState("")
    const [file, setFile] = useState()

    const ruta = "static/images_anam_odonto/" + location.state.run
    const [fotos, setFotos] = useState([])
    const addPhoto = async (e) => {
        e.preventDefault()
        const res = await Axios.post("photo/odonto_geriatra",
            {

                anamnId: location.state.anamId,
                nombreImagen: nombreImagen,
                ruta: ruta,
            })
    }
    const obtainPhoto = async (e) => {
        e.preventDefault()
        const res = await Axios.post("photo/odonto_geriatra/obtain",
            {
                anamnId: location.state.anamId,
            })
        if (!res.data.error)
            setFotos(res.data.result)
        console.log(res.data.result)

    }

    const onSubmit = e => {
        e.preventDefault();
        if (boton === 1) {
            addDentalAnamnesis(e);
        }
        if (boton === 2) {
            enviar();
            addPhoto(e);
            obtainPhoto(e);
        }
    }
    const enviar = async () => {
        await archivo()
    }

    const archivo = () => {
        const f = new FormData();

        f.append("file", file[0], nombreImagen)

        Axios.post("file/img_odonto/" + location.state.run, f)
            .then(response => {
                console.log(response)

            }).catch(error => {
            console.log(error)
        })
    }


    const addDentalAnamnesis = async (e) => {
        e.preventDefault()
        const res = await Axios.post("geriatrical-odonto-anamnesis/",
            {
                anamId: location.state.anamId,

                defreal: defreal,
                ausenciaEncia: ausenciaEncia,
                recesionesGingivales: recesionesGingivales,
                posicionAberrante: posicionAberrante,
                profundidad: profundidad,
                other: other,
                parcialTeeth: parcialTeeth,
                totalTeeth: totalTeeth,
                parcialRemovableProstheses: parcialRemovableProstheses,
                totalRemovableProstheses: totalRemovableProstheses,
                fixedProstheses: fixedProstheses,
                fixedProsthesesImplants: fixedProsthesesImplants,
                prosthesesMaterial: prosthesesMaterial,
                icdas2Index:icdas2Index,
                cpodIndex:cpodIndex

            }, {headers: {'x-access-token': localStorage.getItem('user')}}
        )
        if (!res.data.error)
            setNext(true)

    }


    return (
        <Container>
            <Card>
                <CardBody>
                    <h3>{location.state.run}, {location.state.name} {location.state.apellido}</h3>
                    <h1>
                        Anamnesis Odonto-geriátrica
                    </h1>
                    <h5 className="heading-small">Examen protésico</h5>

                    <Form onSubmit={onSubmit} role="form">
                        <FormGroup className="row">
                            <Col md="10">

                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="parcialTeeth"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setParcialTeeth(!parcialTeeth)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="parcialTeeth"
                                    >Dentado parcial</label>
                                </div>

                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="totalTeeth"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setTotalTeeth(!totalTeeth)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="totalTeeth"
                                    >Dentado total</label>
                                </div>

                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="parcialRemovableProstheses"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setParcialRemovableProstheses(!parcialRemovableProstheses)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="parcialRemovableProstheses"
                                    >Prótesis removible parcial
                                    </label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="totalRemovableProstheses"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setTotalRemovableProstheses(!totalRemovableProstheses)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="totalRemovableProstheses"
                                    >Prótesis removible total
                                    </label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="fixedProstheses"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setFixedProstheses(!fixedProstheses)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="fixedProstheses"
                                    >Prótesis fija
                                    </label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="fixedProsthesesImplants"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setFixedProsthesesImplants(!fixedProsthesesImplants)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="fixedProsthesesImplants"
                                    >Prótesis fija sobre implantes
                                    </label>
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Col>
                                <Label
                                    className="form-control-label"
                                >
                                    Tipo de prótesis(Material)
                                </Label>

                                <Input
                                    defaultValue=""
                                    id="example-text-input"
                                    type="textarea"
                                    onChange={(e) => {
                                        setProsthesesMaterial(e.target.value)
                                    }}
                                />
                            </Col>
                        </FormGroup>
                        <h5 className="heading-small">Examen clínico de la encía </h5>
                        <FormGroup className="row">

                            <Col md="6">
                                <Label
                                    className="form-control-label"
                                    htmlFor="exampleFormControlSelect3"
                                    md="6"
                                >
                                    Alteraciones mucogingivales
                                </Label>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="defreal"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setDefreaL(!defreal)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="defreal"
                                    >Deficiencia reborde alveolar (horizontal y/o vertical)</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="ausenciaEncia"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setAusenciaEncia(!ausenciaEncia)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="ausenciaEncia"
                                    >Ausencia de encía adherida/mucosa queratinizada</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="recesionesGingivales"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setRecesionesGingivales(!recesionesGingivales)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="recesionesGingivales"
                                    >Recesiones gingivales</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="posicionAberrante"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setPosicionAberrante(!posicionAberrante)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="posicionAberrante"
                                    >Inserción de frenillo en posición aberrante</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="profundidad"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setProfundidad(!profundidad)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="profundidad"
                                    >Profundidad de fondo de vestíbulo disminuida</label>
                                </div>
                                <div className="custom-control custom-checkbox custom-checkbox-primary">
                                    <Input
                                        className="custom-control-input"
                                        id="other"
                                        type="checkbox"
                                        onChange={(e) => {
                                            setOther(!other)
                                        }}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="other"
                                    >Otra</label>
                                </div>
                            </Col>
                        </FormGroup>
                        <h5>Evaluación cariológica</h5>
                        <FormGroup className="row">
                                    <Col>
                                        <Label className="form-control-label">
                                            ICDAS 2 (
                                                <a href="https://drive.google.com/drive/u/4/folders/1TX99pqC0ptNFf86B8iEPb0gTsC0VDkOX" target="_blank">ver</a>)
                                        </Label>
                                        <Input
                                            max="9999" min="-9999"
                                            
                                            name="icdas2_index"
                                            type="number"
                                            onChange={e => {setIcdas2Index(e.target.value)}}
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
                                            
                                            name="cpod_index"
                                            type="number"
                                            onChange={e => {setCpodIndex(e.target.value)}}
                                        />
                                    </Col>
                                </FormGroup>                
                        <Card>
                            <CardBody>
                                <h3>Ingreso de imágenes</h3>
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
                        </FormGroup>
                    </Form>
                    {next && <Redirect to={{
                        pathname: "/admin/extra-oral",
                        state: {
                            id: location.state.id,
                            run: location.state.run,
                            name: location.state.name,
                            apellido: location.state.apellido,
                            anamId: location.state.anamId
                        }
                    }}/>}
                </CardBody>
            </Card>
        </Container>
    )
}

export default DentalAnamnesis
