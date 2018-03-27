import React from 'react';
import {
    withStyles,
    Card,
    CardContent,
    CardHeader,
    CardActions,
    Avatar
  } from "material-ui";
import Divider from 'material-ui/Divider';
import {Redirect} from 'react-router-dom';
import { Grid } from "material-ui";
import {
    ProfileCard,
    RegularCard,
    TasksCard,
    Button,
    CustomInput,
    ItemGrid
  } from "components";
  import {
    FormLabel,
    FormControl,
    FormGroup,
    FormControlLabel,
    FormHelperText,
  } from 'material-ui/Form';

export class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            completed: 0,
            menu: false,
            tweets: [],
            file:"null",
            tweet: '',
            people: [],
        };
        this.onChangeTweet = this.onChangeTweet.bind(this);
        this.getTweets = this.getTweets.bind(this);
    }

    getTweets(){
        fetch('https://test-mobile.neo-fusion.com/data', {
            method: 'GET',
            headers: {
              'Access-Token': localStorage.getItem('access'),
            }
      }).then(results => results.json()).then(data => {let tweets = data.map((item)=>{
            return(
                <div key={item.id} className="tweetListWrapper">
                    <RegularCard
                    cardTitle="John"
                    cardSubtitle="john"
                    headerColor="blue"
                    avatar={<Avatar src="http://fanaru.com/random/image/thumb/160391-random-seriously-face-avatar.jpg"/>}
                    content={
                        <div className="tweetDetail">
                        <img src={item.thumbnail_url}/>
                        <p>
                           {item.summary}
                        </p>
                    </div>
                    }
                    >
                    </RegularCard>
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

      fetch('https://randomuser.me/api/?results=5')
        .then(results => results.json())
        .then(data => {let people = data.results.map((item, index)=>{
            return(
                <div key={index} className="follow">
                <ItemGrid xs={12} sm={12} md={4}>
          <ProfileCard
            avatar={item.picture.medium}
            subtitle={item.login.username}
            title={item.name.first}
            footer={
              <Button color="primary" round>
                Follow
              </Button>
            }
          />
        </ItemGrid>
        </div>
            );
        });
        this.setState({
            people: people,
        });
    })
    }


    componentDidMount() {
        this.getTweets();
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
            <div>
            {!isAlreadyAuthenticated ?
              <Redirect to ={{pathname: '/'}} /> : 
                <div>
                    <div className="avatarWrapper">
                <Grid container>
        <ItemGrid xs={4} sm={4} md={4}>
        <ProfileCard
            avatar="http://fanaru.com/random/image/thumb/160391-random-seriously-face-avatar.jpg"
            subtitle="john"
            title="John"
            description="I am the great John, duh."
          />
        </ItemGrid>
      </Grid>
    </div>
                  <div className="followWrapper">
                  {this.state.people}
                    </div>
                    
                    <div className="tweetWrapper">
                    <Card>
                    <div className="inputWrapper">
                        <form name="myForm" method="POST" onSubmit={(e) => this.handleSubmit(e)}encType="multipart/form-data">

                             <div className="form-group">
                                <label>Write Something</label>
                                <textarea 
                                    className="form-control txtarea" rows="4" id="comment" name="tweetText" 
                                    value={this.state.tweet} onChange={this.onChangeTweet} required>
                                </textarea>
                            </div>

                            <input type="file" id="profilePictures" name="file" ref="file" />
                            <button type="submit" id="clear">Tweet</button>
                        </form>
                    </div>
                    </Card>
                 </div>
                 {this.state.tweets}
                </div>
              }
            </div>
        );
    }
}
export default Main;
