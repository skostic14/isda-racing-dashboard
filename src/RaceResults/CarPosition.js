import React from 'react';
import './RaceResults.css';

const renderCarPosition = (props) => {
    return (
        <tr>
            <td>{props.position}</td>
            <td>{props.driverName}</td>
            <td>{props.carNumber}</td>
            <td>{props.totalTime}</td>
            <td>{props.gap}</td>
            <td>{props.laps}</td>
            <td>{props.fastestLap}</td>
        </tr>
    )
}

export default renderCarPosition;