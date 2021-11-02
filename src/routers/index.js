import React from 'react';
import {BrowserRouter, Switch, withRouter} from 'react-router-dom';
import { Route } from 'react-router-dom';

import LayoutRoute from "./LayoutRoute";
// import NotFound from "../components/error/NotFound";
import MainLayout from "../components/common/layout/MainLayout";
import FrontPage from "../layouts/FrontPage";
import ChumpsApi from "../components/api/ChumpsApi"
import ApiNotice from "../components/social/ApiNotice";
// import ImagesApi from "../components/api/ImagesApi";

const Router = () => (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
            <LayoutRoute  exact path="/" layout={MainLayout} component={FrontPage} />
            <Route        exact path="/chumps"  component={ChumpsApi}/>
            <LayoutRoute        path="/api"  component={ApiNotice}/>
        </Switch>
    </BrowserRouter>
);

export default Router;