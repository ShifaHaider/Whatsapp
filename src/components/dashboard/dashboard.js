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

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersData: [],
            anotherUser: {}
        };

        this.db = firebase.firestore();
        this.loadUsersName();
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
        this.setState({anotherUser:data});

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
                                                <ListItem key={data.id} disabled={true}
                                                          leftAvatar={<Avatar onClick={this.setData.bind(this, data)}>{data.name[0]}</Avatar>}>
                                                    {data.name}
                                                </ListItem>
                                            )
                                        })}
                                    </List>
                                </MobileTearSheet>
                            </Tab>
                            <Tab label="Chat">
                                <TextField hintText="Hint Text"/>
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