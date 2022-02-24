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
    const season='ACC_SuperTrofeo_S1'

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
            <h3 className="text-center mt-4 mb-4">Sign up for ACC - 2022 ISDA Lamborghini SuperTrofeo - Winter Season</h3>
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
            <h5 className="text-left mt-4 mb-4 w-50">
            Dear driver,
            <br/><br/>
            We are a non-profit organisation with no sponsors. We keep the servers, site and pay for commentators thanks to donations and from our own pockets. 
            <br/>We do our utmost to keep this place awesome, but we need your support to keep this place rolling!
            <br/><br/>
            <ul>
                <li><a href="https://www.patreon.com/isdaracing">Become our Patreon</a></li>
                <li><a href="https://paypal.me/isdaracing">Donate with PayPal</a></li>
            </ul>
            There are also some perks for our donators, check our Discord for more information.
            <br/><br/>
            Godspeed!
            </h5>
        </div>
    )
}