import { Sim } from 'simple-boot-core/decorators/SimDecorator';
import { interval, Subscription } from 'rxjs';

export class ProgressModal {
    private foods = ['🫓', '🥩', '🍗', '🍖', '🥘', '🍙', , '🧀', '🍤', '🍺', '🥗', '🍣', '🍲', '🍱', '🥟', '🌭']
    private root: HTMLDivElement;
    private interval?: Subscription;

    constructor() {
        this.root = document.createElement('div')
        this.root.classList.add('progress-modal')
        this.root.style.backgroundColor = 'rgba(51,51,51,0.0)'
        this.root.style.position = 'fixed'
        this.root.style.justifyContent = 'center'
        this.root.style.alignItems = 'center'
        this.root.style.minWidth = '100vw'
        this.root.style.minHeight = '100vh'
        this.root.style.zIndex = '9999';
        this.root.style.transition = 'background-color 1s ease';

        const progress = document.createElement('div');
        progress.id = 'container'
        progress.style.position = 'fixed';
        progress.style.top = '50%'
        progress.style.left = '50%'
        // progress.style.width = '100px'
        // progress.style.height = '100px'
        progress.style.transform = 'translate(-50%, -50%)'
        progress.style.borderRadius = '1rem'
        progress.style.padding = '1.5rem'
        progress.style.fontSize = '3rem'
        progress.style.backgroundColor = 'rgba(0,0,0,0.1)'
        progress.style.transition = 'background-color 1s ease';
        progress.innerText = this.getRandomFood();
        this.root.append(progress);
    }

    private getRandomFood() {
        return this.foods[Math.floor(Math.random() * this.foods.length)] ?? '❔';
    }

    open() {
        this.interval = interval(200 /* ms */).subscribe(it => {
            if (this.root.isConnected) {
                const container = this.root.querySelector('#container');
                if (container) {
                    container.innerHTML = this.getRandomFood();
                }
            } else {
                this.close();
            }
        })
        document.body.prepend(this.root);
    }

    close() {
        this.interval?.unsubscribe();
        this.root.remove();
    }
}

@Sim()
export class AlertService {

    constructor() {
    }

    // public openProgressModal() {
    //     return new ProgressModal();
    // }

    public closeAllProgressModal() {
        document.querySelectorAll('.progress-modal').forEach(it => it.remove());
    }

}
