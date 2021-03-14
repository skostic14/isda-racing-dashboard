import React from 'react';
import './RaceResults.css';

const renderDriverStanding = (props) => {

    return (
        <tr>
            <td>{props.position}</td>
            <td>{props.driverName}</td>
            <td>{props.team}</td>
            {
                props.results.map((position) => {
                    let styleModifier = null;
                    if (position === 1) {
                        styleModifier = 'firstPosition';
                    }
                    else if (position === 2) {
                        styleModifier = 'secondPosition';
                    }
                    else if (position === 3) {
                        styleModifier = 'thirdPosition';
                    }
                    else if (position === 'DSQ') {
                        styleModifier = 'DSQ';
                    }
                    return (<td className={styleModifier}>{position}</td>)
                })
            }
            <td>{props.points}</td>
        </tr>
    )
}

export default renderDriverStanding;