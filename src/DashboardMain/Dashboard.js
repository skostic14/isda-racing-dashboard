import React, { useState, useEffect } from 'react'
import { Button, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { useAuth } from '../Authentication/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import RaceResults from '../RaceResults/RaceResults.js'
import Calendar from '../Calendar/Calendar.js'
import SeasonStandings from '../RaceResults/SeasonStandings.js'
import Endurance_SignUp from '../SignUp/Endurance_SignUp.js'
import Endurance_TeamUpdate from '../SignUp/Endurance_TeamUpdate.js'
import GT3Signup from '../SignUp/GT3_Signup.js'
import SignUpList from '../SignUp/SignupList.js'
import IncidentReportForm from '../IncidentReports/IncidentReportForm.js'

export default function Dashboard() {
    const { currentUser, setCurrentDriver, currentDriver, currentUserToken } = useAuth()
    const [component, setComponent] = useState('')
    const history = useHistory()

    useEffect(() => {
        if (!(currentUser && currentUser !== undefined)) {
            history.push('/login')
        }
        else if (currentDriver === undefined) {
            const tokenData = {'token': currentUserToken}
            fetch('https://backend.isdaracing.com/check_uid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tokenData)
            })
            .then( response => response.json())
            .then( data => {
                if (data['driver'] === null) {
                    history.push('/login')
                }
                else {
                    setCurrentDriver(data['driver']['name'])
                }
            })
        }
        return currentUser
    }, []);

    const monzaSignUp = (
        <div className="container w-75">
            <h4>8h of Monza</h4>
            <h4>August 28 - 15:00 CEST</h4>
            <h4 className="mb-4">Team registration</h4>
            <Endurance_SignUp season="ACC_OneOff_Monza8h" maxDrivers="4"/>
        </div>)

    const monzaUpdate = (
        <div className="container w-75">
            <h4>8h of Monza</h4>
            <h4>August 28 - 15:00 CEST</h4>
            <h4 className="mb-4">Team update</h4>
            <Endurance_TeamUpdate season="ACC_OneOff_Monza8h" maxDrivers="4"/>
        </div>
    )

    return (
        <div className="h-100 bg-light">
            <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#" onClick={() => setComponent('')}>International Sim Drivers Association</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
                <Nav className="mr-auto">
                    <NavDropdown title="Results">
                        <NavDropdown.Item onClick={() => setComponent('RaceResults')}>Race results</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => setComponent('SeasonStandings')}>Season standings</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link onClick={() => setComponent('Calendar')}>Calendar</Nav.Link>
                    <Nav.Link onClick={() => setComponent('SignUpList')}>Entry Lists</Nav.Link>
                    <Nav.Link onClick={() => setComponent('IncidentReportForm')}>Incident report</Nav.Link>
                </Nav>
                <Nav className="float-right">
                    <Nav.Link className="mr-auto">{currentDriver}</Nav.Link>
                    <Button variant="light outline-primary"><Link to='/logout'>Log out</Link></Button>
                </Nav>
            </Navbar.Collapse>
            </Navbar>

            <div className="row w-100 bg-light">
                <Navbar className="col-md-2 d-none d-md-block bg-light sidebar">
                    <Button variant="light outline-primary" className="mt-2 w-100"><a href='https://www.isdaracing.com'>ISDA Homepage</a></Button>
                    <Button variant="light outline-primary" className="mt-2 w-100"><a href='https://discord.gg/KZqV4Hfb9A'>ISDA Discord</a></Button>
                    <hr/>
                    <Button variant="light outline-primary" className="mt-2 w-100" onClick={() => setComponent('monzaSignUp')}><a href='#'>8h of Monza - Team Registration</a></Button>
                    <Button variant="light outline-primary" className="mt-2 w-100" onClick={() => setComponent('monzaUpdate')}><a href='#'>8h of Monza - Team Update</a></Button>
                    <hr />
                    <Button variant="light outline-primary" className="mt-2 w-100" onClick={() => setComponent('GT3Signup')}><a href='#'>Register for 2021 ISDA GT3 World Challenge - Autumn Season</a></Button>
                </Navbar>
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4 w-100 mt-4">
                    <div className="w-100">
                        {component==='' && 
                        <div>
                            <h1 className="mt-2 mb-4">Welcome to International Sim Drivers Association!</h1>
                            <div className="row w-75 ml-auto mr-auto">
                                <div className="col-md-6">
                                    <Link onClick={() => setComponent('monzaSignUp')}>
                                    <img className="img-fluid" alt="ISDA GT3 World Challenge - Autumn Season" src="https://www.isdaracing.com/wp-content/uploads/2021/08/8hmonza2.2.png"></img>
                                    <h3 className="mt-2 link">Register for 8h of Monza <br/> August 28 - 15:00 CEST</h3></Link>
                                </div>
                                <div className="col-md-6">
                                    <Link onClick={() => setComponent('GT3Signup')}>
                                    <img className="img-fluid" alt="ISDA GT3 World Challenge - Autumn Season" src="https://www.isdaracing.com/wp-content/uploads/2021/08/signups_open.png"></img>
                                    <h3 className="mt-2 link">Register for 2021 ISDA GT3 World Challenge - Autumn Season</h3>
                                    </Link>
                                </div>
                            </div>
                            <h5 className="mt-3">Please note that the dashboard is in development and that features will be gradually added.</h5>
                            <h5>For more information about dashboard updates, keep an eye on our Discord!</h5>
                        </div>}
                        {component==='RaceResults' && <RaceResults/>}
                        {component==='Calendar' && <Calendar/>}
                        {component==='SeasonStandings' && <SeasonStandings/>}
                        {component==='GT3Signup' && <GT3Signup/>}
                        {component==='SignUpList' && <SignUpList/>}
                        {component==='IncidentReportForm' && <IncidentReportForm/>}
                        {component==='monzaSignUp' && monzaSignUp}
                        {component==='monzaUpdate' && monzaUpdate}
                    </div> 
                </main>
            </div>
            
        </div>
    )
}