import React from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
class View_Appointment extends React.Component{
    constructor(props) {
        super(props);
        this.check_login();
        this.state = {
            date:this.props.location.state.date,
            time:this.props.location.state.time,//24hr format for api sending
            year:this.props.location.state.year,
            doc:this.props.location.state.doc,//doctor id
            docname:this.props.location.state.docname,//doctor name
            timed:this.props.location.state.timed,//display12 he format
            gen:"",
            desc:"",
            name:"",
            fname:"",
            lname:"",
            dob:"",
            mail:"",
            pass:"",
            load:true
        };
    }
    check_login(){
        const loggedin = localStorage.getItem("user");
        this.setState({mail:JSON.parse(loggedin)["mail"]});
        this.setState({pass:JSON.parse(loggedin)["pass"]});
        if (loggedin!=null) {
            this.setState({user:JSON.parse(loggedin)});
        }
        else{
            alert("please login first");
            this.props.history.push('/');
        }
    }
    getappt(){
        const info = {
            date:this.state.date,
            time:this.state.time,
            year:this.date.year,
            doc:this.state.doc,
            mail:this.state.doc,
            pass:this.state.pass
        };
        axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/getappt`,{info}).then(res => { 
            if(res.data["message"]!=="Internal server error"){
            doc[1]=res.data;/*
            this.setState({:res.data.});
            this.setState({:res.data.});
            this.setState({:res.data.});
            this.setState({:res.data.});
            this.setState({:res.data.});*/
            console.log(res.data);
            this.setState({load:false});
            }
        })
    }
    render(){
        return(
        <div className="viewappt">
        {this.state.load?<span className="spinner-border"></span>:
            <div>
                <div>date: {this.state.date+"-"+this.state.year}</div>
                <div>time: {this.state.timed}</div>
                <div>doctor:{this.state.docname}</div>
                <div>patient name{this.state.fname+" "+this.state.lname}</div>
                <div>gender{this.state.gen}</div>
                <div>patient d.o.b{this.state.dob}</div>
                <div>description{this.state.desc}</div>
            </div>
        }
        </div>
            
        )
    }
}

export default View_Appointment;