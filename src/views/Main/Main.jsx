import React from 'react';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Card,{CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import './Main.css';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import {Avatar} from './Avatar';
import {People} from './People';
//bootstrap & jquery
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';

import {Redirect} from 'react-router-dom';

const styles = {
    example: {
        position: "fixed",
        top:0
    }
};

export class Main extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            completed: 0,
            load: false,
            menu: false,
            tweets: [],
            file: '',
            tweet: '',
        };
        this.ShowMenu = this.ShowMenu.bind(this);
        this.onChangeTweet = this.onChangeTweet.bind(this);
    }

    clearFile(){
        document.getElementById("profilePictures").value = "";
    }

    getTweets(){
        fetch('https://test-mobile.neo-fusion.com/data', {
            method: 'GET',
            headers: {
              'Access-Token': localStorage.getItem('access'),
            }
      })
        .then(results => results.json())
        .then(data => {let tweets = data.map((item)=>{
            return(
                <div key={item.id} className="tweetListWrapper">
                    <Card>
                        <CardHeader title="John" subtitle="john" avatar="http://fanaru.com/random/image/thumb/160391-random-seriously-face-avatar.jpg" />
                        <Divider />
                        <div className="tweetDetail">
                            <img src={item.thumbnail_url}/>
                            <p>
                            {item.summary}
                            </p>
                        </div>
                    </Card>
                 </div>
            );
        });
        this.setState({
            tweets: tweets,
        });
    }).catch((error) => {
        console.error(error);
      });
      this.setState(({tweet: ""}));

    }

    onChangeTweet(e){
        this.setState({tweet: e.target.value});
    }

    handleSubmit(e){
        let image = document.getElementById("profilePictures").files[0];
        let form = new FormData();
        form.append("file", image);
        console.log(localStorage.getItem('access'));
        console.log( form.get('file'));
        fetch('http://test-mobile.neo-fusion.com/data/create', {
            method: 'POST',
            headers: {
              'Access-Token': localStorage.getItem('access'),
            },
            body: form
      }).then((response) => response.json())
      .then((data)=> {
          console.log(data);
          
            fetch('https://test-mobile.neo-fusion.com/data/'+data.id+'/update', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Token': localStorage.getItem('access'),
                },
                body: JSON.stringify({
                    'summary': this.state.tweet,
                    'detail': this.state.tweet,
              })
          }).then(response => response.json()).then((data =>{
              this.getTweets();
          }))
    }).catch((error) => {
        console.error(error);
      });

        e.preventDefault();
    }
    

    ShowMenu(){
        if(this.state.menu === true){
            this.setState({menu: false});
        }else{
            this.setState({menu: true});
        }
    }

    isAuthenticated() {
        const token =  localStorage.getItem('access');
        /*if(token && token.length > 10 ){
            return true;
        }*/
        return token && token.length > 10;
    }
    isLogout(){
        localStorage.removeItem('access');
        return <Redirect to ={{pathname: '/'}} />
    }
    
    render(){
        const isAlreadyAuthenticated = this.isAuthenticated();
        return(
            <MuiThemeProvider>
              {!isAlreadyAuthenticated ?
              <Redirect to ={{pathname: '/'}} /> :  (
              
           
            <nav className="navbar navbar-expand-lg navbar-light bg-dark">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
            <a className="navbar-brand text-light" href="#">TWIT</a>

            <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                <li className="nav-item ">
                    <a className="nav-link text-light" href="#">Beranda</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-light" href="#">Notifikasi</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-light" href="#">Pesan</a>
                </li>
                </ul>
                <form className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-success my-2 my-sm-0" type="submit">Search</button>&nbsp;
                </form>
                <form onSubmit={this.isLogout}>
                    <button className="btn btn-danger my-2 my-sm-0" >Log Out</button>
                </form>
            </div>
            </nav>
                )}

                <div>
                <p> avatar </p>
                  <div className="followWrapper">
                       <p> people </p>
                    </div>
                <div className="tweetWrapper">
                    <Card>
                    <div className="inputWrapper">
                        <form name="myForm" method="POST" onSubmit={(e) => this.handleSubmit(e)}encType="multipart/form-data">

                             <div className="form-group">
                                <label for="comment">Write Something</label>
                                <textarea 
                                    className="form-control txtarea" rows="4" id="comment" name="tweetText" 
                                    value={this.state.tweet} onChange={this.onChangeTweet} required maxlength="303">
                                </textarea>
                            </div>

                            <input type="file" id="profilePictures" name="file" ref="file" 
                                onClick = {() => this.clearFile()} 
                            />
                            <button type="submit" id="clear">Tweet</button>
                        </form>
                    </div>
                    </Card>
                 </div>
                 {this.state.tweets}
                 
             </div> 
            </MuiThemeProvider>
        );
    }
}


export default Main;
