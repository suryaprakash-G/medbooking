import React from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import styles from '../style/patform.module.scss';
import bs from '../style/bootstrap.min.module.css';
import SimpleReactCalendar from 'simple-react-calendar'
import cx from 'classnames';
var dob=new Date();//date of birth
const date=new Date();//current date
var timings=["9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];//server 24 hr format
const time=["09:00 am","10:00 am","11:00 am","12:00 pm","01:00 pm","02:00 pm","03:00 pm","04:00 pm","05:00 pm","06:00 pm"];//12 hr format for displaying
class Patient_Form extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            fname:"",
            lname:"",
            dob:"dd-mm-yy",
            gen:'Female',
            desc:"",
            fnamefl:"",
            lnamefl:"",
            dobfl:"",
            descfl:"",
            showModal: false,
            bookdate:this.props.location.state.bookdate,
            booktime:this.props.location.state.booktime,
            load:false
        };
        axiosRetry(axios, { retries: 2 });
        this.check_login =this.check_login.bind(this);
        this.check_login();
        this.stopld=this.stopld.bind(this);
        this.send_form= this.send_form.bind(this);
        this.c_fname = this.c_fname.bind(this);
        this.c_lname = this.c_lname.bind(this);
        this.c_desc = this.c_desc.bind(this);
        this.c_dob = this.c_dob.bind(this);
        this.c_gen= this.c_gen.bind(this);
        this.verify=this.verify.bind(this);
      }
      //login check
      check_login(){
        const loggedin = localStorage.getItem("user");
        if (loggedin==null) {
            alert("please login first");
            this.props.history.push('/');
        }
      }
    //value changing function
    c_fname(e){this.setState({ fname: e.currentTarget.value});
      this.setState({fnamefl:""})}
    c_lname(e){this.setState({ lname: e.currentTarget.value});
      this.setState({lnamefl:""})}
    c_desc(e){this.setState({ desc: e.currentTarget.value});
      this.setState({descfl:""})}
    c_dob(e){
      var dtxt=e.getDate()+'-'+(e.getMonth()+1)+'-'+e.getFullYear();
      dob=e;
      this.setState({dob:dtxt});
      this.setState({dobfl:""});
      this.setState({showModal:false});
    }
    c_gen(e){this.setState({gen:e.currentTarget.value});}
    //calander show on click
    handleClick = () => {
      if (!this.state.showModal) {
        document.addEventListener("click", this.handleOutsideClick, false);
      } else {
        document.removeEventListener("click", this.handleOutsideClick, false);
      }
  
      this.setState(prevState => ({
        showModal: !prevState.showModal
      }));
    };
    //from verification
    verify(){
        var valid=true;
        if(this.state.fname===""){valid=false;
          this.setState({fnamefl:"please enter first name"})}
        if(this.state.lname===""){valid=false;
          this.setState({lnamefl:"please enter last name"})}
        if(this.state.desc===""){valid=false;
          this.setState({descfl:"description required"})}
        if(this.state.dob==="dd-mm-yy"){valid=false;
          this.setState({dobfl:"please select date of birth"})}
        if(valid===true){this.send_form()}
    }

    //send form
    send_form(){
      this.setState({load:true});
      const loggedin = localStorage.getItem("user");
      const info = {
        btime:timings[this.props.location.state.booktime],
        day:this.state.bookdate.getDate(),
        month:this.state.bookdate.getMonth()+1,
        year:this.state.bookdate.getFullYear(),
        doc:this.props.location.state.doc,
        first_name:this.state.fname,
        last_name:this.state.lname,
        dob:this.state.dob,
        gen:this.state.gen,
        desc:this.state.desc,
        umail: JSON.parse(loggedin)["mail"],
        upass: JSON.parse(loggedin)["pass"],
      };
        axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/book`,info).then(res => {
           if(res.data["message"]!=="Internal server error"){
                    if(res.data==="booked"){
                      alert("appointment booked");
                      this.props.history.push("/book");
                    }
                  }
              else{
                alert("something went wrong retry please");
              }
        }).catch(error => {
          this.stopld();
        });
    }
    //stop loading and alert
    stopld(){
      alert("please try again");
      this.setState({load:false});
  }
    render(){
        return(
        <div>
            <div className={cx(styles.header,bs.row)}>
              Patient form
            </div>
            <div className={styles.bookfor}>{"booking for "+this.state.bookdate.getDate()+'-'+(this.state.bookdate.getMonth()+1)+'-'+this.state.bookdate.getFullYear()
              +"   ("+time[parseInt(this.state.booktime)]+") for doctor "+this.props.location.state.docname}</div>
            <div className={styles.form}>
                <input value={this.state.fname} onChange={this.c_fname} className={styles.fname} placeholder="first name" />
                <div className={styles.invalidtxt}>{this.state.fnamefl}</div>
                <input value={this.state.lname} onChange={this.c_lname} className={styles.lname} placeholder="last name" />
                <div className={styles.invalidtxt}>{this.state.lnamefl}</div>
                  <div className={styles.row}>
                    <div className={styles.datepiktxt}>{this.state.dob}</div>
                    <button className={styles.datepikbtn} onClick={this.handleClick}>change D.O.B</button>
                    <div ref={node => {this.node = node;}}>
                      {this.state.showModal && (
                          <Calendar
                            className={styles.cal}
                            value={dob}
                            maxDate={date}
                            onChange={this.c_dob}/>

                      )}</div>
                      
                      <div className={styles.hint}>(hint : click calendar title twice to change year)</div>
                </div>
                <div className={styles.invalidtxt}>{this.state.dobfl}</div>
                <select className={styles.gen} value={this.state.gen} onChange={this.c_gen}>
                    <option value="female">female</option>
                    <option value="male">male</option>
                    <option value="other">other</option>
                </select>
                <input value={this.state.desc} onChange={this.c_desc} className={styles.desc} placeholder="description" />
                <div className={styles.invalidtxt}>{this.state.descfl}</div>
                {this.state.load?
                <button className={cx(styles.submit,styles.patsub)} onClick={this.verify}>
                  <span className={cx(bs["spinner-border"],bs["spin-white"])}></span></button>:
                  <button className={cx(styles.submit,styles.patsub)} onClick={this.verify}>submit</button>
                }
            </div>
        </div>)
    }
}

export default Patient_Form;