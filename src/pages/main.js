import React from 'react';
import axios from 'axios';
//import '../style/main.css';
import '../style/sass/main.scss';
import axiosRetry from 'axios-retry';

class Main extends React.Component{
    constructor(props){
        super(props);
        this.state={
        mail:'',
        pass:'',
        pass2:'',
        phno:'',
        addr:'',
        gen:'Female',
        passlen:'6',
        show:'false',
        lg_loading:false,
        sg_loading:false,
        invalid:""
        }
        //cant even autobind itself lazy crap
        this.loginchk = this.loginchk.bind(this)
        this.login = this.login.bind(this)
        this.signup = this.signup.bind(this)
        this.showlg = this.showlg.bind(this)
        this.showsgp = this.showsgp.bind(this)
        this.stoplg = this.stoplg.bind(this);
        this.stopsg = this.stopsg.bind(this);
        this.hidebox  = this.hidebox.bind(this)
        this.c_mail = this.c_mail.bind(this)
        this.c_pass = this.c_pass.bind(this)
        this.c_pass2 = this.c_pass2.bind(this)
        this.c_phone = this.c_phone.bind(this)
        this.c_gen = this.c_gen.bind(this)
        this.c_addr = this.c_addr.bind(this)
        axiosRetry(axios, { retries: 3 });
      }
      componentWillMount(){
          document.addEventListener('mousedown',this.cick)
      }
    //check if logged in
    loginchk(e){ 
        if(this.state.show==='false')
        {
            const loggedin = localStorage.getItem("user");
            if (loggedin!=null) {
                this.setState({user:loggedin});
                this.props.history.push('/book');
            }else{
                this.showlg();}
        }
        else{this.hidebox();}
        e.preventDefault();
    } 
    stoplg(){
        console.log("stopped loading");
        this.setState({lg_loading:false});
    }stopsg(){
        this.setState({sg_loading:false});
    }
    login(e){
        var valid=true;
        if(this.state.pass===""){valid=false;
            this.setState({invalid:"please enter password"})}
        if(this.state.mail===""){valid=false;
            this.setState({invalid:"mail empty"})}
        if(valid===true){
        this.setState({lg_loading:true});
        const user = {
            mail: this.state.mail,
            pass: this.state.pass
          };
        axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/login`,  user )
        .then(res => {
            this.setState({lg_loading:false});
          if(res.data==="loged in"){
            localStorage.setItem('user',JSON.stringify(user));
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
    signup(e){
        var valid=true;
        if(this.state.addr===""){valid=false;
            this.setState({invalid:"address empty"})}
        if(this.state.phno===""){valid=false;
            this.setState({invalid:"phone number empty"})}
        if(this.state.pass2===""){valid=false;
            this.setState({invalid:"re-type password"})}
        if(this.state.pass===""){valid=false;
            this.setState({invalid:"please enter password"})}
        if(this.state.mail===""){valid=false;
            this.setState({invalid:"mail empty"})}
        if(this.state.mail===""){valid=false;
            this.setState({invalid:"mail empty"})}
        if(valid===true){
        this.setState({sg_loading:true});
        axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/signup`,{
            mail: this.state.mail,
            pass: this.state.pass,
            phno: this.state.phno,
            addr: this.state.addr,
            gen: this.state.gen,
          })
        .then(res => {
            this.setState({sg_loading:false});
          //console.log(res.data["result"]);
          if(res.data["result"]==="signed up"){
              alert("signed up check mail to verify account");
          }
        }).catch(this.stopsg());
    }
        e.preventDefault();
    }

    //show and hide popup variants
    showlg(){this.setState({show:'login'});}
    showsgp(){this.setState({show:'signup'});}
    hidebox(){this.setState({show:'false'});}
    //change textbox values
    c_mail(e){this.setState({ mail: e.currentTarget.value});this.setState({invalid:""});}
    c_pass(e){this.setState({ pass: e.currentTarget.value});this.setState({invalid:""});}
    c_pass2(e){this.setState({ pass2: e.currentTarget.value});this.setState({invalid:""});}
    c_phone(e){this.setState({ phno: e.currentTarget.value});this.setState({invalid:""});}
    c_addr(e){this.setState({addr:e.currentTarget.value});this.setState({invalid:""});}
    c_gen(e){this.setState({gen:e.currentTarget.value});this.setState({invalid:""});}
    render(){
        return(
        <div className="main-page container-fluid">
            surya<br/> 
            
           {(this.state.show!=='false')?
            <div id="myModal" className="modal modal-login">
                <div className="modal-content">
                    <span className="close" onClick={this.hidebox}>&times;</span>
                        
                    <div className="con">
                        <button  onClick={this.showlg} className="buttons ">
                            <div className={(this.state.show==="login")?"selected container":""}>Login</div></button>
                        <button  onClick={this.showsgp} className="buttons">
                            <div className={(this.state.show==="signup")?"selected container":""}>Signup</div></button>
                    </div>
                    {(this.state.show==='login')?
                    <form className='flex-container'>
                            <input value={this.state.mail} onChange={this.c_mail} className="mail inputbox" placeholder="Email" />
                                <div/>
                            <input value={this.state.pass} onChange={this.c_pass} type="password" className="pass inputbox" placeholder="Password" />
                            <div className="invalidtxt">{this.state.invalid}</div>
                            {this.state.lg_loading?<button className="submit" onClick={this.login} disabled>
                                                    <span className="spinner-border"></span></button>
                                                :<button className="submit" onClick={this.login}>Login</button>
                            }
                            </form>:
                    <form className='flex-container'>
                            <div className="row">
                                <img src={gl} className="icons" alt="google"/>
                                <img src={fb} className="icons" alt="facebook"/>
                            </div>
                            <input value={this.state.mail} onChange={this.c_mail}  className="mail inputbox" placeholder="Email" />
                                <div/>
                            <input value={this.state.pass} onChange={this.c_pass}  className="pass inputbox" type="password" placeholder="Password" />
                                <div/>
                            <input value={this.state.pass2} onChange={this.c_pass2}  className="pass2 inputbox" type="password" placeholder="Retype Password" />
                                <div/>
                            <input value={this.state.phno} onChange={this.c_phone} className="phno inputbox" placeholder="Phone Number" />
                            <input value={this.state.addr} onChange={this.c_addr} className="addr inputbox" placeholder="Address" />
                            <select ClassName="Gen"  value={this.state.gen} onChange={this.c_gen}>
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                    <option value="Other">Other</option>
                            </select>
                            {this.state.sg_loading?<button className="submit" onClick={this.login} disabled>
                            <span className="spinner-border"></span></button>
                            :<button className="submit" onClick={this.signup}>Signup</button>}
                            </form>
                }
                </div>
            </div>
        
        :null
        }
            <button className="button"  onClick={this.loginchk}>
                Book Appointment
            </button>
            
        </div>
        )
    }
}
export default Main;
