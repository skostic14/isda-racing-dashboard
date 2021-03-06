import React, { useRef, useState, useEffect } from 'react'
import Select from 'react-select'
import { Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../Authentication/AuthContext'
import { useHistory } from 'react-router-dom'

export default function GT3Signup() {
    const teamNameRef = useRef()
    const carNumberRef = useRef()
    const { currentUser, currentDriver } = useAuth()
    const [error, setError] = useState()
    const [success, setSuccess] = useState()
    const [carOptions, setCarOptions] = useState()
    const [car, setCar] = useState()
    const [loading, setLoading] = useState(false)
    const [responseCode, setResponseCode] = useState()
    const history = useHistory()
    const season='ACC_GT3_S1'

    useEffect(() => {
        if (currentDriver === undefined || !currentDriver) {
            history.push('/login')
        }
        fetch('https://backend.isdaracing.com/get_car_options?season=' + season)
        .then( response => response.json())
        .then( data => {
            let carSelectOptions = [];
            data['cars'].map((car) => {
                return carSelectOptions.push({
                    value: car['id'],
                    label: car['friendly_name']
                })
            })
            setCarOptions(carSelectOptions)
        });
        return currentUser
    }, []);

    function submitCarSelection(e) {
        e.preventDefault()

        if (carNumberRef.current.value < 1 || carNumberRef.current.value > 999) {
            return(setError('Car number must be between 1 and 999'))
        }

        if (car === undefined || car === '') {
            return(setError('Please select a car'))
        }
        
        try {
            setError('')
            setSuccess('')
            setLoading(true)
            fetch('https://backend.isdaracing.com/team_signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'season': season,
                    'car': car,
                    'car_number': carNumberRef.current.value,
                    'teamname': teamNameRef.current.value,
                    'drivers': [
                        currentDriver
                    ]
                })
            })
            .then(response => {
                setResponseCode(response.status)
                return response.json()
            })
            .then(data => {
                if (responseCode === 200 ) {
                    setSuccess('Team registered successfully')
                }
                else {
                    setError(data['message'])
                }
            })
        } catch {
            setError('Failed to register for the season')
        }
        setLoading(false) 
    }

    return (
        <div align="center">
            <h2 className="text-center mt-4 mb-4">Sign up for 2021 ISDA GT3 World Challenge - Spring Season</h2>
            <Form className="mb-4 w-50" onSubmit={submitCarSelection}>
                <Form.Group id="car">
                    <Form.Label>Car Type</Form.Label>
                    <Select className="CarSelect" options={carOptions} onChange={(selectedCar) => setCar(selectedCar.value)} placeholder="Select car"/>
                </Form.Group>
                <Form.Group id="number">
                    <Form.Label>Car Number</Form.Label>
                    <Form.Control type="number" ref={carNumberRef} required></Form.Control>
                </Form.Group>
                <Form.Group id="teamname">
                    <Form.Label>Team Name</Form.Label>
                    <Form.Control type="text" ref={teamNameRef} required></Form.Control>
                </Form.Group>
                <Button type="submit" disabled={loading}>Submit</Button>
            </Form>
            {error && <Alert variant="danger" className="w-50">{error}</Alert>}
            {success && <Alert variant="success" className="w-50">{success}</Alert>}
        </div>
    )
}