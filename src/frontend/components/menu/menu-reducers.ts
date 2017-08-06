import { menuState, MenuState, MENU_CLICKED, SubMenuItems, SUBMENU_CLICKED, SubMenuState, getSelectedSubMenu } from 'frontend/components/menu';
import { Action, apply } from 'frontend/infrastructure';
import { Reducer } from 'redux';

const selectFirstSubItem = (state: SubMenuItems) => {
    var firstSelected = false;
    var subitems = apply(state, (index, element) => {
        if(!firstSelected){
            firstSelected = true;
            return Object.assign({}, element, {selected: true});
        }else{
            return Object.assign({}, element, {selected: false});
        }
    });
    return subitems;
};

const selectItem = (key: string, state: MenuState) => {
    return Object.assign(
        {},
        state,
        apply(state, (index, element) => {
            if(index == key){
                // if(state[index].subitems !== undefined){
                //     return Object.assign({}, element, {selected: true}, {subitems: selectFirstSubItem(state[index].subitems)});
                // }else{
                //     return Object.assign({}, element, {selected: true});
                // }
                return Object.assign({}, element, {selected: true});
            }else{
                return Object.assign({}, element, {selected: false});
            }
        })
    );
};

const selectSubItem = (key: string, state: MenuState) => {
    return Object.assign(
        {},
        state,
        apply(state, (index, element) => {
            if(element.selected){
                return Object.assign({}, element, {
                    subitems: apply(element.subitems, (subindex, subelement) => {
                        if(subindex == key){
                            return Object.assign({}, subelement, {selected: true});
                        }else{
                            return Object.assign({}, subelement, {selected: false});
                        }
                    })
                });
            }else{
                return element;
            }
        })
    );
};

export const menuReducer: Reducer<MenuState> =
    (state: MenuState = menuState, action: Action) => {
        switch(action.type){
            case MENU_CLICKED:
                return selectItem(action.payload, state);
            case SUBMENU_CLICKED:
                return selectSubItem(action.payload, state);
            default:
                return Object.assign({}, state);
        }
    };