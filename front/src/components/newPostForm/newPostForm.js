import React from 'react';
import store from 'zasz';

import * as Api from 'Api';

import './newPostForm.css';


export default (props) => {

    let onNewPostTextChange = (e) => store.newPostText = e.target.value
    let makePost = () => Api.addPost(store.newPostText);

    return (<div className="newPostForm">
        <textarea value={store.newPostText} onChange={onNewPostTextChange} />
        <div className="button" onClick={makePost}>Add post</div>
    </div>)
}
