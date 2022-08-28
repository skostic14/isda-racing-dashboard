import React, {Component} from 'react';
import {Tab, Tabs, Row, Col, Image, Table } from 'react-bootstrap';
import GT3Signup from '../SignUp/GT3_Signup';
import EnduranceTeamSignUp from '../SignUp/Endurance_SignUp';
import EnduranceTeamUpdate from '../SignUp/Endurance_TeamUpdate';
import SeasonRules from './SeasonHubComponents/SeasonRules';
import SeasonEvents from './SeasonHubComponents/SeasonEvents';
import SeasonHubStandings from './SeasonHubComponents/SeasonStandings';
import SignUpList from '../SignUp/SignupList';

class SeasonHub extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'seasonContainer': props.season,
            'seasonId': props.season.id,
            'seasonFriendlyName': props.season.friendly_name,
            'seasonInfoText': props.season.description,
            'seasonBannerLink': props.season.banner_link,
            'rulesContainer': props.season.rules,
            'maxDriversInCar': props.season.rules.max_drivers_in_car,
            'eventIds': props.season.events,
            'active': props.active,
            'eventList': [],
            'showStandings': false
        }
    }

    getSignupTabs() {
        if (!this.state.active) {
            return []
        }
        if (this.state.maxDriversInCar === 1) {
            return [
                (
                <Tab eventKey="signup" title="Sign Up!">
                    <GT3Signup seasonId={this.state.seasonId} seasonFriendlyName={this.state.seasonFriendlyName}/>
                </Tab>
                ),
                (
                <Tab eventKey="liveryUpload" title="Upload Livery!">
                    <iframe src={this.state.seasonContainer['livery_upload_link']} className="w-50" style={{height: "40rem"}}/>
                </Tab>
                )
            ]
        }
        return [
            (
            <Tab eventKey="signup" title="Sign Up!">
                <EnduranceTeamSignUp season={this.state.seasonId} maxDrivers={this.state.maxDriversInCar} />
            </Tab>
            ),
            (
            <Tab eventKey="update_signup" title="Update entry">
                <EnduranceTeamUpdate season={this.state.seasonId} maxDrivers={this.state.maxDriversInCar}/>
            </Tab>
            ),
            (
            <Tab eventKey="liveryUpload" title="Upload Livery!">
                <iframe src={this.state.seasonContainer['livery_upload_link']} className="w-50" style={{height: "40rem"}}/>
            </Tab>
            )
        ]
    }

    getStandingsTab() {
        if (this.state.showStandings === true) {
            return (
                <Tab eventKey="standings" title="Championship Standings">
                    <SeasonHubStandings season={this.state.seasonId}/>
                </Tab>
            )
        }
        return []
    }

    getSignupInformation() {
        let carClassElements = []
        this.state.seasonContainer['classes'].map((carClass) => {
            return carClassElements.push(
                <tr><td colSpan={2}>{carClass}</td></tr>
            )
        })

        return (
            <Table bordered className="mt-2">
                <tr><td colSpan={2}><b>Sign up information</b></td></tr>
                <tr>
                    <td>Sign up counter</td>
                    <td>{this.state.seasonContainer['entries_count']} / 50</td>
                </tr>
                <tr><td colSpan={2}><b>Car Classes</b></td></tr>
                {carClassElements}
            </Table>
        )
    }

    getDescription() {
        let description_text = []
        if ('description_long' in this.state.seasonContainer) {
            Object.keys(this.state.seasonContainer['description_long']).map((key) => {
                description_text.push(<h3>{key}</h3>)
                description_text.push(<p className='mt-2'>{this.state.seasonContainer['description_long'][key]}</p>)
                return description_text.push(<hr/>)
            })
        }
        else {
            description_text.push(this.state.seasonInfoText)
        }
        return description_text
    }

    checkStandingsAvailable() {
        if (this.state.seasonContainer['standings']['races'].length === 0) {
            this.setState({showStandings: false})
        }
        else {
            this.setState({showStandings: true})
        }
    }

    componentDidMount() {
        this.checkStandingsAvailable()
    }

    render() {
        return(
            <div>
                <h1>{this.state.seasonFriendlyName}</h1>
                <hr/>
                <Tabs defaultActiveKey="info" className="mb-3 ml-auto mr-auto" justify>
                    <Tab eventKey="info" title="Info">
                        <Row>
                            <Col className="ml-auto mr-auto">{this.getDescription()}</Col>
                            <Col md={4} className="ml-auto mr-auto">
                                <Row>
                                    <Image src={this.state.seasonBannerLink} rounded fluid/>
                                </Row>
                                <Row>
                                    {this.getSignupInformation()}
                                </Row>
                            </Col>
                        </Row>
                    </Tab>
                    <Tab eventKey="rules" title="Rules">
                        <SeasonRules seasonRules={this.state.rulesContainer} />
                    </Tab>
                    <Tab eventKey="events" title="Events">
                        <SeasonEvents eventIds={this.state.eventIds} seasonId={this.state.seasonId} />
                    </Tab>
                    <Tab eventKey="entryList" title="Entry List">
                        <SignUpList season={this.state.seasonId}></SignUpList>
                    </Tab>
                    {this.getStandingsTab()}
                    {this.getSignupTabs()}
                </Tabs>
            </div>
        )
    }
}

export default SeasonHub;