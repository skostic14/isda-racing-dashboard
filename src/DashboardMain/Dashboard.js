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

    const kyalamiSignUp = (
        <div className="container w-75">
            <h4>9h of Kyalami</h4>
            <h4>May 22 - 15:00 CEST</h4>
            <h4 className="mb-4">Team registration</h4>
            <Endurance_SignUp season="ACC_OneOff_Kyalami9h" maxDrivers="4"/>
        </div>)
    
    const kyalamiUpdate = (
        <div className="container w-75">
            <h4>9h of Kyalami</h4>
            <h4>May 22 - 15:00 CEST</h4>
            <h4 className="mb-4">Team update</h4>
            <Endurance_TeamUpdate season="ACC_OneOff_Kyalami9h" maxDrivers="4"/>
        </div>
    )

    const pcupSignUp = (
        <div className="container w-75">
            <h4>2021 ISDA Porsche Cup Challenge - Spring Season</h4>
            <h4 className="mb-4">Team registration</h4>
            <Endurance_SignUp season="ACC_Pcup_S1" maxDrivers="2"/>
        </div>)
    
    const pcupUpdate = (
        <div className="container w-75">
            <h4>2021 ISDA Porsche Cup Challenge - Spring Season</h4>
            <h4 className="mb-4">Team update</h4>
            <Endurance_TeamUpdate season="ACC_Pcup_S1" maxDrivers="2"/>
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
                    <Button variant="light outline-primary" className="mt-2 w-100" onClick={() => setComponent('9hKyalamiSignUp')}><a href='#'>9h of Kyalami - Team Registration</a></Button>
                    <Button variant="light outline-primary" className="mt-2 w-100" onClick={() => setComponent('9hKyalamiTeamUpdate')}><a href='#'>9h of Kyalami - Team Update</a></Button>
                    <hr/>
                    <Button variant="light outline-primary" className="mt-2 w-100" onClick={() => setComponent('PcupSignUp')}><a href='#'>Porsche Cup Challenge - Registration</a></Button>
                    <Button variant="light outline-primary" className="mt-2 w-100" onClick={() => setComponent('PcupTeamUpdate')}><a href='#'>Porsche Cup Challenge - Team Update</a></Button>
                </Navbar>
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4 w-100 mt-4">
                    <div className="w-100">
                        {component==='' && 
                        <div>
                            <img alt="ISDA BMW M6" src="https://www.isdaracing.com/wp-content/uploads/2021/01/Assetto-Corsa-Competizione-Screenshot-2020.12.28-17.00.00.31-e1610016811534-1024x461.png"></img>
                            <h1 className="mt-5">Welcome to International Sim Drivers Association!</h1>
                            <h3 className="mt-5">Please note that the dashboard is in development and that features will be gradually added.</h3>
                            <h3>For more information about dashboard updates, keep an eye on our Discord!</h3>

                            <Link onClick={() => setComponent('9hKyalamiSignUp')}><h1 className="mt-4 link">Sign up for 9h of Kyalami - May 22</h1></Link>
                            <Link onClick={() => setComponent('PcupSignUp')}><h1 className="mt-4 link">Sign up for 2021 ISDA Porsche Cup Challenge - Spring Season</h1></Link>
                        </div>}
                        {component==='RaceResults' && <RaceResults/>}
                        {component==='Calendar' && <Calendar/>}
                        {component==='SeasonStandings' && <SeasonStandings/>}
                        {component==='GT3Signup' && <GT3Signup/>}
                        {component==='SignUpList' && <SignUpList/>}
                        {component==='9hKyalamiSignUp' && kyalamiSignUp}
                        {component==='9hKyalamiTeamUpdate' && kyalamiUpdate}
                        {component==='PcupSignUp' && pcupSignUp}
                        {component==='PcupTeamUpdate' && pcupUpdate}
                    </div> 
                </main>
            </div>
            
        </div>
    )
}