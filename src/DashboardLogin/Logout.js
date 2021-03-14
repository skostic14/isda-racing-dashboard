import React, { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import { useAuth } from '../Authentication/AuthContext'
import { useHistory } from 'react-router-dom'

export default function Logout() {
    const { currentUser, logout } = useAuth()
    const [error, setError] = useState()
    const history = useHistory()

    useEffect(() => {
        async function logOut() {
            await logout()
            history.push('/login')
        }
        logOut()
        return currentUser
    }, []);

    return (
        <div>
            <h2 className="text-center mb-4">Logging out</h2>
            {error && <Alert variant="danger">{error}</Alert>}
        </div>
    )
}