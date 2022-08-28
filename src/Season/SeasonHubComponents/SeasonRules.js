import React, {Component} from 'react';
import { Table } from 'react-bootstrap';

class SeasonRules extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            'mandatoryPitCount': props.seasonRules.mandatory_pit_count,
            'minDriversInCar': props.seasonRules.min_drivers_in_car,
            'maxDriversInCar': props.seasonRules.max_drivers_in_car,
            'maxStintTime': props.seasonRules.max_stint_time,
            'refuellingAllowed': props.seasonRules.refueling,
            'pointsSystemRace': props.seasonRules.points.r,
            'pointsSystemFastestLap': props.seasonRules.points.fastest_lap,
            'pointsSystemQualifying': props.seasonRules.points.q 
        }
    }

    getPointsSystemRace() {
        let pointsSystemRows = []
        let positionCounter = 0
        pointsSystemRows.push(
            <tr>
                <td><b>Position</b></td>
                <td><b>Points</b></td>
            </tr>
        )
        this.state.pointsSystemRace.map((point) => {
            return pointsSystemRows.push(
                <tr>
                    <td>{++positionCounter}</td>
                    <td>{point}</td>
                </tr>
            )
        })
        return (<Table striped bordered>{pointsSystemRows}</Table>)
    }

    getPointsSystemQualifying() {
        let pointsSystemRows = []
        let positionCounter = 0
        pointsSystemRows.push(
            <tr>
                <td><b>Position</b></td>
                <td><b>Points</b></td>
            </tr>
        )
        this.state.pointsSystemQualifying.map((point) => {
            return pointsSystemRows.push(
                <tr>
                    <td>{++positionCounter}</td>
                    <td>{point}</td>
                </tr>
            )
        })
        return (<Table striped bordered>{pointsSystemRows}</Table>)
    }

    getDriversPerCar() {
        if (this.state.minDriversInCar === this.state.maxDriversInCar) {
            return this.state.minDriversInCar
        }

        return `${this.state.minDriversInCar} - ${this.state.maxDriversInCar}`
    }

    getRefuelingAllowed() {
        if (this.state.refuellingAllowed === 0) {
            return "No"
        }
        return "Yes"
    }

    render() {
        return (
            <div>
                <h3>General Rules</h3>
                <Table striped bordered>
                    <tr>
                        <td>Mandatory Pit Count (can vary between races)</td>
                        <td>{this.state.mandatoryPitCount}</td>
                    </tr>
                    <tr>
                        <td>Refuelling Allowed (can vary between races)</td>
                        <td>{this.getRefuelingAllowed()}</td>
                    </tr>
                    <tr>
                        <td>Drivers per car</td>
                        <td>{this.getDriversPerCar()}</td>
                    </tr>
                    <tr>
                        <td>Rolling Start</td>
                        <td>Yes</td>
                    </tr>
                    <tr>
                        <td>Stewarding</td>
                        <td>Live + Post Race Inquiries</td>
                    </tr>
                </Table>
                <hr/>
                <h3>Points System</h3>
                <Table bordered size="md">
                    <thead>
                    <tr>
                        <td><h4>Qualifying</h4></td>
                        <td><h4>Race</h4></td>
                        <td><h4>Fastest Lap</h4></td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{this.getPointsSystemQualifying()}</td>
                        <td>{this.getPointsSystemRace()}</td>
                        <td>{this.state.pointsSystemFastestLap}</td>
                    </tr>
                    </tbody>
                </Table>
            </div>
        )
    }

}

export default SeasonRules;
