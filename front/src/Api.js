import axios from 'axios';
import store from 'zasz';
import models from 'models';


function request(method, path, params) {
  return new Promise((resolve) => {
    
      let apiServer = process.env.NODE_ENV==='development' ? 'http://localhost:5000/api/' : window.location.origin+'/api/';

      axios[method](apiServer + path, params)
      .then((response) => {
        console.log('>2', response.data)
        return resolve({result:response.data.result})
      }, (error) => {
        console.warn(error)
        return resolve({error:error.response.data})
      })
    });
}





export async function actualizePosts() {
  console.warn('START OF ACTUALIZING')
  let response = await request('get', 'posts/get');
  console.warn('FIN ZH')
  if(response.error) {console.warn('AN ERROR', response.error); return; }
  console.warn('POSTS: ',response.result)
  store.posts = response.result;
}




export async function login(login, password) {
  let response = await request('post', 'auth/login',{login, password});
  console.log('>LOIGN', response)
  if(response.error) {console.warn('AN ERROR', response.error); return; }
  window.localStorage.feed_token = response.result;
  store.loginForms = models.loginForms();
  loginByToken(response.result);
}


export async function loginByToken(token) {
  let getMe = await request('get', 'auth/getMe?token='+token);
  if(getMe.error) {
    window.localStorage.removeItem('feed_token');
    console.warn('WRONG TOKEN, so i am deleting it', getMe.error);
    return;
  }

  let newUser = models.user();
  newUser.loggedIn = true;
  newUser.name = getMe.result.name;
  newUser.email = getMe.result.email;
  newUser.id = getMe.result.id;
  newUser.token = token;
  store.user = newUser;
}


export async function logout() {
  window.localStorage.removeItem('feed_token');
  store.user = models.user();
}


export async function addPost(text) {
  let response = await request('post', 'posts/add', {
    token:store.user.token,
    text
  });
  if(response.error) {
    console.warn('COULDNT ADD POST', response.error);
    return;
  }
  store.newPostText = '';
  actualizePosts();
}
