import React from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import styles from '../style/new_doc.module.scss';
var uname,pass;
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
    //value changing function
    c_fname(e){this.setState({ fname: e.currentTarget.value});
    this.setState({fnamefl:""})}
    c_lname(e){this.setState({ lname: e.currentTarget.value});
    this.setState({lnamefl:""})}
    c_desc(e){this.setState({ desc: e.currentTarget.value});
    this.setState({descfl:""})}
    c_gen(e){this.setState({gen:e.currentTarget.value});}
    //adding new doctor
    adddoc(){
        this.setState({load:true});
        const info = {
            first_name:this.state.fname,
            last_name:this.state.lname,
            gen:this.state.gen,
            desc:this.state.desc,
            umail: uname,
            upass: pass,
        };
        console.log(info);
            axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/newdoc`,info).then(res => {
                if(res.data["message"]!=="Internal server error"){
                        console.log("response: "+JSON.stringify(res.data));
                        if(res.data==="booked"){
                        alert("doctor added");
                        this.props.history.push("/admin/doc");
                        }
                    }
                else{
                    alert("something went wrong retry please");
                }
            }).catch(error => {
            this.stopld();
            });
        }
    stopld(){
        alert("please try again");
        this.setState({load:false});
    }
    
    render(){
        return(
        <div>
            <div className={cx(styles.header,styles.row)}>
              Patient form
            </div>
            <div className={styles.form}>
                <input value={this.state.fname} onChange={this.c_fname} className={styles.fname} placeholder="first name" />
                <div className={styles.invalidtxt}>{this.state.fnamefl}</div>
                <input value={this.state.lname} onChange={this.c_lname} className={styles.lname} placeholder="last name" />
                <div className={styles.invalidtxt}>{this.state.lnamefl}</div>
                <select className={styles.gen} value={this.state.gen} onChange={this.c_gen}>
                    <option value="female">female</option>
                    <option value="male">male</option>
                    <option value="other">other</option>
                </select>
                <input value={this.state.lname} onChange={this.c_lname} className={styles.dep} placeholder="department" />
                <div className={styles.invalidtxt}>{this.state.depfl}</div>
                <input value={this.state.desc} onChange={this.c_desc} className={styles.desc} placeholder="description" />
                <div className={styles.invalidtxt}>{this.state.descfl}</div>
                {this.state.load?
                <button className={cx(styles.submit,styles.patsub)} onClick={this.verify}>
                  <span className={cx(bs['spinner-border'],bs['spin-white'])}></span></button>:
                  <button className={cx(styles.submit,styles.patsub)} onClick={this.verify}>add</button>
                }
            </div>
        </div>)
    }
}