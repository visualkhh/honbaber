import { Sim } from 'simple-boot-core/decorators/SimDecorator';
import { Component } from 'simple-boot-front/decorators/Component';
import template from './app.html'
import css from './app.css'
import { FrontLifeCycle } from 'simple-boot-front/module/FrontLifeCycle';
import { ProjectService } from './services/ProjectService';
import { DomRenderProxy } from 'dom-render/DomRenderProxy';
import { Rating } from './shareds/rating/Rating';
import { AlertService } from './services/alert/AlertService';
import { ApiService } from './services/ApiService';
declare var bootstrap: any;
declare var naver: any;
export type Store = {
    ID: number;
    ADDR1: string; // "서울 영등포구 당산로 180"
    ADDR2: string; // "신우빌딩 1층 12호"
    IMG: string; // "https://lh3.googleusercontent.com/IY46sYeT68JA7Zrq7En8FgQdwh4cQ5buQgWc4wDIZdSvIXW2uHea6d1JdaUPJs_JadHe"
    LAT: number; // 37.5303057771
    LNG: number; // 126.8992801172
    NAME: string; // "우미노미"
    POST: string; // "07216"
    RADIUS: number; // 0
    TEL: string; // "070-4367-7116"
    TOTAL_RATE: number; // 3
    TOTAL_RATE_CNT: number; // 3
    _marker: any;
    _infoWIndow: any;
}
@Sim({scheme: 'layout-router'})
@Component({template, styles: [css]})
export class App implements FrontLifeCycle {
    public currentMarker?: any;
    public currentCircle?: any;
    public radius = 100;
    public map?: any;
    public fullPopup = false;
    public sense = new Rating('👀 :');
    public taste = new Rating('😋 :');
    public service = new Rating('👍 :');
    public time = new Rating('⏱ :');
    public results: Store[] = [];
    constructor(public projectService: ProjectService, public apiService: ApiService, public alertService: AlertService) {

    }

    onCreate(): void {
    }

    onChangedRender(): void {
    }

    onFinish(): void {
    }

