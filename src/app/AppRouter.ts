import { Index } from './features/index';
import { Router, Sim } from 'simple-boot-core/decorators/SimDecorator';
import { Component } from 'simple-boot-front/decorators/Component';
import template from './layouts/app.html'
import css from './layouts/app.css'
import { RouterAction } from 'simple-boot-core/route/RouterAction';
import { Intent } from 'simple-boot-core/intent/Intent';
import { ConstructorType } from 'simple-boot-core/types/Types';
import { FrontLifeCycle } from 'simple-boot-front/module/FrontLifeCycle';

declare var naver: any;

@Sim({scheme: 'layout-router'})
@Router({
    path: '',
    childs: {
        '': Index,
        '/': Index
    }
})
@Component({template, styles: [css]})
export class AppRouter implements RouterAction, FrontLifeCycle {

    child?: any;

    onCreate(): void {
        // throw new Error('Method not implemented.');
    }

    canActivate(url: Intent, module: any): void {
        // console.log('->>>>>', this, module)
        // this.child = module;
    }

    onChangedRender(): void {
    }

    onFinish(): void {
    }

    onInit(): void {
        var mapDiv = document.getElementById('map'); // 'map'으로 선언해도 동일
        var map = new naver.maps.Map(mapDiv);
    }

    onInitedChild(): void {
    }
}
