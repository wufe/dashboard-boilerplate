import * as React from "react";
import { resolvePath } from 'frontend/components/menu/menu-utils';
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