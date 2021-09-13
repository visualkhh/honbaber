import {Sim} from 'simple-boot-core/decorators/SimDecorator';

@Sim()
export class ProjectService {
    constructor() {
    }

    public calc(i: number, y: number) {
        return i + y
    }

    public tail(origin: string | number, tail: string) {
        return origin + tail;
    }

    public loadScript(src: string) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.onload = resolve
            script.onerror = reject
            script.src = src
            document.head.append(script)
        })
    }


}
