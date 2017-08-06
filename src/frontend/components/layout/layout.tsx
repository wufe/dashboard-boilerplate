import './layout.scss';
import { AsideMenu, AsideSubMenu, Body } from "frontend/components";
import { Component } from 'react';
import * as React from 'react';

export class Layout extends Component{
    render(){
        return (
            <div className="layout">
                <div className="aside-menu-container">
                    <AsideMenu />
                </div>
                <div className="aside-submenu-container">
                    <AsideSubMenu />
                </div>
                <div className="body-container">
                    <Body />
                </div>
            </div>
        );
    }
}

export default class LayoutContainer extends Component{
    render(){
        return <Layout {...this.props}/>;
    }
}