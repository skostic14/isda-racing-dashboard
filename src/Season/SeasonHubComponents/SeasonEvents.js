import React, {Component} from 'react';
import { Table, Button, CloseButton } from 'react-bootstrap';
import RaceResults from '../../RaceResults/RaceResults';
import IncidentReportForm from '../../IncidentReports/IncidentReportForm';

class SeasonEvents extends Component {

    constructor(props) {
        super(props)
        this.state = {
            'seasonId': props.seasonId,
            'eventIds': props.eventIds,
            'eventList': [],
            'displayRace': null,
            'displayIncident': null
        }
    }

    fetchEventDetails() {
        fetch('https://backend.isdaracing.com/get_events_details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'events': this.state.eventIds})
            })
            .then( response => response.json())
            .then( data => {
                let eventList = []
                data['events'].map( (event) => {
                    return eventList.push(event)
                })
                this.setState({eventList: eventList})
            })
    }

    componentDidMount() {
        this.fetchEventDetails();
    }

    displayRaceResults(raceId) {
        this.setState({
            displayRace: raceId,
            displayIncident: null
        })
    }

    displayInvestigationMenu(raceId) {
        this.setState({
            displayRace: null,
            displayIncident: raceId
        })
    }

    displayEvents() {
        this.setState({
            displayRace: null,
            displayIncident: null
        })
    }

    getEventsCalendar() {
        let calendarList = []
        if (this.state.eventList.length === 0) {
            return calendarList
        }
        this.state.eventList.map((event) => {
            let containsResults = false
            try {
                if (event['results']['r']['overall'].length > 0) {
                    containsResults = true
                }
                if (event['results']['r'].length > 0) {
                    containsResults = true
                }
            }
            catch (error) {
                containsResults = false
            }

            return calendarList.push(
                <tr>
                    <td>{event['date']}</td>
                    <td>{event['start_time']}</td>
                    <td>{event['friendly_name']}</td>
                    <td>{event['track']}</td>
                    <td width="15%">{containsResults && <Button className="w-75" variant="primary" onClick={() => this.displayRaceResults(event['id'])}>Results</Button>}</td>
                    <td width="15%">{containsResults && <Button className="w-75" variant="danger" onClick={() => this.displayInvestigationMenu(event['id'])}>Report Incident</Button>}</td>
                </tr>
            )
        })
        return calendarList
    }

    getEventDisplay() {
        if (this.state.displayIncident != null && this.state.displayRace == null) {
            let incidentReportForm = (<IncidentReportForm />)
            //incidentReportForm.setPreselectSeason(this.state.seasonId)
            //incidentReportForm.setPreselectRace(this.state.displayIncident)
            
            return (
                <div>
                    <CloseButton onClick={() => this.displayEvents()}></CloseButton>
                    <hr/>
                    {incidentReportForm}
                </div>
            )
        }

        if (this.state.displayIncident == null && this.state.displayRace != null) {
            return (
                <div>
                    <CloseButton onClick={() => this.displayEvents()}></CloseButton>
                    <hr/>
                    <RaceResults race={this.state.displayRace}/>
                </div>
            )
        }
        
        
        return (
            <Table>{this.getEventsCalendar()}</Table>
        )
        
    }

    render() {
        return (
            <div>
                <h4>Events List</h4>
                {this.getEventDisplay()}
            </div>
        )
    }

}

export default SeasonEvents;
