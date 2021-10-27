import React from 'react';
import {BrowserRouter, Switch} from 'react-router-dom';


import LayoutRoute from "./LayoutRoute";
// import NotFound from "../components/error/NotFound";
import MainLayout from "../components/common/layout/MainLayout";
import FrontPage from "../layouts/FrontPage";

const Router = () => (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
            <LayoutRoute  exact path="/" layout={MainLayout} component={FrontPage} />
        </Switch>
    </BrowserRouter>
);

export default Router;