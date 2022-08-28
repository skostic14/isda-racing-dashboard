import React, { Component } from 'react'
import Select from 'react-select'
import { Form, Button, Alert } from 'react-bootstrap'

class GT3Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'seasonId': props.seasonId,
            'seasonFriendlyName': props.seasonFriendlyName,
            'error': '',
            'success': '',
            'carOptions': [],
            'loading': false,
            'responseCode': 200
        }
    }

    setError = (error) => {
        this.setState({error: error})
    }

    setSuccess = (success) => {
        this.setState({success: success})
    }

    setCarOptions = (carOptions) => {
        this.setState({carOptions: carOptions})
    }

    setLoading = (isLoading) => {
        this.setState({loading: isLoading})
    }

    setResponseCode = (responseCode) => {
        this.setState({responseCode: responseCode})
    }

    componentDidMount() {
        /*if (currentDriver === undefined || !currentDriver) {
            this.history.push('/login')
        }*/
        fetch('https://backend.isdaracing.com/get_car_options?season=' + this.state.seasonId)
        .then( response => response.json())
        .then( data => {
            let carSelectOptions = [];
            data['cars'].map((car) => {
                return carSelectOptions.push({
                    value: car['id'],
                    label: car['friendly_name']
                })
            })
            this.setCarOptions(carSelectOptions)
        });
    }

    submitCarSelection = (e) => {
        e.preventDefault()

        if (this.carNumberRef.current.value < 1 || this.carNumberRef.current.value > 999) {
            return(this.setError('Car number must be between 1 and 999'))
        }

        if (this.car === undefined || this.car === '') {
            return(this.setError('Please select a car'))
        }
        
        try {
            this.setError('')
            this.setSuccess('')
            this.setLoading(true)
            fetch('https://backend.isdaracing.com/team_signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'season': this.state.season,
                    'car': this.state.car,
                    'car_number': this.state.carNumberRef.current.value,
                    'teamname': this.state.teamNameRef.current.value,
                    'drivers': [
                        this.state.currentDriver
                    ]
                })
            })
            .then(response => {
                this.setResponseCode(response.status)
                return response.json()
            })
            .then(data => {
                if (this.state.responseCode === 200 ) {
                    this.setSuccess('Team registered successfully')
                }
                else {
                    this.setError(data['message'])
                }
            })
        } catch {
            this.setError('Failed to register for the season')
        }
        this.setLoading(false) 
    }

    render() {
        return(
        <div align="center">
            <h3 className="text-center mt-4 mb-4">Sign up for {this.state.seasonFriendlyName}</h3>
            <Form className="mb-4 w-50" onSubmit={this.submitCarSelection}>
                <Form.Group id="car">
                    <Form.Label>Car Type</Form.Label>
                    <Select className="CarSelect" options={this.state.carOptions} onChange={(selectedCar) => this.setCar(selectedCar.value)} placeholder="Select car"/>
                </Form.Group>
                <Form.Group id="number">
                    <Form.Label>Car Number</Form.Label>
                    <Form.Control type="number" ref={this.state.carNumberRef} required></Form.Control>
                </Form.Group>
                <Form.Group id="teamname">
                    <Form.Label>Team Name</Form.Label>
                    <Form.Control type="text" ref={this.state.teamNameRef} required></Form.Control>
                </Form.Group>
                <Button type="submit" disabled={this.state.loading}>Submit</Button>
            </Form>
            {this.state.error && <Alert variant="danger" className="w-50">{this.state.error}</Alert>}
            {this.state.success && <Alert variant="success" className="w-50">{this.state.success}</Alert>}
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
}

export default GT3Signup;
