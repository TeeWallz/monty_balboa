import React, {Component} from 'react';
// import {bindActionCreators} from 'redux'
// import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import { differenceInDays, format } from 'date-fns'

import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import Chumps from "../../data/chumps";


const styles = theme => ({
    header: {
        backgroundColor: '#fff5ee',
        // height: '50px',
    },
    header_image:{
        width: '100%',
    },
    flex: {
        flex: 1
    },
    dayCounter: {
        fontSize: '350%',

        // [theme.breakpoints.up('sm')]: {
        //     fontSize: '450%',
        // },
    }
});

class DayCounter extends Component {

    render() {
        const {classes} = this.props;
        const chumps = Chumps()

        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                <div className={classNames(classes.dayCounter)}>{chumps[0].streak}</div>
                <div className={classNames(classes.commonBigText)}>As of {format(chumps[0].parsedDate, 'do LLLL yyyy')}</div>
            </div>
        )
    }
}

DayCounter.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(DayCounter)
