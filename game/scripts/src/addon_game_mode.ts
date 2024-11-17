import 'utils/index';
import { ActivateModules } from './modules';
import Precache from './utils/precache';
import './modifire/init';
import './customize/init';

Object.assign(getfenv(), {
    Activate: () => {
        ActivateModules();
    },
    Precache: Precache,
});
