import * as got from 'got';

const tough = require('tough-cookie');

const { Cookie } = tough;

interface ParamsAddTask {
    readonly element_type: number;
    readonly complete_till: number;
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

    public authUrl: string;

    constructor(login: string, hash: string, url: string) {
      this.url = url;
      this.strForm = JSON.stringify({
        USER_LOGIN: login,
        USER_HASH: hash,
      });
      this.addAndUpdateTaskUrl = `${url}/api/v2/tasks`;
      this.authUrl = `${url}/private/api/auth.php`;
    }

    public async connect() {
      try {
        const data: any = await got.post(this.authUrl, {
          body: this.strForm,
        });
        this.setCookie(data);
      } catch (e) {
        console.log(e);
      }
    }

    public setCookie(data: any) {
      this.cookie = Cookie.parse(data.headers['set-cookie'][0]);
      // this.cookie = ([data.headers['set-cookie'][0],data.headers['set-cookie'][1]]).join(',');
    }

    public async addTask(task: ParamsAddTask) {
      const strTask = JSON.stringify({
        add: [task],
      });
      try {
        const status = await got.post(this.addAndUpdateTaskUrl, {
          headers: {
            'Content-Type': 'application/hal+json',
            'Runtime-Timestamp': '1508320306',
            cookie: this.cookie,
          },
          body: strTask,
        });
        status.statusCode === 200 ? console.log('done! addTask') : console.log(status.statusCode);
      } catch (e) {
        if (e.statusCode === 401) {
          console.log('Unauthorized!');
        } else {
          console.log('Params error');
        }
      }
    }


    public async updateTask(task: ParamsUpdateTask) {
      const strTask: string = JSON.stringify({
        update: [task],
      });
      try {
        const status = await got.post(this.addAndUpdateTaskUrl, {
          headers: {
            'Content-Type': 'application/hal+json',
            'Runtime-Timestamp': '1508320306',
            cookie: this.cookie,
          },
          body: strTask,
        });
        status.statusCode === 200 ? console.log('done! updateTask') : console.log(status.statusCode);
      } catch (e) {
        console.log('Status code - ', e.statusCode);
      }
    }
}
