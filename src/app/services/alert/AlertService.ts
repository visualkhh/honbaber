import { Sim } from 'simple-boot-core/decorators/SimDecorator';
import { AlertPrimary } from './AlertPrimary';
import { AlertSuccess } from './AlertSuccess';
import { AlertWarning } from './AlertWarning';
import { AlertDanger } from './AlertDanger';
import { AlertProgress } from './AlertProgress';

@Sim()
export class AlertService {
    constructor() {

    }

    public showProgress(msg: string) {
        return new AlertProgress(msg, this).open();
    }

    public showPrimary(msg: string) {
        return new AlertPrimary(msg, this).open();
    }

    public showSuccess(msg: string) {
        return new AlertSuccess(msg, this).open();
    }

    public showWarning(msg: string) {
        return new AlertWarning(msg, this).open();
    }

    public showDanger(msg: string) {
        return new AlertDanger(msg, this).open();
    }

    public getAlertContainer() {
        const id = 'alert-container';
        let container = document.querySelector(`#${id}`) as HTMLDivElement;
        if (!container) {
            container = document.createElement('div');
            container.id = id;
            container.style.position = 'fixed'
            container.style.left = '100%'
            container.style.top = '50px'
            container.style.transform = 'translate(-100%)'
            // container.style.backgroundColor = 'rgba(51,51,51,0.4)';
            // container.style.marginRight = '20px';
            container.style.minWidth = '150px'
            // container.style.minHeight = '100vh'
            container.style.zIndex = '9999';
            // container.innerHTML = ``
            document.body.prepend(container);
        }
        // (container as HTMLDivElement).style.display = 'block';
        return container;
    }

    public closeAllProgressModal() {
        document.querySelectorAll('.progress-modal').forEach(it => it.remove());
    }

}
