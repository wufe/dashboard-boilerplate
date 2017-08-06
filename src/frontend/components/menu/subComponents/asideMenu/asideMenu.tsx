import './asideMenu.scss';
import { Component, MouseEvent } from 'react';
import { getAsset, IMAGE_BRANDLOGO, Action } from "frontend/infrastructure";
import { IconBaseProps } from "react-icon-base";
import * as MdIcons from 'react-icons/md'
import * as React from 'react';
import { connect } from 'react-redux';
import { State } from 'frontend/state';
import { MenuState, ReselectedMenuState, menuItemsSelector, selectMenuItem } from 'frontend/components/menu';
import { selectSubMenuItem, resolvePath, createMenuItem } from "frontend/components/menu";
import { withRouter, RouteComponentProps } from "react-router";
import { History } from 'history';

export type AsideMenuProps = {
    children?: any;
};

export class AsideMenu extends Component<{children: any}>{

    constructor() {
        super();
    }

    render(){
        return (
            <div className="aside-menu">
                <div className="brand-logo-container">
                    <img className="brand-logo" src={getAsset(IMAGE_BRANDLOGO)} />
                </div>
                <div className="menu-items-container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export interface AsideMenuContainerProps{
    originalMenuState?: MenuState;
    menu?: ReselectedMenuState;
    selectMenuItem?: (key: string) => Action<string>;
    selectSubMenuItem?: (key: string) => Action<string>;
    history?: History;
};

class AsideMenuContainer extends Component<AsideMenuContainerProps>{

    onClick = (key: string) => {
        this.props.selectMenuItem(key);
        let menuState = this.props.originalMenuState[key];
        if(menuState && menuState.subitems){
            let firstSubItemKey = Object.keys(menuState.subitems)[0];
            this.props.selectSubMenuItem(firstSubItemKey);

            let firstSubItem = menuState.subitems[firstSubItemKey];
            let {title, path} = firstSubItem;
            let selected = true;

            let resolvedPath = resolvePath(path, {title, selected});
            if(resolvedPath)
                this.props.history.push(resolvedPath);
        }
    };

    render(){
        return (
            <AsideMenu>
                {this.props.menu.map(
                    x => createMenuItem(
                        Object.assign(x, {
                            props: {
                                onClick: () => this.onClick(x.key)
                            }
                        }),
                        !x.subitems.length ? true : false
                    )
                )}
            </AsideMenu>
        );
    }
}

const mapStateToProps: (state: State, ownProps: AsideMenuContainerProps) => Partial<AsideMenuContainerProps> =
    (state, ownProps ) => {
        return {
            originalMenuState: state.menu,
            menu: menuItemsSelector(state)
        };
    };

const mapDispatchToProps: (dispatch: any) => Partial<AsideMenuContainerProps> = 
    (dispatch) => {
        return {
            selectMenuItem: (key:string) => dispatch(selectMenuItem(key)),
            selectSubMenuItem: (key: string) => dispatch(selectSubMenuItem(key))
        };
    };

export default withRouter<AsideMenuContainerProps>(connect(mapStateToProps, mapDispatchToProps)(AsideMenuContainer) as React.ComponentType<RouteComponentProps<AsideMenuContainerProps>>);