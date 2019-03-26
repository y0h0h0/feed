import React from 'react';
import store from 'zasz';
import './header.css';
import * as Api from 'Api';

export default (props) =>
    <div className="Header">
      <div>
        <div/>
        {store.user.loggedIn &&
          <div>
            <div>{store.user.name}</div>
            <a href="javascript:void(0)" onClick={() => Api.logout()}>Logout</a>
          </div>
        }
      </div>
    </div>
