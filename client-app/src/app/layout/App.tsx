import React, { Fragment } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, RouteComponentProps, withRouter, Switch } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import {ToastContainer} from 'react-toastify';

const App: React.FC<RouteComponentProps> = ({ location }) => {

  return (
    <Fragment>
      <ToastContainer position="bottom-right" />
      <Route exact path="/" component={HomePage} />
      <Route path={"/(.+)"} render={() => (
        <Fragment>
          <NavBar />
          <Container style={{ marginTop: "7em" }}>
            <Switch>
              <Route exact path="/activities" component={ActivityDashboard} />
              <Route path="/activities/:id" component={ActivityDetails} />
              <Route
                key={location.key}
                path={["/createActivity", "/editActivity/:id"]}
                component={ActivityForm}
              />
              <Route component={NotFound} />
            </Switch>
          </Container>
      </Fragment>
      )}></Route>
    </Fragment>
  );
};

// have to export as an observer because only by making it as an observer,
// we can access the store component
export default withRouter(observer(App));
