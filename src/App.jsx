import React from 'react';
import { hot } from 'react-hot-loader'; // eslint-disable-line import/no-extraneous-dependencies
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Layout from './views/Layout/Layout';
import Home from './views/Home/Home';
import './index.less';

const App = () => (
  <LocaleProvider locale={zhCN}>
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/option1" component={Home} />
          <Route path="/option2" component={Home} />
          <Route path="/option3" component={Home} />
        </Switch>
      </Layout>
    </Router>
  </LocaleProvider>
);

export default hot(module)(App);
