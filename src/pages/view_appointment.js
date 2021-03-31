import React from 'react';
import axios from 'axios';
import styles from '../style/view_appointment.module.scss';
import cx from 'classnames';
import bs from '../style/bootstrap.min.module.css';
class View_Appointment extends React.Component{
    constructor(props) {
        super(props);
        this.check_login();
        this.state = {
            date:this.props.location.state.bookdate,
            time:this.props.location.state.booktime,//24hr format for api sending
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
            load:true
        };
        console.log("recerived: "+this.state.year);
    }

    componentDidMount() {
        this.getappt();
    }
    check_login(){
        const loggedin = localStorage.getItem("user");
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
        const loggedin = localStorage.getItem("user");
        
        axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/getappt`, {
            date:this.state.date,
            time:this.state.timed,
            year:String(this.state.year),
            doc:this.state.doc,
            mail:JSON.parse(loggedin)["mail"],
            pass:JSON.parse(loggedin)["pass"]
        }).then(res => {
            if(res.data["message"]!=="Internal server error"){
                if(res.data==="no app"){
                    alert("error on loading appointment");
                }
                else{
                    console.log(res.data);
                    this.setState({desc:res.data.desc.S});
                    this.setState({dob:res.data.dob.S});
                    this.setState({fname:res.data["first name"].S});
                    this.setState({lname:res.data["last name"].S});
                    this.setState({gen:res.data.gen.S});
                    console.log(res.data);
                    this.setState({load:false});
                }
            }
        }).catch(error => {
            alert("error loading appointment");
            this.props.history.push("/book");
          });
    }
    render(){
        return(
        <div className={styles.viewappt}>
        <div className={styles.header}>Appointment</div>
        {this.state.load?
            <div className={bs['spin-cont']}><span className={cx(bs['spinner-border'],bs['spin-pink'])}></span></div>:
            <div className="textbox">
                <div className={styles.x}>date: </div><div className={styles.y}>{this.state.date+"-"+this.state.year}</div>
                <div className={styles.x}>time: </div><div className={styles.y}>{this.state.timed}</div>
                <div className={styles.x}>doctor: </div><div className={styles.y}>{this.state.docname}</div>
                <div className={styles.x}>patient name: </div><div className={styles.y}>{this.state.fname+" "+this.state.lname}</div>
                <div className={styles.x}>gender: </div><div className={styles.y}>{this.state.gen}</div>
                <div className={styles.x}>patient d.o.b: </div><div className={styles.y}>{this.state.dob}</div>
                <div className={styles.x}>description: </div><div className={styles.y}>{this.state.desc}</div>
            </div>
        }
        </div>
            
        )
    }
}

export default View_Appointment;