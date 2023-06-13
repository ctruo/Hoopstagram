import React from 'react';
import "./Feed.css";

class Feed extends React.Component {
  constructor(props) {
    super(props);
    // https://stackoverflow.com/questions/62499061/how-to-use-react-useref-in-class-component
    this.textRef = React.createRef();
    this.titleRef = React.createRef();
    this.state = {
      data: null,
      array: null,
    };
  }

  componentDidMount() {
    this.getData();
  }

  validSubmission = () => {
    if (this.textRef.current.value && this.titleRef.current.value) {
      return true;
    } else {
      return false;
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    if (this.validSubmission()) {
      const response = await fetch("http://localhost:5000/post/create", {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: this.titleRef.current.value,
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

  getData = async () => {
    const response = await fetch("http://localhost:5000/user/feed", {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    this.setState({ data }, () => {
      this.genArray();
    });
    console.log(this.state.data);
  }

  genArray = () => {
    const thisArr = this.state.data.map((item, index) => (
      <div key={index} id="postE">
        <a className="mid" href={`/view/${item._id}`}>{item.title}</a>
        <div className="mid">{item.text}</div>
      </div>
    ));

    this.setState({ array: thisArr });
  }

  render() {
    const { array } = this.state;

    return (
      <div>
        <div>
          <form id="post-form" onSubmit={this.handleSubmit}>
            <label htmlFor="title">Title</label>
            <input
              maxLength={20}
              ref={this.titleRef}
              placeholder="Enter a title..."
              type="text"
              id="title"
              name="title"
            ></input>
            <label htmlFor="text">Post Text</label>
            <textarea
              ref={this.textRef}
              maxLength={1000}
              placeholder="Post about anything..."
              rows="6"
              cols="100"
              type="text"
              id="text"
              name="text"
            ></textarea>
            <button id="post-form-btn" type="submit">
              Post
            </button>
          </form>
        </div>
        <div id="posts">
          <h1 className="postsheader">Posts</h1>
          <div id="postcontainer">
            {array ? array : "Head over to the login page to begin viewiewing posts!"}
          </div>
        </div>
      </div>
    );
  }
}
export default Feed;
