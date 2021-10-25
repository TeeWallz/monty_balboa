import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import combineStyles from "../../../utils/combineStyles";
import commonStyle from "../../../styles/common";



const styles = theme => ({

});

class Footer extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                <div>
                    Redesign heavily inspired by
                    <a href={"https://hiatus-hiatus.github.io/"}>
                        https://hiatus-hiatus.github.io/
                    </a>
                </div>
                <div>
                    <a href={"https://github.com/TeeWallz/monty_balboa"}>View on Github</a>
                </div>
            </div>
        )
    }
}

Footer.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(Footer)
