import { Sim } from 'simple-boot-core/decorators/SimDecorator';
import { Component } from 'simple-boot-front/decorators/Component';
import template from './app.html'
import css from './app.css'
import { FrontLifeCycle } from 'simple-boot-front/module/FrontLifeCycle';
import { Intent } from 'simple-boot-core/intent/Intent';
import { ProjectService } from './services/ProjectService';
import { DomRenderProxy } from 'dom-render/DomRenderProxy';
import { Rating } from './shareds/rating/Rating';
import { AlertService } from './services/alert/AlertService';
import { ApiService } from './services/ApiService';
declare const bootstrap: any;
declare const naver: any;
export type Menu = {
    ID: number; // 2
    IS_SIGNATURE: number; // 1
    MENU: string; // "스키야키정식"
    PRICE: number; // 15,000

}
export type Store = {
    ID: number;
    ADDR1: string; // "서울 영등포구 당산로 180"
    ADDR2: string; // "신우빌딩 1층 12호"
    IMG: string; // "https://lh3.googleusercontent.com/IY46sYeT68JA7Zrq7En8FgQdwh4cQ5buQgWc4wDIZdSvIXW2uHea6d1JdaUPJs_JadHe"
    LAT: number; // 37.5303057771
    LNG: number; // 126.8992801172
    ICON: string; // icon encoding by utf-8
    NAME: string; // "우미노미"
    POST: string; // "07216"
    RADIUS: number; // 0
    TEL: string; // "070-4367-7116"
    TOTAL_RATE: number; // 3
    TOTAL_RATE_CNT: number; // 3
    _marker: any;
    _infoWIndow: any;
}
export type StoreDetail = {
    ADDR1: string;
    ADDR2: string;
    IMG: string;
    IS_SELF_PAYMENT: number;
    IS_SELF_SIDE_DISH: number;
    IS_SELF_WATER: number;
    NAME: string;
    OFF_DAY: string;
    OPEN_AT: string;
    OPEN_DAY: string;
    PERSONAL_TABLE_CNT: number;
    POST: string;
    SENSE_RATE: number;
    TASTE_RATE: number;
    TEL: string;
    TIME_RATE: number;
    TOTAL_RATE: number;
    WEBSITE: string;
}
@Sim({scheme: 'index'})
@Component({template, styles: [css]})
export class App implements FrontLifeCycle {
    public radius = 100;
    public fullPopup = false;
    public sense = new Rating('👀 :');
    public taste = new Rating('😋 :');
    public service = new Rating('👍 :');
    public time = new Rating('⏱ :');
    public results: Store[] = [];
    public currentStore?: Store;
    public currentStoreMenu?: Menu;
    public currentStoreDetail?: StoreDetail;
    public shieldDatas: {
        map?: any;
        currentMarker?: any,
        currentCircle?: any,
        bsOffcanvas?: {show: () => void, hide: () => void}
    } = DomRenderProxy.final({});

    constructor(public projectService: ProjectService, public apiService: ApiService, public alertService: AlertService) {
    }

    onCreate(): void {
    }

    onChangedRender(): void {
    }

    onFinish(): void {
    }

    onInit() {
    }

    onInitedChild(): void {
    }

    async onInitMap(mapElement: Element) {
        await this.projectService.loadScript('https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=83bfuniegk&amp;submodules=panorama,geocoder,drawing,visualization')
        const locationBtnHtml = '<a href="#" class="btn_mylct"><span class="spr_trff spr_ico_mylct">NAVER 그린팩토리</span></a>';
        // DomRen
        this.shieldDatas.map = new naver.maps.Map(mapElement, {
            // zoom: 13, //지도의 초기 줌 레벨
            // minZoom: 7, //지도의 최소 줌 레벨
            useStyleMap: true,
            zoomControl: true, // 줌 컨트롤의 표시 여부
            mapTypeControl: true,
            zoomControlOptions: { // 줌 컨트롤의 옵션
                style: naver.maps.ZoomControlStyle.SMALL,
                //     position: naver.maps.Position.CENTER_LEFT
            }
        });

        this.shieldDatas.currentMarker = new naver.maps.Marker({map: this.shieldDatas.map, position: this.shieldDatas.map.getCenter(), visible: true});
        this.shieldDatas.currentCircle = new naver.maps.Circle({
            map: this.shieldDatas.map,
            radius: this.radius,
            center: this.shieldDatas.currentMarker.getPosition(),
            strokeColor: '#5347AA',
            strokeOpacity: 0.5,
            strokeWeight: 2,
            fillColor: '#1a7fe5',
            visible: true,
            fillOpacity: 0.2
        });
        this.clickMap({coord: this.shieldDatas.currentMarker.getPosition()})
        naver.maps.Event.addListener(this.shieldDatas.map, 'click', this.clickMap.bind(this));
        naver.maps.Event.once(this.shieldDatas.map, 'init_stylemap', () => {
            // customControl 객체 이용하기
            const customControl = new naver.maps.CustomControl(locationBtnHtml, {
                position: naver.maps.Position.TOP_LEFT
            });
            customControl.setMap(this.shieldDatas.map);
            const domEventListener = naver.maps.Event.addDOMListener(customControl.getElement(), 'click', () => {
                navigator.geolocation?.getCurrentPosition(this.moveCurrentPosition.bind(this), ()=>{});
            });
        });
    }

