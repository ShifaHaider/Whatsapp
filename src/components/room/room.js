import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import firebase from 'firebase'
import firestore from 'firebase/firestore'
import {List, ListItem} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';

import './style.css'

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: {},
            messages: [],
            message: '',
            anotherUser: {},
            fileURL: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        this.setState({anotherUser: nextProps.anotherUser});
        this.db = firebase.firestore();
        this.usersDB = this.db.collection('Users');
        this.roomsDB = this.db.collection('Rooms');
        this.userId = localStorage.getItem('Id');
        this.friendId = nextProps.anotherUser.id;
        if (nextProps.anotherUser.id) {
            this.checkRoom();
        }

    }

    checkRoom() {
        this.roomsDB.where('users.' + this.userId, '==', true).where('users.' + this.friendId, '==', true).limit(1).get().then((rooms) => {
            if (rooms.empty) {
                this.createRoom();
            }
            else {
                var roomData = rooms.docs[0].data();
                roomData.id = rooms.docs[0].id;
                this.setState({room: roomData});
                this.loadMessages();
            }
        })
    }


    addMessages() {
        var id = localStorage.getItem('Id');
        this.roomsDB.doc(this.state.room.id).collection('Messages').add({
            text: this.state.message,
            time: Date.now(),
            senderId: id,
            roomId: this.state.room.id,
            fileURL: this.state.fileURL || null,
            fileType: this.state.fileType

        })
    }

    loadMessages() {
        var data = [];
        window.Message ? window.Message() : null;
        window.Message = this.roomsDB.doc(this.state.room.id).collection('Messages').onSnapshot((msgsData) => {
            msgsData.docChanges.forEach((msgData) => {
                var msg = msgData.doc.data();
                msg.id = msgData.doc.id;
                data.push(msg);
                this.setState({messages: data})
            })
        })
    }

    createRoom() {
        var ref = this.db.collection('Rooms').doc();
        var o = {
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

        };
        o.id = ref.id;
        this.setState({room: o});
        ref.set(o).then(() => {
            this.loadMessages();
        })
    }

    handleChange(e) {
        this.setState({message: e.target.value});
    }

    uploadFile(input) {
        var file = input.target.files[0];
        console.log(file);
        var event = firebase.storage().ref().child(file.name).put(file);
        event.then((snapshot) => {
            console.log(snapshot);
            var fileURL = snapshot.downloadURL;
            this.setState({fileURL: fileURL, fileType: file.type});
            console.log(this.state);
        })
    }

    render() {
        return (
            <div>
                <List>
                    <ListItem leftAvatar={<Avatar>{(this.state.anotherUser.name || [])[0]}</Avatar>}>
                        {this.state.anotherUser.name}
                    </ListItem>
                </List>
                <Card className='card'>
                    <List>
                        {this.state.messages.map((data) => {
                            return (
                                <ListItem key={data.id} primaryText={data.text}
                                          secondaryText={new Date(data.time).toLocaleString()}>
                                    <img src={data.fileURL} alt=""/>
                                </ListItem>
                            )
                        })}
                    </List>
                </Card>
                <input type="file" onChange={this.uploadFile.bind(this)}/>
                <div className='input'>
                    <TextField className='inp' hintText="Type a Message" fullWidth={true} multiLine={true} rows={1}
                               value={this.state.message} onChange={this.handleChange.bind(this)}/>
                    <FlatButton label="Send" onClick={this.addMessages.bind(this)}/>
                </div>
            </div>
        )
    }
}

export default Room;




