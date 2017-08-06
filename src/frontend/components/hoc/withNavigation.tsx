import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";

export interface IWithNavigationProps {
    navigate?: () => void;
}

export function withNavigation<P, S>(
    Component: React.ComponentClass<P & IWithNavigationProps> | React.SFC<P & IWithNavigationProps>,
    routeWhenClicked: string
): React.ComponentClass<P> {

    class C extends React.Component<P & RouteComponentProps<P>, S> {

        constructor(props: P & RouteComponentProps<P>) {
            super(props);
        }

        onClick = () => {
            if(routeWhenClicked !== undefined)
                this.props.history.push(routeWhenClicked);
        }

        public render(): JSX.Element {
            return (
                <Component navigate={this.onClick} {...this.props} />
            );
        }
    }
    return withRouter(C);
}

export default withNavigation;