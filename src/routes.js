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

import Dashboard from "views/pages/dashboards/Dashboard.js";
import Login from "views/pages/examples/Login.js";
import LoginExp from "views/pages/examples/LoginExp.js";
import Register from "views/pages/examples/Register.js";
import UserTest from "views/pages/patient/list-user";
import RegisterUser from "views/pages/patient/register-user";
import PatientAdmission from "views/pages/patient/patient-admission"
import ListPatient from "views/pages/patient/list-patient";
import ListRecord from "views/pages/patient/list-records"
import ConsultationAppointment from "views/pages/patient/consultation-appointment"
import Referral from "views/pages/patient/referral"
import ListPatientAnamnesis from "views/pages/patient/list-patient-anamnesis"

const routes = [
  {
    path: "/dashboard",
    name: "Home",
    icon: "fa fa-columns text-primary",
    miniName: "D",
    component: Dashboard,
    layout: "/admin" 
  },
  {
    path: "/patient-admission",
    name: "Pre Ingreso",
    icon: "fa fa-address-book text-primary",
    miniName: "PI",
    component: PatientAdmission,
    layout: "/admin" 
  },


    //   {
    //     path: "/consultation-motive",
    //     name: "Motivo Consulta",
    //     miniName: "MC",
    //     component: ConsultationMotive,
    //     layout: "/admin"
    //  },
    //   {
    //     path: "/covid-risk",
    //     name: "Riesgo Covid",
    //     miniName: "RC",
    //     component: CovidRisk,
    //     layout: "/admin"
    //   },
    //   {
    //     path: "/informed-consent",
    //     name: "Consentimiento Informado",
    //     miniName: "CI",
    //     component: InformedConsent,
    //     layout: "/admin"
    //   },
    //   {
    //     path: "/sociodemographic-data",
    //     name: "Datos Sociodemográficos",
    //     miniName: "DS",
    //     component: SociodemographicData,
    //     layout: "/admin"
    //   },
         
    
  
  {
    path: "/consultation-appointment",
    name: "Agendar Consulta",
    icon: "fa fa-address-book text-primary",
    miniName: "AC",
    component: ConsultationAppointment,
    layout: "/admin" 
  },
  {
    path: "/list-patient",
    name: "Recepcionar paciente",
    miniName: "LP",
    icon: "ni fas fa-user-plus text-primary",
    component: ListPatient,
    layout: "/admin"
  
  },
  {
  
    path: "/list-patient-anamnesis",
    name: "Crear Anamnesis ",
    miniName: "LPA",
    icon: "ni fas fa-user-plus text-primary",
    component: ListPatientAnamnesis,
    layout: "/admin"
 
   
  },
  {
    path: "/referral",
    name: "Interconsultas",
    icon: "fa fa-address-book text-primary",
    miniName: "IC",
    component: Referral,
    layout: "/admin" 
  },
  // {
  //   collapse: true,
  //   name: "Paginas sueltas",
  //   icon: "fa fa-briefcase-medical text-primary",
  //   state: "atencionCollapse",
  //   views: [ 
      
  //    /* 
  //     {
  //       path: "/extra-oral",
  //       name: "Examen Extra Oral",
  //       miniName: "EO",
  //       component: ExtraOral,
  //       layout: "/admin"
  //     }, 
  //     {
  //       path: "/soft-tissues-exam",
  //       name: "Examen de tejidos blandos",
  //       miniName: "Etb",
  //       component: SoftTissuesExam,
  //       layout: "/admin"
  //     }, 

  //     {
  //       path: "/odontogram",
  //       name: "Odontograma",
  //       miniName: "O",
  //       component: Odontogram,
  //       layout: "/admin"
  //     }, 
  //     */
  //     {
  //       path: "/periodontograma",
  //       name: "Periodontograma",
  //       miniName: "P",
  //       component: Periodontograma,
  //       layout: "/admin"
  //     }
  //   ]
  // },
  {
    path: "/list-record",
    name: "Fichas clinicas",
    miniName: "LF",
    icon: "ni fas fa-user-plus text-primary",
    component: ListRecord,
    layout: "/admin"
    
  },
  {
    collapse: true,
    name: "Administrar Usuarios",
    icon: "ni fas fa-user-plus text-primary",
    state: "AdminstrarCollapse",
    layout: "/admin",
    views: [
      {
        path: "/user",
        name: "Registrar Usuario",
        miniName: "RU",
        component: RegisterUser,
        layout: "/admin"
      },
      {
        path: "/list-user",
        name: "Listado de Usuarios",
        miniName: "PU",
        component: UserTest,
        isAdmin: true,
        layout: "/admin"
      },      
    ]
  },
  
  {
    path: "/login",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/loginexp",
    component: LoginExp,
    layout: "/auth"
  },
  {
    path: "/register",
    component: Register,
    layout: "/auth"
  }

];

export default routes;
