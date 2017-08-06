export type PathResolverProperties = {
    title: string;
    selected: boolean;
};

export type PathResolver = (properties: PathResolverProperties) => string;

export type SubMenuItem = {
    title: string;
    selected: boolean;
    path?: string | PathResolver;
};

export type SubMenuItems = {
    [key: string]: SubMenuItem;
};

export type SubMenuState = SubMenuItems;

export type MenuState = {
    [key: string]: {
        icon: string;
        title: string;
        selected: boolean;
        path?: string | PathResolver;
        subitems?: SubMenuItems;
    };
};

// Path resolver, called "path" for sake of simplicity
export const path: PathResolver = ({title}) => `#${title}`;

export const menuState: MenuState = {
    home: {
        icon: 'MdHome',
        title: 'Home',
        selected: true,
        path,
        subitems: {
            lorem: {
                title: 'Lorem',
                selected: true,
                path
            },
            ipsum: {
                title: 'Ipsum',
                selected: false,
                path
            }
        }
    },
    users: {
        icon: 'MdPeople',
        title: 'Users',
        selected: false,
        path,
        subitems: {
            dolor: {
                title: 'Dolor',
                selected: true
            },
            sit: {
                title: 'Sit',
                selected: false
            },
            amet: {
                title: 'Amet',
                selected: false
            }
        }
    },
    sells: {
        icon: 'MdShoppingCart',
        title: 'Sells',
        selected: false,
        path
    },
    charts: {
        icon: 'MdMultilineChart',
        title: 'Charts',
        selected: false,
        subitems: {
            consectetur: {
                title: 'Consectetur',
                selected: true
            },
            adipisicit: {
                title: 'Adipisicit',
                selected: false
            },
            elit: {
                title: 'Elit',
                selected: false
            },
            sed: {
                title: 'Sed',
                selected: false
            },
            do: {
                title: 'Do',
                selected: false
            },
            eiusmond: {
                title: 'Eiusmond',
                selected: false
            }
        }
    }
};