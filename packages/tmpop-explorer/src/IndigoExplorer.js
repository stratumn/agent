import React, { Component } from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
// import Blocks from './components/Blocks';
import App from './containers/App';
import BlockContainer from './containers/BlockContainer';
import Index from './containers/Index';
import IndigoReader from './IndigoReader';
import IndigoReaderProvider from './containers/IndigoReaderProvider';

export default class IndigoExplorer extends Component {

	constructor(props) {
		super(props);
		this.indigoReader = new IndigoReader(this.props.remote);
	}	

	render(){
		return(
			<IndigoReaderProvider reader={this.indigoReader}>
				<Router history={browserHistory}>
					<Route path="/" component={App}>
						<IndexRoute component={Index} />
						<Route path="blocks/:height" component={BlockContainer} />						
					</Route>
				</Router>
			</IndigoReaderProvider>
		);
	}
}

IndigoExplorer.propTypes = {
	remote: React.PropTypes.string.isRequired,
};

