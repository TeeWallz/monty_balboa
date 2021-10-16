import React, {Component} from 'react';
// import {bindActionCreators} from 'redux'
// import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";


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
    }
});

class DayCounter extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classNames(classes.section)}>
                <div>69</div>
                <div style={{fontSize: '0.5em'}}>As of 1st Smarch 2031</div>
            </div>
        )
    }
}

DayCounter.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(DayCounter)
