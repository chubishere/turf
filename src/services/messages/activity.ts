export enum ActivityFieldType {
    Text,
    Camera,
    Image,
    Video,
    File
}

type ActivityField = {
    type: ActivityFieldType;
    required: boolean;
}

let imageRequiredField:ActivityField = {type: ActivityFieldType.Image, required: true};
let textOptionalField:ActivityField = {type: ActivityFieldType.Text, required: false};

export class Activity {
    id: number;
    fields: ActivityField[] = [];

    constructor(id: number, fields: ActivityField[]) {
        this.id = id;
        fields.forEach(field => this.fields.push(field));
    }
}

export class Activities {

    static activities: Activity[] = [
        new Activity(0, [imageRequiredField, textOptionalField])
    ];

    static get(activityId: number):Activity {
        return this.activities.filter(activity => activity.id === activityId).pop();
    }
}