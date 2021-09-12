import { Sim } from 'simple-boot-core/decorators/SimDecorator';
import { Component } from 'simple-boot-front/decorators/Component';
import template from './app.html'
import css from './app.css'
import { FrontLifeCycle } from 'simple-boot-front/module/FrontLifeCycle';

declare var naver: any;

@Sim({scheme: 'layout-router'})
@Component({template, styles: [css]})
export class App implements FrontLifeCycle {

    onCreate(): void {
    }

    onChangedRender(): void {
    }

    onFinish(): void {
    }

    onInit(): void {
        new naver.maps.Map(document.querySelector('#map'));
    }

    onInitedChild(): void {
    }
}
