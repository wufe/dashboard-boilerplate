import * as React from "react";
import { PathResolver, PathResolverProperties } from "frontend/components/menu";
import { MenuItem } from 'frontend/components';
import { withNavigation } from "frontend/components";

export type MenuItemProperties = {
    key: string;
    selected: boolean;
    icon?: string;
    title: string;
    path?: string | PathResolver;
    props?: any;
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

export const createMenuItem: <P, S>(
    properties: MenuItemProperties,
    useNavigation?: boolean
) => JSX.Element =
    (properties, useNavigation = true) => {
        let {selected, title} = properties;
        let path: string = resolvePath(properties.path, {selected, title});
        const RoutedMenuItem = useNavigation ? withNavigation(MenuItem, path) : MenuItem;
        return (
            <RoutedMenuItem
                key={properties.key}
                selected={properties.selected}
                icon={properties.icon}
                {...(properties.props || {})}>
                {properties.title}
            </RoutedMenuItem>
        );
    };