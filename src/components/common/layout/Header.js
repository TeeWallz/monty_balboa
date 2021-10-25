import React, {Component} from 'react';
// import {bindActionCreators} from 'redux'
// import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import commonTheme from "../../../styles/common";
import combineStyles from "../../../utils/combineStyles";
import commonStyle from "../../../styles/common";

import headerImage from '../../../images/MontyHeader.png'


const headerStyle = theme => ({
    header: {
        // backgroundColor: '#fff5ee',
        // height: '50px',
        maxWidth: '815px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    header_image:{
        width: '100%',

    },
    flex: {
        flex: 1
    }
});

class Header extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classNames(classes.sectionWidth)}>
                <img className={classes.header_image} src={headerImage} />
            </div>
        )
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired
};

/**
 * Map the actions to props.
 */
const mapDispatchToProps = dispatch => ({
    // actions: bindActionCreators(Object.assign({}, authService), dispatch)
});

const combinedStyles = combineStyles(headerStyle, commonStyle);

export default withStyles(combinedStyles)(Header)
