import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Header from "./Header";

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
        margin: 'auto',

        padding: '10px',
        [theme.breakpoints.up('xs')]: {
            marginLeft: '10px',
            marginRight: '10px',
        },
        [theme.breakpoints.up('md')]: {
            'marginLeft': 'auto',
            'marginRight': 'auto',
            width: '800px',
        },
    },
    content: {
        width: '100%',
        flexGrow: 1,
    },
    section:{
        background-color: var(--section-bg-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 8px;
        margin-right: 8px;
        padding: 8px;
        box-shadow: 2px 2px 2px 2px var(--box-shadow-color);
        margin-bottom: 32px;
    }
});

const MainLayout = (props) => {
    const { classes, children } = props;
    // const [open, setOpen] = useState(true);
    //
    // const handleToggle = () => setOpen(!open);

    return (
        <div className={classes.root}>
            <div className={classes.appFrame}>
                <Header/>
                {/*<Header navDrawerOpen={open} handleToggleDrawer={handleToggle} />*/}
                {/*<MiniDrawer navDrawerOpen={open} />*/}
                <main className={classes.content}>{children}</main>
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
