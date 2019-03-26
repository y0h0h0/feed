import React from 'react';
import './aPost.css';



export default (props) => {
    let {post} = props;
    let d = new Date(post.datetime);
    d = d.toString().split(' ');
    let fDate = `${d[1]} ${d[2]} ${d[3]} ${d[4]}`;

    return (
      <div key={post.id} className="aPost">
        <div className="userName">{post.authorname}</div>
        <div className="postDatetime">{fDate}</div>
        <div className="text">{post.text}</div>
      </div>
    )

}
