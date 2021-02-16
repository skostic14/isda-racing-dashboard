import React, {Component} from 'react';
import './Calendar.css';

class Calendar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            'upcoming_races': []
        }
    }

    componentDidMount() {
        this.getUpcomingRaces();
    }

    getUpcomingRaces = () => {
        fetch('https://backend.isdaracing.com/get_upcoming_races/')
        .then( response => response.json())
        .then( data => this.setState({upcoming_races: data['races']}));
    }

    render() {
        let upcomingRaceList = null;
        if (this.state.upcoming_races.length > 0) {
            upcomingRaceList = (
                <table className='ResultsTable'>
                    <tr className='ResultsTableHeader'>
                        <td>Date</td>
                        <td>Time (CET)</td>
                        <td>Race</td>
                        <td>Track</td>
                        <td>Q</td>
                        <td>R</td>
                        <td></td>
                    </tr>
                    {
                        this.state.upcoming_races.map((race) => {
                            const qualySessionData = race['sessions'].find(function(item) {return item['type'] === 'q'});
                            const raceSessionData = race['sessions'].find(function(item) {return item['type'] === 'r'});
                            
                            let qualyDuration = qualySessionData['duration'];
                            if (qualySessionData['duration_type'] === 'min') {
                                qualyDuration += '\'';
                            }

                            let raceDuration = raceSessionData['duration'];
                            if (raceSessionData['duration_type'] === 'min') {
                                raceDuration += '\'';
                            }

                            return (
                                <tr>
                                    <td>{race['date']}</td>
                                    <td>{race['start_time']}</td>
                                    <td>{race['name']}</td>
                                    <td>{race['track']}</td>
                                    <td>{qualyDuration}</td>
                                    <td>{raceDuration}</td>
                                    <td>Click here to join kurwa</td>
                                </tr>
                            );
                        })
                    }
                </table>
            )
        }
        return (
            <div className="RaceResults">
                <h2>Upcoming races</h2>
                {upcomingRaceList}
            </div>
        )
    }
}

export default Calendar;