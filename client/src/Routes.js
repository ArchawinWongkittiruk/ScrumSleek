import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Project from './pages/Project';
import Account from './pages/Account';

import Navbar from './components/other/Navbar';
import Alert from './components/other/Alert';

const Routes = () => {
  const location = useLocation();

  return (
    <>
      {!['/register', '/login'].includes(location.pathname) && <Navbar />}
      <Alert />
      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/projects' component={Projects} />
        <Route exact path='/project/:id' component={Project} />
        <Route exact path='/account' component={Account} />
      </Switch>
    </>
  );
};

export default Routes;