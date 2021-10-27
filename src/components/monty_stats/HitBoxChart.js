import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import ReactTooltip from "react-tooltip";

import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import boutsByYearWeek from "../../data/boutsByYearWeek";


const styles = theme => ({
    chartRows: {},
    chartRow: {
        marginBottom: '7px',
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
        width: '420px',
        maxWidth: '3em',
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

const localStyle = {
    popupBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '2em'
    }
}


class HitBoxChart extends Component {
    constructor(props) {
        super(props);
        this.getPopupData = this.getPopupData.bind(this);
        // this.openModal = this.openModal.bind(this);
    }


    getPopupData(yearWeek) {
        const ourBoutsByYearWeek = boutsByYearWeek()

        // Is our entry null/invalid? If so, return default value
        if (!(typeof yearWeek === 'string' || yearWeek instanceof String)) {
            return '';
        }

        // We only get a key string, so split it to access our array
        const yearWeekSplit = yearWeek.split("/");
        const ass = ourBoutsByYearWeek[yearWeekSplit[0]][yearWeekSplit[1]]
        if (ass.length == 0) {
            return ""
        }


        return (
            <div style={localStyle.popupBox}>
                <img src={ass.chumps[0].image} style={{width: '7em'}}/>
                <div>{ass.date}</div>
                <div>{ass.chumps[0].name}</div>
            </div>
        )
    }

    // openModal(year, elemWeek) {
    //     console.log(year, elemWeek)
    //     this.setState({
    //
    //     })
    // }

    render() {

        const {classes} = this.props;
        const {lightbox} = this.props;

        const bouts = boutsByYearWeek();
        const years = Object.keys(bouts).reverse();

        const rows = years.map(year => (
            <div className={classes.chartRow}>
                <div className={classNames(classes.year, classes.commonBigText)}

                >
                    {year}
                </div>

                <div className={classes.hitList}>
                    {
                        Object.keys(bouts[year]).map(elemWeek => (


                            <div className={classes.hitList}>
                                {/*<div onClick={() => lightbox.openMe(year, elemWeek)}*/}
                                <div onClick={() => this.props.setLightboxData({lightboxIsOpen: true, key: [year, elemWeek]})}
                                    data-tip={year + "/" + elemWeek} data-for={bouts[year][elemWeek].chumps.length > 0 ? 'registerTip' : ''} className={
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

        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                <div className={classNames(classes.commonHeaderText)}>
                    Streak Calendar
                </div>
                <div className={'rows'}>
                    <div className={classes.chartRows}>
                        {rows}
                    </div>
                </div>
                {/*<div className={classNames(classes.commonSmallText)} style={{textAlign: 'right', width: '100%'}}>*/}
                {/*    Legend for colours here. Make boxes clickable/hoverable?*/}
                {/*</div>*/}
                <ReactTooltip id="registerTip" place="top" effect="solid" getContent={this.getPopupData}>
                </ReactTooltip>
            </div>
        )


    }
}

HitBoxChart.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(HitBoxChart)
