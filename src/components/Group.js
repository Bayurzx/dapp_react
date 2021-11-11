import React from "react";
import { CardGroup, Card } from 'react-bootstrap';


const Group = (props) => {


    return (
        <div className="">
            <CardGroup>
                <Card>
                    <Card.Img variant="top" src={/* img link*/} />
                    <Card.Body>
                        <Card.Title>{ /*title*/ }</Card.Title>
                        <Card.Text>
                            { /*desc*/}
                        </Card.Text>
                        {/* {youtube link to trailer} */}
                    </Card.Body>
                    <Card.Footer>
                        {/* {Vote count and Vote} */}

                    </Card.Footer>
                </Card>

            </CardGroup>
        </div>
    );
};

export default Group;
