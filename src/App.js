import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Router, Route, Switch, Link} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import firebase from 'firebase'
import firestore from 'firebase/firestore'
import Account from "./components/create-account/create-account";
import Login from "./components/login/login";
import Dashboard from "./components/dashboard/dashboard";


var config = {
    apiKey: "AIzaSyDE-xiJYHnsJELOJmNW_M9LrGbITKv6YBY",
    authDomain: "whatsapp-c9cc7.firebaseapp.com",
    databaseURL: "https://whatsapp-c9cc7.firebaseio.com",
    projectId: "whatsapp-c9cc7",
    storageBucket: "whatsapp-c9cc7.appspot.com",
    messagingSenderId: "297648899483"
};
firebase.initializeApp(config);
const history = createBrowserHistory();
class App extends Component {
  render() {
    return (
      <div className="App">
          <Router history={history}>
              <div>
                  <Switch>
                      <Route exact path={'/'} component={Account}/>
                      <Route exact path={'/account'} component={Account}/>
                      <Route exact path={'/login'} component={Login}/>
                      <Route exact path={'/dashboard'} component={Dashboard}/>

                  </Switch>
              </div>
          </Router>
      </div>
    );
  }
}

export default App;
