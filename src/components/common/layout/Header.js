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
// import MenuIcon from '@material-ui/icons/Menu';

// import * as authService from '../../../services/authService';

const drawerWidth = 250;

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

class Header extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.header}>
                <img className={classes.header_image} src={"https://howmanydayssincemontaguestreetbridgehasbeenhit.com/static/img/monty_header.png"} />
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

export default withStyles(styles)(Header)
