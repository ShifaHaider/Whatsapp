import React, {Component} from 'react';
import firebase from 'firebase'
import firestore from 'firebase/firestore'
import App from "../../App";
import '../../index.css';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import './style.css'


class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {
                name: '',
                email: '',
                password: '',
                phone: ''
            },
            message: '',
            isAlertOpen: false
        }
    };

    createAccount() {
        var db = firebase.firestore();
        firebase.auth().createUserWithEmailAndPassword(this.state.userData.email, this.state.userData.password)
            .then((data) => {
                console.log(data);
                console.log(data.uid);
                var userData = this.state.userData;
                userData.id = data.uid;
                db.collection('Users').doc(data.uid).set(userData);
                this.props.history.push('/login');

            })
            .catch((error) => {
                this.setState({message: error.message, isAlertOpen: true});
            });
        console.log(this.state.userData);
    }

    handleChangeReg(p, e) {
        var userData = this.state.userData;
        userData[p] = e.target.value;
        this.setState({userData: userData})
    }

    login() {
        console.log(this.props);
        this.props.history.push('/login')
    }

    close() {
        this.setState({isAlertOpen: false});
    }

    render() {

        return (
            <div className='account'>
                <AppBar title='Account'/>
                <TextField
                    hintText="Name Field"
                    floatingLabelText="Name"
                    type="text"
                    value={this.state.userData.name}
                    onChange={this.handleChangeReg.bind(this, 'name')}/><br/>
                <TextField
                    hintText="Email Field"
                    floatingLabelText="Email"
                    type="text"
                    value={this.state.userData.email}
                    onChange={this.handleChangeReg.bind(this, 'email')}/><br/>
                <TextField
                    hintText="Password Field"
                    floatingLabelText="Password"
                    type="password"
                    value={this.state.userData.password}
                    onChange={this.handleChangeReg.bind(this, 'password')}/><br/>
                <TextField
                    hintText="Phone Number"
                    floatingLabelText="Phone Number"
                    type="number"
                    value={this.state.userData.phone}
                    onChange={this.handleChangeReg.bind(this, 'phone')}/><br/>
                <RaisedButton label='Create Account' secondary={true} onClick={this.createAccount.bind(this)}/><br/><br/>
                <RaisedButton label='Login' primary={true} onClick={this.login.bind(this)}/>


                <Dialog
                    actions={<FlatButton
                        label="Cancel"
                        primary={true}
                        onClick={this.close.bind(this)}/>}
                    modal={false}
                    open={this.state.isAlertOpen}>
                    {this.state.message}
                </Dialog>
            </div>
        )
    }
}

export default Account;