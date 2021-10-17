import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import Chumps from "../../data/chumps";


const styles = theme => ({
    chumpImage: {
        width: '60%',
        display: 'block',
        margin: 'auto',
    },
    chumpName: {
        fontSize: '4vw',
    },
});

class CurrentChump extends Component {

    render() {
        const {classes} = this.props;
        const chumps = Chumps()

        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                <div><img className={classes.chumpImage} src={chumps[0].chumps[0].image}/></div>
                <div className={classNames(classes.chumpName)}>
                    <a href={chumps[0].chumps[0].url} target="_blank" >{chumps[0].chumps[0].name}</a>
                </div>

            </div>
        )
    }
}

CurrentChump.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(CurrentChump)
