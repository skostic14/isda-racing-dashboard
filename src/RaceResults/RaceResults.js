import React, {Component} from 'react';
import Select from 'react-select';
import './RaceResults.css';
import CarPosition from './CarPosition.js';

class RaceResults extends Component {

    constructor(props) {
        super(props)
        this.state = {
            'available_race_results': [],
            'current_race_data': {},
            'results': []
        }
    }

    componentDidMount() {
        this.getAvailableRaceResults();
    }

    getAvailableRaceResults = () => {
        fetch('https://backend.isdaracing.com/get_available_race_results/')
        .then( response => response.json())
        .then( data => this.setState({available_race_results: data['races']}));
    }

    getRaceResults = (raceID) =>  {
        fetch('https://backend.isdaracing.com/get_race_results?id=' + raceID['value'] + '&session=r').
            then(response => response.json()).
            then(data => this.setState({current_race_data: data['race_data'], results: data['results']}));
    }

    render() {
        let availableRaceResults = null;
        if (this.state.available_race_results.length > 0) {
            let availableRacesArray = []
            this.state.available_race_results.map((race) => {
                return availableRacesArray.push({
                    value: race['id'],
                    label: race['name']
                });
            });

            availableRaceResults = (<Select options={availableRacesArray} onChange={this.getRaceResults}/>)
        }

        let raceResultsTable = null;
        if (this.state.results.length > 0) {
            let positionCounter = 0;
            raceResultsTable = (
                <table>
                    <tr>
                        <td>Position</td>
                        <td>Driver</td>
                        <td>Car number</td>
                        <td>Total Time</td>
                        <td>Gap</td>
                        <td>Laps</td>
                        <td>Fastest lap</td>
                    </tr>
                    {
                       this.state.results.map((car) => {
                            const firstDriverName = car['drivers'][0]['name']
                            return(<CarPosition position={++positionCounter} driverName={firstDriverName} 
                                                carNumber={car.race_number} fastestLap={car['fastest_lap']}
                                                totalTime={car['total_time']} gap={car['gap']} laps={car['laps']}></CarPosition>)
                       }) 
                    }
                </table>
            )
        }

        return (
            <div>
                <h1>Race results</h1>
                {availableRaceResults}
                {raceResultsTable}
            </div>
        )
    }
}

export default RaceResults;