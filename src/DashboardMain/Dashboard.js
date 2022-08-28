import React, { useState, useEffect } from 'react'
import { Button, Navbar, Nav, NavDropdown, Stack, Row, Carousel } from 'react-bootstrap'
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
import CreateEvent from '../AdminTools/CreateEvent'
import SeasonCard from '../Season/SeasonCard'
import SeasonHub from '../Season/SeasonHub'

export default function Dashboard() {
    const { currentUser, setCurrentUser, setCurrentDriver, currentDriver, currentUserToken, currentRole, setCurrentRole } = useAuth()
    const [component, setComponent] = useState('')
    const [activeSeasons, setActiveSeasons] = useState([])
    const [pastSeasons, setPastSeasons] = useState([])
    const history = useHistory()

    function fetchActiveSeasons() {
        fetch('https://backend.isdaracing.com/get_active_seasons')
        .then( response => response.json() )
        .then ( data => {
            setActiveSeasons(data['seasons'])
        })
    }

    function fetchPastSeasons() {
        fetch('https://backend.isdaracing.com/get_past_seasons')
        .then( response => response.json() )
        .then ( data => {
            setPastSeasons(data['seasons'])
        })
    }

    useEffect(() => {
        fetchActiveSeasons()
        fetchPastSeasons()
        let currentUserLocalStorage = JSON.parse(localStorage.getItem("ISDA_USER"))
        let currentDriverLocalStorage = localStorage.getItem("ISDA_DRIVER")
        if (!(currentUser && currentUser !== null)) {
            setCurrentUser(currentUserLocalStorage)
        }
        if (currentDriver === null) {
            setCurrentDriver(currentDriverLocalStorage)
        }

        if (!(currentUser && currentUser !== null)) {
            history.push('/login')
        }
        else if (currentDriver === null) {
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
                    localStorage.setItem("ISDA_DRIVER", data['driver']['name'])
                    setCurrentRole(data['driver']['role'])
                    localStorage.setItem("ISDA_ROLE", data['driver']['role'])
                }
            })
        }

        return currentUser
    }, []);

    let adminToolsDropdown = null
    if (currentRole === "admin") {
        adminToolsDropdown = (
            <NavDropdown title="Admin Tools">
                <NavDropdown.Item onClick={() => setComponent('CreateEvent')}>Create Event</NavDropdown.Item>
            </NavDropdown>
        )
    }

    let activeSeasonsCards = []
    let pastSeasonsCards = []
    let seasonsHubs = {}
    

    function setComponentOfSeason(seasonId) {
        setComponent(seasonId);
    }

    activeSeasons.map((season) => {
        activeSeasonsCards.push(
            <SeasonCard active={true} seasonId={season.id} friendlyName={season.friendly_name} description={season.description} bannerLink={season.banner_link} callbackFn={() => setComponentOfSeason(season.id)} simulator={season.simulator}></SeasonCard>
        )
        seasonsHubs[season.id] = <SeasonHub season={season} active={true} />
    })

    pastSeasons.map((season) => {
        pastSeasonsCards.push(
            <SeasonCard active={false} seasonId={season.id} friendlyName={season.friendly_name} description={season.description} bannerLink={season.banner_link} callbackFn={() => setComponentOfSeason(season.id)} simulator={season.simulator}></SeasonCard>
        )
        seasonsHubs[season.id] = <SeasonHub season={season} active={false} />
    })

    function getActiveComponent() {
        if (component === '') {
            return (
                <div>
                    <h1 className="mt-2 mb-4">Welcome to International Sim Drivers Association!</h1>
                    <h3>Currently Active Seasons</h3>
                    <Row xs={1} md={4} className="g-4 center ml-auto w-100">
                        {activeSeasonsCards}
                    </Row>
                    <hr/>
                    <h5 className="mt-3">Please note that the dashboard is in development and that features will be gradually added.</h5>
                    <h5>For more information about dashboard updates, keep an eye on our Discord!</h5>
                    <hr/>
                    <h4>Past Seasons</h4>
                    <Row xs={1} md={5} className="ml-auto w-100 scroll">
                        {pastSeasonsCards}
                    </Row>
                </div>
            )
        }

        if (component === 'RaceResults') {
            return (<RaceResults/>)
        }

        if (component === 'Calendar') {
            return (<Calendar/>)
        }

        if (component === 'SeasonStandings') {
            return (<SeasonStandings/>)
        }

        if (component === 'SignUpList') {
            return (<SignUpList/>)
        }

        if (component === 'IncidentReportForm') {
            return (<IncidentReportForm/>)
        }

        if (component === 'CreateEvent') {
            return (<CreateEvent/>)
        }

        if (component in seasonsHubs) {
            return seasonsHubs[component]
        }
    }


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
                    {adminToolsDropdown}
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
                    {/*
                    <Button variant="light outline-primary" className="mt-2 w-100" onClick={() => setComponent('GT3Signup')}><a href='#'>Register for ACC - 2022 ISDA Ferrari Challenge USA - Summer Season</a></Button>
                    <Button variant="light outline-primary" className="mt-2 w-100"><a href='https://forms.gle/z1H4E2iJmo9fwL4s9'>Livery Upload for Ferrari Challenge USA - Summer Season</a></Button>
                    <hr/>
                    */}
                    <Button variant="light outline-primary" className="mt-2 w-100"><a href='https://www.patreon.com/isdaracing'>Become our Patreon</a></Button>
                    <Button variant="light outline-primary" className="mt-2 w-100"><a href='https://paypal.me/isdaracing'>Donate with PayPal</a></Button>
                    <hr/>
                </Navbar>
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4 w-100 mt-4">
                    <div className="w-100">
                        {
                            getActiveComponent()
                        }
                    </div> 
                </main>
            </div>
            
        </div>
    )
}