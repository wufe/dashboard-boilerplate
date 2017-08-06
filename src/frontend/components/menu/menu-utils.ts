import { MenuState, SubMenuState } from "frontend/components/menu";

export const getSelectedSubMenu: (state: MenuState) => SubMenuState =
    (state) => 
    {
        let subMenu: SubMenuState = {};
        Object
            .keys(state)
            .forEach((key) => {
                if(state[key].selected && state[key].subitems !== undefined)
                    subMenu = state[key].subitems;
            });
        return subMenu;
    };