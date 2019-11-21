import * as got from 'got';

import tough from 'tough-cookie';

const { Cookie } = tough;

const headerParams = `
  'Content-Type': 'application/hal+json',
  'Runtime-Timestamp': 1508320306,
`;
/* eslint-disable */
interface ParamsAddTask {
    readonly element_type?: number;
    readonly complete_till?: number;
    readonly task_type?: number;
    readonly text?: string;
    readonly responsible_user_id?: number;
    readonly is_completed?: boolean;
    readonly created_by?: number;
}
interface ParamsUpdateTask {
    readonly id: number;
    readonly updated_at: number;
    readonly text: string;
}
/* eslint-enable */
export default class CrmApi {
    public login: string;

    public hash: string;

    public url: string;

    public strForm: string;

    public addAndUpdateTaskUrl: string;

    public cookie: any;

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
      const data: any = await got.post(this.authUrl, {
        body: this.strForm,
      });
      this.setCookie(data);
    }

    public setCookie(data: any) {
      this.cookie = Cookie.parse(data.headers['set-cookie'][0]);
      // this.cookie = ([data.headers['set-cookie'][0],data.headers['set-cookie'][1]]).join(',');
    }

    public async addTask(task: ParamsAddTask) {
      const strTask = JSON.stringify({
        add: [task],
      });
      await got.post(this.addAndUpdateTaskUrl, {
        headers: {
          headerParams,
          cookie: this.cookie,
        },
        body: strTask,
      });
    }

    public async updateTask(task: ParamsUpdateTask) {
      const strTask: string = JSON.stringify({
        update: [task],
      });
      await got.post(this.addAndUpdateTaskUrl, {
        headers: {
          headerParams,
          cookie: this.cookie,
        },
        body: strTask,
      });
    }
}
