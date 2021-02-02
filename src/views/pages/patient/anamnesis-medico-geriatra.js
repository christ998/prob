import React, { useState } from 'react'
import {
  Button, Col, Container, Form, FormGroup, Input, Row, InputGroup,
  InputGroupText, InputGroupAddon, Card, CardBody, Label, Progress
} from 'reactstrap'
import Axios from '../../../helpers/axiosConfig'
import {Redirect} from 'react-router-dom';

const AnamnesisMedicoGeriatra = ({location}) => {
  const [anamId, setAnamId] =useState(0)
  const [datos, setDatos] = useState({
    velocidadMarcha: null,
    peso: null,
    altura: null,
    imc: null,
    temperatura: null,
    sistolic: null,
    diastolic: null,
    frecCardiaca: null,
    saturacionO2: null,
    fuerzaMuscular: '1',
    glicemia: null,
    extraInfo:null,
    folsteinTest: null,
    pfeifferTest: null,
    yesavageTest: null
  });
  const handleInputChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    })
  }
  const [next, setNext] = useState(false)
  

  const calcIMC = () => {
    let w = Number(datos.peso);
    let hSq = Number(datos.altura) ** 2;
    return w / hSq;
  }

 
  const addAMG = async e => {
    
    e.preventDefault();
    
    const res = await Axios.post( "geriatrical-medical-anamnesis", {
      personId: location.state.id,
      walkingSpeed: Number(datos.velocidadMarcha),
      weight: Number(datos.peso),
      height: Number(datos.altura),
      bmi: calcIMC(),
      bloodPressure: datos.sistolic + "/" + datos.diastolic,
      temperature: Number(datos.temperatura),
      heartRate: Number(datos.frecCardiaca),
      oxygenSaturation: Number(datos.saturacionO2),
      muscularStrength: datos.fuerzaMuscular,
      glycemia: Number(datos.glicemia),
      extraInfo: datos.extraInfo
    });
    if (res.data.result) {
      
      setAnamId(res.data.result.insertId)
      setNext(true)
    };

    // console.log({
    //     person_id: location.state.id,
    //     velocidadMarcha: Number(datos.velocidadMarcha),
    //     peso: Number(datos.peso),
    //     altura: Number(datos.altura),
    //     imc: calcIMC(),
    //     temperatura: Number(datos.temperatura),
    //     presionArterial: datos.sistolic + "/" + datos.diastolic,
    //     frecCardiaca: Number(datos.frecCardiaca),
    //     saturacionO2: Number(datos.saturacionO2),
    //     fuerzaMuscular: datos.fuerzaMuscular,
    //     glicemia: Number(datos.glicemia),
    //     folsteinTest: Number(datos.folsteinTest),
    //     pfeifferTest: Number(datos.pfeifferTest),
    //     yesavageTest: Number(datos.yesavageTest)
    //   })
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
          <h5 className="heading-small" >Parametros Fisicos</h5>
          <Form role="form" onSubmit={addAMG}>
            <FormGroup className="row">
              <Col md="4">
              <Label
                className="form-control-label"
                htmlFor="example-text-input"
              >
                Velocidad de marcha 
              </Label>
                <InputGroup>
                  <Input
                    type="number"
                    min={0}
                    max={3}
                    step="0.1"
                    name="velocidadMarcha"
                    onChange={(e) => { handleInputChange(e) }}
                    //required
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>m/s</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
              <Col md="4">
              <Label
                className="form-control-label"
                htmlFor="example-text-input"
              >
                Peso 
              </Label>
                <InputGroup>
                  <Input
                    type="number"
                    min={0}
                    max={200}
                    step="1"
                    name="peso"
                    onChange={(e) => { handleInputChange(e) }}
                    //required
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>kg</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
              <Col md="4">
              <Label
                className="form-control-label"
                htmlFor="example-text-input"
              >
                Altura 
              </Label>
                <InputGroup>
                  <Input
                    type="number"
                    min={0.5}
                    max={3}
                    step="0.01"
                    name="altura"
                    onChange={(e) => { handleInputChange(e) }}
                    //required
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>m</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
            </FormGroup>
            <FormGroup className="row">
              <Col md="4">
              <Label
                className="form-control-label"
                htmlFor="example-text-input"
              >
                Presión Arterial (Sistólica / Diastólica) 
              </Label>
                <InputGroup>
                  <Input
                    type="number"
                    min={80}
                    max={250}
                    step="1"
                    name="sistolic"
                    onChange={(e) => { handleInputChange(e) }}
                    //required
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>/</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="number"
                    min={50}
                    max={200}
                    step="1"
                    name="diastolic"
                    onChange={(e) => { handleInputChange(e) }}
                    //required
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>mmHg</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
              <Col md="4">
              <Label
                className="form-control-label"
                htmlFor="example-text-input"
              >
                Temperatura 
              </Label>
                <InputGroup>
                  <Input
                    type="number"
                    min={15}
                    max={50}
                    step="1"
                    name="temperatura"
                    onChange={(e) => { handleInputChange(e) }}
                    //required
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>ºC</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
              <Col md="4">
              <Label
                className="form-control-label"
                htmlFor="example-text-input"
              >
                Frecuencia Cardíaca 
              </Label>
                <InputGroup>
                  <Input
                    type="number"
                    min={40}
                    max={220}
                    step="1"
                    name="frecCardiaca"
                    onChange={(e) => { handleInputChange(e) }}
                    //required
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>lat/m</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
            </FormGroup>
            <FormGroup className="row">
              <Col md="4">
              <Label
                className="form-control-label"
                htmlFor="example-text-input"
              >
                Saturación de Oxígeno 
              </Label>
                <InputGroup>
                  <Input
                    type="number"
                    min={60}
                    max={100}
                    step="1"
                    name="saturacionO2"
                    onChange={(e) => { handleInputChange(e) }}
                    //required
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>%SpO2</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
              <Col md="4">
              <Label
                className="form-control-label"
                htmlFor="example-text-input"
              >
                Fuerza Muscular 
              </Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Grado</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="select"
                    name="fuerzaMuscular"
                    onChange={(e) => { handleInputChange(e) }}
                    //required
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4-</option>
                    <option>4</option>
                    <option>4+</option>
                    <option>5</option>
                  </Input>
                </InputGroup>
              </Col>
              <Col md="4">
              <Label
                className="form-control-label"
                htmlFor="example-text-input"
              >
                Glicemia 
              </Label>
                <InputGroup>
                  <Input
                    type="number"
                    min={50}
                    max={150}
                    step="1"
                    name="glicemia"
                    onChange={(e) => { handleInputChange(e) }}
                    //required
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>mg/dl</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
            </FormGroup>
            <FormGroup className="row">
              <Col md="8">
              <Label
                className="form-control-label"
                htmlFor="example-text-input"
              >
                Información Adicional
              </Label>
                <InputGroup>
                  <Input
                    type="textarea"
                    name="extraInfo"
                    onChange={(e) => { handleInputChange(e) }}
                  />
                </InputGroup>
              </Col>
            </FormGroup>
            
            <FormGroup className="row">
              <Col md="10">
                
              </Col>
              <Col md="2">
                <Button type="submit"  color="primary">Guardar</Button>
              </Col>
              {next && <Redirect to={{
                        pathname: "/admin/evaluations",
                        state: {id: location.state.id, run: location.state.run, name: location.state.name, apellido:location.state.apellido,  anamId: anamId}
                    }}/>}
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
}

export default AnamnesisMedicoGeriatra;