import React from "react";
import { Container, Toast } from 'react-bootstrap';

const Toasts = (props) => {
    return (
        <div className="">
            {/* pass in all the animes in an array */}
            <Toast className="d-inline-block m-1" bg={props.status}>
                <Toast.Header>
                    {/* <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" /> */}
                    <strong className="me-auto">{props.title}</strong>
                    {/* <small>11 mins ago</small> */}
                </Toast.Header>
                <Toast.Body>
                    {props.body}
                </Toast.Body>
            </Toast>
        </div>
    );
};

export default Toasts;
