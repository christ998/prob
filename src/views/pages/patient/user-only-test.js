import React, { useState } from 'react'
import { getToken, getNames, verify } from 'helpers/AuthHelper2'
import {
    Container, Card, CardBody,


} from 'reactstrap'

import { Redirect } from 'react-router-dom';

class UserTest extends React.Component {

    render() {
        const rendered = (
            <Container>
                <Card>
                    <CardBody>
                        <h1 className="heading-large text-muted mb-4">
                            Entrada correcta
                        </h1>
                        <p>Usted se ha autentificado como {getNames()}</p>
                        <p>Su token es: {getToken()}</p>
                    </CardBody>
                </Card>
            </Container>
        );
        let verification = verify('user');
        let result = (verification == 200) ? rendered : (<Redirect to={(verification == 403) ? window.location.href: "/auth/login"}/>);
        return result
    }
}

export default UserTest
