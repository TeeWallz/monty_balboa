import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import { VictoryChart, VictoryHistogram, VictoryLabel } from "victory";

import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import Chumps from "../../data/chumps";

const styles = theme => ({
    streakGraph:{
        width: '90%',
        height: '100px',
        fontSize: '0.5em',
    },
});

const sampleHistogramData = [
    { x: 0 },
    { x: 1 },
    { x: 1 },
    { x: 2 },
    { x: 3 },
    { x: 4 },
    { x: 4 }
]

class StreakGraph extends Component {

    render() {
        const {classes} = this.props;
        const chumps = Chumps();
        // const streakArray = chumps.map(e => x: e.streak});
        const streakArray = chumps.map(chump => ({ x: chump.streak }));


        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                <VictoryChart
                    domainPadding={{ x: 20 }}
                >
                    <VictoryLabel
                        x={225}
                        y={25}
                        textAnchor="middle"
                        text="Histogram of Streaks"
                    />
                    <VictoryLabel
                        x={225}
                        y={290}
                        textAnchor="middle"
                        text="Streaks in days"
                    />
                    <VictoryHistogram
                        style={{
                            // data: { fill: "#c43a31" }
                        }}
                        cornerRadius={5}
                        x = "streak"
                        data={chumps}
                        // bins={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 140, 160, 180, 200, 300]}
                        bins={15}
                        labels={({ datum }) => `${datum.y}`}
                    />
                </VictoryChart>
            </div>
        )
    }
}

StreakGraph.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(StreakGraph)
