import React from 'react';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch, Link, Route } from 'react-router-dom';
import NavBarContainer from './nav/navbar_container';
import TweetsContainer from './tweets/tweets_container';
import MainPage from './main/main_page';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import ProfileContainer from './profile/profile_container';
import TweetComposeContainer from './tweets/tweet_compose_container';
import Game from './game/game';
import GameClient from './game/game_client';
import Modal from './modal/modal';
import JoinGameSessionContainer from './game/join_game_session_container'
import CreateGameSessionContainer from './game/create_game_session_container.js'
import GameSessionContainer from './game/game_session_container.js'
import '../style/stylesheets/snowy.css'

import socketIOClient from 'socket.io-client';
import { emitSetup, onSetup } from '../util/sockets_util';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'white',
      gameState: {
        player: {
          pos: [13, 13],
          health: 100,
        },
        bullets: [],
        enemies: [],
      },
      sockets: {}
    }
    this.send = this.send.bind(this);
    this.setHealth = this.setHealth.bind(this);

    this.sockets = [];
    this.isHost = null;

    this.createSocket = this.createSocket.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
    this.joinSocket = this.joinSocket.bind(this);
    this.closeSockets = this.closeSockets.bind(this);
  }

  closeSockets() {
    if (this.sockets.length > 0) {
      this.sockets.forEach((socket, idx) => {
        socket.off('From Client Input');
        socket.off('From Host GameState');
        socket.off('Initial State');
        socket.disconnect();
      })
      this.sockets = [];
    }
  }

  joinSocket(room) {
    this.room = room;

    this.closeSockets();

    console.log(window.location);

    let socket;
    if (process.env.NODE_ENV === 'development') {
      socket = socketIOClient('localhost:5000', { query: { room: this.room } });
    } else {
      socket = socketIOClient(window.location, { query: { room: this.room } });
    }
    this.sockets.push(socket);


    if (this.isHost) {
      socket.on('From Client Input', (receivedInput) => {
        this.child.SOCKET_ReceiveInputs(receivedInput);
      });
    } else {
      console.log('attached to from host game state')
      socket.on('From Host GameState', (receivedGameState) => {
        this.child.SOCKET_ReceiveGameState(receivedGameState);
      });
    }


    // if (process.env.NODE_ENV === 'development') {
    //   socket = socketIOClient('localhost:5000', { query: { room: this.room } });
    // } else {
    //   socket = socketIOClient(window.location, { query: { room: this.room } });
    // }

    // if (this.isHost) {
    //   socket.on('Initial State', (initialState) => {
    //     this.child.SOCKET_ReceiveInitialState(initialState);
    //   })
    // }


    this.sockets.push(socket);
    // this.emit = emitSetup(socket);
    // this.on = onSetup(socket);
  }
  
  createSocket() {
    this.isHost = true;
    this.joinSocket(this.props.currentUser.id);
    // this.forceUpdate();
  }
  
  connectSocket(name) {
    console.log('connecting socket');
    this.isHost = false;
    const user = this.props.users[name];
    console.log(`Connecting to user: ${user}`);
    if (user) {
      const sessionId = this.props.users[name]._id;
      console.log(`Session ID: ${sessionId}`);
      this.joinSocket(sessionId);
      return true;
    } else {
      return false;
    }
    // this.forceUpdate();
  }

  send(data) {
    // this.child.testMethod();
    if (this.emit) {
      if (this.isHost) {
        this.emit('From Host GameState', data);
      } else {
        this.emit('From Client Input', data);
      }
    }
  }

  setHealth(health) {
    return () => {
      const gameState = this.state.gameState;
      gameState['player']['health'] = health;
      return () => this.setState({ gameState });
    }
  }

  render() {
    console.log(`host: ${this.isHost}`);
    return (
      <div className="app">
        {/* } */}
        <NavBarContainer closeSockets={this.closeSockets}/>
        <Switch>
          <AuthRoute exact path="/" component={MainPage} />
          <AuthRoute exact path="/login" component={LoginFormContainer} />
          <AuthRoute exact path="/register" component={SignupFormContainer} />

          <ProtectedRoute exact path="/join" createSocket={this.createSocket} connectSocket={this.connectSocket} component={JoinGameSessionContainer} />
          <ProtectedRoute exact path="/create" createSocket={this.createSocket} connectSocket={this.connectSocket} component={CreateGameSessionContainer} />

          <ProtectedRoute path="/game" component={GameSessionContainer}>
            {this.isHost && this.props.loggedIn && 
              <Route path='/game' render={() => 
                <Game ref={Ref => this.child = Ref} send={this.send} isHost={this.isHost} name={this.props.currentUser.name}/>
              } /> }
            
            {!this.isHost && this.props.loggedIn && 
              <Route path='/game' render={() => 
                <GameClient ref={Ref => this.child = Ref} send={this.send} isHost={this.isHost} name={this.props.currentUser.name}/>
              } /> }
          </ProtectedRoute>
        </Switch>
      </div>
    )
  }
};

export default App;