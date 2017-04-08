/**
 * Manages messages between users
 * 
 */
import { LocalNotifications } from 'ionic-native'; // just a test

export enum MessageResponseRequired {
    YES = 1,
    NO = -1,
    OPTIONAL = 0
}

interface MessageData {
    user: string;
    content?: string;
    reference?: string;
    dateCreated?: string;
    replied?: boolean;
    requiresResponse?: MessageResponseRequired;
    archiveText?: string;
    optOutText?: string;
    optInText?: string;
    activityId?: number;
}

export class Message {
    /**
     * Format to disply the message date
     */
    static dateFormat: string = 'd MMM yyyy';
    static dateTimeFormat: string = 'd MMM yyyy, HH:mm';

    /**
     * Unique ID of this message
     * We use this to find messages
     */
    id: string;

    /**
     * who wrote this message
     */
    user: string;

    content: string;
    
    /**
     * 
     */
    activityTemplate: any;
    activityData: any;

    /**
     * Date in the ISO 8601 compliant format:
     * 2013-02-08 21:30:26+23:01
     */
    dateCreated: string;

    /**
     * A message may reference other entities in daughter
     * 
     * e.g. When a user replies to a message, the reply references
     * the message being repied to
     * 
     * e.g. A user can choose to ask another user about an uploaded photo or video.
     * In that case, reference refers to that photo or video.
     * 
     */
    reference?: string;

    /**
     * If true, tapping message brings participant to the reply ui
     * If false, message can be dismiss/archived
     */
    requiresResponse?: MessageResponseRequired;

    /**
     * Text in the message dimiss button
     */
    archiveText?: string = 'Ok';

    /**
     * Text in the message dimiss button
     */
    optOutText?: string = 'Skip';

    /**
     * Text in the message reply button
     */
    optInText?: string = 'Reply';

    /**
     * IDs of response Messages
     */
    _responseMessageIds?: string[] = [];

    /**
     * ID of message this message replies to
     */
    _promptMessageId?: string;

    /**
     * User can decide to archive a message
     */
    _archived: boolean = false;

    /**
     * Id of the activity the reply shows
     */
    activityId?: number;

    constructor( data?: MessageData ) {
        this.dateCreated = '2017-03-30';
        for (let prop in data) {
            if (data.hasOwnProperty(prop)) {
                this[prop] = data[prop];
            }
        }
        this.id = 'Message:' + Math.random() + (new Date()).getMilliseconds();
    }

    get hasResponses(): boolean {
        return this._responseMessageIds.length > 0;
    }

    get responses(): Messages {
        return Messages.get().filterBy('id', this._responseMessageIds);
    }

    get hasPrompt(): boolean {
        return Messages.get().filterBy('id', this._promptMessageId).length > 0;
    }

    get prompt(): Message {
        return Messages.get().filterBy('id', this._promptMessageId)[0];
    }

    reply(reply:Message) {
        this._responseMessageIds.push(reply.id);
        this._archived = true;
        reply._promptMessageId = this.id;
        reply._archived = true;
        Messages.add(reply);
        return;
        //LocalNotifications.schedule({
        //    title: 'title',
        //    text: 'Yee hoo',
        //    at: new Date(new Date().getTime() + 1000)
        //});
        // LocalNotifications.on('schedule', note => alert('sched' + note.title+note.text));
        // LocalNotifications.getAllScheduled().then(s => {
        //     let o = s.reduce((acc, note) => {
        //         acc.push('=='+note.title+note.text);
        //         return acc;
        //     },[]);
        //     alert(o);
        // })
        // LocalNotifications.on('trigger', event => alert('trig'));
    }

    dismiss() {
        this._archived = true;
    }

    get archived() {
        return this._archived;
    }
}

export class Messages {

//     //hacky hack
    static messages: Message[] = messageMocks();

    static get() {
        return new Messages(Messages.messages);
    }

    static add(message:Message) {
        Messages.messages.push(message);
    }

    constructor(private messages: Message[]) {
    }

//     /**
//      * Sort messages by property 'prop'
//      * 
//      * @param {string} prop 
//      * @param {string} direction 'asc'|'desc'
//      */
//     sortBy(prop: string, direction: 'asc'|'des' = 'asc') {
//         let d = (direction === 'des')? -1: 1;
//         let sorted = this.messages.slice().sort((a, b) => {
//             if(a[prop] == b[prop]) {
//                 return 0;
//             }
//             return (a[prop] > b[prop])? 1 * d : -1 * d;
//         });
//         return new Messages( sorted );
//     }

    /**
     * Filter messages for message.prop == value
     * 
     * @param {string} prop 
     * @param {any} value 
     */
    filterBy(prop: string, value: any);

    /**
     * Filter messages for message.prop is in values
     * 
     * @param {string} prop 
     * @param {array} values
     */
    filterBy(props: string, values: any[]);

    /**
     * Filter messages matching object
     * 
     * Example:
     * message.filterBy({user: bob, hasResponses: true})
     * returns message from user 'bob' that has responses
     * 
     * @param {object} props
     */
    filterBy(props: Object);

    /**
     * FilterBy implementation
     * 
     */
    filterBy(props, values?) {
        let filtered: Message[];

        if(typeof props === 'string' && !(values instanceof Array)) {
            filtered = this.messages.filter(message => 
                message[<string>props] === values
            );
        }
        else if(typeof props === 'string' && values instanceof Array) {
            filtered = this.messages.filter(message => {
                return (<Array<any>>values).some(value => {
                    return message[<string>props] === value;
                });
            });
        }
        else if(props instanceof Object) {
            filtered = this.messages.filter(message => {
                return Object.keys(props).every(key =>
                    message[key] === props[key]
                );
            });
        }

        if (filtered === undefined) {
            throw Error(`Messages filterBy received unexpected parameters (${props},${values})`)
        }
        
        return new Messages( filtered );
    }

    /**
     * Get length of messages
     */
    length() {
        return this.messages.length;
    }

    [Symbol.iterator]() {
        let messages = this.messages.slice();
        return {
            next: () => {
                return {
                    done: messages.length == 0,
                    value: messages.shift(),
                }
            }
        }
    }
}

function messageMocks(){ 
    return [
        new Message({
            user: 'Columbo', 
            content: `
            Welcome to the study, Estaban!<br/>
            We're really interested in the way people are using smoked paprika.
            Did you know it was King Tutenkahmens favourite spice?
            <br/><br/>
            Any way. My name is Columbo, I love food and cooking, and for the next
            two weeks, I hope we can explore ways of making life better with Paprika together!
            <br/><br/>
            BTW, just click the 'Ok' below when you've read this message. It'll move this
            message into the timeline where you can always refer back to it.
            `,
            requiresResponse: MessageResponseRequired.NO,
            dateCreated:'2017-03-10'
        }),
        new Message({
            user: 'Columbo', 
            content: `
            Lunch time is near! And so is your first activity!
            <br/><br/>
            If your lunch has paprika in it, 
            reply to this message with a picture of it!
            `, 
            activityId: 0, 
            requiresResponse: MessageResponseRequired.OPTIONAL,
            dateCreated:'2017-03-11'
        }),
    ];
}