import { resolvePath } from "frontend/components/menu/menu-utils";

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
export const path: PathResolver = ({title}) => `/#${title}`;

const menuState: MenuState = {
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

let initialUrl = '/' + document.location.href.replace(/^(?:\/\/|[^\/]+)*\//, "");

let selectedMenuItemKey: string;
let selectedSubMenuItemKey: string;
let foundSelection: boolean = false;

for(let menuItemKey in menuState){
    let menuItem = menuState[menuItemKey];
    if(menuItem.selected && !selectedMenuItemKey)
        selectedMenuItemKey = menuItemKey;

    if(menuItem.subitems && Object.keys(menuItem.subitems).length){
        for(let subMenuItemKey in menuItem.subitems){
            let subMenuItem = menuItem.subitems[subMenuItemKey];
            if(subMenuItem.selected && !selectedSubMenuItemKey)
                selectedSubMenuItemKey = subMenuItemKey;

            let { selected, title } = subMenuItem;
            let path = resolvePath(subMenuItem.path, { title, selected });
            if(path == initialUrl && !foundSelection){
                foundSelection = true;
                menuState[menuItemKey].subitems[subMenuItemKey].selected = true;
                menuState[menuItemKey].selected = true;
            }else{
                menuState[menuItemKey].subitems[subMenuItemKey].selected = false;
            }
        }
    }
    
    if(!foundSelection){
        let { selected, title } = menuItem;
        let path = resolvePath(menuItem.path, { title, selected });
        if(path == initialUrl && !foundSelection){
            foundSelection = true;
            menuState[menuItemKey].selected = true;
        }else{
            menuState[menuItemKey].selected = false;
        }
    }
}

if(!foundSelection){
    if(selectedSubMenuItemKey && selectedMenuItemKey){
        menuState[selectedMenuItemKey].subitems[selectedSubMenuItemKey].selected = true;
        menuState[selectedMenuItemKey].selected = true;
    }else if(selectedMenuItemKey){
        menuState[selectedMenuItemKey].selected = true;
    }
}

export { menuState };