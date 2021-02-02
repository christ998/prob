import React, {useState, useEffect} from 'react'
import {
    Button, Col, Container, Card, CardBody,
    Table,
    Alert

} from 'reactstrap'

import Axios from '../../../helpers/axiosConfig'
import {Redirect} from 'react-router-dom';

const ListPatientAnamnesis = ({location}) => {

    const [datos, setDatos] = useState([])
    const [editModal, setEditModal] = useState();
    const [deletModal, setDeletModal] = useState();
    const [showDelete, setShowDelete] = useState()



    const editToggle = () => setEditModal(!editModal);
    //const deleteToggle = () => setDeletModal(!deletModal);
    const deleteToggleDelete = (run) => {
        setShowDelete({
            ...showDelete,
            [run]: false
        })
    }
    const deleteToggleModal = (run) => {
        setDeletModal({
            ...deletModal,
            [run]: !deletModal[run]
        })
    }


    class Person {
        constructor(id, idRun, name, lastname, run, urgency, pain, cavities, wounds, bleeding, fracture, other, answer_id, covid19_risk_id,
                    phone, cellphone, email, occupation, prevision_id, marital_status_id, native_origin_id, educational_level_id) {

            this.id = id
            this.idRun = idRun
            this.name = name;
            this.lastname = lastname;
            this.run = run;
            this.urgency = urgency;
            this.pain = pain;
            this.cavities = cavities;
            this.wounds = wounds;
            this.bleeding = bleeding;
            this.fracture = fracture;
            this.other = other;
            this.answer_id = answer_id;
            this.covid19_risk_id = covid19_risk_id;
            this.phone = phone;
            this.cellphone = cellphone;
            this.email = email;
            this.occupation = occupation;
            this.prevision_id = prevision_id;
            this.marital_status_id = marital_status_id;
            this.native_origin_id = native_origin_id;
            this.educational_level_id = educational_level_id;
        }
    }

    var personas = []

    const listPatient = async () => {

        const res = await Axios.get("person/listpatient")
            .then(response => {
                response.data.result.forEach(element => {
                    setShowDelete({[element.run]: false})
                    setDeletModal({[element.run]: false})
                    personas.push(new Person(element.person_id, element.run_id, element.names, element.lastnames, element.run, element.urgency,
                        element.pain, element.cavities, element.wounds, element.bleeding, element.fracture, element.other, element.informed_consent_answer_id,
                        element.covid19_risk_id, element.phone, element.cellphone, element.email,
                        element.occupation, element.prevision_id, element.marital_status_id, element.native_origin_id, element.educational_level_id));

                });
            })

        setDatos(personas)
    }


    const [odontoFichaAnamnesis, setOdontoFichaAnamnesis] = useState(false)
    const [nuevaOdontoAnamnesis, setNuevaOdontoAnamnesis] = useState(false)
    const [medicoFichaAnamnesis, setMedicoFichaAnamnesis] = useState(false)
    const [nuevaMedicoAnamnesis, setNuevaMedicoAnamnesis] = useState(false)
    const [generalFichaAnamnesis, setGeneralFichaAnamnesis] = useState(false)
    const [nuevaGeneralAnamnesis, setNuevaGeneralAnamnesis] = useState(false)
    const [name, setName] = useState("")
    const [run, setRun] = useState("")
    const [lastname, setLastName] = useState("")
    const [id, setId] = useState(0)

    const datosPersona = (id, name, lastname, run) => {
        setName(name)
        setRun(run)
        setLastName(lastname)
        setId(id)
    }

    const consultaAnamnesisOdonto = async (id, name, lastname, run) => {

        const res = await Axios.get("geriatrical-odonto-anamnesis/crud/" + id
        )

        if (res.data.result.length === 1) {
            datosPersona(id, name, lastname, run)
            setOdontoFichaAnamnesis(true)
        } else {
            datosPersona(id, name, lastname, run)
            setNuevaOdontoAnamnesis(true)
        }

    }
    const consultaAnamnesisMedico = async (id, name, lastname, run) => {

        const res = await Axios.get("geriatrical-medical-anamnesis/crud/" + id
        )

        if (res.data.result.length === 1) {
            datosPersona(id, name, lastname, run)
            setMedicoFichaAnamnesis(true)
        } else {
            datosPersona(id, name, lastname, run)
            setNuevaMedicoAnamnesis(true)
        }

    }
    const consultaAnamnesisGeneral = async (id, name, lastname, run) => {

        const res = await Axios.get("general-anamnesis/" + id
        )

        if (res.data.result.length === 1) {
            datosPersona(id, name, lastname, run)
            setGeneralFichaAnamnesis(true)
        } else {
            datosPersona(id, name, lastname, run)
            setNuevaGeneralAnamnesis(true)
        }

    }

    const [modalReception, setModalReception]=useState(false)
    const [modalGeneral, setModalGeneral]=useState(false)
    const [modalMedica, setModalMedica]=useState(false)
    const [modalOdonto, setModalOdonto]=useState(false)

    const modal=()=>{
        if(location?.state?.reception){
            setModalReception(!modalReception)
        }
        if(location?.state?.anamnesisGeneral){
            setModalGeneral(!modalGeneral)
        }
        if(location?.state?.medicalAnamnesis){
            setModalMedica(!modalMedica)
        }
        if(location?.state?.dentalAnamnesis){
            setModalOdonto(!modalOdonto)
        }

    }

    
    

    useEffect(() => {
        listPatient();
        modal();
    }, []);


    return (
        <Container>

            <Card>
                <CardBody>
                    {location?.state?.reception && <Alert color="success" isOpen={modalReception} toggle={() => {setModalReception(false)}}>
                        Recepción realizada exitosamente
                    </Alert>}
                    {location?.state?.anamnesisGeneral && <Alert color="success" isOpen={modalGeneral} toggle={() => {setModalGeneral(false)}}>
                        Anamnesis General creada exitosamente
                    </Alert>}
                    {location?.state?.medicalAnamnesis && <Alert color="success" isOpen={modalMedica} toggle={() => {setModalMedica(false)}}>
                    Anamnesis Médico-geriátrica creada exitosamente
                    </Alert>}
                    {location?.state?.dentalAnamnesis && <Alert color="success" isOpen={modalOdonto} toggle={() => {setModalOdonto(false)}}>
                    Anamnesis Odonto-geriátrica creada exitosamente
                    </Alert>}
                    <h1>
                        Listado de pacientes
                    </h1>
                    <Table className="align-items-center" responsive>
                        <thead className="thead-light">
                        <tr className="text-center">
                            <th scope="col">N°</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Apellido</th>
                            <th scope="col">Run</th>
                            <th scope="col">Nueva Anamnesis</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            datos.map(
                                (person, i) =>

                                    <tr className="text-center" key={person.id}>
                                        <td>
                                            {i + 1}
                                        </td>
                                        <td>
                                            {person.name}
                                        </td>
                                        <td>
                                            {person.lastname}
                                        </td>
                                        <td>
                                            {person.run}
                                        </td>

                                        <td>
                                            <Button
                                                onClick={() => consultaAnamnesisGeneral(person.id, person.name, person.lastname, person.run)}
                                                color="primary">
                                                General
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                onClick={() => consultaAnamnesisMedico(person.id, person.name, person.lastname, person.run)}
                                                color="primary">
                                                Medico Geriatra
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                onClick={() => consultaAnamnesisOdonto(person.id, person.name, person.lastname, person.run)}
                                                color="primary">
                                                Odonto Geriatra
                                            </Button>
                                        </td>
                                    </tr>
                            )}
                        </tbody>
                    </Table>
                    {nuevaGeneralAnamnesis && <Redirect to={{
                        pathname: "/admin/anamnesis-general",
                        state: {id: id, run: run, name: name}
                    }}/>}
                    {generalFichaAnamnesis && <Redirect to={{
                        pathname: "/admin/general-anamnesis-u",
                        state: {id: id, run: run, name: name}
                    }}/>}
                    {nuevaMedicoAnamnesis && <Redirect to={{
                        pathname: "/admin/physical-parameters",
                        state: {id: id, run: run, name: name}
                    }}/>}
                    {medicoFichaAnamnesis && <Redirect to={{
                        pathname: "/admin/medical-anamnesis-u",
                        state: {id: id, run: run, name: name}
                    }}/>}
                    {nuevaOdontoAnamnesis && <Redirect to={{
                        pathname: "/admin/background",
                        state: {id: id, run: run, name: name}
                    }}/>}
                    {odontoFichaAnamnesis && <Redirect to={{
                        pathname: "/admin/dental-anamnesis-u",
                        state: {id: id, run: run, name: name}
                    }}/>}
                </CardBody>
            </Card>
        </Container>
    )
}

export default ListPatientAnamnesis
