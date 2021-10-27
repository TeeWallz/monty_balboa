import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';

import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import StreakStats from "./StreakStats";


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

});

class MiniStats extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                <div className={classNames(classes.commonHeaderText)}>Stats</div>
                {/*<StreakGraph />*/}
                {/*<hr style={{width:'100%'}} />*/}
                <StreakStats/>
            </div>
        )
    }
}

MiniStats.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(MiniStats)
