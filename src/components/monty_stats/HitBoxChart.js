import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import chumps from "../../data/chumps.json";
import Chumps from "../../data/chumps";
import boutsByYearWeek from "../../data/boutsByYearWeek";


const styles = theme => ({
    chartRows:{

    },
    chartRow:{

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
    year:{
        marginTop: 0,
        marginBottom: 0,
        padding: 0,
        marginRight: '8px',
        minWidth: '40px',
        fontSize: '2.5vw',
    },
    hitList:{
        flexWrap: 'wrap',
        display: 'flex',
    },
    hitBox:{
        // width: '22px',
        // height: '17px',
        width: '10px',
        height: '7px',
        background: 'grey',
        marginRight: '1px',
        marginLeft: '1px',
        marginBottom: '2px',
        fontSize: '0.1em',
    },
    hitBoxDoubleKill:{
        backgroundColor: '#6f110b'
    },
    hitBoxHit:{
        backgroundColor: '#f44336'
    },
    hitBoxSafe:{
        backgroundColor: '#33b5e5'
    },

});

class HitBoxChart extends Component {

    render() {
        const {classes} = this.props;
        const ourBoutsByYearWeek = Object.entries(boutsByYearWeek()).reverse()

        const rows = ourBoutsByYearWeek.map(elem => (
                <div className={classes.chartRow}>
                    <div className={classNames(classes.year, classes.commonBigText)}>{elem[0]}</div>
                    <div className={classes.hitList}>
                        {
                            Object.keys(elem[1]).map(elemWeek => (
                                <div className={classes.hitList}>
                                    <div className={
                                        classNames(classes.hitBox, {
                                            [classes.hitBoxDoubleKill]: elem[1][elemWeek]>1,
                                            [classes.hitBoxHit]: elem[1][elemWeek]===1,
                                            [classes.hitBoxSafe]: elem[1][elemWeek]===0
                                        })
                                    }>
                                        {/*{elem[1][elemWeek]}*/}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
        ));


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
    }
}

HitBoxChart.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(HitBoxChart)
