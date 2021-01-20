import React from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import '../style/doc_edit.scss';
import '../style/react_calendar.scss';
class Doc_edit extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            load:false
        };
        axiosRetry(axios, { retries: 2 });
      }
      //login check
      check_login(){
        const loggedin = localStorage.getItem("admin");
        if (loggedin==null) {
            alert("please login first");
            this.props.history.push('/admin');
        }else{
            uname=JSON.parse(loggedin)["uname"];
            pass=JSON.parse(loggedin)["pass"];}
      }
   
    render(){
        return(
        <div>
            <div className="header row">
              doctor management
            </div>
        </div>)
    }
}

export default Doc_edit;