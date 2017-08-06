import { createSelector }  from 'reselect';
import { menuState, MenuState, SubMenuState } from 'frontend/components/menu/menu-state';
import { State } from 'frontend/state';
import { getSelectedSubMenu, PathResolver } from "frontend/components/menu";

type ReselectedSubMenuItem = {
    key: string;
    title: string;
    selected: boolean;
    path?: string | PathResolver;
};

export type ReselectedSubMenuState = ReselectedSubMenuItem[];

const subMenuStateReselector = (subMenuState: SubMenuState) => {
    return subMenuState ? Object
        .keys(subMenuState)
        .map<ReselectedSubMenuItem>(
            x => {
                return {
                    key: x,
                    title: subMenuState[x].title,
                    selected: subMenuState[x].selected,
                    path: subMenuState[x].path
                };
            }
        ) : [];
};

export const subMenuItemsSelector = createSelector<State, SubMenuState, ReselectedSubMenuState>(
    state => getSelectedSubMenu(state.menu),
    subMenuState => subMenuStateReselector(subMenuState)
); 

type ReselectedMenuItem = {
    key: string;
    icon: string;
    title: string;
    selected: boolean;
    path?: string | PathResolver;
    subitems?: ReselectedSubMenuState;
};
export type ReselectedMenuState = ReselectedMenuItem[];

export const menuItemsSelector = createSelector<State, MenuState, ReselectedMenuState>(
    state => state.menu,
    menuObject => {
        return Object
            .keys(menuObject)
            .map<ReselectedMenuItem>(
                x => {
                    return {
                        key: x,
                        icon: menuObject[x].icon,
                        title: menuObject[x].title,
                        selected: menuObject[x].selected,
                        path: menuObject[x].path,
                        subitems: subMenuStateReselector(menuObject[x].subitems)
                    };
                }
            );
    }
);

