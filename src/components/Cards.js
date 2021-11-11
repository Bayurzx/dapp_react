import React from "react";
import { CardGroup, Card } from 'react-bootstrap';

const Cards = (props) => {

    const randomBg = () => {
        let randInt = Math.floor(Math.random() * (8 - 1 + 1) + 1).toString();
        let bgColors = {
            '1': 'Primary',
            '2': 'Secondary',
            '3': 'Success',
            '4': 'Danger',
            '5': 'Warning',
            '6': 'Info',
            '7': 'Light',
            '8': 'Dark',
        }
        return bgColors[randInt];
    }

    

    return (
        <div className="">
            {/* pass-in all the animes in an array */}
            <Row xs={1} md={3} className="g-4">
                {Array.from({ length: 6 }, (a,b) => b+1).map((_, idx) => (
                    <Col>
                        <Card
                            bg={randomBg}
                            key={idx}
                            text={() => randomBg().toLowerCase() === 'light' ? 'dark' : 'white'}
                            className="mb-2"

                        >
                            <Card.Img variant="top" src="holder.js/100px160" />
                            <Card.Body>
                                <Card.Title>Card title {_} </Card.Title>
                                <Card.Text>
                                    This is a longer card with supporting text below as a natural
                                    lead-in to additional content. This content is a little bit longer.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Cards;
