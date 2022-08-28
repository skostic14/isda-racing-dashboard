import React, {Component} from 'react';
import { Table } from 'react-bootstrap';
import SeasonStandings from '../../RaceResults/SeasonStandings';

class SeasonHubStandings extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            'seasonId': props.season,
            'standingsComponent': []
        }
    }

    getStandingsComponent() {
        let standingsComponent = (<SeasonStandings season={this.state.seasonId}/>)
        this.setState({standingsComponent: standingsComponent}) 
    }

    componentDidMount() {
        this.getStandingsComponent()
    }

    render() {
        if (this.state === null) {
            return (<div></div>)
        }
        return (
            <div>{this.state.standingsComponent}</div>
        )
    }
}

export default SeasonHubStandings;
