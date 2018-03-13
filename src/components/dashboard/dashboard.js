import React, {Component} from 'react';
import firebase from 'firebase'
import firestore from 'firebase/firestore'
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import {Tabs, Tab} from 'material-ui/Tabs';
import {GridList, GridTile} from 'material-ui/GridList';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import './style.css'
import MobileTearSheet from '../MobileTearSheet/mobile-tear-sheet';
import Room from '../room/room'
import ContentSend from 'material-ui/svg-icons/content/send';
import FileFolder from 'material-ui/svg-icons/file/folder';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersData: [],
            anotherUser: {},
            rooms: []
        };
        this.db = firebase.firestore();
        this.loadUsersName();
        // this.loadRooms();

    }

    loadUsersName() {
        this.db.collection('Users').get().then((users) => {
                users.forEach((userName) => {
                    var data = userName.data();
                    var arr = this.state.usersData;
                    arr.push(data);
                    this.setState({usersData: arr})
                });
            }
        )
    }

    setData(data) {
        this.setState({anotherUser: data});
    }

    componentWillMount() {
        this.db = firebase.firestore();
        this.usersDB = this.db.collection('Users');
        this.roomsDB = this.db.collection('Rooms');
        this.userId = localStorage.getItem('Id');
        this.loadRooms();

    }

    loadRooms() {
        var arr = [];
        window.Room ? window.Room() : null;
        window.Room = this.roomsDB.where('users.' + this.userId, '==', true).onSnapshot((rooms) => {
            rooms.docChanges.forEach((room) => {
                var r = room.doc.data();
                r.id = room.doc.id;
                if (room.type == 'added') {
                    var fid  = this.userId;
                    for (var id in r.users) id != this.userId ? fid = id : null;
                    r.refs[fid].get().then((doc) => {
                        r.friend = doc.data();
                        r.friend.id = doc.id;
                        arr.push(r);
                        this.setState({rooms: arr})
                    })
                }
            })
        });
    }

    roomData(rData) {
    }

    render() {
        return (
            <div>
                <AppBar title='Dashboard'/>
                <GridList cols={12} cellHeight='auto'>
                    <GridTile cols={3}>
                        <Tabs>
                            <Tab label="Contact">
                                <MobileTearSheet>
                                    <List>
                                        {this.state.usersData.map((data) => {
                                            return (
                                                <ListItem key={data.id} disabled={true} leftAvatar={<Avatar
                                                    onClick={this.setData.bind(this, data)}>{data.name[0]}</Avatar>}>
                                                    {data.name}
                                                </ListItem>
                                            )
                                        })}
                                    </List>
                                </MobileTearSheet>
                            </Tab>
                            <Tab label="Chat">
                                <List>
                                    {this.state.rooms.map((data) => {
                                        return (
                                            <ListItem key={data.id} disabled={true}
                                                      leftAvatar={<Avatar
                                                          onClick={this.roomData.bind(this, data.friend)}
                                                          icon={<FileFolder/>}/>}
                                                      primaryText={data.friend.name}
                                                      secondaryText={data.lastMsg.text + new Date(data.lastMsg.time).toLocaleString()}>
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </Tab>
                        </Tabs>
                    </GridTile>
                    <GridTile cols={9}>
                        <Room anotherUser={this.state.anotherUser}/>
                    </GridTile>
                </GridList>
            </div>
        )
    }
}

export default Dashboard;