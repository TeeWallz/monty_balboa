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
import images from "../../images";


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
        textAlign: 'center',
        height: '100px',
        // [theme.breakpoints.up('sm')]: {
        //     fontSize: '450%',
        // },
    },
    wreath: {
        position: 'absolute',
        width: '130px',
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        transform: 'scaleX(1.3)'
    },
    dayCounterWrapper:{
        width: '40%',
    },
});

class DayCounter extends Component {

    render() {
        const {classes} = this.props;
        const chumps = Chumps()

        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                <img src={'/images/FRboxing.gif'}  style={{position: 'absolute', marginRight: '245px'}}/>

                <div className={classNames(classes.dayCounterWrapper)}>
                    <img className={classNames(classes.wreath)} src={'/images/wreath.png'} />
                    <div className={classNames(classes.dayCounter)}>{chumps[0].streak}</div>
                </div>

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
