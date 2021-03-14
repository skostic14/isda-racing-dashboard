import React, { useRef, useEffect } from 'react'
import { useStateIfMounted } from 'use-state-if-mounted'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../Authentication/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login, currentUser, setCurrentDriver } = useAuth()
    const [error, setError] = useStateIfMounted()
    const [loading, setLoading] = useStateIfMounted(false)
    const history = useHistory()

    useEffect(() => {
        if (currentUser && currentUser !== undefined) {
            history.push('/logout')
        }
        return currentUser
    }, []);

    async function handleSubmit(e) {
        e.preventDefault()
  
        function checkUid(token) {
            fetch('https://backend.isdaracing.com/check_uid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'token': token})
            })
            .then( response => response.json())
            .then( data => {
                if (data['driver'] === null) {
                    history.push('/complete_profile')
                }
                else {
                    setCurrentDriver(data['driver']['name'])
                    history.push('/')
                }
            })
        }

        function displayError(message) {
            setError(message)
        }

        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value, checkUid, displayError)     
        } catch {
            setError('Failed to log in')
        }
        setLoading(false)
    }

    return (
        <div>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Log in</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required></Form.Control>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required></Form.Control>
                        </Form.Group>
                        <Button type="submit" className="w-100" disabled={loading}>Log in</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">Don't have an account? <Link to="/sign_up">Sign up</Link></div>
        </div>
    )
}