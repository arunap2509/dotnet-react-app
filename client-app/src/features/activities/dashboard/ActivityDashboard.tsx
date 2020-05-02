import React, { useEffect, useContext } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import ActivityStore from '../../../app/stores/activityStores';
import { LoadingComponent } from "../../../app/layout/LoadingComponent";

const ActivityDashboard: React.FC = () => {

  const activityStore = useContext(ActivityStore);
  const { loadActivities } = activityStore;
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if (activityStore.initialLoader)
    return <LoadingComponent content="Loading Activities..." />;
    
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList/>
      </Grid.Column>
      <Grid.Column width={6}>
        <h2>Activity Filters</h2>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
