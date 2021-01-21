import React, {Component} from 'react';
import './SignUp.css';

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            surname: '',
            nickname: '',
            steamid: '',
            nationality: '',
            showErrors: false,
            showSignUpResponse: true,
            signUpCode: -1,
            signUpMessage: ''
        };
    }

    handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    }

    handleSubmit = (event) => {
        if (this.validateData()) {
            const driverData = {
                'name': this.state.name,
                'surname': this.state.surname,
                'nickname': this.state.nickname,
                'steamid': this.state.steamid,
                'country': this.state.nationality
            };

            fetch('https://backend.isdaracing.com/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...driverData})
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

    verifySignUpResponse = (response) => {
        
    }

    validateData = () => {
        if (this.state.name.length < 1) {
            return false;
        }
        if (this.state.surname.length < 1) {
            return false;
        }
        if (this.state.nickname.length !== 3) {
            return false;
        }
        if (this.state.steamid.length !== 17) {
            return false;
        }
        if (this.state.nationality.length !== 2) {
            return false;
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
        let surnameClass = [];
        let nicknameClass = [];
        let steamIDClass = [];
        let countryClass = [];

        if (this.state.showErrors) {
            if (this.state.name.length < 1) {
                nameClass.push('invalidInput');
            }
            if (this.state.surname.length < 1) {
                surnameClass.push('invalidInput');
            }
            if (this.state.nickname.length !== 3) {
                nicknameClass.push('invalidInput');
            }
            if (this.state.steamid.length !== 17) {
                steamIDClass.push('invalidInput');
            }
            if (this.state.nationality.length !== 2) {
                countryClass.push('invalidInput');
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
            console.log(this.state.signUpMessage)
            signupMessage = (<tr><td><p className={signupMessageClass}>{this.state.signUpMessage}</p></td></tr>);
        }
        
        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <p>Name:</p>
                                </td>
                            <td>
                                <input className={nameClass} type="text" name="name" onChange={this.handleChange}></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Surname:</p>
                                </td>
                            <td>
                                <input className={surnameClass} type="text" name="surname" onChange={this.handleChange}></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Three-letter abbreviation:</p>
                                </td>
                            <td>
                                <input className={nicknameClass} type="text" name="nickname" onChange={this.handleChange}></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Steam ID:</p>
                                </td>
                            <td>
                                <input className={steamIDClass} type="text" name="steamid" onChange={this.handleChange}></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Country (two-letter code):</p>
                                </td>
                            <td>
                                <input className={countryClass} type="text" name="nationality" onChange={this.handleChange}></input>
                            </td>
                        </tr>
                        <tr><td></td><td><button onClick={this.handleSubmit}>Submit</button></td></tr>
                        {signupMessage}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default SignUp;