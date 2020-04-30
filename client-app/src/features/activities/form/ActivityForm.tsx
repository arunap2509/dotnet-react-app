import React, { useState, FormEvent } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activities";
import {v4 as uuid} from "uuid";

interface IProps {
  setEditMode: (editMode: boolean) => void;
  activity: IActivity;
  createActivity: (activity: IActivity) => void;
  editActivity: (activity: IActivity) => void;
}

export const ActivityForm: React.FC<IProps> = ({
  setEditMode,
  activity: initializeFormState,
  createActivity,
  editActivity
}) => {
  const initializeForm = () => {
    if (initializeFormState) {
      return initializeFormState;
    } else {
      return {
        id: "",
        title: "",
        description: "",
        category: "",
        date: "",
        city: "",
        venue: "",
      };
    }
  };

  const [activity, setActivity] = useState<IActivity>(initializeForm);

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () => {
    if(activity.id.length === 0) {
      let newActivity = { ...activity, id: uuid()}
      createActivity(newActivity);
    } else {
      editActivity(activity);
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

        <Button floated="right" type="submit" content="Submit" positive />
        <Button
          onClick={() => setEditMode(false)}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
};
