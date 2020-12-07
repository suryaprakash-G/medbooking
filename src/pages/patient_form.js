import React from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
class Patient_Form extends React.Component{
    render(){
        return(
        <div className="patform">
        <input value={this.state.fname} className="fname" placeholder="first name" />
        <input value={this.state.lname} className="lname" placeholder="last name" />
        <row>
            <a>{this.state.dob}</a>
            <i class='far fa-calendar-alt' style='font-size:36px'></i>
        </row>
        <select name="gender" id="gen">
            <option value="female">female</option>
            <option value="male">male</option>
            <option value="other">other</option>
        </select>
        <input value={this.state.desc} className="desc" placeholder="description" />
        <button></button>
        </div>)
    }
}

export default Patient_Form;