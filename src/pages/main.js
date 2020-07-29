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
    showlg(){this.setState({show:'login'});}
    showsgp(){this.setState({show:'signup'});}
    hidebox(){this.setState({show:'false'});}
    
    render(){
        return(
        <div className="main-page">
            surya<br/> 
           {(this.state.show!=='false')?
            <div id="myModal" className="modal">
                <div className="modal-content">
                    <span className="close" onClick={this.hidebox}>&times;</span>
                    <row>
                        <button  onClick={this.showlg}>login</button>
                        <button  onClick={this.showsgp}>signup</button>
                    </row>
                    {(this.state.show==='login')?
                    <form className='flex-container'>login
                        <label className="mail" >Email:</label>
                            <input value={this.state.mail} className="mail" />
                        <label className="pass" >Password:</label>
                            <input value={this.state.pass} type="password" className="pass" />
                    </form>:
                    <form className='flex-container'>signup
                        <label className="mail" >Email:</label>
                            <input value={this.state.mail} className="mail" />
                        <label className="pass" >Password:</label>
                            <input value={this.state.pass} type="password" className="pass" />
                        <label className="pass" >retype Password:</label>
                            <input value={this.state.pass2} type="password" className="pass" />
                        <label className="phno" >phone number:</label>
                            <input value={this.state.phno} className="phno" />
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
