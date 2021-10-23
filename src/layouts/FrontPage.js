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
import LightboxExample from "../components/lightbox/Lightbox";
import Chumps from "../data/chumps";
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
    constructor(props) {
        super(props);
        this.setLightboxData = this.setLightboxData.bind(this);
        this.lightboxTitle = this.lightboxTitle.bind(this);
        this.chumps = Chumps()

        this.state = {
            lightboxCurrentChumpId : 0,
            lightboxIsOpen: false,
            lightboxTitle: '',
        }
    }

    lightboxTitle(idx){
        return this.chumps[idx].date_aus_string + ' - ' + this.chumps[idx].chumps[0].name
    }

    setLightboxData(state) {
        // We don't have the photo id directly, get it from year/week
        // This could be integrated into the boutByYearWeek directly later
        if('key' in state){
            let chumpId = 0;
            for(let i = 0; i < this.chumps.length; i++){
                if(this.chumps[i].date_year.toString() === state.key[0] && this.chumps[i].date_week.toString() === state.key[1]){
                    chumpId = i;
                    break;
                }
            }
            state.lightboxCurrentChumpId = chumpId;
        }


        console.log("Setting state")
        console.log(state)
        this.setState(state)
    }

    render() {
        const {classes} = this.props;

        return (
            <React.Fragment>
                <LightboxExample lightboxCurrentChumpId={this.state.lightboxCurrentChumpId}
                                 lightboxIsOpen={this.state.lightboxIsOpen}
                                 lightboxTitle={this.lightboxTitle}
                                 setLightboxData={this.setLightboxData}/>

                <DayCounter />
                <CurrentChump />
                <MiniStats />
                <ChumpHistory setLightboxData={this.setLightboxData}/>


                <HitBoxChart setLightboxData={this.setLightboxData}/>
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
