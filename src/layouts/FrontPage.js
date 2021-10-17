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
import DayCounter from "../components/monty_stats/DayCounter";
// import MenuIcon from '@material-ui/icons/Menu';

// import * as authService from '../../../services/authService';
import applyCommonTheme from "../styles/common";
import combineStyles from "../utils/combineStyles";
import commonStyle from "../styles/common";
import CurrentChump from "../components/monty_stats/CurrentChump";
import MiniStats from "../components/monty_stats/MiniStats";
import CommentsContainer from "../components/social/CommentsContainer";
import ChumpHistory from "../components/history/ChumpHistory";
import HitBoxChart from "../components/monty_stats/HitBoxChart";
import StreakGraph from "../components/monty_stats/StreakGraph";
// console.log(theme_common)



const frontPageStyle = theme => ({
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

class FrontPage extends Component {

    render() {
        const {classes} = this.props;
        // const {parentStyles} = this.props;

        return (
            <React.Fragment>
                {/*<div className={classNames(classes.header, classes.section, classes.sectionWidth)} />*/}
                <DayCounter />
                <CurrentChump />
                <MiniStats />
                <ChumpHistory />


                <HitBoxChart/>
                <StreakGraph />
                <CommentsContainer />
                {/*<Current Image*/}
                {/*<Data (Graph, history, average)*/}
                {/*<Comments*/}
            </React.Fragment>

        )
    }
}

FrontPage.propTypes = {
    classes: PropTypes.object.isRequired
};

/**
 * Map the actions to props.
 */
const mapDispatchToProps = dispatch => ({
    // actions: bindActionCreators(Object.assign({}, authService), dispatch)
});

const combinedStyles = combineStyles(frontPageStyle, commonStyle);

export default withStyles(combinedStyles)(FrontPage)
