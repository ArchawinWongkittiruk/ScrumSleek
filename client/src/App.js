import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Project from './pages/Project';
import Account from './pages/Account';

import Alert from './components/other/Alert';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Alert />
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/projects' component={Projects} />
          <Route exact path='/project/:id' component={Project} />
          <Route exact path='/account' component={Account} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
