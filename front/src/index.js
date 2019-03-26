import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import models from 'models';
import store, { Provider } from 'zasz';

store.user = models.user();
store.posts = [];
store.newPostText = '';
store.loginForms = models.loginForms();

ReactDOM.render(<Provider><App /></Provider>, document.getElementById('root'));
