import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import Chumps from "../../data/chumps";
import images from "../../images";


const styles = theme => ({
    chumpImageFrame: {
        width: '60%',
        // display: 'block',
        // margin: 'auto',
        maxWidth: '70%',
        backgroundColor: '#ddc',
        border: 'solid 4vmin #eee',
        borderBottomColor: '#fff',
        borderLeftColor: '#eee',
        borderRadius: '2px',
        borderRightColor: '#eee',
        borderTopColor: '#ddd',
        boxShadow: '0 0 5px 0 rgb(0 0 0 / 25%) inset, 0 5px 10px 5px rgb(0 0 0 / 25%)',
        boxSizing: 'border-box',
        display: 'inline-block',
        margin: '2vh 2vw',
        padding: '10px',
        position: 'relative',
        textAlign: 'center',
        "&:before": {
            borderRadius: '2px',
            bottom: '-2vmin',
            boxShadow: '0 2px 5px 0 rgb(0 0 0 / 25%) inset',
            content: '""',
            left: '-2vmin',
            position: 'absolute',
            right: '-2vmin',
            top: '-2vmin',
        },
        "&:after": {
            borderRadius: '2px',
            bottom: '-2.5vmin',
            boxShadow: '0 2px 5px 0 rgb(0 0 0 / 25%)',
            content: '""',
            left: '-2.5vmin',
            position: 'absolute',
            right: '-2.5vmin',
            top: '-2.5vmin',
        },
    },
    chumpImageContainer:{
        width: '100%',
    },
    chumpImage:{
        width: '100%',
    },
    chumpName: {
        fontSize: '4vw',
    },
    candle:{
        position: 'absolute',
        width: '40%',
        top: '70%',
        zIndex: 100,
    },
    candleLeft: {
        right: '80%',
    },
    candleRight: {
        right: '-20%',
        WebkitTransform: 'scaleX(-1)',
        transform: 'scaleX(-1)',
    },
    frameRibbon: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        right: '1px',
    }

});

class CurrentChump extends Component {

    render() {
        const {classes} = this.props;
        const chumps = Chumps()

        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                <div className={classes.commonHeaderText}>Current ''''champion''''</div>
                <div className={classes.chumpImageFrame}>
                    <div className={classes.chumpImageContainer}>
                        <img className={classes.frameRibbon} src={images['ribbon.png'].default}/>
                        <img className={classes.chumpImage} src={chumps[0].local_image}/>
                    </div>

                    <img className={classNames(classes.candle, classes.candleLeft)}
                         src={images['candle.gif'].default}
                    />
                    <img className={classNames(classes.candle, classes.candleRight)}
                         src={images['candle.gif'].default}
                    />
                    {/*<div className={classNames(classes.frameRibbon)}></div>*/}

                </div>
                <div className={classNames(classes.chumpName, classes.commonBigText)}>
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
