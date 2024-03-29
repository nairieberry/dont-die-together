import React from 'react';
import { Link } from 'react-router-dom'
import '../../style/stylesheets/reset.css'
import '../../style//stylesheets/navbar.css'
import {Modal} from '../modal/modal'

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.logoutUser = this.logoutUser.bind(this);  
    this.getLinks = this.getLinks.bind(this);      
  }

  logoutUser(e) {
    e.preventDefault();
    this.props.history.push('/');
    this.props.closeSockets();
    this.props.logout();
  }

  // Selectively render links dependent on whether the user is logged in
  getLinks() {
    // debugger
    if (this.props.loggedIn) {
      return (
        <div>
          {/* <Link to={'/tweets'}>All Tweets</Link>
          <Link to={'/profile'}>Profile</Link>
          <Link to={'/new_tweet'}>Write a Tweet</Link> */}
          {/* {this.props.currentUser}<br /> */}
          <button className="navbar-thingy" onClick={this.logoutUser}>❆ Logout ❆</button>
        </div>
      );
    } else {
      return (
        <div>
          <Link className="navbar-thingy" to={'/login'}>❆ Login</Link>
          &nbsp;or&nbsp;
          <Link className="navbar-thingy" to={'/register'}>Register ❆</Link>
          {/* {this.props.openModal} */}
        </div>
      );
    }
  }

  render() {
    // console.log(this.props)
    return (
      <div>
        <div className="navbar-top"></div>
        <div className="navbar-game-title">Don't Die Together</div>
        <div className="navbar-login-register">
          {this.props.currentUser && <div>{this.props.currentUser.name}</div> }
          <div>{this.getLinks()}</div>
          {/* {!this.props.username && <div></div>} */}
        </div>
      </div>
    );
  }
}

export default NavBar;