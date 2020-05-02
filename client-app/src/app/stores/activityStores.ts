import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activities";
import agent from "../api/agent";

configure({enforceActions: 'always'});

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable initialLoader = false;
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

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if(activity) {
      this.activity = activity;
    } else {
      this.initialLoader = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction('getting activity', () => {
          this.activity = activity;
          this.initialLoader = false;
        });
      } catch(err) {
        runInAction('getting acivity error', () => {
          this.initialLoader = false;
        })
        console.log(err);
      }
    }
  }

  @action clearActivity = () => {
    this.activity = null;
  }

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction('create activity',() => {
        this.activityRegistry.set(activity.id, activity);
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
            this.activity = activity;
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
}

// we are using this to make the store available for all components
export default createContext(new ActivityStore());
