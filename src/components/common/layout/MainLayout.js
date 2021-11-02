import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DocumentMeta from 'react-document-meta';

import Header from "./Header";
import Footer from "./Footer";
import FunnyHtmlComment from "./FunnyComment";
import Chumps from "../../../data/chumps";


const styles = (theme) => ({
    root: {
        width: '100%',
        height: 'auto',
        zIndex: 1,
        overflow: 'hidden',
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        paddingBottom: '32px',
        paddingTop: '8px',
        marginTop: '10px',
        margin: 'auto',
        padding: '10px',
        backgroundColor: '#fff5ee',
        alignItems: 'center',

        [theme.breakpoints.up('xs')]: {
            marginLeft: '10px',
            marginRight: '10px',
        },

        flexGrow: 1,
        // [theme.breakpoints.up('md')]: {
        //     'marginLeft': 'auto',
        //     'marginRight': 'auto',
        //     width: '800px',
        // },
    },
    content: {
        width: '100%',
        flexGrow: 1,
    },

});

const bouts = Chumps();
const age = bouts[0].streak;
const date = bouts[0].date_aus_string;
const days_str = (age == 1) ? 'day' : 'days';
const description = `Tracking lost fights against the Montague Street Bridge. Latest bout ${age} ${days_str} ago on ${date}`;

const meta = {
    title: 'How Many Days Since The Montague Street Bridge Has Been Hit?',
    description: description,
    canonical: 'https://howmanydayssincemontaguestreetbridgehasbeenhit.com/',
    meta: {
        charset: 'utf-8',
        name: {
            keywords: 'Montague Street Bridge how many days bus truck how many days since montague street bridge has been hit'
        }
    }
}

const MainLayout = (props) => {
    const { classes, children } = props;
    // const [open, setOpen] = useState(true);
    //
    // const handleToggle = () => setOpen(!open);

    return (
        <div className={classes.root}>
            <DocumentMeta {...meta} />
            <div className={classes.appFrame}>
                <Header/>
                {children}
                <Footer/>
            </div>
            {/*<Footer />*/}
        </div>
    );
};

MainLayout.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.element,
};

export default withStyles(styles)(MainLayout);
