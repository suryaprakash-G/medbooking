import React from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import '../style/adminlogin.css';
class adminlogin extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            user:"",
            pass:"",
            load:false
        };
        axiosRetry(axios, { retries: 2 });
      }

    //check if logged in
    loginchk(e){ 
        if(this.state.show==='false')
        {
            const loggedin = localStorage.getItem("admin");
            if (loggedin!=null) {
                this.setState({user:loggedin});
                this.props.history.push('/adminmain');
            }else{
                this.showlg();}
        }
        else{this.hidebox();}
        e.preventDefault();
    }
    login(e){
        var valid=true;
        if(this.state.pass===""){valid=false;
            this.setState({invalid:"please enter password"})}
        if(this.state.user===""){valid=false;
            this.setState({invalid:"username empty"})}
        if(valid===true){
        this.setState({lg_loading:true});
        const admin = {
            mail: this.state.user,
            pass: this.state.pass
          };
        axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/adminlogin`, admin )
        .then(res => {
            this.setState({lg_loading:false});
          if(res.data==="loged in"){
            localStorage.setItem('admin',JSON.stringify(admin));
            this.props.history.push('/book');
          }else{
              this.setState({invalid:"invalid credentials"});
          }
        }).catch(error => {
            this.stoplg();
          });
    }
    e.preventDefault();
    }
    render(){
        return(
        <div>
        <form className='flex-container'>
        <div className="header">Admin login</div>
            <input value={this.state.uname} onChange={this.c_uname} className="inputbox" placeholder="User Name" />
            <input value={this.state.pass} onChange={this.c_pass} type="password" className="pass inputbox" placeholder="Password" />
            <div className="invalidtxt">{this.state.invalid}</div>
            {this.state.lg_loading?<button className="submit" onClick={this.login} disabled>
                                    <span className="spinner-border"></span></button>
                                :<button className="submit" onClick={this.login}>Login</button>
            }
        </form>
        </div>)
    }
}

export default adminlogin;