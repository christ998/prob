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
// react library for routing
import { Route, Switch, Redirect } from "react-router-dom";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";
import ConsultationMotive from "views/pages/patient/consultation-motive";
import CovidRisk from "views/pages/patient/covid-risk";
import SociodemographicData from "views/pages/patient/sociodemographic-data";
import CovidRiskReception from "views/pages/patient/covid-risk-reception";
import InformedConsentReception from "views/pages/patient/informed-consent-reception";
import AnamnesisGeneral from "views/pages/patient/anamnesis-general";
import AnamnesisMedicoGeriatra from "views/pages/patient/anamnesis-medico-geriatra";
import Evaluations from "views/pages/patient/evaluations";
import InformedConsent from "views/pages/patient/informed-consent";
import PatientCarer from "views/pages/patient/patient-carer"
import ClinicalRecord from "views/pages/patient/clinical-record"
import Background from "views/pages/patient/background";
import PhysicalParameters from "views/pages/patient/anamnesis-medico-geriatra"
import DentalAnamnesis from "views/pages/patient/dental-anamnesis"
import DentalAnamnesisU from "views/pages/patient/dental-anamnesis-u"
import GeneralAnamnesisU from "views/pages/patient/general-anamnesis-u"
import MedicalAnamnesisU from "views/pages/patient/medical-anamnesis-u"
import MuscularExam from "views/pages/patient/muscular-exam";
import ExtraOral from "views/pages/patient/extra-oral";
import SoftTissuesExam from "views/pages/patient/soft-tissues-exam";
import Odontogram from "views/pages/patient/odontogram";
import Periodontogram from "views/pages/patient/peridontrograma";

class Admin extends React.Component {
  state = {
    sidenavOpen: true
  };
  componentDidUpdate(e) {
    if (e.history.pathname !== e.location.pathname) {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainContent.scrollTop = 0;
    }
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  // toggles collapse between mini sidenav and normal
  toggleSidenav = e => {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
    }
    this.setState({
      sidenavOpen: !this.state.sidenavOpen
    });
  };
  getNavbarTheme = () => {
    return this.props.location.pathname.indexOf(
      "admin/alternative-dashboard"
    ) === -1
      ? "dark"
      : "light";
  };
  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes}
          toggleSidenav={this.toggleSidenav}
          sidenavOpen={this.state.sidenavOpen}
          logo={{
            innerLink: "/",
            //imgSrc: require("assets/img/brand/tego.jpeg"),
            imgSrc: require("assets/img/brand/tego5.svg"),
            imgAlt: "..."
          }}
        />
        <div
          className="main-content"
          ref="mainContent"
          onClick={this.closeSidenav}
        >
          <AdminNavbar
            {...this.props}
            theme={this.getNavbarTheme()}
            toggleSidenav={this.toggleSidenav}
            sidenavOpen={this.state.sidenavOpen}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>
            {this.getRoutes(routes)}
            <Route path="/admin/consultation-motive" component={ConsultationMotive}/> 
            <Route path="/admin/covid-risk" component={CovidRisk}/> 
            <Route path="/admin/informed-consent" component={InformedConsent}/> 
            <Route path="/admin/sociodemographic-data" component={SociodemographicData}/> 
            <Route path="/admin/covid-risk-reception" component={CovidRiskReception}/> 
            <Route path="/admin/informed-consent-reception" component={InformedConsentReception}/> 
            <Route path="/admin/anamnesis-general" component={AnamnesisGeneral}/> 
            <Route path="/admin/anamnesis-medicogeriatra" component={AnamnesisMedicoGeriatra}/> 
            <Route path="/admin/evaluations" component={Evaluations}/> 
            <Route path="/admin/patient-carer" component={PatientCarer}/> 
            <Route path="/admin/clinical-record" component={ClinicalRecord}/> 
            <Route path="/admin/background" component={Background}/> 
            <Route path="/admin/muscular-exam" component={MuscularExam}/>
            <Route path="/admin/physical-parameters" component={PhysicalParameters}/>      
            <Route path="/admin/dental-anamnesis" component={DentalAnamnesis}/> 
            <Route path="/admin/dental-anamnesis-u" component={DentalAnamnesisU}/> 
            <Route path="/admin/general-anamnesis-u" component={GeneralAnamnesisU}/>
            <Route path="/admin/medical-anamnesis-u" component={MedicalAnamnesisU}/> 
            <Route path="/admin/extra-oral" component={ExtraOral}/>
            <Route path="/admin/soft-tissues-exam" component={SoftTissuesExam}/>
            <Route path="/admin/odontogram" component={Odontogram}/> 
            <Route path="/admin/periodontogram" component={Periodontogram}/>
            {/* <Route path="/covid-risk" component={CovidRisk}/> 
            <Route path="/covid-risk" component={CovidRisk}/> 
            <Route path="/covid-risk" component={CovidRisk}/> 
            <Route path="/covid-risk" component={CovidRisk}/>  */}
            
            <Redirect from="*" to="/admin/dashboard" />
          </Switch>
          <AdminFooter />
        </div>
        {this.state.sidenavOpen ? (
          <div className="backdrop d-xl-none" onClick={this.toggleSidenav} />
        ) : null}
      </>
    );
  }
}

export default Admin;
