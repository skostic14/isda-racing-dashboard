import React, { useState, useEffect } from 'react';
import Select from 'react-select';

export default function SignupList() {

    const [seasons, setSeasons] = useState()
    const [entryList, setEntryList] = useState()

    useEffect(() => {
        getAvailableSeasons()
    }, [])

    function getAvailableSeasons() {
        fetch('http://localhost:3010/get_available_seasons/')
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
                setSeasons(availableSeasonsArray)
                }
            })
    }

    function getEntryList(season) {
        setEntryList([])
        fetch('http://localhost:3010/get_registered_teams?season=' + season)
        .then( response => response.json())
        .then( data => setEntryList(data['teams']));
    }

    return (
        <div>
            <h2 className="mt-2">Season entry lists</h2>
            <Select className="RaceSelect mt-2" options={seasons} onChange={(s) => getEntryList(s.value)} isSearchable={false} placeholder="Select season"/>
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
                        entryList?.map((entry) => {
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