import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { MainPage } from "../MainPage";
import { CardPage } from "../CardPage";

export const PageRouter: React.FC = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={MainPage} />
      <Route path="/card/:user/:reponame" component={CardPage} />
      <Redirect to="/" />
    </Switch>
  </Router>
);
