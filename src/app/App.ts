import { Sim } from 'simple-boot-core/decorators/SimDecorator';
import { Component } from 'simple-boot-front/decorators/Component';
import template from './app.html'
import css from './app.css'
import { FrontLifeCycle } from 'simple-boot-front/module/FrontLifeCycle';
import { ProjectService } from './services/ProjectService';

declare var naver: any;

@Sim({scheme: 'layout-router'})
@Component({template, styles: [css]})
export class App implements FrontLifeCycle {

    constructor(public projectService: ProjectService) {
    }

    onCreate(): void {
    }

    onChangedRender(): void {
    }

    onFinish(): void {
    }

    async onInit() {
        const data = await this.projectService.loadScript('https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=83bfuniegk&amp;submodules=panorama,geocoder,drawing,visualization')
        console.log(data);
        new naver.maps.Map(document.querySelector('#map'));
    }

    onInitedChild(): void {
    }
}
