import { AppContainer } from 'react-hot-loader';
import { render, unmountComponentAtNode } from 'react-dom';
import * as React from 'react';
import Root from 'frontend/components';
import { RouteComponentProps } from 'react-router';

declare let module: NodeModule & {
	hot: any;
}

const AppDiv = document.getElementById('app');

const renderApp = (App: React.ComponentType<RouteComponentProps<any> | {}>) => {
	render(
		<AppContainer>
			<App />
		</AppContainer>,
		AppDiv
	);
}

if (module.hot) {
	module.hot.accept(['frontend/components', 'frontend/components/layout/layout', 'frontend/components/index.tsx'], () => {
		const UpdatedRoot = require('frontend/components').default;
		unmountComponentAtNode(AppDiv);
		renderApp(UpdatedRoot);
	});
}
renderApp(Root);