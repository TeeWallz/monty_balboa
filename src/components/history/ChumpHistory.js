import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';

import { format } from 'date-fns'
import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import Chumps from "../../data/chumps";
import boutsByYearWeek from "../../data/boutsByYearWeek";



const styles = theme => ({
    historyTable:{
        fontSize: '0.5em',
    },
    headerText: {
        fontSize: '5vw',
    },
    regularText: {
        fontSize: '2vw',
    },
});



class ChumpHistory extends Component {

    render() {
        const {classes} = this.props;
        const {historyLimit} = this.props;
        const chumps = Chumps()

        const rows = [...Array(10)].map((_, i) => {
            let kek = 1;
            return (
                <tr>
                    <td className={classNames(classes.commonRegularText)}>{format(chumps[i].parsedDate, 'dd/MM/yyyy')}</td>
                    <td className={classNames(classes.commonRegularText)}>{chumps[i].streak}</td>
                    <td className={classNames(classes.commonSmallText)}>{chumps[i].chumps[0].name}</td>
                </tr>
            )
        });

        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                <div className={classNames(classes.headerText)}>Recent Top 'Hits'</div>
                <table className={classNames(classes.historyTable, classes.commonRegularText)}>
                    <thead>
                        <tr>
                            <td>Date</td>
                            <td>Streak</td>
                            <td>"""winner"""</td>
                        </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>

                </table>
                <div className={classNames(classes.commonSmallText)} style={{textAlign: 'right', width: '100%'}}>
                    See More >>
                </div>

            </div>
        )
    }
}

ChumpHistory.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(ChumpHistory)
