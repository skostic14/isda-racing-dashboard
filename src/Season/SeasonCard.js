import React, {Component} from 'react';
import { Card, Button } from 'react-bootstrap';

class SeasonCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'seasonId': props.seasonId,
            'friendlyName': props.friendlyName,
            'description': props.description,
            'bannerLink': props.bannerLink,
            'simulator': props.simulator,
            'callbackFn': props.callbackFn,
            'active': props.active
        }
    }

    getButtonText() {
        if (this.state.active) {
            return "Information & Sign up"
        }
        return "Information"
    }

    render() {
        return (
            <Card style={{margin: '0.2rem'}}>
                <Card.Img variant="top rounded" src={this.state.bannerLink}/>
                <Card.Body>
                    <Card.Title>{this.state.friendlyName}</Card.Title>
                    <Button onClick={() => this.state.callbackFn()}>{this.getButtonText()}</Button>
                </Card.Body>
            </Card>
        )
    }
}

export default SeasonCard;
