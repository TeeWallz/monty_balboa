import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";


const styles = theme => ({
    streakGraph:{
        width: '90%',
        height: '100px',
        fontSize: '0.5em',
    },
});

const data = [
    {
        year: '2019',
        hits: 10,
    },
    {
        year: '2020',
        hits: 20,
    },
    {
        year: '2021',
        hits: 15,
    },

];

class StreakGraph extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classNames(classes.streakGraph)}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        // width={500}
                        // height={300}
                        data={data}
                        margin={{ top: 0, left: -40, right: -10, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        {/*<Tooltip />*/}
                        <Legend />
                        <Bar dataKey="hits" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }
}

StreakGraph.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(StreakGraph)
