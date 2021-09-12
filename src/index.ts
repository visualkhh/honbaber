import {SimpleBootFront} from 'simple-boot-front/SimpleBootFront';
import {App} from './app/App';
import {SimFrontOption} from 'simple-boot-front/option/SimFrontOption';
new SimpleBootFront(App, new SimFrontOption(window)).run();
