import { useParams } from "react-router-dom";

import "./Post.css";
import React from 'react'

const PostWrapper = () => {
  const { id } = useParams();
  return <Post id={id}  />;
};

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.textRef = React.createRef();
    this.state = {
      data: null,
      comments: null,
      commentArray: null,
      id: null,
    };
  }

  componentDidMount() {
    const { id } = this.props;
    this.setState({ id }, () => {
      this.getData();
    });
  }

  validSubmission = () => {
    if (this.textRef.current.value) {
      return true;
    } else {
      return false;
    }
  }
  handleLike = async () =>
  {
    const response = await fetch("http://localhost:5000/post/like", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id: this.state.id,
      }),
    });
    const responseData = await response.json();
    if (responseData.errorMsg) {
      window.location.href = "/login";
    }
    else {
      window.location.reload();
    }
  }
  handleDislike = async () =>
  {
    const response = await fetch("http://localhost:5000/post/dislike", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id: this.state.id,
      }),
    });
    const responseData = await response.json();
    if (responseData.errorMsg) {
      window.location.href = "/login";
    }
    else {
      window.location.reload();
    }
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    console.log(this.textRef.current.value)
    if (this.validSubmission()) {
      const response = await fetch(`http://localhost:5000/post/comment/${this.state.id}`, {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          text: this.textRef.current.value,
        }),
      });
      const responseData = await response.json();
      //error
      if (responseData.errorMsg) {
        window.location.href = "/login";
      }
      else {
        window.location.reload();
      }
    }
  }

  async getData() {
    const res = await fetch(`http://localhost:5000/post/view/${this.state.id}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    const otherRes = await fetch(`http://localhost:5000/post/comments/${this.state.id}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const comments = await otherRes.json();
      this.setState({ comments });

      this.setState({ data }, () => {
        this.genArray();
      });
      console.log(comments)
  }
  genArray = () => {
    const thisArr = this.state.comments.map((item, index) => (
      <div key={index} id="cmnt">
        <a id="author" href={`/profile/${item.user}`} className="mid">{item.username}</a>
        <div className="mid">{item.text}</div>
      </div>
    ));

    this.setState({ commentArray: thisArr });
  }

    handleDelete = () => {
        const { id } = this.state;

        fetch("http://localhost:5000/post/delete", {
            method: "DELETE",
            mode: "cors",
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ id: id }),
        })
        .then((res) => { 
            window.location.href = "/feed"
        })
        
 
    };

  render() {

    const { commentArray } = this.state

    if (this.state.data == null) {
      return (
        <div>
          <div id="postdiv">
            <h1>Loading <small>by loading</small></h1>
            <div>
              Loading
            </div>
          </div> 
        </div>
      );
    } else {
      return (
        <div>
          <div id="postdiv">
            <h1>{this.state.data.post.title} <small>by {this.state.data.author}</small></h1>
            <div>
              {this.state.data.post.text}
            </div>
            {this.state.data.ownpost ? (
              <div>
                <button id="btns-delete" className="btn" onClick={this.handleDelete}>Delete</button>
              </div>
            ) : ""}
            <div id="ratebtns">
                { this.state.data.liked ? <button className="midbtn sel" onClick={this.handleLike}>Liked</button> :                 <button className="midbtn" onClick={this.handleLike}>Like</button>}
                <a>{this.state.data.post.likes}</a>
                {this.state.data.disliked ? <button className="midbtn sel" onClick={this.handleDislike}>Disliked</button> :                 <button className="midbtn" onClick={this.handleDislike}>Dislike</button>}
            </div>
          </div>
          <div id="commentdiv">
          <form id="comment-form" onSubmit={this.handleSubmit}>
            <label htmlFor="text">Comment</label>
            <input
              maxLength={150}
              ref={this.textRef}
              placeholder="What are you thinking..."
              type="text"
              id="text"
              name="text"
            ></input>
            <button id="cmnt-form-btn" type="submit">
              Comment
            </button>
          </form>
          </div>
          <div>
          <div id="commentsection">
            <h1>Comments</h1>
            {commentArray}
          </div>
          </div>

        </div>
      );
    }
  }
}

export default PostWrapper;
