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
import {useBreakpoint} from '../breakpoint'


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
    // historyTableRow: {
    //     cursor:'pointer',
    // },
    thanksText: {
        fontSize: "0.5em",
    }
});


function ChumpHistory(props) {
    const {classes} = props;
    const {lightbox} = props;
    const chumps = Chumps();
    const breakpoints = useBreakpoint();
    

    function imageButton(id){
        return (
            <span onClick={() => props.setLightboxData({lightboxIsOpen: true, lightboxCurrentChumpId: id})}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                </svg>
            </span>
        )
    }
    
    function chumpLink(row){
        return (
            <span 
                style={{cursor:'pointer'}}
                onClick={() => window.open(row.url, '_blank').focus()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                    <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                </svg>
            </span>
        )
    }






    const large_columns = [
        {
            dataField: 'date_aus_string',
            text: 'Date',
            sortValue: (cell, row) => {
                return format(parse(cell, "dd/MM/yyyy", new Date()), 'yyyy-MM-dd')
            },
            sort: true,
            headerStyle: {
                width: '5em',
                textAlign: 'center',
            },
            style: {
                width: '5em',
                textAlign: 'center',
                fontSize: '0.8em',
            },
        },
        {
            dataField: 'name',
            text: 'Chump',
            sort: true,
            formatter: (cell, row, rowIndex, formatExtraData) => {
                return (
                    <div style={{cursor:'pointer'}}>
                        <div style={{fontSize: '1em;'}}>
                            {cell}
                        </div>
                        <div className={classNames(classes.thanksText)}>
                            {chumps[row.idx].thanks}
                        </div>
                    </div>
                )
            },
            events: {
                onClick: (e, column, columnIndex, row, rowIndex) => {
                  window.open(row.url, '_blank').focus();
                }
              },
        },
        {
            dataField: 'streak_yeet',
            text: 'Streak',
            sort: true,
            classes: classes.streakBar,
            sortValue: (cell, row) => {
                return cell[0]
            },
            formatter: (cell) => {
                return (
                    <div className={classes.streakBar} style={{width:cell[1]*100 + '%'}}>
                        {cell[0]}
                    </div>
                )
            }
        },
        {
            dataField: 'url',
            text: 'Link',
            headerStyle: {
                width: '3em',
                textAlign: 'center',
            },
            style: {
                fontSize: '2em',
                width: '3em',
                textAlign: 'center',
            },
            formatter: (cell, row, rowIndex, formatExtraData) => {
                return ( chumpLink(row) )
            },
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
                cursor:'pointer'
            },
            formatter: (cell, row, rowIndex, formatExtraData) => {
                return imageButton(rowIndex)
            }

        }
    ];

    const small_columns = [
        {
            dataField: 'date_aus_string',

            headerStyle: {
                width: '2em',
                textAlign: 'center',
            },
            events: {
                onClick: (e, column, columnIndex, row, rowIndex) => {
                    props.setLightboxData({lightboxIsOpen: true, lightboxCurrentChumpId: rowIndex})
                }
              },
            formatter: (cell, row, rowIndex, formatExtraData) => {
                return (
                    <img    src={row.thumb}
                            style={{
                                width:'100%',
                                border: '1px solid #555',
                                boxShadow: '2px 2px 2px 2px rgb(170 170 170 / 42%)'
                            }}
                    />
                )
            }
        },
        {
            dataField: 'date_aus_string',
            text: 'Chump',
            sortValue: (cell, row) => {
                return format(parse(cell, "dd/MM/yyyy", new Date()), 'yyyy-MM-dd')
            },
            sort: true,
            headerStyle: {
                width: '5em',
                textAlign: 'center',
            },
            // style: {
            //     width: '5em',
            //     textAlign: 'center',
            //     fontSize: '0.8em',
            // },
            events: {
                onClick: (e, column, columnIndex, row, rowIndex) => {
                    props.setLightboxData({lightboxIsOpen: true, lightboxCurrentChumpId: rowIndex})
                }
              },
            formatter: (cell, row, rowIndex, formatExtraData) => {
                return (
                    <span>
                        <div style={{fontSize: '1.5em', fontWeight: 'bold'}}> {row.date} </div>
                        <div style={{fontSize: '1.3em'}}> {row.name} </div>
                        <div style={{fontSize: '1em'}}> Streak - <b>{row.streak}</b> days </div>
                    </span>
                )
            }
        },
        {
            dataField: 'date_aus_string',
            text: '',
            sortValue: (cell, row) => {
                return format(parse(cell, "dd/MM/yyyy", new Date()), 'yyyy-MM-dd')
            },
            sort: true,
            headerStyle: {
                width: '2em',
                textAlign: 'center',
            },
            // style: {
            //     width: '5em',
            //     textAlign: 'center',
            //     fontSize: '0.8em',
            // },
            formatter: (cell, row, rowIndex, formatExtraData) => {
                return (
                    <span>
                        <span>{ imageButton(rowIndex) }</span>
                        <span style={{marginLeft:'10px'}}>{ chumpLink(row) }</span>
                    </span>
                )
            }
        },
    ]
    
    const tableData = chumps.map((_, i) => {
        return {
            date_aus_string: chumps[i].date_aus_string,
            idx: chumps[i].idx,
            date: chumps[i].date,
            name: chumps[i].chumps[0].name,
            urlText: chumps[i].chumps[0].url,
            url: chumps[i].chumps[0].url,
            streak: chumps[i].streak,
            streak_max_proportion: chumps[i].streak_max_proportion,
            streak_yeet: [chumps[i].streak, chumps[i].streak_max_proportion],
            image: chumps[i].idx,
            thumb: chumps[i].thumb,
        }
    });


    const matchingList = Object.keys(breakpoints).map(media => (
        <li key={media}>{media} ---- {breakpoints[media] ? 'Yes' : 'No'}</li>
      ))


    return (
        <div className={classNames(classes.section, classes.sectionWidth)}>
            <img src={'/images/rainhistory.gif'} />
            <BootstrapTable keyField='id'
                            data={tableData}
                            columns={ breakpoints.sm ? small_columns : large_columns }
                            bordered={ false }
                            // rowEvents={ rowEvents }
                            rowClasses={ classNames(classes.commonRegularText, classes.historyTableRow) }
                            keyField={"date"}
                            formatExtraData={tableData}
            />
        </div>
    )
}

ChumpHistory.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(ChumpHistory)
