import {menuState, MenuState} from 'frontend/components/menu';

export type State = {
    menu: MenuState;
    [key: string]: any;
};

export const state: State = {
    menu: menuState
};