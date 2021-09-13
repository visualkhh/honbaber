import { Sim } from 'simple-boot-core/decorators/SimDecorator';
import { Component } from 'simple-boot-front/decorators/Component';
import template from './app.html'
import css from './app.css'
import { FrontLifeCycle } from 'simple-boot-front/module/FrontLifeCycle';
import { ProjectService } from './services/ProjectService';
import { DomRenderProxy } from 'dom-render/DomRenderProxy';
declare var naver: any;
@Sim({scheme: 'layout-router'})
@Component({template, styles: [css]})
export class App implements FrontLifeCycle {
    public map?: any;
    public fullPopup = false;
    constructor(public projectService: ProjectService) {
    }

    onCreate(): void {
    }

    onChangedRender(): void {
    }

    onFinish(): void {
    }

    async onInit() {
    }

    onInitedChild(): void {
    }

    async onInitMap(mapElement: Element) {
        const data = await this.projectService.loadScript('https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=83bfuniegk&amp;submodules=panorama,geocoder,drawing,visualization')
        console.log(data);
        var locationBtnHtml = '<a href="#" class="btn_mylct"><span class="spr_trff spr_ico_mylct">NAVER 그린팩토리</span></a>';
        // DomRen
        this.map = DomRenderProxy.final(new naver.maps.Map(mapElement, {
            // zoom: 13, //지도의 초기 줌 레벨
            // minZoom: 7, //지도의 최소 줌 레벨
            useStyleMap: true,
            zoomControl: true, //줌 컨트롤의 표시 여부
            mapTypeControl: true,
            zoomControlOptions: { //줌 컨트롤의 옵션
                style: naver.maps.ZoomControlStyle.SMALL,
                //     position: naver.maps.Position.CENTER_LEFT
            }
        }));
        // map.zz = '1'
        naver.maps.Event.once(this.map, 'init_stylemap', () => {
            //customControl 객체 이용하기
            const customControl = new naver.maps.CustomControl(locationBtnHtml, {
                position: naver.maps.Position.TOP_LEFT
            });
            const searchBtn = new naver.maps.CustomControl('<button class="btn btn-primary btn-search" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">Toggle bottom offcanvas</button>', {
                position: naver.maps.Position.LEFT_BOTTOM
            });

            customControl.setMap(this.map);
            searchBtn.setMap(this.map);

            const domEventListener = naver.maps.Event.addDOMListener(customControl.getElement(), 'click', () => {
                    navigator.geolocation?.getCurrentPosition(this.moveCurrentPosition.bind(this), ()=>{});
                //map.setCenter(new naver.maps.LatLng(37.3595953, 127.1053971));
            });

            //Map 객체의 controls 활용하기
            // var $locationBtn = $(locationBtnHtml),
            //     locationBtnEl = $locationBtn[0];
            //
            // map.controls[naver.maps.Position.LEFT_CENTER].push(locationBtnEl);
            //
            // var domEventListener = naver.maps.Event.addDOMListener(locationBtnEl, 'click', function() {
            //     map.setCenter(new naver.maps.LatLng(37.3595953, 127.1553971));
            // });
        });
    }

    moveCurrentPosition(position: GeolocationPosition) {
        var infowindow = new naver.maps.InfoWindow();
        var location = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
        this.map.setZoom(18); // 지도의 줌 레벨을 변경합니다.
        infowindow.setContent('<div style="padding:20px;">' + 'geolocation.getCurrentPosition() 위치' + '</div>');
        infowindow.open(this.map, location);
    }
    // onSuccessGeolocation(position) {
    //     var location = new naver.maps.LatLng(position.coords.latitude,
    //         position.coords.longitude);
    //
    //     map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
    //     map.setZoom(10); // 지도의 줌 레벨을 변경합니다.
    //
    //     infowindow.setContent('<div style="padding:20px;">' + 'geolocation.getCurrentPosition() 위치' + '</div>');
    //
    //     infowindow.open(map, location);
    //     console.log('Coordinates: ' + location.toString());
    // }
    // onErrorGeolocation() {
    //     var center = map.getCenter();
    //
    //     infowindow.setContent('<div style="padding:20px;">' +
    //         '<h5 style="margin-bottom:5px;color:#f00;">Geolocation failed!</h5>'+ "latitude: "+ center.lat() +"<br />longitude: "+ center.lng() +'</div>');
    //
    //     infowindow.open(map, center);
    // }
}
