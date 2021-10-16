import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import chumps from "../../data/chumps.json";


const styles = theme => ({
    chartRows:{

    },
    chartRow:{
        // display: 'flex', // For large screens
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginTop: 0,
    },
    year:{
        marginTop: 0,
        marginBottom: 0,
        padding: 0,
        marginRight: '8px',
        fontSize: '0.6em',
        minWidth: '40px',
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

        return (
            <div className={classes.section}>
                <div className={'rows'}>
                    <div className={classes.chartRows}>
                        <div className={classes.chartRow}>
                            <div className={classes.year}>2021</div>
                            <div className={classes.hitList}>
                                <div className={classes.hitList}>
                                    {[...Array(52)].map((_, i) => {
                                        return (
                                            <div className={classNames(classes.hitBox, classes.hitBoxSafe)} ></div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className={classes.chartRow}>
                            <div className={classes.year}>2020</div>
                            <div className={classes.hitList}>
                                <div className={classes.hitList}>
                                    {[...Array(52)].map((_, i) => {
                                        return (
                                            <div className={classNames(classes.hitBox, classes.hitBoxSafe)} ></div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className={classes.chartRow}>
                            <div className={classes.year}>2019</div>
                            <div className={classes.hitList}>
                                <div className={classes.hitList}>
                                    {[...Array(52)].map((_, i) => {
                                        return (
                                            <div className={classNames(classes.hitBox, classes.hitBoxSafe)} ></div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
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
