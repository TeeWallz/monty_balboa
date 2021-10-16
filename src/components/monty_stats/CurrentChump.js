import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";


const styles = theme => ({
    chumpImage: {
        width: '75%',
        display: 'block',
        margin: 'auto',
    }
});

class CurrentChump extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classNames(classes.section)}>
                <div><img className={classes.chumpImage} src={"https://i.imgur.com/qPGkmgv.jpg"}/></div>
                <div>to moje imię</div>

            </div>
        )
    }
}

CurrentChump.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(CurrentChump)
