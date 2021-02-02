import React, {useState} from 'react'
import {
    Button, Col, Container, Form, FormGroup, Input, Card, CardBody, Label, Alert
} from 'reactstrap'
import Axios from '../../../helpers/axiosConfig'
import {Link} from 'react-router-dom';

const TemperaturePatient = ({location}) => {

    const [temperature, setTemperature] = useState('')


    const addTemperatura = async (e) => {
        e.preventDefault()
        const res = await Axios.post("",
            {
                idperson: location.state.id,
                temperature: temperature

            }
        )

    }


    return (
        <Container>
            <Card>
                <CardBody>
                    <h3>{location.state.id}, {location.state.run}, {location.state.name} {location.state.apellido}</h3>
                    <h6 className="heading-small text-muted mb-4">
                        Paciente
                    </h6>
                    <Form onSubmit={addTemperatura} role="form">
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmslFor="example-text-input"
                                md="2"
                            >
                                TEMPERATURA
                            </Label>
                            <Input
                                placeholder="36"
                                id="example-text-input"
                                type="number"
                                min="30"
                                max="50"
                                step=".1"
                                onChange={(e) => {
                                    setTemperature(e.target.value)
                                }}
                                required
                            />
                        </FormGroup>
                        {temperature && <div>
                            {temperature <= 35 && <Alert color="primary">
                                <strong>Hipotermia!</strong>
                            </Alert>}
                            {temperature < 37.8 && temperature > 35 && <Alert color="success">
                                Temperatura normal
                            </Alert>}
                            {temperature >= 37.8 && <Alert color="danger">
                                <strong>Derivar a hospital</strong>
                            </Alert>}
                        </div>}
                        <FormGroup className="row">
                            <Col md="10">
                                <Button type="submit" color="primary">Guardar</Button>
                            </Col>
                            <Col md="0,5">
                                <Button color="primary">
                                    <Link to={{
                                        pathname: "/admin/informed-consent-reception",
                                        state: {
                                            id: location.state.id,
                                            run: location.state.run,
                                            name: location.state.name
                                        }
                                    }} style={{color: "white"}}>Siguiente</Link>
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>

                </CardBody>
            </Card>
        </Container>
    )
}

export default TemperaturePatient