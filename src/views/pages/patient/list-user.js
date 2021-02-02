import React, {useState, useEffect, useRef} from 'react';
import {Button, Col, Container, Form, FormGroup, Input, Card, CardBody, Label, Table, Modal, ModalHeader, ModalBody} from 'reactstrap';
import axios from '../../../helpers/axiosConfig';
import useList from 'hooks/useList';
import {getList} from 'helpers/ListHelper';
import SimpleModal from "../components/SimpleModal";

const ListUser = () => {
    useEffect(() => {fetchUsers()}, []);
    const [users, setUsers] = useState([]);
    const [userMedicalAreas, setUserMedicalAreas] = useState([]);
    const userTypes = useList("list/user-type");
    const medicalAreas = useList("list/medical-area");
    const [currentUser, setCurrentUser] = useState({});
    const [group, setGroup] = useState('user');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        const res = await getList("user");
        setLoading(false)
        setUsers(res);
    };

    const fetchAreas = async (user_id) => {
        const res = await getList("user/user-medical-area/" + user_id);
        setUserMedicalAreas(res);
    };

    const handleInputChange = (e) => {
        setCurrentUser({
            ...currentUser,
            [e.target.name]: e.target.value
        });
    };

    const [displayModal, setDisplayModal] = useState(false);
    const showModal = (user) => {
        setCurrentUser(user);
        setGroup("user");
        fetchAreas(user.user_id);
        setDisplayModal(!displayModal);
    }

    const changeGroup = (group) => {
        var form = document.getElementById('id-form-update');
        if (form.checkValidity()) {
            setGroup(group);
        } else {
            document.getElementById('id-btn-save').click();
        };
    };

    const modalRef = useRef()
    const setModal = (options) => {
        modalRef.current.setModal(options);
    };

    const deleteUserMedicalArea = async (user_medical_area_id) => {
        await axios.delete("user/user-medical-area/" + user_medical_area_id);
        fetchAreas(currentUser.user_id);
    };

    const updateStateUser = async (run) => {
        await axios.put("user/" + run);
        setModal({});
        fetchUsers();
    };

    const saveUserMedicalArea = async () => {
        try {
            const res = await axios.post("user/user-medical-area",
                {user_id: currentUser.user_id, medical_area_id: currentUser.medical_area_id}
            );
            if (!res.data.error) {
                fetchAreas(currentUser.user_id);
            } else {
                console.log('Err: ' + res.data.result.code + ' ' + res.data.result.sqlMessage);
            }
        } catch (e) {
            console.log('Err: ' + e);
        };
    };

    const updateUser = async e => {
        e.preventDefault();
        try {
            const res = await axios.put("user", currentUser);
            switch (res.data.result[0][0].cod) {
                case 0:
                    fetchUsers();
                    setDisplayModal(!displayModal);
                    break;
                case 1:
                    setModal({title: 'Usuario', text: 'El usuario ' + currentUser.run + ' ya existe.', type: 1});
                    break;
                case 2:
                    setModal({title: 'Usuario', text: 'El usuario ' + currentUser.run + ' ya existe pero esta inactivo', type: 1});
                    break;
                default:
                    setModal({title: 'Error', text: 'Despierte al administrador de sistemas ' + res.data.result[0][0].msg, type: 1});
                    break;
            };
        } catch (e) {
            console.log('Err: ' + e);
        };
    };

    const reqTag = <span style={{color:"#DC3545"}}>*</span>

    return (
        <Container className="mt-3">
            <SimpleModal ref={modalRef}/>
            <Card>
                <CardBody>
                    <h1>Listado de usuarios</h1>
                    <Input 
                        type="text" 
                        placeholder="Buscar..."
                        name="look_for"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <br/>
                    {loading 
                        ?<div className="w-100 d-flex justify-content-center">
                            <div className="loader"></div>
                        </div>
                        :<Table className="align-items-center" responsive>
                            <thead className="thead-light">
                            <tr className="text-center">
                                <th scope="col">N°</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Apellido</th>
                                <th scope="col">Run</th>
                                <th scope="col">Rol</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.filter(val => {
                                    if(searchTerm == "") {
                                        return val;
                                    } else if (val.run.includes(searchTerm) || val.fullname.toLowerCase().includes(searchTerm.toLowerCase())) {
                                        return val;
                                    }
                            }).map(user => (
                                <tr className="text-center" key={user.user_id}>
                                    <td>{user.user_id}</td>
                                    <td>{user.names}</td>
                                    <td>{user.lastnames}</td>
                                    <td>{user.run}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <Button color="primary" onClick={() => showModal(user)}>Editar</Button>
                                    </td>
                                    <td>
                                        <Button color="danger" size="sm" onClick={() => setModal({title: 'Usuario', text: 'Desea eliminar al usuario ' + user.run + '?', type: 2, fx: () => updateStateUser(user.run)})}><i className="far fa-trash-alt"></i></Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    }
                    <Modal isOpen={displayModal}>
                        <Form id="id-form-update" role="form" onSubmit={e => updateUser(e)}>
                            <ModalHeader toggle={() => {setDisplayModal(!displayModal)}}>
                                {currentUser.user_type_id == 2
                                    ? <>
                                        <a href="#" style={{paddingRight: "15px", cursor: "pointer", ...(group === 'user' ? {color: "#11cdef"} : {})}} onClick={() => changeGroup('user')}>Usuario</a>
                                        <a href="#" style={{paddingRight: "15px", cursor: "pointer", ...(group === 'area' ? {color: "#11cdef"} : {})}} onClick={() => changeGroup('area')}>Especialidad</a>
                                      </>
                                    : "Usuario"
                                }
                            </ModalHeader>
                            {group === 'user' && <>
                                <ModalBody>
                                    <h5 style={{color:"#DC3545"}}>* Existen campos obligatorios</h5>
                                    <FormGroup className="row">
                                        <Col>
                                            <Label className="form-control-label">Nombres {reqTag}</Label>
                                            <Input
                                                autoComplete="off"
                                                type="text"
                                                required
                                                name="names"
                                                value={currentUser.names}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="row">
                                        <Col>
                                            <Label className="form-control-label">Apellidos {reqTag}</Label>
                                            <Input
                                                autoComplete="off"
                                                type="text"
                                                name="lastnames"
                                                value={currentUser.lastnames}
                                                onChange={e => handleInputChange(e)}
                                                required
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="row">
                                        <Col>
                                            <Label className="form-control-label">Número de Identidad {reqTag}</Label>
                                            <Input
                                                required
                                                autoComplete="off"
                                                type="text"
                                                name="run"
                                                value={currentUser.run}
                                                onChange={e => handleInputChange(e)}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="row">
                                        <Col>
                                            <Label className="form-control-label">Rol</Label>
                                            <Input
                                                type="select"
                                                name="user_type_id"
                                                onChange={e => handleInputChange(e)}
                                                value={currentUser.user_type_id}>
                                                {userTypes.map(e => (<option key={e.user_type_id} value={e.user_type_id}>{e.name}</option>))}
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup className="row">
                                        <Col>
                                            <Label className="form-control-label">Email</Label>
                                            <Input
                                                autoComplete="off"
                                                type="email"
                                                name="email"
                                                onChange={e => handleInputChange(e)}
                                                value={currentUser.email}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <div className="float-right mb-4 mr-2">
                                        <Button type="submit" id="id-btn-save"color="primary">Guardar</Button>{' '}
                                        <Button onClick={() => {setDisplayModal(!displayModal)}} color="secondary">Cancelar</Button>
                                    </div>
                                </ModalBody>
                            </>}
                            {group === 'area' && <>
                                <ModalBody>
                                    <FormGroup className="row">
                                        <Col>
                                            <Label className="form-control-label">Especialidad</Label>
                                            <Input
                                                type="select"
                                                name="medical_area_id"
                                                onChange={e => handleInputChange(e)}
                                                value={currentUser.medical_area_id}>
                                                <option hidden value="">Seleccione...</option>
                                                {medicalAreas.map(e => (<option key={e.medical_area_id} value={e.medical_area_id}>{e.name}</option>))}
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <Table className="align-items-center" responsive>
                                        <thead className="thead-light">
                                        <tr className="text-center">
                                            <th scope="col">Especialidad</th>
                                            <th scope="col">Eliminar</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {userMedicalAreas.map(userMedicalArea => (
                                            <tr className="text-center" key={userMedicalArea.user_medical_area_id}>
                                                <td>{userMedicalArea.name}</td>
                                                <td>
                                                    <Button onClick={() => {deleteUserMedicalArea(userMedicalArea.user_medical_area_id)}} className="mr-2" color="danger" size="sm"><i className="far fa-trash-alt"/></Button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                    <div className="float-right mb-4 mr-2">
                                        <Button onClick={() => {saveUserMedicalArea()}} color="primary">Agregar</Button>
                                        <Button onClick={() => {setDisplayModal(!displayModal)}} color="secondary">Salir</Button>
                                    </div>
                                </ModalBody>
                            </>}
                        </Form>
                    </Modal>
                </CardBody>
            </Card>
        </Container>
    );
};

export default ListUser;

