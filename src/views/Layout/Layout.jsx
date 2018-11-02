import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import './Layout.less';

export default class BasicLayout extends PureComponent {
  render() {
    const {
      children,
    } = this.props;
    const nav = window.location.pathname;

    return (
      <div className="layout-wrapper">
        <div className="layout-left">
          <div className="logo-brand">
            demo
          </div>
          <Menu
            defaultSelectedKeys={[nav.substring(1)]}
            mode="inline"
            theme="dark"
          >
            <Menu.Item key="option1">
              <Link to="/option1">
                <Icon type="pie-chart" />
                <span>Option 1</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="option2">
              <Link to="/option2">
                <Icon type="desktop" />
                <span>Option 2</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="option3">
              <Link to="/option3">
                <Icon type="inbox" />
                <span>Option 3</span>
              </Link>
            </Menu.Item>
          </Menu>
        </div>
        <div className="layout-right">
          {children}
        </div>
      </div>
    );
  }
}
