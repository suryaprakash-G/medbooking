import React from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import '../style/new_doc.scss';
class New_doc extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            id:"",
            fname:"",
            lname:"",
            pass:"",
            dep:"",
            desc:"",
            load:true
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
              Patient form
            </div>
            <div className="form">
                <input value={this.state.fname} onChange={this.c_fname} className="fname" placeholder="first name" />
                <div className="invalidtxt">{this.state.fnamefl}</div>
                <input value={this.state.lname} onChange={this.c_lname} className="lname" placeholder="last name" />
                <div className="invalidtxt">{this.state.lnamefl}</div>
                <select className="gen" value={this.state.gen} onChange={this.c_gen}>
                    <option value="female">female</option>
                    <option value="male">male</option>
                    <option value="other">other</option>
                </select>
                <input value={this.state.lname} onChange={this.c_lname} className="dep" placeholder="department" />
                <div className="invalidtxt">{this.state.depfl}</div>
                <input value={this.state.desc} onChange={this.c_desc} className="desc" placeholder="description" />
                <div className="invalidtxt">{this.state.descfl}</div>
                {this.state.load?
                <button className="submit patsub" onClick={this.verify}>
                  <span className="spinner-border spin-white"></span></button>:
                  <button className="submit patsub" onClick={this.verify}>add</button>
                }
            </div>
        </div>)
    }
}