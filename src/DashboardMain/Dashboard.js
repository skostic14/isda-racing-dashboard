import React, { useState, useEffect } from 'react'
import { Button, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { useAuth } from '../Authentication/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import RaceResults from '../RaceResults/RaceResults.js'
import Calendar from '../Calendar/Calendar.js'
import SeasonStandings from '../RaceResults/SeasonStandings.js'
import GT3Signup from '../SignUp/GT3_Signup.js'

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
                    <Button variant="light outline-primary" className="mt-2 w-100" onClick={() => setComponent('GT3Signup')}><a href="#">Sign up for 2021 ISDA GT3 World Challenge - Spring Season</a></Button>
                </Navbar>
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4 w-100">
                    {component==='' && 
                    <div>
                        <img alt="ISDA BMW M6" src="https://www.isdaracing.com/wp-content/uploads/2021/01/Assetto-Corsa-Competizione-Screenshot-2020.12.28-17.00.00.31-e1610016811534-1024x461.png"></img>
                        <h1 className="mt-5">Welcome to International Sim Drivers Association!</h1>
                        <h3 className="mt-5">Please note that the dashboard is in development and that features will be gradually added.</h3>
                        <h3>For more information about dashboard updates, keep an eye on our Discord!</h3>

                        <Link onClick={() => setComponent('GT3Signup')}><h1 className="mt-4 link">Sign up for 2021 ISDA GT3 World Challenge - Spring Season</h1></Link>    
                    </div>}
                    {component==='RaceResults' && <RaceResults/>}
                    {component==='Calendar' && <Calendar/>}
                    {component==='SeasonStandings' && <SeasonStandings/>}
                    {component==='GT3Signup' && <GT3Signup/>}
                </main>
            </div>
            
        </div>
    )
}