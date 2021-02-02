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
import {Redirect} from "react-router";
// node.js library that concatenates classes (strings)
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col} from "reactstrap";

// core components
import AuthHelper from "../../../helpers/AuthHelper";
import {
  chartOptions,
  parseOptions} from "variables/charts.js";


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNav: 1,
      chartExample1Data: "data1"
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }
  render() {
    if (AuthHelper.isAuthenticated()) {
      return (
        <Container>
          <Row>
            <Col>
              <img
                alt=""
                className="navbar-brand-img"
                src={require("assets/img/brand/tego5.svg")}
                style={{maxHeight:"20rem", marginTop:"2rem", marginLeft:"1rem"}}
              />
            </Col>
          </Row><Row>
            <Col>
              <Card>
                <CardHeader>
                  <h1 style={{color: "#0e4eb5"}}>¡Bienvenid@ a tego.cl!</h1>
                </CardHeader>
                <CardBody>
                  <Row>
                  <Col md="1"><i className="ni ni-bold-left" style={{color: "#0e4eb5"}}></i></Col>
                  <Col md="11">Para empezar, elija un  de una de
                  las listas para recepcionar, agendar consultas o registrar información médica. Si no ha registrado a
                  ningún paciente aún, comienze por el menú "Ingreso".</Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    } else {
      return <Redirect to="/auth/loginexp"/>
    }
  }
}

export default Dashboard;
