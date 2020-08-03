import React from 'react';
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
        console.log("mail : "+this.state.mail);
        e.preventDefault();
    }
    signup(e){
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
                                <img src={gl} className="icons"/>
                                <img src={fb} className="icons"/>
                            </row>
                            <input value={this.state.mail} onChange={this.c_mail} className="mail inputbox" placeholder="Email" />
                                <div/>
                            <input  type="password" className="pass inputbox" placeholder="Password" />
                            <button className="submit" onClick={this.login}>Login</button>
                            </form>:
                    <form className='flex-container'>
                            <row>
                                <img src={gl} className="icons"/>
                                <img src={fb} className="icons"/>
                            </row>
                            <input  className="mail inputbox" placeholder="Email" />
                                <div/>
                            <input  className="pass inputbox" type="password" placeholder="Password" />
                                <div/>
                            <input  className="pass2 inputbox" type="password" placeholder="Retype Password" />
                                <div/>
                            <input  className="phno inputbox" placeholder="Phone Number" />
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
