import * as got from 'got';
const tough = require('tough-cookie');
const Cookie = tough.Cookie;


const obj = require('./test.json');
const obj2 = require('./testupdate.json');


interface ParamsAddTask {
    readonly element_type: number;
    readonly complete_till: DataCue;
    readonly task_type: number;
    readonly text: string;
    readonly responsible_user_id: number;
    readonly is_completed: boolean;
    readonly created_by: number;
}
interface ParamsUpdateTask {
    readonly id: number;
    readonly updated_at: number;
    readonly text: string;
}
export default class CrmApi {
    public login: string;
    public hash: string;
    public url: string;
    public strForm: string;
    public addAndUpdateTaskUrl: string;
    public cookie: string;
    constructor(login: string, hash: string, url: string) {
        this.url = url;
        this.strForm = JSON.stringify({
            USER_LOGIN: login,
            USER_HASH: hash
        });
        this.addAndUpdateTaskUrl = 'https://spaceboss.amocrm.ru/api/v2/tasks';
    }

    public async connect() {
        let data: any = await got.post(this.url, {
            body: this.strForm
        }).catch(e => {
            throw new Error(e)
        })
        this.getCookie(data)
    }
    public getCookie(data: any) {
        this.cookie = Cookie.parse(data.headers['set-cookie'][0]);
        // this.cookie = ([data.headers['set-cookie'][0],data.headers['set-cookie'][1]]).join(',');
    }

    public async addTask(task: ParamsAddTask) {

        let strTask = JSON.stringify({
            "add": [task]
        });
        await got.post(this.addAndUpdateTaskUrl, {
            headers: {
                'Content-Type': 'application/hal+json',
                'Runtime-Timestamp': '1508320306',
                cookie: this.cookie
            },
            body: strTask
        }).then(() => {
            console.log('Good')
        }).catch((e: any) => {
            if (e.statusCode === 401) {
                throw new Error('Unauthorized!')
            }
            throw new Error('Syntax form error!')
        });
    }


    public async updateTask(task: ParamsUpdateTask) {
        console.log(task);
        let strTask: string = JSON.stringify({
            "update": [task]
        });
        console.log(strTask)
        await got.post(this.addAndUpdateTaskUrl, {
            headers: {
                'Content-Type': 'application/hal+json',
                'Runtime-Timestamp': '1508320306',
                cookie: this.cookie
            },
            body: strTask
        }).then(() => {
            console.log('Good')
        }).catch(e => {
            if (e.statusCode === 401) {
                throw new Error('Unauthorized!')
            }
            throw new Error('Syntax form error!')
        });
    }
}
