import * as React from 'react';
import { Component, MouseEvent } from 'react';
import './asideSubMenu.scss';
import { SubMenuItems, subMenuItemsSelector, SubMenuState, ReselectedSubMenuState, selectSubMenuItem } from "frontend/components/menu";
import { State } from "frontend/state";
import { connect } from "react-redux";
import { Action } from "frontend/infrastructure";
import { History } from 'history';
import { withRouter, RouteComponentProps } from "react-router";
import { withNavigation, IWithNavigationProps } from "frontend/components";
import { createMenuItem } from "frontend/components/menu";

interface MenuItemProps extends IWithNavigationProps{
    children?: string;
    selected?: boolean;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
};

export class AsideSubMenu extends Component{
    render(){
        return (
            <div className="aside-submenu">
                <div className="submenu-items-container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export interface AsideSubMenuContainerProps{
    submenu?: ReselectedSubMenuState;
    selectSubMenuItem?: (key: string) => Action<string>;
};

class AsideSubMenuContainer extends Component<AsideSubMenuContainerProps>{

    onClick = (key: string) => {
        this.props.selectSubMenuItem(key);
    };

    render(){
        return (
            <AsideSubMenu>
                {this.props.submenu.map(
                    x => createMenuItem(
                        Object.assign(x, {
                            props: {
                                onClick: () => this.onClick(x.key)
                            }
                        })
                    )
                )}
            </AsideSubMenu>
        );
    }
}

const mapStateToProps: (state: State, ownProps: AsideSubMenuContainerProps) => Partial<AsideSubMenuContainerProps> =
    (state, ownProps) => {
        return {
            submenu: subMenuItemsSelector(state)
        }
    };

const mapDispatchToProps: (dispatch: any) => Partial<AsideSubMenuContainerProps> =
    (dispatch) => {
        return {
            selectSubMenuItem: (key: string) => dispatch(selectSubMenuItem(key))
        }
    };

export default connect(mapStateToProps, mapDispatchToProps)(AsideSubMenuContainer);