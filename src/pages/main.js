import React from 'react';
import history from '../components/history';

class Main extends React.Component{
    //check if logged in
    loginchk(event){ 
          history.push("/book");
          //this.props.history.push('/book');
          //alert("success");
         event.preventDefault();
    }
    render(){
        return(
        <div className="ord-page">
            surya<br/>  
            <button className="button"  onClick={this.loginchk}>
                Book Appointment
            </button>
        </div>
        )
    }
}
export default Main;
