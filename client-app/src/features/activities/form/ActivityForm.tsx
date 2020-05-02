import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activities";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStores";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

interface IDetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<IDetailParams>> = ({
  match,history
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    activity: initializeFormState,
    loadActivity,
    clearActivity
  } = activityStore;

  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    description: "",
    category: "",
    date: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    if(match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id).then(
        () => initializeFormState && setActivity(initializeFormState)
      );
    }
    
    return () => {
      clearActivity();
    };
  }, [loadActivity, clearActivity, match.params.id, initializeFormState, activity.id.length]);

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = { ...activity, id: uuid() };
      createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
    } else {
      editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
    }
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          onChange={handleInputChange}
          name="title"
          placeholder="title"
          value={activity.title}
        />
        <Form.Input
          onChange={handleInputChange}
          name="category"
          placeholder="category"
          value={activity.category}
        />
        <Form.TextArea
          onChange={handleInputChange}
          name="description"
          rows={2}
          placeholder="description"
          value={activity.description}
        />
        <Form.Input
          onChange={handleInputChange}
          name="date"
          type="datetime-local"
          placeholder="date"
          value={activity.date}
        />
        <Form.Input
          onChange={handleInputChange}
          name="city"
          placeholder="city"
          value={activity.city}
        />
        <Form.Input
          onChange={handleInputChange}
          name="venue"
          placeholder="venue"
          value={activity.venue}
        />

        <Button
          loading={submitting}
          floated="right"
          type="submit"
          content="Submit"
          positive
        />
        <Button
          onClick={() => history.push('/activities')}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
