import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import firebase from 'firebase'
import firestore from 'firebase/firestore'


class Room extends Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {

        };
    }

    componentDidUpdate() {
        console.log(this.props.anotherUser);
        if(this.props.anotherUser.id){
            this.createRom();
        }
    }

    createRom() {
        this.db = firebase.firestore();
        this.usersDB = this.db.collection('Users');
        this.userId = localStorage.getItem('Id');
        this.friendId = this.props.anotherUser.id;
        var ref = this.db.collection('Rooms').doc();
        ref.set({
            [this.userId]: 1,
            [this.friendId]: 1,
            users: {
                [this.userId]: true,
                [this.friendId]: true
            },
            lastMsgTime: Date.now(),
            refs: {
                [this.userId]: this.usersDB.doc(this.userId),
                [this.friendId]: this.usersDB.doc(this.friendId)
            },
            lastMsg: {
                time: Date.now(),
                text: 'New Message'
            }
        })
    }

    render() {
        return (
            <div>
                <Card className='card'>
                    <CardText>{this.props.anotherUser.name}</CardText>
                    <CardText>{new Date().toLocaleString()}</CardText>
                </Card>
                <div className='input'>
                    <TextField hintText="Type a Message" fullWidth={true} multiLine={true} rows={1}/>
                </div>
            </div>
        )
    }
}

export default Room;



