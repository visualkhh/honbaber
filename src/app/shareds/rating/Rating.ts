import { Component } from 'simple-boot-front/decorators/Component';
import template from './rating.html'
import css from './rating.css'

@Component({template, styles: [css]})
export class Rating {
    public value = 1;
    public max = 5;
    constructor(public title = '', public selected = '🌕', public unselected = '🌑') {
    }
}
