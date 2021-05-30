import React, {Component} from 'react';
import Select from 'react-select';
import './RaceResults.css';
import DriverStanding from './DriverStanding.js';

class SeasonStandings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            'available_seasons': [],
            'driver_standings': {},
            'team_standings': [],
            'races': [],
            'display': 'teams',
            'isMulticlass': false
        }
    }

    componentDidMount() {
        this.getAvailableSeasons();
    }

    getAvailableSeasons = () => {
        fetch('https://backend.isdaracing.com/get_available_seasons/')
            .then( response => response.json())
            .then( data => this.setState({available_seasons: data['seasons']}));
    }

    getSeasonResults = (seasonID) =>  {
        this.setState({display: ''})
        fetch('https://backend.isdaracing.com/get_season_standings?id=' + seasonID['value'])
            .then(response => response.json())
            .then(data => {
                let multiclass = true
                if (Array.isArray(data['driver_standings'])) {
                    multiclass = false
                }
                this.setState({driver_standings: data['driver_standings'], races: data['races'], team_standings: data['team_standings'], isMulticlass: multiclass})

                console.log(this.state.driver_standings)
            });
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
        if (true) {
            let positionCounter = 0;
            console.log(this.state.display)
            switch (this.state.display) {
                case 'Driver Standings': 
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
                    break
                case 'Driver Standings - PRO':
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
                            this.state.driver_standings['pro'].map((driver) => {
                                    return(<DriverStanding position={++positionCounter} driverName={driver['name']} team={driver['team']} 
                                                            results={driver['results']} points={driver.points}></DriverStanding>)
                            }) 
                            }
                        </table>
                    )
                    break
                case 'Driver Standings - AM':
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
                            this.state.driver_standings['am'].map((driver) => {
                                    return(<DriverStanding position={++positionCounter} driverName={driver['name']} team={driver['team']} 
                                                            results={driver['results']} points={driver.points}></DriverStanding>)
                            }) 
                            }
                        </table>
                    )
                    break
                    case 'Driver Standings - SILVER':
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
                                this.state.driver_standings['silver'].map((driver) => {
                                        return(<DriverStanding position={++positionCounter} driverName={driver['name']} team={driver['team']} 
                                                                results={driver['results']} points={driver.points}></DriverStanding>)
                                }) 
                                }
                            </table>
                        )
                        break
                case 'Team Standings': 
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
                    break
                case 'Team Standings - PRO': 
                    standingsTable = (
                        <table className='ResultsTable'>
                            <tr className="ResultsTableHeader">
                                <td>Position</td>
                                <td>Team</td>
                                <td>Points</td>
                            </tr>
                            {
                                this.state.team_standings['pro'].map((team) => {
                                        return(<tr><td>{++positionCounter}</td><td>{team['name']}</td><td>{team['points']}</td></tr>)
                                }) 
                            }
                        </table>
                    )
                    break
                case 'Team Standings - AM': 
                    standingsTable = (
                        <table className='ResultsTable'>
                            <tr className="ResultsTableHeader">
                                <td>Position</td>
                                <td>Team</td>
                                <td>Points</td>
                            </tr>
                            {
                                this.state.team_standings['am'].map((team) => {
                                        return(<tr><td>{++positionCounter}</td><td>{team['name']}</td><td>{team['points']}</td></tr>)
                                }) 
                            }
                        </table>
                    )
                    break
                case 'Team Standings - SILVER': 
                    standingsTable = (
                        <table className='ResultsTable'>
                            <tr className="ResultsTableHeader">
                                <td>Position</td>
                                <td>Team</td>
                                <td>Points</td>
                            </tr>
                            {
                                this.state.team_standings['silver'].map((team) => {
                                        return(<tr><td>{++positionCounter}</td><td>{team['name']}</td><td>{team['points']}</td></tr>)
                                }) 
                            }
                        </table>
                    )
                    break
            }
        }

        let availableStandingsArray = [];

        if (this.state.isMulticlass) {
            console.log(this.state.driver_standings)
            if (this.state.driver_standings['pro']) {
                availableStandingsArray.push(
                    {
                        value: 'Driver Standings - PRO',
                        label: 'Driver Standings - PRO'
                    }
                );
            }
            if (this.state.driver_standings['am']) {
                availableStandingsArray.push(
                    {
                        value: 'Driver Standings - AM',
                        label: 'Driver Standings - AM'
                    }
                );
            }

            if (this.state.driver_standings['silver']) {
                availableStandingsArray.push(
                    {
                        value: 'Driver Standings - SILVER',
                        label: 'Driver Standings - SILVER'
                    }
                );
            }
        }
        else if (this.state.driver_standings.length) {
            availableStandingsArray.push(
                {
                    value: 'Driver Standings',
                    label: 'Driver Standings'
                }
            );
        }

        if (this.state.isMulticlass) {
            if (this.state.team_standings['pro']) {
                availableStandingsArray.push(
                    {
                        value: 'Team Standings - PRO',
                        label: 'Team Standings - PRO'
                    }
                );
            }
            if (this.state.team_standings['am']) {
                availableStandingsArray.push(
                    {
                        value: 'Team Standings - AM',
                        label: 'Team Standings - AM'
                    }
                );
            }
            if (this.state.team_standings['silver']) {
                availableStandingsArray.push(
                    {
                        value: 'Team Standings - SILVER',
                        label: 'Team Standings - SILVER'
                    }
                );
            }
        }
        else if (this.state.team_standings.length) {
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