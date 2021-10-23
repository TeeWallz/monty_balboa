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

const products = [{id: 1, name: 'yeet', price: 1}];
const columns = [
    {
        dataField: 'date_aus_string',
        text: 'Date',
        sortValue: (cell, row) => parse(cell, 'dd/MM/yyyy'),
        sort: true,
        headerStyle: {
            fontSize: '0.5em'
        },
        style: {
            fontSize: '0.5em'
        },
    },
    {
        dataField: 'name',
        text: 'Product Name',
        sort: true,
        headerStyle: {
            fontSize: '0.5em'
        },
        style: {
            fontSize: '0.5em'
        },
    },
    {
        text: 'Image',
        dataField: 'image',
        headerStyle: {
            fontSize: '0.5em',
            width: '5em',
            textAlign: 'center',
        },
        style: {
            fontSize: '0.5em'
        },

    }
];


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

        const rows = chumps.map((_, i) => {
            let kek = 1;
            // console.log(chumps[i])
            return (
                <tr>
                    <td className={classNames(classes.commonRegularText)}>{format(chumps[i].parsedDate, 'dd/MM/yyyy')}</td>
                    <td className={classNames(classes.commonRegularText)}>{chumps[i].streak}</td>
                    <td className={classNames(classes.commonSmallText)}>
                        <a href={chumps[i].chumps[0].url} target={"_blank"}>
                            {chumps[i].chumps[0].name}
                        </a>
                    </td>
                    <td className={classNames(classes.commonSmallText)}
                        style={{cursor: 'pointer'}}
                        onClick={() => this.props.setLightboxData({lightboxIsOpen: true, lightboxCurrentChumpId: i})}
                    >🮥
                    </td>
                </tr>
            )
        });

        const tableData = chumps.map((_, i) => {
            return {
                date_aus_string: chumps[i].date_aus_string,
                idx: chumps[i].idx,
                date: chumps[i].date,
                name: chumps[i].chumps[0].name,
                url: chumps[i].chumps[0].url,
                image: '🮥',
            }
        });

        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                <div className={classNames(classes.headerText)}>History (Think of funny thing)</div>
                {/*<Table className={classNames(classes.historyTable, classes.commonRegularText)}>*/}
                {/*    <thead>*/}
                {/*    <tr>*/}
                {/*        <td>Date</td>*/}
                {/*        <td>Streak</td>*/}
                {/*        <td>"""winner"""</td>*/}
                {/*        <td>Image</td>*/}
                {/*    </tr>*/}
                {/*    </thead>*/}
                {/*    <tbody>*/}
                {/*    {rows}*/}
                {/*    </tbody>*/}

                {/*</Table>*/}
                <BootstrapTable keyField='id'
                                data={tableData}
                                columns={columns} bordered={ false }
                                rowEvents={ this.rowEvents }/>
                <lightbox chumps={chumps}/>
            </div>
        )
    }
}

ChumpHistory.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(ChumpHistory)
