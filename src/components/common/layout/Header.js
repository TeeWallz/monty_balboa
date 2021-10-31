import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';

import combineStyles from "../../../utils/combineStyles";
import commonStyle from "../../../styles/common";
import images from "../../../images";




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
                <img className={classes.header_image} src={'images/MontyHeader.png'} />
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
