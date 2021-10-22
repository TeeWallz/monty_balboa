import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import Table from 'react-bootstrap/Table'

import {format} from 'date-fns'
import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import Chumps from "../../data/chumps";
import boutsByYearWeek from "../../data/boutsByYearWeek";
import LightboxExample from "../lightbox/Lightbox";


const styles = theme => ({
    historyTable: {
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
    constructor(props) {
        super(props);
        this.state = {historyLimit: 10};
        // this.expandHistory = this.expandHistory.bind(this);
    }

    render() {
        const {classes} = this.props;
        const chumps = Chumps()

        const rows = chumps.map((_, i) => {
            let kek = 1;
            console.log(chumps[i])
            return (
                <tr>
                    <td className={classNames(classes.commonRegularText)}>{format(chumps[i].parsedDate, 'dd/MM/yyyy')}</td>
                    <td className={classNames(classes.commonRegularText)}>{chumps[i].streak}</td>
                    <td className={classNames(classes.commonSmallText)}>{chumps[i].chumps[0].name}</td>
                    <td className={classNames(classes.commonSmallText)}>🮥</td>
                </tr>
            )
        });

        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                <div className={classNames(classes.headerText)}>History (Think of funny thing)</div>
                <Table className={classNames(classes.historyTable, classes.commonRegularText)}>
                    <thead>
                    <tr>
                        <td>Date</td>
                        <td>Streak</td>
                        <td>"""winner"""</td>
                        <td>Image</td>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>

                </Table>
                <LightboxExample chumps={chumps}/>
            </div>
        )
    }
}

ChumpHistory.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(ChumpHistory)
