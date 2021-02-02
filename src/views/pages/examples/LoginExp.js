/*!

=========================================================
* Argon Dashboard PRO React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import {loginURL, setTokens} from 'helpers/AuthHelper2'
// nodejs library that concatenates classes
import classnames from "classnames";
// reactstrap components
import {
    Alert,
    Button,
    Card,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Container,
    Row,
    Col
} from "reactstrap";
// core components
import AuthHeader from "components/Headers/AuthHeader.js";
import AuthHelper from "../../../helpers/AuthHelper"
import {formatRut} from "@fdograph/rut-utilities";

import {Link, Redirect} from "react-router-dom";


// const login = async (e) => {
//   e.preventDefault()
//   const res = await Axios.post(
//     process.env.REACT_APP_API_URL + "session/login",
//     { run: run, pass: pass }
//   )
// }


class LoginExp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wrongLogin: false,
            timeWrong: 0
        }

    }

    loginFunc = async (e) => {
        e.preventDefault()
        // AuthHelper.login(formatRut(this.run), this.pass).then((res) => {
        AuthHelper.login(formatRut(this.run), this.pass).then((res) => {
            if (res.auth) {
                this.props.history.push('/admin/dashboard')
            } else {
                this.setState({wrongLogin: true, timeWrong: 2})
                this.countDown()
            }
        })
    }

    run = "";
    pass = "";
    countDown = () => {
        var x = setInterval(() => {
            this.setState({timeWrong: this.state.timeWrong - 1})
            if (this.state.timeWrong === 0) clearInterval(x)

        }, 1000)
    }


    render() {

        return (
            <>
                <AuthHeader
                    title="Bienvenido a Tego"
                    lead=""
                />
                <Container className="mt--8 pb-5">
                    <Row className="justify-content-center">
                        <Col lg="5" md="7">
                            <Card className="bg-secondary border-0 mb-0">
                                <CardBody className="px-lg-5 py-lg-5">
                                    {(this.state.wrongLogin && this.state.timeWrong !== 0) &&
                                    <Alert color="danger">
                                        <strong>Rut o Contraseña Inválido</strong>
                                    </Alert>
                                    }
                                    <div className="text-muted text-center mt-2 mb-3">
                                        Por favor, ingrese con su Rut o DNI:
                                    </div>
                                    <Form onSubmit={this.loginFunc} role="form" method="post">
                                        <FormGroup
                                            className={classnames("mb-3", {
                                                focused: this.state.focusedRun
                                            })}
                                        >
                                            <InputGroup className="input-group-merge input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-email-83"/>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder="Rut o DNI"
                                                    type="run"
                                                    onChange={(e) => {
                                                        this.run = e.target.value

                                                    }}
                                                    onFocus={() => this.setState({focusedRun: true})}
                                                    onBlur={() => this.setState({focusedRun: false})}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup
                                            className={classnames({
                                                focused: this.state.focusedPassword
                                            })}
                                        >
                                            <InputGroup className="input-group-merge input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-lock-circle-open"/>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder="Contraseña"
                                                    type="password"
                                                    onChange={(e) => {
                                                        this.pass = e.target.value
                                                    }}
                                                    onFocus={() =>
                                                        this.setState({focusedPassword: true})
                                                    }
                                                    onBlur={() =>
                                                        this.setState({focusedPassword: false})
                                                    }
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                        <div className="custom-control custom-control-alternative custom-checkbox">

                                        </div>
                                        <div className="text-center">
                                            <Button className="my-4" color="info" type="submit">
                                                Ingresar
                                            </Button>
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
                            <Row className="mt-3">
                                <Col xs="6">
                                    <a
                                        className="text-light"
                                        href="#pablo"
                                        onClick={e => e.preventDefault()}
                                    >

                                    </a>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default LoginExp;