    clickMap(e: any) {
        this.shieldDatas.currentMarker.setPosition(e.coord);
        this.setRadius(this.radius)
    }

    async setRadius(value: number) {
        const position = this.shieldDatas.currentMarker.getPosition();
        this.shieldDatas.currentCircle.setRadius(this.radius = value);
        this.shieldDatas.currentCircle.setCenter(position);
        this.shieldDatas.currentCircle.setVisible(true);
        const data = await this.apiService.get(`/stores?lat=${position.y}&lng=${position.x}&radius=${this.radius / 1000}&rate=3`, '주변');
        this.results.filter(it => it._marker).forEach(it => {
            if (it._marker.getMap()) {
                it._marker.setMap(null);
            }
            it._infoWIndow.close();
        });
        this.results.length = 0;
        <Store[]>(data ?? []).forEach((it: Store) => {
            const marker = new naver.maps.Marker({
                map: this.shieldDatas.map,
                position: new naver.maps.LatLng(it.LAT, it.LNG),
                title: '',
                icon: {
                    url: '/assets/images/ico_pin.jpg',
                    size: new naver.maps.Size(25, 34),
                    scaledSize: new naver.maps.Size(25, 34),
                    origin: new naver.maps.Point(0, 0),
                    anchor: new naver.maps.Point(12, 34)
                },
                zIndex: 100
            });
            const infoWindow = new naver.maps.InfoWindow({
                content: `<img style="display: none" onload="var a = document.querySelector('#info-window-${it.ID}')?.parentElement?.parentElement?.parentElement; if(a) {a.classList.add('info-window') }" id="info-window-${it.ID}" src="data:image/gif;base64,R0lGODlhCwALAIAAAAAA3pn/ZiH5BAEAAAEALAAAAAALAAsAAAIUhA+hkcuO4lmNVindo7qyrIXiGBYAOw==">
                            <div style="width:150px; text-align:center;padding:10px;">
                                <b>${it.ICON}&nbsp;&nbsp;${it.NAME}</b> <button onclick="const data = new CustomEvent('intent', {detail: {uri: 'index://showStore', data: {id: ${it.ID}}}}); window.dispatchEvent(data);">📃자세히..</button>
                            </div>`,
                anchorSkew: true
            });
            it._marker = DomRenderProxy.final(marker);
            it._infoWIndow = DomRenderProxy.final(infoWindow);
            naver.maps.Event.addListener(it._marker, 'click', () => {
                it._infoWIndow.open(this.shieldDatas.map, it._marker)
            });
            this.results.push(it)
        })
    }

    moveCurrentPosition(position: GeolocationPosition) {
        const location = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.shieldDatas.map.setCenter(location);
        this.clickMap({coord: location})
    }

    public onInitDetaileCanvas(e: Element) {
        this.shieldDatas.bsOffcanvas = new bootstrap.Offcanvas(e)
    }

    public async showStore(i: Intent) {
        this.currentStore = await this.apiService.get(`/stores/${i.data.id}`, '가게 정보');
        this.currentStoreMenu = await this.apiService.get(`/stores/${i.data.id}/menus`, '메뉴 정보');
        this.currentStoreDetail = await this.apiService.get(`/stores/${i.data.id}/detail`, '상세 정보');
        this.shieldDatas.bsOffcanvas?.show();
    }
}
