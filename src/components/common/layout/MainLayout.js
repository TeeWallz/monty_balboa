import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import HTMLComment from 'react-html-comment';
import ReactGA from 'react-ga';

import Header from "./Header";
import Footer from "./Footer";
import FunnyHtmlComment from "./FunnyComment";


// Import custom components
// import Header from '../header/Header';
// import MiniDrawer from '../drawer/MiniDrawer';
// import Footer from '../footer/Footer';


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

const MainLayout = (props) => {
    const { classes, children } = props;
    // const [open, setOpen] = useState(true);
    //
    // const handleToggle = () => setOpen(!open);

    return (
        <div className={classes.root}>
            <FunnyHtmlComment />
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
