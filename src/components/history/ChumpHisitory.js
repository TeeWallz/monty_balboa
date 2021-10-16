import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";

import chumps from '../../data/chumps.json'

const styles = theme => ({
    historyTable:{
        fontSize: '0.5em',
    }
});

class ChumpHistory extends Component {

    render() {
        const {classes} = this.props;
        const {historyLimit} = this.props;
        console.log(chumps)

        const rows = [...Array(10)].map((_, i) => {
            return (
                <tr>
                    <td>{chumps[i].date}</td>
                    <td>{chumps[i].chumps[0].name}</td>
                </tr>
            )
        });

        return (
            <div className={classNames(classes.section)}>
                <div>Recent Top 'Hits'</div>
                <table className={classes.historyTable}>
                    <thead>
                        <tr><td>Date</td></tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>

                </table>

            </div>
        )
    }
}

ChumpHistory.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(ChumpHistory)
