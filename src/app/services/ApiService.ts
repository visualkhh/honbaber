import { Sim } from 'simple-boot-core/decorators/SimDecorator';
import { ProgressModal } from './AlertService';

@Sim()
export class ApiService {
    constructor() {
    }

    public get(url: string) {
        const p = new ProgressModal();
        p.open();
        return fetch(url).then((response) => response.json()).catch(it => p.close()).finally(() => p.close());
    }

    public post(url: string, data: any) {
        const p = new ProgressModal();
        p.open();
        return fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        }).then(response => response.json()).catch(it => p.close()).finally(() => p.close());
    }
}
