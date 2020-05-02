import React, {useContext, Fragment } from "react";
import { Item, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStores";
import ActivityListItems from './ActivityListItems';

const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const {
    activitiesByDate,
  } = activityStore;

  return (
    <Fragment>
      {activitiesByDate.map(([group, activities]) => (
        <Fragment>
          <Label size="large" color="blue">
            {group}
          </Label>
          <Item.Group divided>
            {activities.map((activity) => (
              <ActivityListItems key={activity.id} activity={activity}/>
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
