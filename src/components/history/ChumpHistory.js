import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import Table from 'react-bootstrap/Table'
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {parse} from 'date-fns'

import {format} from 'date-fns'
import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import Chumps from "../../data/chumps";
import boutsByYearWeek from "../../data/boutsByYearWeek";
import images from "../../images";


const styles = theme => ({
    streakBar: {
        paddingTop: '2px',
        paddingBottom: '2px',
        color: '#fff',
        backgroundColor: '#DACFBB',
        fontWeight: 700,
        textAlign: 'right',
        paddingLeft: '3px',
        minWidth: '20px!important',
        borderRadius: '4px',
        paddingRight: '6px',
        // fontSize: '0.1em',
    },
    historyTableRow: {
        cursor:'pointer',
    },
    thanksText: {
        fontSize: "0.5em",
    }
});


class ChumpHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {historyLimit: 10};
        // this.onRowClick = this.onRowClick.bind(this);

        this.rowEvents = {
            onClick: (e, row, rowIndex) => {
                this.props.setLightboxData({lightboxIsOpen: true, lightboxCurrentChumpId: row.idx})
            }
        };
    }

    imageButton(){

    }

    render() {
        const {classes} = this.props;
        const {lightbox} = this.props;
        const chumps = Chumps()

        const columns = [
            {
                dataField: 'date_aus_string',
                text: 'Date',
                sortValue: (cell, row) => {
                    return format(parse(cell, "dd/MM/yyyy", new Date()), 'yyyy-MM-dd')
                },
                sort: true,
                headerStyle: {
                    width: '8em',
                    textAlign: 'center',
                },
                style: {
                    width: '8em',
                    textAlign: 'center',
                },
            },
            {
                dataField: 'name',
                text: 'Chump',
                sort: true,
                formatter: (cell, row, rowIndex, formatExtraData) => {
                    console.log(cell, row, rowIndex, formatExtraData)
                    return (
                        <div>
                            <div>
                                {cell}
                            </div>
                            <div className={classNames(classes.thanksText)}>
                                {chumps[row.idx].thanks}
                            </div>
                        </div>
                    )
                }
            },
            {
                dataField: 'streak_yeet',
                text: 'Streak',
                sort: true,
                classes: classes.streakBar,
                sortValue: (cell, row) => {
                    return cell[0]
                },
                formatter: (cell, row, rowIndex, formatExtraData) => {
                    return (
                        <div className={classes.streakBar} style={{width:cell[1]*100 + '%'}}>
                            {cell[0]}
                        </div>
                    )
                }
            },
            {
                text: 'Image',
                dataField: 'image',
                headerStyle: {
                    width: '4em',
                    textAlign: 'center',
                },
                style: {
                    fontSize: '2em',
                    width: '4em',
                    textAlign: 'center',
                },

            }
        ];



        const tableData = chumps.map((_, i) => {
            return {
                date_aus_string: chumps[i].date_aus_string,
                idx: chumps[i].idx,
                date: chumps[i].date,
                name: chumps[i].chumps[0].name,
                url: chumps[i].chumps[0].url,
                streak: chumps[i].streak,
                streak_max_proportion: chumps[i].streak_max_proportion,
                streak_yeet: [chumps[i].streak, chumps[i].streak_max_proportion],
                image: '>',
            }
        });

        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                {/*<div className={classNames(classes.commonHeaderText)}>History</div>*/}
                <img src={'/images/rainhistory.gif'} />
                <BootstrapTable keyField='id'
                                data={tableData}
                                columns={columns} bordered={ false }
                                rowEvents={ this.rowEvents }
                                rowClasses={ classNames(classes.commonRegularText, classes.historyTableRow) }
                                keyField={"date"}
                />
            </div>
        )
    }
}

ChumpHistory.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(ChumpHistory)
