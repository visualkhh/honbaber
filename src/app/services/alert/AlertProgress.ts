import { AlertService } from './AlertService';
import { Alert } from './Alert';


export class AlertProgress extends Alert {
    private foods = ['🫓', '🥩', '🍗', '🍖', '🥘', '🍙', , '🧀', '🍤', '🍺', '🥗', '🍣', '🍲', '🍱', '🥟', '🌭']
    private interval?: NodeJS.Timer;
    constructor(public msg: string, alertService: AlertService) {
        super(alertService);
    }

    getAfterCloseTime(): number {
        return 0;
    }

    getContainerClass(): string {
        return 'alert-primary';
    }

    getContainerContent(): Element | DocumentFragment {
        const template = document.createElement('template')
        template.innerHTML = `
            <div class="icon-food">${this.getRandomFood()}</div>
            <div>&nbsp; ${this.msg}&nbsp; Loading..<div>
        `
        return template.content;
    }

    open() {
        super.open();
        this.interval = setInterval(() => {
            const foodContainer = this.item.querySelector('.icon-food');
            if (foodContainer) {
                foodContainer.innerHTML = this.getRandomFood();
            } else {
                this.close();
            }
        }, 200);
        return this;
    }

    close() {
        super.close();
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    private getRandomFood() {
        return this.foods[Math.floor(Math.random() * this.foods.length)] ?? '❔';
    }
}