    onInit() {
        // let alert = this.alertService.showPrimary('aa');
        // alert.open();
        //
        // setTimeout(()=>{
        //     alert = this.alertService.showSuccess('a3a');
        //     alert.open();
        // }, 1000)
        //
        // setTimeout(()=>{
        // alert = this.alertService.showWarning('aa2');
        // alert.open();
        // }, 2000)
        //
        // setTimeout(()=>{
        // alert = this.alertService.showDanger('addda');
        // alert.open();
        // }, 3000)
        // let progressModal = this.alertService.openProgressModal();
        // setTimeout(()=>{
        //     //this.time.value = 3
        // }, 5000);
        // setTimeout(()=>{
        //     var myOffcanvas = document.getElementById('detailCanvas')
        //     var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
        //     bsOffcanvas.show();
        //     setTimeout(() => {
        //         bsOffcanvas.hide()
        //     }, 2000)
        // }, 5000)
        // setTimeout(()=>{
        //     var myOffcanvas = document.getElementById('offcanvasBottom')
        //     var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
        //     bsOffcanvas.show();
        // }, 2000)
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

        this.currentMarker = DomRenderProxy.final(new naver.maps.Marker({map: this.map, position: this.map.getCenter(), visible: true}));
        this.currentCircle = DomRenderProxy.final(new naver.maps.Circle({
            map: this.map,
            radius: this.radius,
            center: this.currentMarker.getPosition(),
            strokeColor: '#5347AA',
            strokeOpacity: 0.5,
            strokeWeight: 2,
            fillColor: '#1a7fe5',
            visible: true,
            fillOpacity: 0.2
        }));
        this.clickMap({coord: this.currentMarker.getPosition()})
        // this.currentMarker.onRemove();
        // map.zz = '1'
        naver.maps.Event.addListener(this.map, 'click', this.clickMap.bind(this));
        naver.maps.Event.once(this.map, 'init_stylemap', () => {
            //customControl 객체 이용하기
            const customControl = new naver.maps.CustomControl(locationBtnHtml, {
                position: naver.maps.Position.TOP_LEFT
            });
            const searchBtn = new naver.maps.CustomControl('<button class="btn btn-light btn-outline-dark btn-search" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">🍮 주변 검색</button>', {
                position: naver.maps.Position.LEFT_BOTTOM
            });
            const detailBtn = new naver.maps.CustomControl('<button class="btn btn-primary btn-search" type="button" data-bs-toggle="offcanvas" data-bs-target="#detailCanvas" aria-controls="offcanvasBottom">Toggle bottom offcanvas</button>', {
                position: naver.maps.Position.RIGHT_TOP
            });

            customControl.setMap(this.map);
            // searchBtn.setMap(this.map);
            // detailBtn.setMap(this.map);

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

    clickMap(e: any) {
        this.currentMarker.setPosition(e.coord);
        this.setRadius(this.radius)
    }

    async setRadius(value: number) {
        let position = this.currentMarker.getPosition();
        this.currentCircle.setRadius(this.radius = value);
        this.currentCircle.setCenter(position);
        this.currentCircle.setVisible(true);
        // console.log(position, this.radius)

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
                map: this.map,
                position: new naver.maps.LatLng(it.LAT, it.LNG),
                title: '??',
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
                content: `<img style="display: none" onload="var a = document.querySelector('#info-window-${it.ID}')?.parentElement?.parentElement?.parentElement; if(a) {a.classList.add('info-window') }" id="info-window-${it.ID}" src="data:image/gif;base64,R0lGODlhCwALAIAAAAAA3pn/ZiH5BAEAAAEALAAAAAALAAsAAAIUhA+hkcuO4lmNVindo7qyrIXiGBYAOw=="><div style="width:150px; text-align:center;padding:10px;"><b>${it.NAME}</b> <button onclick="alert(this)">aaa</button></div>`,
                // backgroundColor: '#00000000',
                // borderColor: '#00000000',
                anchorSkew: true
            });
            it._marker = DomRenderProxy.final(marker);
            it._infoWIndow = DomRenderProxy.final(infoWindow);
            naver.maps.Event.addListener(it._marker, 'click', () => {
                it._infoWIndow.open(this.map, it._marker)
            });
            // naver.maps.Event.addListener(it._infoWIndow, 'click', () => {
            //     alert(1)
            // });
            // naver.maps.Event.addListener(this.map, 'click', () => {
            //     alert(1)
            // });
            this.results.push(it)
            // const contentString = `
            //     <div class="iw_inner">
            //        <h3>${it.NAME}</h3>
            //        <p>${it.ADDR1} | ${it.ADDR2} | (${it.POST})<br/>
            //            <img src="${it.IMG}" width="55" height="55" class="thumb" /><br />
            //            ${it.TEL}<br />
            //            // <a href="http://www.seoul.go.kr" target="_blank">www.seoul.go.kr/</a>
            //        </p>
            //     </div>
            //     `;
            //
            // var infowindow = new naver.maps.InfoWindow({
            //     content: contentString
            // });
        })
        console.log('-->', data)

    }

    moveCurrentPosition(position: GeolocationPosition) {
        // var infowindow = new naver.maps.InfoWindow();
        var location = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);
        // this.map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
        // this.map.setZoom(18); // 지도의 줌 레벨을 변경합니다.
        // infowindow.setContent('<div style="padding:20px;">' + 'geolocation.getCurrentPosition() 위치' + '</div>');
        // infowindow.open(this.map, location);
        this.map.setCenter(location);
        this.clickMap({coord: location})



        // naver.maps.Event.addListener(this.map, 'click', (e: any) => {
        //     marker.setPosition(e.coord);
        // });


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
    // public openInfoWindow(it: Store) {
    //     return (e: any) => {
    //         it._infoWIndow.open(this.map, it._marker)
    //     }
    //     console.log('--click???????->', it)
    // }
}
