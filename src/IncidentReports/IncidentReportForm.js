import React, { useRef, useState, useEffect } from 'react'
import Select from 'react-select'
import { Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../Authentication/AuthContext'

export default function IncidentReportForm() {

    const [selectedRace, setSelectedRace] = useState('')
    const locationRef = useRef()
    const [selectedDrivers, setSelectedDrivers] = useState()
    const descRef = useRef()

    const { currentUser, currentUserToken } = useAuth()
    const [seasonList, setSeasonList] = useState()
    const [entryList, setEntryList] = useState()
    const [raceList, setRaceList] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const [success, setSuccess] = useState()
    const [responseCode, setResponseCode] = useState()

    useEffect(() => {
        fetch('https://backend.isdaracing.com/get_available_seasons/')
        .then( response => response.json())
        .then( data => {
            let seasonList = [];
            data['seasons'].map((season) => {
                return seasonList.push({
                    value: season['id'],
                    label: season['name'],
                    races: season['races']
                })
            })
            setSeasonList(seasonList)
        });
        return currentUser
    }, []);

    function getEntryList(season_id) {
        fetch('https://backend.isdaracing.com/get_registered_teams?season=' + season_id)
        .then( response => response.json())
        .then( data => {
            let entries = [];
            data['teams'].map((entry) => {
                let driversString = ""
                entry['drivers'].map((driver) => {
                    driversString += driver['name']
                    driversString += " / "
                    return
                })

                return entries.push({
                    value: entry['id'],
                    label: entry['entry_number'] + ' | ' + driversString.slice(0, driversString.length - 3)
                })
            })
            setEntryList(entries)
        });
    }

    function handleSeasonSelect(season_id) {
        const season = seasonList.find(({value}) => value === season_id)
        getEntryList(season_id)
        let races = []
        season['races'].map((race) => {
            return races.push({
                value: race['id'],
                label: race['friendly_name']
            })
        })
        setRaceList(races)
    }

    function submitReport(e) {
        e.preventDefault()
        try {
            setError('')
            setSuccess('')
            setLoading(true)
            fetch('https://backend.isdaracing.com/submit_report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'race': selectedRace,
                    'involved_cars': selectedDrivers,
                    'location': locationRef.current.value,
                    'description': descRef.current.value,
                    'token': currentUserToken
                })
            })
            .then(response => {
                setResponseCode(response.status)
                return response.json()
            })
            .then(data => {
                if (responseCode === 200 ) {
                    setSuccess('Incident report filed successfully')
                }
                else {
                    setError(data['message'])
                }
            })
        } catch {
            setError('Failed to submit an incident report')
        }
        setLoading(false)
    }

    return (
        <div>
            <Form onSubmit={submitReport}>
                <Form.Group>
                    <Form.Label>Season</Form.Label>
                    <Select options={seasonList} onChange={(season) => handleSeasonSelect(season.value)} placeholder="Select season"/>
                </Form.Group>
                <Form.Group id="race">
                    <Form.Label>Race</Form.Label>
                    <Select options={raceList} placeholder="Select race" onChange={(race) => setSelectedRace(race.value)}></Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label>When did the accident happen (Lap and Turn)</Form.Label>
                    <Form.Control as="textarea" rows={1} ref={locationRef}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Which cars were involved?</Form.Label>
                    <Select options={entryList} isMulti placeholder="Select cars involved" onChange={(driver) => setSelectedDrivers(driver)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Describe the incident from your point of view</Form.Label>
                    <Form.Control as="textarea" rows={5} ref={descRef}/>
                </Form.Group>
                <Button type="submit" disabled={loading}>Submit</Button>
                {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
                {success && <Alert variant="success" className="mt-4">{success}</Alert>}
            </Form>
        </div>
    )
}