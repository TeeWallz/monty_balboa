import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";


const styles = theme => ({
    StreakStatsText:{
        fontSize: '0.5em',
    }
});

class StreakStats extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div >
                <div className={classes.StreakStatsText}>Average Streak: 80 days</div>
                <div className={classes.StreakStatsText}>Current Status: Overdue</div>
            </div>
        )
    }
}

StreakStats.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(StreakStats)
