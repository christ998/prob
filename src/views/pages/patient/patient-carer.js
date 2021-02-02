import React, { useState } from 'react'
import {
  Button, Col, Container, Form, FormGroup, Input, Card, CardBody, Label
} from 'reactstrap'
import Axios from '../../../helpers/axiosConfig'
import { Link , Redirect} from 'react-router-dom';
const PatientCarer = () => {

  const [createdPersonId, setCreatedPersonId] = useState(0)
   const [toggle, setToggle] = useState(false)
   const [next, setNext]=useState(false)
   const[datos, setDatos]=useState({
     carerNames:"",
     carerPaternalLastname:"",
     carerMaternalLastname:"",
     carerPhone:"",
     carerCellPhone:"",
     carerEmail:"",
     contador:"",
   })
  const handleInputChange = (e) =>{
     setDatos({
       ...datos,
       [e.target.name]: e.target.value
     })
      console.log(datos)
  }

  const addPerson = async (e) => {
    e.preventDefault()
    const res = await Axios.post("person",
      {
        run: datos.run + "-" + datos.verificationNumber,
        names: datos.names,
        lastnames: datos.paternalLastname + " " + datos.maternalLastname,
        birthdate: datos.birthDate,
        phone: datos.phone,
        cellphone: datos.cellphone,
        email: datos.email
      }
    )
    console.log(res)
    if (!res.data.error)
      
      await setCreatedPersonId(res.data.result[2].insertId)
      await setDatos({
        
        ...datos,
        
      })
      await setNext(true)
      
  }

  const addCarer = async (e) => {
    e.preventDefault()
    const res = await Axios.post("carer/",
      {
        personId: datos.createdPersonId,
        names: datos.carerNames,
        lastnames: datos.carerPaternalLastname + " " + datos.carerMaternalLastname,
        phone: datos.carerPhone,
        cellphone: datos.carerCellPhone,
        email: datos.carerEmail
      })
  }
  const hoy = new Date()

  const reqTag = <span style={{color:"#DC3545"}}>*</span>

  return (
    <Container>
         
      
        <Card>
          <CardBody>
            <h6 className="heading-small text-muted mb-4">
              Cuidador
                        </h6>
            <h5 style={{color:"#DC3545"}}>* Existen campos obligatorios</h5>
            <Form onSubmit={addCarer} role="form">
              <FormGroup className="row">
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example-text-input"
                  >
                    Nombres {reqTag}
                            </Label>
                  <Input
                    placeholder="Debe colocar primera letra en Mayúscula"
                    id="example-text-input"
                    name="carerNames"
                    type="text"
                    pattern="^[ña-zÑA-Z ]*$"
                    onChange={(e) => { handleInputChange(e) }}
                    required
                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example-text-input"
                  >
                    Apellido Paterno {reqTag}
                            </Label>
                  <Input
                    placeholder="Debe colocar primera letra en Mayúscula"
                    id="example-text-input"
                    name="carerPaternalLastnames"
                    type="text"
                    pattern="^[ÑA-Z ña-z]*$"
                    onChange={(e) => { handleInputChange(e) }}
                    required
                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example-text-input"
                  >
                    Apellido Materno {reqTag}
                            </Label>
                  <Input
                    placeholder="Debe colocar primera letra en Mayúscula"
                    id="example-text-input"
                    name="carerMaternalLastncame"
                    type="text"
                    pattern="^[ÑA-Z ña-z]*$"
                    onChange={(e) => { handleInputChange(e) }}
                    required
                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example-text-input"
                  >
                    Teléfono fijo
                            </Label>
                  <Input
                    placeholder="+56 9 2299 7066"
                    name="carerPhone"
                    id="example-text-input"
                    type="tel"
                    onChange={(e) => { handleInputChange(e) }}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example-text-input"
                  >
                    Teléfono celular {reqTag}
                            </Label>
                  <Input
                    placeholder="+56 9 2299 7066"
                    id="example-text-input"
                    name="carerCellPhone"
                    type="tel"
                    onChange={(e) => { handleInputChange(e) }}
                    required

                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Col>
                  <Label
                    className="form-control-label"
                    htmlFor="example-text-input"
                  >
                    Email
                            </Label>
                  <Input
                    placeholder="correo@dominio.cl"
                    id="example-text-input"
                    name="carerEmail"
                    type="email"
                    onChange={(e) => { handleInputChange(e) }}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="row">
                <Col md="10"></Col>
                <Col md="2">
                  <Button type="submit" color="primary">Registrar Cuidador</Button>
                </Col>
              </FormGroup>
            </Form>
            { next && <Redirect to={{
                pathname: "/admin/consultation-motive",
                state: { id: createdPersonId, run: datos.run + "-" + datos.verificationNumber, name: datos.names, apellido : datos.paternalLastname} 
              }} /> }
          </CardBody>
        </Card>
      
    </Container>
  )
}

export default PatientCarer
