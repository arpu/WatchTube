import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import { Link, withRouter } from 'react-router';

const CLOUDINARY_UPLOAD_PRESET = 'mimznvzb';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/danielcloud/upload';

class SessionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFileCloudinaryUrl: '',
      email: "",
      username: "",
      password: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderAvatar = this.renderAvatar.bind(this);
    this.renderEmail = this.renderEmail.bind(this);
    this.renderDemo = this.renderDemo.bind(this);
  }

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0]
    });
    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                        .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url
        });
      }
    });
  }

  componentDidUpdate() {
    this.redirectIfLoggedIn();
  }

  redirectIfLoggedIn() {
    if (this.props.loggedIn) {
      this.props.router.push("/");
    }
  }

  renderAvatar() {
    if (this.props.formType !== "login") {
      return(
        <div>
          <div className="file-upload">
            <Dropzone
              multiple={ false }
              accept="image/*"
              onDrop={this.onImageDrop.bind(this)}>
              <p>Drop an image or click to select a file to upload.</p>
            </Dropzone>
          </div>

          <div>
            {this.state.uploadedFileCloudinaryUrl === '' ? null :
            <div>
              <p>{this.state.uploadedFile.name}</p>
              <img src={this.state.uploadedFileCloudinaryUrl} />
            </div>}
          </div>
        </div>
      );
    } else return null;
  }

  renderEmail() {
    if (this.props.formType !== "login" ) {
      return(
        <label className="login-input">
          <input
            className="login-input-text"
            type="text"
            placeholder="Enter your email"
            value={this.state.email}
            onChange={this.update("email")}/>
        </label>
      );
    } else return null;
  }

  renderDemo() {
    if (this.props.formType === "login") {
      return(
        <label className="login-input">
          <input className="login-button" type="submit" value="Demo"
            onClick={() => this.setState({
              username: "Demo",
              password: "password"
            })}></input>
        </label>
      );
    }
  }

  renderErrors() {
    return(
      <ul className="login-signup-errors">
        {this.props.errors.map((error, idx) => (
          <li className="error-detail"key={idx}>
            {error}
          </li>
        ))}
      </ul>
    );
  }

  update(field) {
    return (e) => this.setState({
      [field]: e.currentTarget.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = this.state;
    this.props.processForm({ user });
  }

  render() {
    const text = this.props.formType === "login" ? "Log in" : "Create account";

      return (
        <div className="login-form-container">
          <form className="login-form-form" onSubmit={this.handleSubmit}>

            <img
              className="login-form-logo"
              src={require('../../../app/assets/images/logo-title.png')}/>
            <h3 className="login-form-message">
              {text} and start watching!
            </h3>

            <div className="login-input-form">

              {this.renderAvatar()}

              {this.renderEmail()}

              <label className="login-input">
                <input
                  className="login-input-text"
                  type="text"
                  placeholder="Enter your username"
                  value={this.state.username}
                  onChange={this.update("username")}/>
              </label>

              <label className="login-input">
                <input
                  className="login-input-text"
                  type="password"
                  placeholder="Enter your password"
                  value={this.state.password}
                  onChange={this.update("password")}/>
              </label>

              {this.renderErrors()}

              <label className="login-input">
                <input className="login-button" type="submit" value={text} />
              </label>

              {this.renderDemo()}

            </div>

          </form>
        </div>
      );
    }
}

export default withRouter(SessionForm);
