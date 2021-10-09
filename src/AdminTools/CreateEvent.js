import React, { useRef, useState, useEffect } from 'react'
import Select from 'react-select'
import { Form, Button, Alert } from 'react-bootstrap'

export default function CreateEvent() {
    const eventIdRef = useRef()
    const eventFriendlyNameRef = useRef()
    const qualyDurationRef = useRef()
    const raceDurationRef = useRef()
    const dateRef = useRef()
    const startTimeRef = useRef()
    const [selectedTrack, setSelectedTrack] = useState('')
    const [trackList, setTrackList] = useState()
    const [responseCode, setResponseCode]= useState()
    const [error, setError] = useState()
    const [success, setSuccess] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch('https://backend.isdaracing.com/get_all_tracks')
        .then( response => response.json())
        .then( data => {
            let trackList = []
            data['tracks'].map((track) => {
                return trackList.push({
                    value: track['id'],
                    label: track['friendly_name']
                })
            })
            setTrackList(trackList)
        });
        return
    }, []);

    
    function submitEvent(e) {
        e.preventDefault()
        try {
            setError('')
            setSuccess('')
            setLoading(true)
            fetch('https://backend.isdaracing.com/create_event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'id': eventIdRef.current.value,
                    'friendly_name': eventFriendlyNameRef.current.value,
                    'track': selectedTrack,
                    'session_type': 'race',
                    'sessions': [
                        {
                            'type': 'q',
                            'duration': qualyDurationRef.current.value,
                            'duration_type': 'min',
                            'time_progression': 1,
                            'weather': 'clear'
                        },
                        {
                            'type': 'r',
                            'duration': raceDurationRef.current.value,
                            'duration_type': 'min',
                            'time_progression': 1,
                            'weather': 'clear'
                        }
                    ],
                    'results': {
                        'fp': [],
                        'q': [],
                        'r': []
                    },
                    'date': dateRef.current.value,
                    'race_start_time': startTimeRef.current.value
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
        } catch (error) {
            console.trace()
            console.error(error)
            setError('Failed to submit an incident report')
        }
        setLoading(false)
    }

    return (
        <div>
            <h2>Event Scheduler</h2>
            <Form onSubmit={submitEvent}>
                <Form.Group>
                    <Form.Label>Event ID</Form.Label>
                    <Form.Control as="textarea" rows={1} ref={eventIdRef}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Event name</Form.Label>
                    <Form.Control as="textarea" rows={1} ref={eventFriendlyNameRef}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Date - use format YYYY-MM-DD</Form.Label>
                    <Form.Control as="textarea" rows={1} ref={dateRef}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Start time (CEST) - use format HH:MM</Form.Label>
                    <Form.Control as="textarea" rows={1} ref={startTimeRef}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Track</Form.Label>
                    <Select options={trackList} onChange={(track) => setSelectedTrack(track.value)} placeholder="Select track"></Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Qualifying Duration (minutes)</Form.Label>
                    <Form.Control as="textarea" rows={1} ref={qualyDurationRef}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Race Duration (minutes)</Form.Label>
                    <Form.Control as="textarea" rows={1} ref={raceDurationRef}/>
                </Form.Group>
                {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
                {success && <Alert variant="success" className="mt-4">{success}</Alert>}
                <Button type="submit" disabled={loading}>Submit</Button>
            </Form>
        </div>
    )
}