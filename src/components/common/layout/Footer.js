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
                    <span>Redesign heavily inspired by </span>
                    <a target="_blank" href={"https://hiatus-hiatus.github.io/"}>
                        https://hiatus-hiatus.github.io/
                    </a>
                </div>
                <div>
                    <a target="_blank" href={"https://github.com/TeeWallz/monty_balboa"}>View on Github</a>
                </div>
                <div>
                    <a target="_blank" href={"/rss.xml"}>RSS Feed</a>
                </div>
                <div>
                    <a target="_blank" href={"/chumps.json"}>"""API"""</a>
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
