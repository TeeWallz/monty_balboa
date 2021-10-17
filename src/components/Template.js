import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";


const styles = theme => ({

});

class Template extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                69
            </div>
        )
    }
}

Template.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(Template)
