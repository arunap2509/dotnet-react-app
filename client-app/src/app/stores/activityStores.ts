import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activities";
import agent from "../api/agent";

configure({enforceActions: 'always'});

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined = undefined;
  @observable initialLoader = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = '';

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  @action loadActivities = async () => {
    this.initialLoader = true;
    try {
      var activities = await agent.Activities.list();
      runInAction('loadingActivities',() => {
        activities.forEach((activity: IActivity) => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
          this.initialLoader = false;
        });
      })
    } catch (err) {
      runInAction('loading activities error',() => {
        this.initialLoader = false;
      })
      console.log(err);
    }
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction('create activity',() => {
        this.activityRegistry.set(activity.id, activity);
        this.editMode = false;
        this.submitting = false;
      })
    } catch (err) {
      runInAction('create activity error',() => {
        this.submitting = false;
      })
      console.log(err);
    }
  };

  @action editActivity = async (activity: IActivity) => {
      this.submitting = true;
      try {
          await agent.Activities.update(activity);
          runInAction('editing activity',() => {
            this.activityRegistry.set(activity.id, activity);
            this.selectedActivity = activity;
            this.editMode = false;
            this.submitting = false;
          })
      } catch (error) {
        runInAction('editing activity error',() => {
          this.submitting = false;
        })
        console.log(error);
      }
  }

  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>,id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction('delete activity', () => {
              this.activityRegistry.delete(id);
              this.submitting = false;
              this.target = '';
            })
        } catch(error) {
          runInAction('delete activity error', () => {
            this.submitting = false;
            this.target = '';
          });
          console.log(error);
        }
  }

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  @action openEditForm = (id: string) => {
      this.selectedActivity = this.activityRegistry.get(id);
      this.editMode = true;
  }

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  };

  @action cancelSelectedActivity = () => {
      this.selectedActivity = undefined;
  }

  @action cancelOpenForm = () => {
      this.editMode = false;
  }
}

// we are using this to make the store available for all components
export default createContext(new ActivityStore());
