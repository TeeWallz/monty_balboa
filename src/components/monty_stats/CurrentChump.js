import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import Chumps from "../../data/chumps";
import images from "../../images";


const styles = theme => ({
    chumpImageFrame: {
        // width: '60%',
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
        // padding: '10px',
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
    chumpImageContainer: {
        width: '100%',
    },
    chumpImage: {
        width: '100%',
    },
    chumpName: {
        fontSize: '4vw',
        textAlign: 'center',
    },
    candle: {
        position: 'absolute',
        width: '40%',
        bottom: '0',
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



    render () {
        const { classes } = this.props;
        const chumps = Chumps()
        let extension = chumps[0].image.split('.').pop();
        let my_image = (<></>)


        console.log("-----")
        console.log(extension)

        if (extension == 'webm') {
            my_image = (
                <>
                    <video width="320" height="320" autoPlay muted loop>
                        <source src={chumps[0].image} type="video/webm" />
                        Your browser does not support the video tag.
                    </video>
                </>
            )
        }
        else {
            my_image = (
                <img className={classes.chumpImage} src={chumps[0].image} />
            )
        }

        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                <div className={classes.commonHeaderText}>
                    Current ''''<span><img src={'/images/championredflaming2.gif'} /></span>''''
                </div>
                <div className={classes.chumpImageFrame}>
                    <div className={classes.chumpImageContainer}>
                        <img className={classes.frameRibbon} src={'/images/ribbon.png'} />
                        {/* <img className={classes.chumpImage} src={chumps[0].image} /> */}
                        {my_image}
                    </div>

                    <img className={classNames(classes.candle, classes.candleLeft)}
                        src={'/images/candle.gif'}
                    />
                    <img className={classNames(classes.candle, classes.candleRight)}
                        src={'/images/candle.gif'}
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
