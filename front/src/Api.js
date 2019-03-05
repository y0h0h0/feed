import axios from 'axios';


function __getAPIaddress() {
  if(process.env.NODE_ENV==='development') {
    return 'http://localhost:5000/api/';
  } else {
    return 'https://warhound.herokuapp.com/api/';
  }
}



export function getPosts() {
  // console.log( process   );

  // 34026
console.log('>1')
  return new Promise((resolve) => {

      console.log('>1', __getAPIaddress() + 'posts/get')
      // axios.post(__getAPIaddress() + 'auth/port')
      axios.post(__getAPIaddress() + 'posts/get')
      .then((response) => {
        console.log('>2', response.data)
        resolve({result:response.data.result})

        // clearInterval(waiter);
        // if (response.data.error && window.console) {
        //   window.console.log.apply(console, [
        //     "%c'"+ method +"' ERROR "+ response.data.error.code +"': %c"+ response.data.error.message,
        //     "color:#ff0000;font-weight:bold;",
        //     "color:#ff0000;"
        //   ]);
        //   if (response.data.error.code === 'API_403') {
        //     window.localStorage.removeItem('DC_authToken');
        //     window.localStorage.removeItem('DC_selectedClientId');
        //     router.resetStack('onboarding')
        //   }
        // }
        // if (callback) {
        //   callback(response.data.result , response.data.error, response);
        // }
      }, (error) => {
        resolve({error})
        // if (!error.__proto__.__CANCEL__) {
        //   window.emit('ScreenLocker::show', { error, method });
        // }
      })


  })


  // axios.post(apiaddress + method, data, {
  //
  // })
  // .then((response) => {
  //   clearInterval(waiter);
  //   if (response.data.error && window.console) {
  //     window.console.log.apply(console, [
  //       "%c'"+ method +"' ERROR "+ response.data.error.code +"': %c"+ response.data.error.message,
  //       "color:#ff0000;font-weight:bold;",
  //       "color:#ff0000;"
  //     ]);
  //     if (response.data.error.code === 'API_403') {
  //       window.localStorage.removeItem('DC_authToken');
  //       window.localStorage.removeItem('DC_selectedClientId');
  //       router.resetStack('onboarding')
  //     }
  //   }
  //   if (callback) {
  //     callback(response.data.result , response.data.error, response);
  //   }
  // }, (error) => {
  //   if (!error.__proto__.__CANCEL__) {
  //     window.emit('ScreenLocker::show', { error, method });
  //   }
  // })




}
