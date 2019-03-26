import React from 'react';
import store from 'zasz';

import * as Api from 'Api';

import './loginForms.css';



export default (props) => {

    let switchTab = (tab) => store.loginForms.tab = tab

    let onNameChange = (e) => store.loginForms.name = e.target.value
    let onLoginChange = (e) => store.loginForms.login = e.target.value
    let onPasswordChange = (e) => store.loginForms.password = e.target.value
    let prox = (e) => {
      if(store.loginForms.tab==='registration') {
        window.alert('THERE IS NO Registration POINT')
      } else {
        Api.login(store.loginForms.login, store.loginForms.password);
      }



    }



    return (<div className="loginForms">

        <div className="tabs">
          <div className={store.loginForms.tab==='registration' && 'active'} onClick={()=>{switchTab('registration')}}>Registration</div>
          <div className={store.loginForms.tab==='login' && 'active'} onClick={()=>{switchTab('login')}}>Login</div>
        </div>

        <div>
          {
              store.loginForms.tab==='registration' && <input type="text" value={store.loginForms.name} placeholder="Name" onChange={onNameChange} />
          }
          <input type="text" value={store.loginForms.login} placeholder="Login (email)" onChange={onLoginChange} />
          <input type="password" value={store.loginForms.password} placeholder="Password" onChange={onPasswordChange} />
        </div>

        <div className="button" onClick={prox}>Sign me {store.loginForms.tab==='registration' ? 'up' : 'in'}</div>

    </div>)

}
