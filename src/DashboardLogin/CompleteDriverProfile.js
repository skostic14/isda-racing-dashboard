import React, { useRef, useEffect } from 'react'
import { useStateIfMounted } from 'use-state-if-mounted'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../Authentication/AuthContext'
import { useHistory } from 'react-router-dom'

export default function CompleteDriverProfile() {
    const nameRef = useRef()
    const surnameRef = useRef()
    const shortnameRef = useRef()
    const steamIDRef = useRef()
    const discordIDRef = useRef()
    const countryRef = useRef()
    const { currentUser, currentUserToken } = useAuth()
    const [error, setError] = useStateIfMounted()
    const [successMessage, setSuccessMessage] = useStateIfMounted()
    const [statusCode, setStatusCode] = useStateIfMounted()
    const [loading, setLoading] = useStateIfMounted()
    const [existingDriver, setExistingDriver] = useStateIfMounted()
    const history = useHistory()

    useEffect(() => {
        if (currentUser === undefined) {
            history.push('/login')
        }
        setLoading(false)
        setExistingDriver(false)
        return currentUser
    }, []);

    function handleSubmitNewDriver(e) {
        e.preventDefault()
  
        try {
            setError('')
            setSuccessMessage('')
            setLoading(true)
            const driverData = {
                'steamid': steamIDRef.current.value,
                'name': nameRef.current.value,
                'surname': surnameRef.current.value,
                'nickname': shortnameRef.current.value,
                'country': countryRef.current.value,
                'discordid': discordIDRef.current.value,
                'token': currentUserToken
            }
            if (shortnameRef.current.value.length !== 3) {
                setError('Abbreviation must be three letters long')
            }

            if (steamIDRef.current.value.length !== 17) {
                setError('Steam ID must contain 17 digits')
            }

            if (!(discordIDRef.current.value.includes('#'))) {
                setError('Discord ID must contain the ID number')
            }

            if (discordIDRef.current.value.length < 6) {
                setError('Discord ID too short')
            }

            if (countryRef.current.value.length !== 2) {
                setError('Country code must be two letters long')
            }
            if (error === '') {
                fetch('https://backend.isdaracing.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(driverData)
                }).then(response => {
                    setStatusCode(response.status)
                    return response.json()
                }).then(data => {
                    if (statusCode === 200) {
                        setSuccessMessage(data['message'])
                        history.push('/')
                    } else {
                        setError(data['message'])
                    }
                })
            }
        } catch(e) {
            setError('Failed to log in')
        }
        setLoading(false)   
    }

    function handleSubmitExistingDriver(e) {
        e.preventDefault()
  
        try {
            setError('')
            setSuccessMessage('')
            setLoading(true)
            const driverData = {
                'steamid': steamIDRef.current.value,
                'token': currentUserToken
            }

            if (steamIDRef.current.value.length !== 17) {
                setError('Steam ID must contain 17 digits')
            }

            if (error === '') {
                fetch('https://backend.isdaracing.com/connect_uid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(driverData)
                }).then(response => {
                    setStatusCode(response.status)
                    return response.json()
                }).then(data => {
                    if (statusCode === 200) {
                        setSuccessMessage(data['message'])
                        history.push('/')
                    } else {
                        setError(data['message'])
                    }
                })
            }
        } catch(e) {
            setError('Failed to log in')
        }
        setLoading(false)   
    }

    function changeExistingDriverStatus() {
        setExistingDriver(!existingDriver)
    }

    return (
        <div>
            {!existingDriver && <Card className="align-center w-50">
                <Card.Body>
                    <Button className="w-25 btn btn-light btn-outline-primary" disabled={loading} onClick={changeExistingDriverStatus}>Already registered at ISDA?</Button>
                    <h2 className="text-center mt-4 mb-4">Enter your details</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    <Form onSubmit={handleSubmitNewDriver}>
                        <Form.Group id="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" ref={nameRef} required></Form.Control>
                        </Form.Group>
                        <Form.Group id="surname">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control type="text" ref={surnameRef} required></Form.Control>
                        </Form.Group>
                        <Form.Group id="shortname">
                            <Form.Label>Three-letter abbreviation</Form.Label>
                            <Form.Control type="text" ref={shortnameRef} required></Form.Control>
                        </Form.Group>
                        <Form.Group id="steamid">
                            <Form.Label>Steam ID</Form.Label>
                            <Form.Control type="text" ref={steamIDRef} required></Form.Control>
                        </Form.Group>
                        <Form.Group id="discordid">
                            <Form.Label>Discord ID (e.g. ISDA#0101)</Form.Label>
                            <Form.Control type="text" ref={discordIDRef} required></Form.Control>
                        </Form.Group>
                        <Form.Group id="countrycode">
                            <Form.Label>Country (two-letter code)</Form.Label>
                            <Form.Control type="text" ref={countryRef} required></Form.Control>
                        </Form.Group>
                        <Button type="submit" className="w-25" disabled={loading}>Submit</Button>
                    </Form>
                </Card.Body>
            </Card>
            }
            {existingDriver && <Card className="align-center w-50">
                <Card.Body>
                    <Button className="center w-50 btn btn-light btn-outline-primary" disabled={loading} onClick={changeExistingDriverStatus}>New to ISDA?</Button>
                    <h2 className="text-center mt-4 mb-4">Enter your Steam ID to connect the profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    <Form onSubmit={handleSubmitExistingDriver}>
                        <Form.Group id="steamid">
                            <Form.Label>Steam ID</Form.Label>
                            <Form.Control type="text" ref={steamIDRef} required></Form.Control>
                        </Form.Group>
                        <Button type="submit" className="w-25" disabled={loading}>Submit</Button>
                    </Form>
                </Card.Body>
            </Card>
            }
        </div>
    )
}