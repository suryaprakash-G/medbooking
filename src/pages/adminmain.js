import React from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import Calendar from 'react-calendar';
import '../style/adminlogin.css';
class AdminMain extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            load:false
        };
        this.check_login =this.check_login.bind(this);
        this.check_login();
        axiosRetry(axios, { retries: 3 });
      }
      //login check
      check_login(){
        const loggedin = localStorage.getItem("admin");
        if (loggedin==null) {
            alert("please login first");
            this.props.history.push('/admin');
        }
      }

    render(){
        return(
        <div>
            <div>
            <Calendar/>
            <div className="chart"></div>
            </div>
        </div>)
    }
}

export default AdminMain;