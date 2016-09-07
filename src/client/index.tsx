import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import App from './App';
import Stats from './Stats';
import Summary from './Panels/Summary';
import Damage from './Panels/Damage';
import Games from './Panels/Games';
import Players from './Panels/Players';
import Warnings from './Panels/Warnings';
import Errors from './Panels/Errors';

let container = document.getElementById('react-container');
if (!container) {
  container = document.createElement('div');
  document.body.appendChild(container);
}

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      <Route component={Stats}>
        <Route path='summary' component={Summary} />
        <Route path='damage' component={Damage} />
        <Route path='games(/:id)' component={Games} />
        <Route path='players' component={Players} />
        <Route path='warnings' component={Warnings} />
        <Route path='errors' component={Errors} />
      </Route>
    </Route>
  </Router>
), container);

(window as any).gitter = {
  chat: {
    options: {
      room: 'culling-webapp-stats/Lobby',
    },
  },
};
