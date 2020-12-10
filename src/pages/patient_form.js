import React from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import '../style/patform.css';
var dob=new Date();//date of birth
class Patient_Form extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            fname:"",
            lname:"",
            dob:"",
            gen:"",
            desc:"",
            showModal: false,
            
        };
        this.c_fname = this.c_fname.bind(this);
        this.c_lname = this.c_lname.bind(this);
        this.c_desc = this.c_desc.bind(this);
        this.c_dob = this.c_dob.bind(this);
        this.c_dob(dob);
      }
    //value changing function
    c_fname(e){this.setState({ fname: e.currentTarget.value});}
    c_lname(e){this.setState({ lname: e.currentTarget.value});}
    c_desc(e){this.setState({ desc: e.currentTarget.value});}
    c_dob(e){
      var dtxt=e.getDate()+'-'+(e.getMonth()+1)+'-'+e.getFullYear();
      dob=e;
      this.setState({dob:dtxt});
      console.log("date: "+dtxt);
    }
    
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
  
    handleOutsideClick = e => {
      if (!this.node.contains(e.target)) this.handleClick();
    };
    //from verification
    verify(){
        var valid=true;
        if(this.state.fname===""){valid=false}
        if(this.state.lname===""){valid=false}
        if(this.state.desc===""){valid=false}
        if(valid===true){this.send_form()}
        else{alert("invalid form")};

    }

    //send form
    send_form(){

        axios.get(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/book`,{}).then(res => {

        })
    }

    render(){
        return(
        <div>
            <div className="header">
                Patient form
            </div>
            <div className="form">
                <input value={this.state.fname} onChange={this.c_fname} className="fname" placeholder="first name" />
                <input value={this.state.lname} onChange={this.c_lname} className="lname" placeholder="last name" />
                <div>{this.state.dob}</div>
                  <div className="row">
                    <div ref={node => {this.node = node;}}>
                    <button className="datepikbtn" onClick={this.handleClick}>change date</button>
                  </div>
                {this.state.showModal && (
                    <Calendar className="modal-calendar" onChange={this.c_dob} value={dob} />
                )}</div>
                <select className="gen">
                    <option value="female">female</option>
                    <option value="male">male</option>
                    <option value="other">other</option>
                </select>
                <input value={this.state.desc} onChange={this.c_desc} className="desc" placeholder="description" />
                <button className="submit" onClick={this.verify}>submit</button>
            </div>
        </div>)
    }
}

export default Patient_Form;