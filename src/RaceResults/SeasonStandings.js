import React, {Component} from 'react';
import Select from 'react-select';
import './RaceResults.css';
//import './SeasonStandings.css'
import DriverStanding from './DriverStanding.js';

class SeasonStandings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            'available_seasons': [],
            'driver_standings': {},
            'team_standings': [],
            'races': [],
            'display': 'teams'
        }
    }

    componentDidMount() {
        this.getAvailableSeasons();
    }

    getAvailableSeasons = () => {
        fetch('https://backend.isdaracing.com/get_available_seasons/')
        //fetch('http://localhost:3010/get_available_seasons/')
            .then( response => response.json())
            .then( data => this.setState({available_seasons: data['seasons']}));
    }

    getSeasonResults = (seasonID) =>  {
        fetch('https://backend.isdaracing.com/get_season_standings?id=' + seasonID['value']).
        //fetch('http://localhost:3010/get_season_standings?id=' + seasonID['value'])
            .then(response => response.json())
            .then(data => this.setState({driver_standings: data['driver_standings'], races: data['races'], team_standings: data['team_standings']}));
    }

    handleStandingsSelectChange = (selected) => {
        this.setState({display: selected['value']})
    }

    render() {
        let availableSeasons = null;
        if (this.state.available_seasons.length > 0) {
            let availableSeasonsArray = []
            this.state.available_seasons.map((season) => {
                return availableSeasonsArray.push({
                    value: season['id'],
                    label: season['name']
                });
            });

            availableSeasons = (<Select className="RaceSelect" 
                                    options={availableSeasonsArray} 
                                    onChange={this.getSeasonResults} 
                                    isSearchable={false}/>)
        }

        let standingsTable = null;
        if (this.state.driver_standings.length > 0) {
            let positionCounter = 0;
            if (this.state.display === 'Driver Standings') {
                standingsTable = (
                    <table className="ResultsTable">
                        <tr className="ResultsTableHeader">
                            <td>Position</td>
                            <td>Driver</td>
                            <td>Team</td>
                            {
                                this.state.races.map((race) => {
                                    return (<td>{race}</td>)
                                })
                            }
                            <td>Points</td>
                        </tr>
                        {
                        this.state.driver_standings.map((driver) => {
                                return(<DriverStanding position={++positionCounter} driverName={driver['name']} team={driver['team']} 
                                                        results={driver['results']} points={driver.points}></DriverStanding>)
                        }) 
                        }
                    </table>
                )
            }

            else if (this.state.display === 'Team Standings') {
                standingsTable = (
                    <table className='ResultsTable'>
                        <tr className="ResultsTableHeader">
                            <td>Position</td>
                            <td>Team</td>
                            <td>Points</td>
                        </tr>
                        {
                            this.state.team_standings.map((team) => {
                                    return(<tr><td>{++positionCounter}</td><td>{team['name']}</td><td>{team['points']}</td></tr>)
                            }) 
                        }
                    </table>
                )
            }
        }

        let availableStandingsArray = [];
        if (this.state.driver_standings.length > 0) {
            availableStandingsArray.push(
                {
                    value: 'Driver Standings',
                    label: 'Driver Standings'
                }
            );
        }

        if (this.state.team_standings.length > 0) {
            availableStandingsArray.push(
                {
                    value: 'Team Standings',
                    label: 'Team Standings'
                }
            );
        }

        let standingsSelect = null;
        if (availableStandingsArray.length > 0) {
            standingsSelect = (<Select className="StandingsSelect" 
                                        options={availableStandingsArray} 
                                        onChange={this.handleStandingsSelectChange} 
                                        isSearchable={false}
                                        placeholder={'Select available standings'}/>)
        }

        return (
            <div className="RaceResults">
                {availableSeasons}
                {standingsSelect}
                {standingsTable}
            </div>
        )
    }
}

export default SeasonStandings;