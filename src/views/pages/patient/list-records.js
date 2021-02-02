import React, {useState, useEffect} from 'react';
import {Button, Container, Card, CardBody, Table, Input} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../../../assets/css/loading.css'
import {getList} from 'helpers/ListHelper';

const ListRecords = () => {
    const [persons, setPersons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchPersons = async () => {
        const res = await getList("list/person");
        setLoading(false)
        setPersons(res);
    };

    useEffect(() => {
        fetchPersons();
    }, []);

    return (
        <Container className="mt-3">
            <Card>
                <CardBody>
                    <h1>Fichas Clinicas</h1>
                    <Input type="text" placeholder="Buscar..." autoComplete="off" name="look_for" 
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
                                    <th scope="col">ID</th>
                                    <th scope="col">Run</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Apellidos</th>
                                    <th scope="col">Ficha Clinica</th>
                                </tr>
                            </thead>
                            {/* {loading && <div className="loader align-self-center text-center justify-content-center"></div>} */}
                            <tbody>
                                {persons.filter(val => {
                                    if(searchTerm == "") {
                                        return val;
                                    } else if (val.run.includes(searchTerm) || val.fullname.toLowerCase().includes(searchTerm.toLowerCase())) {
                                        return val;
                                    }
                                }).map(e_person => (
                                    <tr className="text-center" key={e_person.person_id}>
                                        <td>{e_person.person_id}</td>
                                        <td>{e_person.run}</td>
                                        <td>{e_person.names}</td>
                                        <td>{e_person.lastnames}</td>
                                        <td>
                                            {/* <Button onClick={() => showModalAppointments(e_person)}>Listar</Button> */}
                                            <Link to={{
                                                    pathname: "/admin/clinical-record",
                                                    state: {
                                                        id: e_person.person_id,
                                                        run: e_person.run,
                                                        name: e_person.names,
                                                        apellido: e_person.lastnames
                                                    }
                                                }} style={{color: "white"}}><Button color="primary">
                                                Ver</Button></Link>
                                            
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    }
                </CardBody>
            </Card>
        </Container>
    );
};

export default ListRecords;
