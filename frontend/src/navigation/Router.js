import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Index as NotFoundPage } from '../components/404';
import { PublicRoute } from './PublicRoute';
import { withRouter } from 'react-router';

const loadable = loader => React.lazy(loader); // added

const routes = [
  {
    path: '/',
    component: loadable(() => import('../pages/Homepage')),
    exact: true,
    authorize: false,
  },
];

const Router = props => {
  return (
    <Switch>
      {routes.map(route => {
        return (
          <PublicRoute
            {...props}
            path={route.path}
            component={route.component}
            key={route.path}
            exact={route.exact}
            header={route.header}
            footer={route.footer}
            header={route.header || true}
          />
        );
      })}
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default withRouter(Router);
