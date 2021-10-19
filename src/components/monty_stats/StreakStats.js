import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Table from 'react-bootstrap/Table'
import {getYear} from "date-fns";
import {withStyles} from '@material-ui/core/styles';

import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import Chumps from "../../data/chumps";

import {median} from "../../utils/Maths";
import skewness from "../../utils/Skewness";


const styles = theme => ({
    StreakStatsText:{
        fontSize: '3vw',
    },
    textAlignRight:{
        textAlign: 'right',
    }
});

const averageExpectingGateDays = 15;
const overdueGateDays = 15;
const wayOverdueGateDays = 15;


// 'Recent Loss to Monty Balboa'
function currentStatus(currentStreak, average) {
    if(currentStreak <= 20){
        return "Recent loss against Monty Balboa";
    }
    else if(Math.abs(currentStreak - average) <= averageExpectingGateDays){
        return "Expecting soon!";
    }
    else if((currentStreak - average) >= wayOverdueGateDays){
        return "WAAAAY overdue!!";
    }
    else if((currentStreak - average) >= overdueGateDays){
        return "Overdue";
    }
    else{
        return "Not expecting";
    }

}

function getStandardDeviation (array) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

class StreakStats extends Component {

    render() {
        const {classes} = this.props;
        const chumps = Chumps();
        const streakArray = chumps.map(e => e.streak);

        const averageStreak = (streakArray.reduce((a, b) => a + b, 0) / chumps.length).toFixed(2);
        const stdDev = getStandardDeviation(streakArray).toFixed(2);
        const medianStreak = median(streakArray).toFixed(2);
        const streakStatus = currentStatus(chumps[0].streak, medianStreak);
        const setSkewness = skewness(streakArray).toFixed(2);

        return (
            <div >
                <Table className={classes.commonRegularText}>
                    <tbody>
                        <tr><td className={classNames(classes.textAlignRight)}>Average Streak:</td><td>{averageStreak} days</td></tr>
                        <tr><td className={classNames(classes.textAlignRight)}>Median Streak:</td><td>{medianStreak} days</td></tr>
                        <tr><td className={classNames(classes.textAlignRight)}>Standard Deviation:</td><td>{stdDev} days</td></tr>
                        <tr><td className={classNames(classes.textAlignRight)}>Skewness:</td><td>{setSkewness}</td></tr>
                        <tr><td className={classNames(classes.textAlignRight)}>Current Status:</td><td>{streakStatus}</td></tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}

StreakStats.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(StreakStats)
