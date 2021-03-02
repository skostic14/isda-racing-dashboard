import React, {Component} from 'react';
import Select from 'react-select';
import './SignUp.css';

class EnduranceTeamSignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'availableSeasons': [],
            'registeredTeams': [],
            'carOptions': [],
            'driverList': [],
            'season': 'ACC_OneOff_Misano8h',
            'teamname': '',
            'car': '',
            'carNumber': 0,
            'drivers': ['', '', '', ''],
            'country': '',
            'pin': '',
            'update': false,
            'showErrors': false,
            'showSignUpResponse': true,
            'signUpCode': -1,
            'signUpMessage': ''
        };
    }

    componentDidMount() {
        this.getActiveDrivers();
        this.getCarOptions(this.state.season)
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    }

    handleDriverSelect = (driver, index) => {
        let current_driver_list = this.state.drivers;
        current_driver_list[index] = driver.value;
        this.setState({drivers: current_driver_list})
    }

    handleCarSelect = (car) => {
        this.setState({car: car.value})
    }

    handleSubmit = (event) => {
        if (this.validateData()) {
            const teamData = {
                'season': this.state.season,
                'teamname': this.state.teamname,
                'car': this.state.car,
                'car_number': this.state.carNumber,
                'drivers': this.state.drivers,
                'country': this.state.country,
                'pin': this.state.pin
            };

            let link = 'https://backend.isdaracing.com/team_signup';
            if (this.state.update) {
                link = 'https://backend.isdaracing.com/team_update/';
            }

            fetch(link, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...teamData})
            }).then(response => {
                this.setState({signUpCode: response.status});
                return response.json();
            }).then(data => this.setState({signUpMessage: data["message"], showSignUpResponse: true}));
            this.setState({showErrors: false});
        }

        else {
            this.setState({showErrors: true});
        }

        event.preventDefault();
    }

    getRegisteredTeams = (season) => {
        fetch('https://backend.isdaracing.com/get_registered_teams?season=' + season)
        .then( response => response.json())
        .then( data => this.setState({registeredTeams: data['teams']}));
    }

    getCarOptions = (season) => {
        fetch('https://backend.isdaracing.com/get_car_options?season=' + season)
        .then( response => response.json())
        .then( data => this.setState({carOptions: data['cars']}));
    }

    getActiveDrivers = () => {
        fetch('https://backend.isdaracing.com/get_active_drivers')
        .then( response => response.json())
        .then( data => this.setState({driverList: data['drivers']}));
    }

    validateData = () => {
        if (this.state.teamname.length < 1) {
            return false;
        }
        if (this.state.carNumber < 1 || this.state.carNumber > 999) {
            return false;
        }
        if (this.state.pin.length < 1) {
            return false;
        }
        if (this.state.drivers[0].length < 1) {
            return false
        }
        return true;
    }

    showErrors = () => {
        let errors = null;
        if (this.state.showErrors) {
            errors = this.validateData();

            errors.map((err, index) => {
                    return (<h3>err</h3>);
                }
            )
        }
    }

    render() {

        let nameClass = [];
        let carNumberClass = [];
        let pinClass = [];

        let carSelect = [];
        if (this.state.carOptions.length > 0) {
            let carOptions = [];
            this.state.carOptions.map((car) => {
                return carOptions.push({
                    value: car['id'],
                    label: car['friendly_name']
                })
            })
            carSelect = (<Select className="CarSelect" options={carOptions} onChange={this.handleCarSelect} placeholder="Select car"/>);
        }

        let driverSelect = [];
        let driverOptions = [];
        if (this.state.driverList.length > 0) {
            this.state.driverList.map((driver) => {
                return driverOptions.push({
                        value: driver['real_name'],
                        label: driver['real_name']
                })
            });
            driverSelect = (<Select className="DriverSelect" options={driverOptions} placeholder="Select driver"/>);
        }

        let seasonSelect = [];
        if (this.state.availableSeasons.length > 0) {
            let availableSeasons = []
            this.state.availableSeasons.map((season) => {
                return availableSeasons.push({
                    value: season['id'],
                    label: season['friendly_name']
                })
            })
            carSelect = (<Select className="CarSelect" options={availableSeasons} placeholder="Select season"/>)
        }

        if (this.state.showErrors) {
            if (this.state.teamname.length < 1) {
                nameClass.push('invalidInput');
            }
            if (this.state.carNumber < 1 || this.state.carNumber > 999) {
                carNumberClass.push('invalidInput');
            }
            if (this.state.pin.length < 1) {
                pinClass.push('invalidInput');
            }
        }

        let signupMessage = null;
        if (this.state.showSignUpResponse) {
            let signupMessageClass = [];
            if (this.state.signUpCode === 200) {
                signupMessageClass.push('signupSuccess');
            }
            else {
                signupMessageClass.push('signupError');
            }
            signupMessage = (<tr><td><p className={signupMessageClass}>{this.state.signUpMessage}</p></td></tr>);
        }
        
        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <p>Team name</p>
                                </td>
                            <td>
                                <input className={nameClass} type="text" name="teamname" onChange={this.handleChange}></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Car</p>
                                </td>
                            <td>
                               {carSelect}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Car number</p>
                                </td>
                            <td>
                                <input className={carNumberClass} type="number" name="carNumber" onChange={this.handleChange}></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Driver 1</p>
                                </td>
                            <td>
                                <Select className="DriverSelect" options={driverOptions} onChange={(e) => this.handleDriverSelect(e, 0)} placeholder="Select driver"/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Driver 2</p>
                                </td>
                            <td>
                                <Select className="DriverSelect" options={driverOptions} onChange={(e) => this.handleDriverSelect(e, 1)} placeholder="Select driver"/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Driver 3</p>
                                </td>
                            <td>
                                <Select className="DriverSelect" options={driverOptions} onChange={(e) => this.handleDriverSelect(e, 2)} placeholder="Select driver"/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Driver 4</p>
                                </td>
                            <td>
                                <Select className="DriverSelect" options={driverOptions} onChange={(e) => this.handleDriverSelect(e, 3)} placeholder="Select driver"/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>4-digit PIN</p>
                                </td>
                            <td>
                                <input className={pinClass} type="number" name="pin" onChange={this.handleChange}></input>
                            </td>
                        </tr>
                        <tr><td></td><td><button onClick={this.handleSubmit}>Submit</button></td></tr>
                        
                    </tbody>
                </table>
                {signupMessage}
            </div>
        )
    }
}

export default EnduranceTeamSignUp;