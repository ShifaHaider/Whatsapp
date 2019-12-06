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
                text: this.state.message
            }

        };
        o.id = ref.id;
        this.setState({room: o});
        ref.set(o).then(() => {
            this.loadMessages();
        })
    }

    addMessages() {
        var id = localStorage.getItem('Id');
        {this.state.message ?
        this.roomsDB.doc(this.state.room.id).collection('Messages').add({
            text: this.state.message,
            time: Date.now(),
            senderId: id,
            roomId: this.state.room.id,
            fileURL: this.state.fileURL || null,
            fileType: this.state.fileType || null

        }): null}
        this.setState({message : ""})
    }

    loadMessages() {
        var data = [];
        this.setState({messages: data});
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


    handleChange(e) {
        this.setState({message: e.target.value});
    }

    uploadFile(input) {
        var file = input.target.files[0];
        var fileName = file.name.split('.');
        var fileExtension = fileName[fileName.length - 1].toLocaleLowerCase();
        var fileType = '';
        if (['jpg', 'gif', 'bmp', 'png', 'jpeg'].indexOf(fileExtension) != -1) {
            fileType = 'image';
        }
        else if (['m4v', 'avi', 'mpg', 'mp4', 'webm','wmv'].indexOf(fileExtension) != -1) {
            fileType = 'video';
        }
        else {
            fileType = 'file';
        }
        var event = firebase.storage().ref().child(file.name).put(file);
        event.then((snapshot) => {
            var fileURL = snapshot.downloadURL;
            this.setState({fileURL: fileURL, fileType: fileType});
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
                {this.state.messages.length === 0 ? null :
                <Card className='card'>
                    <List>
                        {this.state.messages.map((data) => {
                            return (
                                <ListItem key={data.id} primaryText={data.text}
                                          secondaryText={new Date(data.time).toLocaleString()}>
                                    {data.fileType == 'image' ? <img src={data.fileURL} width='250' height='240'/> : ''}
                                    {data.fileType == 'video' ? <video width='320' height='240' controls><source src={data.fileURL}/></video> : ''}
                                    {data.fileType == 'file' ? <img src={data.fileURL}/> : ''}

                                </ListItem>
                            )
                        })}
                    </List>
                </Card>}

                <div className='input'>
                    <TextField className='inp' hintText="Type a Message"  multiLine={true} rows={1}
                               value={this.state.message} onChange={this.handleChange.bind(this)}/>

                    <FlatButton label="Send" onClick={this.addMessages.bind(this)}/>
                    <input type="file" onChange={this.uploadFile.bind(this)}/>
            </div>
            </div>
        )
    }
}

export default Room;




