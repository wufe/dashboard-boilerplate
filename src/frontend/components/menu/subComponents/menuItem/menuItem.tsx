import * as React from 'react';
import { MouseEvent, Component } from 'react';
import * as MdIcons from 'react-icons/md';
import { IWithNavigationProps, withNavigation } from "frontend/components";
import { PathResolver } from "frontend/components/menu";

let Icons: {
    [key: string]: any;
} = MdIcons;

interface MenuItemProps extends IWithNavigationProps{
    children?: string | JSX.Element;
    icon?: any;
    selected?: boolean;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
};

export default class MenuItem extends Component<MenuItemProps>{
    public static defaultProps: Partial<MenuItemProps> = {
        children: null,
        selected: false,
        onClick: null
    };

    private onClick = (event: MouseEvent<HTMLDivElement>) => {
        if(typeof this.props.navigate == 'function'){
            this.props.navigate();
        }
        if(typeof this.props.onClick == 'function'){
            this.props.onClick(event);
        }
    };

    render(){
        let icon = this.props.icon ? (
            <span className="icon">
                {React.createElement(Icons[this.props.icon])}
            </span>
        ) : undefined;
        return (
            <div
                className={'menu-item' + (this.props.selected ? ' selected' : '')}
                onClick={this.onClick}>
                {this.props.selected ? null : <div className="hover" />}
                {icon}
                <span className="title">
                    {this.props.children}
                </span>
            </div>
        );
    }
}