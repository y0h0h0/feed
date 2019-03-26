import React, { Component } from 'react';
// import logo from './logo.svg';
import './Styles.css';
import * as Api from 'Api';

import Header from 'components/header/header';
import LoginForms from 'components/loginForms/loginForms';
import NewPostForm from 'components/newPostForm/newPostForm';
import APost from 'components/aPost/aPost';

import store from 'zasz';


class App extends Component {


  componentDidMount() {
    console.log('App mounted at ', window.location);
    console.log( process.env );
    Api.actualizePosts();


    if(window.localStorage.feed_token) {
      console.log(' heaf goog ', window.localStorage.feed_token)
      Api.loginByToken(window.localStorage.feed_token)
    }
  }




  render() {


    return (
      <div className="App">
        <Header />

        <div className="topPanel">
          <div>
          {store.user.loggedIn ?
            <NewPostForm />
            :
            <LoginForms />
          }
          </div>
        </div>

        <div className="postList">
          <div>{
            store.posts.map(post => {
              return <APost key={post.id} post={post} />
            })
          }</div>
        </div>

        <div className="footer">
          <div>
            <div>&copy; Romka 2019</div>
            <div>a test project</div>
          </div>
        </div>


      </div>
    );

  }
}

export default App;
