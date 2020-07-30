import React from 'react';
//import ReactModal from 'react-modal';
import '../style/main.css';

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
        this.loginchk = this.loginchk.bind(this)
        this.showlg = this.showlg.bind(this)
        this.showsgp = this.showsgp.bind(this)
        this.hidebox = this.hidebox.bind(this)
      }
    //check if logged in
    loginchk(){ 
        //history.push('/book');
        //event.preventDefault();
        if(this.state.show==='false')
        {this.showlg()}
        else{this.hidebox();}
        console.log("s "+this.state.show);;
    }
    //show and hide popup variants
    showlg(){this.setState({show:'login'});}
    showsgp(){this.setState({show:'signup'});}
    hidebox(){this.setState({show:'false'});}
    //change textbox values
    c_mail(){}
    c_pass(){}
    c_pass2(){}
    c_phone(){}

    render(){
        return(
        <div className="main-page">
            surya<br/> 
           {(this.state.show!=='false')?
            <div id="myModal" className="modal">
                <div className="modal-content">
                    <span className="close" onClick={this.hidebox}>&times;</span>
                        
                    <row className="container">
                        <button  onClick={this.showlg} className="buttons">
                            <div className={(this.state.show=="login")?"selected container":""}>Login</div></button>
                        <button  onClick={this.showsgp} className="buttons">
                            <div className={(this.state.show=="signup")?"selected container":""}>Signup</div></button>
                    </row>
                    {(this.state.show==='login')?
                    <form className='flex-container'>
                            <input  className="mail inputbox" placeholder="Email" />
                                <div/>
                            <input  type="password" className="pass inputbox" placeholder="Password" />
                            <button className="submit">Login</button>
                            </form>:
                    <form className='flex-container'>
                            <input  className="mail inputbox" placeholder="Email" />
                                <div/>
                            <input  className="pass inputbox" type="password" placeholder="Password" />
                                <div/>
                            <input  className="pass2 inputbox" type="password" placeholder="Retype Password" />
                                <div/>
                            <input  className="phno inputbox" placeholder="Phone Number" />
                            <button className="submit">Signup</button>
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
