import React from "react";
import { Navbar, Container, Nav, Form, FormControl, Button } from 'react-bootstrap';

import icon from "../celo-logo.png";

const Navigate = ({account}) => {
    return (
        <div className="">

            <Navbar bg="light" expand="lg">
                <Container>
                    <img src={icon} alt="celo" className="align-left inline-block mx-2" width="30" height="30" />
                    <Navbar.Brand href="#">Anime Recommendation</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '200px' }}
                            navbarScroll
                        >
                            <Nav.Link href="#action1">Home</Nav.Link>
                            <Nav.Link href="#action2">Link</Nav.Link>
                        </Nav>
                        <Form className="d-flex me-5">
                            <FormControl
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="outline-success">Search</Button>
                        </Form>
                        <button className="btn btn-outline-info">User's Balance is {account[1]} from {account[0]}</button>

                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </div>
    );
};

export default Navigate;
