import React, { useRef, useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../Authentication/AuthContext'
import { Link } from 'react-router-dom'

export default function PasswordReset() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState()
    const [success, setSuccess] = useState()
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
  
        try {
            setError('')
            setSuccess('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setSuccess('Check your Email to reset password')
        } catch {
            setError('Failed to send reset password')
        }
        setLoading(false)   
    }

    return (
        <div>
            <Card className="w-25 center">
                <Card.Body>
                    <h2 className="text-center mb-4">Password reset</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required></Form.Control>
                        </Form.Group>
                        <Button type="submit" className="w-100" disabled={loading}>Reset password</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-25 text-center mt-2"><Link to="/login">Log in</Link></div>
        </div>
    )
}