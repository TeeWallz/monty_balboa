import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import Popup from 'reactjs-popup';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import ReactTooltip from "react-tooltip";

import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import chumps from "../../data/chumps.json";
import Chumps from "../../data/chumps";
import boutsByYearWeek from "../../data/boutsByYearWeek";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";


const styles = theme => ({
    chartRows: {},
    chartRow: {

        flexWrap: 'nowrap',
        marginTop: 0,
        flexDirection: 'row',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            marginTop: 0,
        },
    },
    year: {
        marginTop: 0,
        marginBottom: 0,
        padding: 0,
        marginRight: '8px',
        // minWidth: '40px',
        fontSize: '2.5vw',
    },
    hitList: {
        flexWrap: 'wrap',
        display: 'flex',
    },
    hitBox: {
        // width: '22px',
        background: 'grey',
        marginRight: '1px',
        marginLeft: '1px',
        marginBottom: '2px',
        fontSize: '0.1em',
        // height: '17px',
        width: '18px',
        height: '17px',
        [theme.breakpoints.up('md')]: {
            width: '18px',
            height: '17px',
        },
    },
    hitBoxDoubleKill: {
        backgroundColor: '#6f110b'
    },
    hitBoxHit: {
        backgroundColor: '#f44336'
    },
    hitBoxSafe: {
        backgroundColor: '#33b5e5'
    },

});

function getPopupData(yearWeek){
    const ourBoutsByYearWeek = boutsByYearWeek()

    if (!(typeof yearWeek === 'string' || yearWeek instanceof String)){
        return '';
    }

    const yearWeekSplit = yearWeek.split("/");
    const ass = ourBoutsByYearWeek[yearWeekSplit[0]][yearWeekSplit[1]]
    if(ass.length == 0){
        return ""
    }
    return (
        <div>
            <div style={{width:'100px', marginLeft: 'auto', marginRight: 'auto'}}>
                <img src={ass.chumps[0].image} style={{width:'100%'}}/>
            </div>
            <div >{ass.chumps[0].name}</div>
        </div>
    )
}

class HitBoxChart extends Component {


    render() {

        const {classes} = this.props;

        const bouts = boutsByYearWeek();
        const years = Object.keys(bouts).reverse();

        const rows = years.map(year => (
            <div className={classes.chartRow}>
                <ReactTooltip id="registerTip" place="top" effect="solid" getContent={getPopupData}>
                </ReactTooltip>

                <div className={classNames(classes.year, classes.commonBigText)}>{year}</div>

                <div className={classes.hitList}>
                    {
                        Object.keys(bouts[year]).map(elemWeek => (



                            <div className={classes.hitList}>
                                <div data-tip={year + "/" + elemWeek} data-for={bouts[year][elemWeek].chumps.length > 0 ? 'registerTip' : ''} className={
                                    classNames(classes.hitBox, {
                                        [classes.hitBoxDoubleKill]: bouts[year][elemWeek].chumps.length > 1,
                                        [classes.hitBoxHit]: bouts[year][elemWeek].chumps.length === 1,
                                        [classes.hitBoxSafe]: bouts[year][elemWeek].chumps.length === 0
                                    })
                                }>
                                    {bouts[year][elemWeek].length}
                                </div>
                            </div>



                        ))
                    }
                </div>
            </div>
        ));

        let y = 8;

        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                <div className={'rows'}>
                    <div className={classes.chartRows}>
                        {rows}
                    </div>
                </div>
                <div className={classNames(classes.commonSmallText)} style={{textAlign: 'right', width: '100%'}}>
                    Legend for colours here. Make boxes clickable/hoverable?
                </div>
            </div>
        )


        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                <button data-tip data-for="registerTip">
                    Register
                </button>


            </div>
        )


    }
}

HitBoxChart.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(HitBoxChart)
