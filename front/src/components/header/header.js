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
            <div onClick={() => Api.logout()}>Logout</div>
          </div>
        }
      </div>
    </div>
