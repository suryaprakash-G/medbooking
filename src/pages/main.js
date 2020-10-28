import React from 'react';
import axios from 'axios';
import '../style/main.css';
import gl from '../img/google.png';
import fb from '../img/facebook.png';

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
        show:'false'
        }
        //cant even autobind itself lazy crap
        this.loginchk = this.loginchk.bind(this)
        this.login = this.login.bind(this)
        this.signup = this.signup.bind(this)
        this.showlg = this.showlg.bind(this)
        this.showsgp = this.showsgp.bind(this)
        this.hidebox = this.hidebox.bind(this)
        this.c_mail = this.c_mail.bind(this)
        this.c_pass = this.c_pass.bind(this)
        this.c_pass2 = this.c_pass2.bind(this)
        this.c_phone = this.c_phone.bind(this)
        this.c_gen = this.c_gen.bind(this)
        this.c_addr = this.c_addr.bind(this)
      }
      componentWillMount(){
          document.addEventListener('mousedown',this.cick)
      }
    //check if logged in
    loginchk(e){ 
        //history.push('/book');
        //e.preDefault();
        if(this.state.show==='false')
        {this.showlg()}
        else{this.hidebox();}
        console.log(this.state.mail);
        e.preventDefault();
    }
    login(e){
        const user = {
            mail: this.state.mail,
            pass: this.state.pass
          };
          //alert("maapi");//192.168.29.58
        axios.post(`https://9k1attlbyd.execute-api.ap-south-1.amazonaws.com/test`,  user )
        .then(res => {
            console.log(res.data.body);
          if(res.data.body==="loged in"){
            console.log(res.data.body);
            this.props.history.push('/book');
          }
        })
        e.preventDefault();
    }
    signup(e){
        var user = {
            mail: this.state.mail,
            pass: this.state.pass,
            phno: this.state.phno,
            addr: this.state.addr,
            gen: this.state.gen,
          };
        axios.post(`https://sd51wgc7kb.execute-api.ap-south-1.amazonaws.com/test`,{
            mail: this.state.mail,
            pass: this.state.pass,
            phno: this.state.phno,
            addr: this.state.addr,
            gen: this.state.gen,
          })
        .then(res => {
          //console.log(res.data["result"]);
          if(res.data["result"]=="signed up"){
              alert("signed up check mail to verify account");
          }
        })
        
        e.preventDefault();
    }

    //show and hide popup variants
    showlg(){this.setState({show:'login'});}
    showsgp(){this.setState({show:'signup'});}
    hidebox(){this.setState({show:'false'});}
    //change textbox values
    c_mail(e){this.setState({ mail: e.currentTarget.value});}
    c_pass(e){this.setState({ pass: e.currentTarget.value});}
    c_pass2(e){this.setState({ pass2: e.currentTarget.value});}
    c_phone(e){this.setState({ phno: e.currentTarget.value});}
    c_addr(e){this.setState({addr:e.currentTarget.value});}
    c_gen(e){this.setState({gen:e.currentTarget.value});}
    render(){
        return(
        <div className="main-page container-fluid">
            surya<br/> 
           {(this.state.show!=='false')?
            <div id="myModal" className="modal" onClick={console.log("clicked mod")}>
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
                            <row>
                                <img src={gl} className="icons" alt="google"/>
                                <img src={fb} className="icons" alt="facebook"/>
                            </row>
                            <input value={this.state.mail} onChange={this.c_mail} className="mail inputbox" placeholder="Email" />
                                <div/>
                            <input value={this.state.pass} onChange={this.c_pass} type="password" className="pass inputbox" placeholder="Password" />
                            <button className="submit" onClick={this.login}>Login</button>
                            </form>:
                    <form className='flex-container'>
                            <row>
                                <img src={gl} className="icons" alt="google"/>
                                <img src={fb} className="icons" alt="facebook"/>
                            </row>
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
                            <button className="submit" onClick={this.signup}>Signup</button>
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
