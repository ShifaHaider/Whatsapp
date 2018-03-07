import React, {Component} from 'react';
import firebase from 'firebase'
import firestore from 'firebase/firestore'
import App from "../../App";
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import {purple500} from 'material-ui/styles/colors';
import {Tabs, Tab} from 'material-ui/Tabs';
import Slider from 'material-ui/Slider';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersData: []
        };

        this.db = firebase.firestore();
        this.loadUsersName();
    }

    loadUsersName() {
        this.db.collection('Users').get().then((users) => {
                console.log(users);
                users.forEach((userName) => {
                    var data = userName.data();
                    var arr = this.state.usersData;
                    arr.push(data);
                    this.setState({usersData: arr})
                });
                console.log(this.state.usersData);
            }
        )
    }


    render() {
        return (
            <div>
                <AppBar title='Dashboard'/>
                {/*<List>*/}
                {/*{this.state.usersData.map((data) => {*/}
                {/*console.log(data);*/}
                {/*return (*/}
                {/*<div>*/}
                {/*<ListItem key={data.id}*/}
                {/*disabled={true}*/}
                {/*leftAvatar={<Avatar>{data.name[0]}</Avatar>}*/}
                {/*backgroundColor={purple500}>*/}
                {/*{data.name}*/}
                {/*</ListItem>*/}
                {/*</div>*/}
                {/*)*/}
                {/*})}*/}
                {/*</List>*/}
                <Tabs>
                    <Tab label="Item One">
                        <List>
                        {this.state.usersData.map((data) => {
                        console.log(data);
                        return (
                        <div>
                        <ListItem key={data.id}
                        disabled={true}
                        leftAvatar={<Avatar>{data.name[0]}</Avatar>}
                        backgroundColor={purple500}>
                        {data.name}
                        </ListItem>
                        </div>
                        )
                        })}
                        </List>
                    </Tab>
                    <Tab label="Item Two">
                        fsdfsdf
                    </Tab>
                </Tabs>
            </div>
        )
    }
}

export default Dashboard;