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
// nodejs library that concatenates classes
import classnames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import AuthHelper from "../../helpers/AuthHelper";
import {Redirect} from "react-router";
// reactstrap components
import {
    Collapse,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    ListGroupItem,
    ListGroup,
    Media,
    Navbar,
    NavItem,
    NavLink,
    Nav,
    Container,
    Row,
    Button,
    ButtonGroup,
    Col
} from "reactstrap";

class AdminNavbar extends React.Component {
    redirigir = false;
    // function that on mobile devices makes the search open
    openSearch = () => {
        document.body.classList.add("g-navbar-search-showing");
        setTimeout(function () {
            document.body.classList.remove("g-navbar-search-showing");
            document.body.classList.add("g-navbar-search-show");
        }, 150);
        setTimeout(function () {
            document.body.classList.add("g-navbar-search-shown");
        }, 300);
    };
    // function that on mobile devices makes the search close
    closeSearch = () => {
        document.body.classList.remove("g-navbar-search-shown");
        setTimeout(function () {
            document.body.classList.remove("g-navbar-search-show");
            document.body.classList.add("g-navbar-search-hiding");
        }, 150);
        setTimeout(function () {
            document.body.classList.remove("g-navbar-search-hiding");
            document.body.classList.add("g-navbar-search-hidden");
        }, 300);
        setTimeout(function () {
            document.body.classList.remove("g-navbar-search-hidden");
        }, 500);
    };
    afuera = (e) => {
        e.preventDefault()
        AuthHelper.logout()
        this.props.history.push("/auth/loginexp")
    }

    name = AuthHelper.getName()

    render() {

        return (
            <>
                <Navbar
                    className={classnames(
                        "navbar-top navbar-expand border-bottom",
                        {"navbar-dark bg-info": this.props.theme === "dark"},
                        {"navbar-light bg-secondary": this.props.theme === "light"}
                    )}
                >
                    <Container fluid>
                        <Collapse navbar isOpen={true}>


                            

              <Nav className="align-items-center ml-md-auto" navbar>
              </Nav>
              <Nav className="align-items-center ml-auto ml-md-0" navbar>
                <ButtonGroup>
                    <Button outline color="default" size="sm" disabled>
                        <i className="fas fa-user"></i> {this.name}
                    </Button>
                    <Button outline color="danger" size="sm" onClick={() => {
                    AuthHelper.logout();
                    this.props.history.push('/auth/loginexp')
                    }}><i className="fas fa-sign-out-alt"></i> Terminar sesión</Button>
                </ButtonGroup>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

AdminNavbar.defaultProps = {
    toggleSidenav: () => {
    },
    sidenavOpen: false,
    theme: "dark"
};
AdminNavbar.propTypes = {
    toggleSidenav: PropTypes.func,
    sidenavOpen: PropTypes.bool,
    theme: PropTypes.oneOf(["dark", "light"])
};

export default AdminNavbar;
