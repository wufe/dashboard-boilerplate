import { Action } from 'frontend/infrastructure';
import { MENU_CLICKED, SUBMENU_CLICKED }  from 'frontend/components/menu';

export const selectMenuItem: (key: string) => Action<string> =
    (key) => {
        return {
            type: MENU_CLICKED,
            payload: key
        };
    };

export const selectSubMenuItem: (key: string) => Action<string> =
    (key) => {
        return {
            type: SUBMENU_CLICKED,
            payload: key
        };
    };