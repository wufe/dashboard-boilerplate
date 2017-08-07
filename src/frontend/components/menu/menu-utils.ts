import { MenuState, SubMenuState, PathResolver, PathResolverProperties } from "frontend/components/menu";

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

export const resolvePath = (path: string | PathResolver, properties: PathResolverProperties) => {
    switch(typeof path){
        case 'string':
            return path as string;
        case 'function':
            return (path as PathResolver)({
                title: properties.title,
                selected: properties.selected
            });
        default:
            return undefined;
    };
};