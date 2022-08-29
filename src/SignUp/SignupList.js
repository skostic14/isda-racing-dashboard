import React, { useState, useEffect, Component } from 'react';
import Select from 'react-select';

class SignUpList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            seasons: [],
            entryList: [],
            preselectSeason: props.season
        }
    }

    getAvailableSeasons() {
        fetch('https://backend.isdaracing.com/get_available_seasons/')
            .then( response => response.json())
            .then( data => {
                let availableSeasonsArray = []
                if (data['seasons'].length > 0) {
                data['seasons'].map((season) => {
                    return availableSeasonsArray.push({
                        value: season['id'],
                        label: season['name']
                    });
                });
                this.setState({seasons: availableSeasonsArray})
                }
            })
    }

    getEntryList(season) {
        fetch('https://backend.isdaracing.com/get_registered_teams?season=' + season)
        .then( response => response.json())
        .then( data => this.setState({entryList: data['teams']}))
    }

    componentDidMount() {
        if (this.state.preselectSeason) {
            this.getEntryList(this.state.preselectSeason)
        }
        else {
            this.getAvailableSeasons()
        }
    }

    render() {
        return (
        <div>
            {!(this.state.preselectSeason) && (<h2 className="mt-2">Season entry lists</h2>)}
            {!(this.state.preselectSeason) && (<Select className="RaceSelect mt-2" options={this.state.seasons} onChange={(s) => this.getEntryList(s.value)} isSearchable={false} placeholder="Select season"/>)}
            <table className="table mt-4 w-100">
                <thead>
                    <tr>
                        <th>Driver(s)</th>
                        <th>Team name</th>
                        <th>Car</th>
                        <th>Car number</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.entryList?.map((entry) => {
                            const drivers = entry['drivers']
                            const team_name = entry['team_name']
                            const car = entry['car_name']
                            const carNumber = entry['entry_number']

                            let driversString = ""
                            drivers.map((driver) => {
                                driversString += driver['name']
                                driversString += " / "
                                return
                            })

                            return(
                                <tr>
                                    <td>{driversString.slice(0, driversString.length - 3)}</td>
                                    <td>{team_name}</td>
                                    <td>{car}</td>
                                    <td>{carNumber}</td>    
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
        )
    }

}

export default SignUpList;
