import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activities";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [
    selectedActivity,
    setSelectedActivity,
  ] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleSelectedActivity = (id: string) => {
    setSelectedActivity(
      activities.filter((activity) => activity.id === id)[0]
    );
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity = (activity: IActivity) => {
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleEditActivity = (activity: IActivity) => {
    setActivities([...activities.filter(a => a.id !== activity.id), activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(a => a.id !== id)]);
  }
  // since this hook is a combination of three hooks if we dont specify the
  // second parameter it will get executed continuously
  useEffect(() => {
    axios
      .get<IActivity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        let activitiesList: IActivity[] = [];
        response.data.forEach((activity: IActivity) => {
          activity.date = activity.date.split(".")[0];
          activitiesList.push(activity);
        });
        setActivities(activitiesList);
      });
  }, []);

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectedActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </Fragment>
  );
};

export default App;
