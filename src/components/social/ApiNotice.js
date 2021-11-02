import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";


const styles = theme => ({


});

class ApiNotice extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div>
                <div>
                    Please see
                    <a href={"https://howmanydayssincemontaguestreetbridgehasbeenhit.com/chumps.json"}>/chumps.json</a>
                    for API data.
                </div>
                <div>
                    This site is currently changing it's hosting method. An API method should be implemented soon.
                </div>
                <div>
                    Sorry for an inconvenience
                </div>
                <div>
                    Please shout at <b>thomas.r.waller [at] gmail.com</b> if you're annoyed by this and I'll try to implement this quicker
                </div>
            </div>
        )
    }
}

ApiNotice.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(ApiNotice)
