import React, {Component} from 'react';
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

    getAvailableRaceResults = () => {
        fetch('https://backend.isdaracing.com/get_available_race_results/')
        .then( response => response.json())
        .then( data => this.setState({available_race_results: data['races']}));
    }

    getRaceResults = (raceID) =>  {
        fetch('https://backend.isdaracing.com/get_race_results?id=' + raceID + '&session=r').
            then(response => response.json()).
            then(data => this.setState({current_race_data: data['race_data'], results: data['results']}));
    }

    render() {
        
        this.getAvailableRaceResults();
        this.getRaceResults('ACC_Pcup_S0_hungaroring');

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
                {raceResultsTable}
            </div>
        )
    }
}

export default RaceResults;