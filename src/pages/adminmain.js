import React from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import Docsel from '../components/doc_select'
import Calendar from 'react-calendar';
import '../style/adminmain.css';
const timings=["9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];//server 24 hr format
var doclist=[];//doctor json list with name and id and possible mor in future
var doc=["loading . . .   ",""];
var date=new Date();//current/selected date throughout this file
const today=new Date(date);
var maxdate=new Date(date);
const time=["09:00 am","10:00 am","11:00 am","12:00 pm","01:00 pm","02:00 pm","03:00 pm","04:00 pm","05:00 pm","06:00 pm"];//12 hr format for displaying
const day=["sun","mon","tue","wed","thu","fri","sat"];
var data =  [
    ["01-02-2020"],
    ["mon"],
    [0,0,0,0,0,0,0,0,0,0,0,0],];
maxdate.setDate(maxdate.getDate()+180);
var uname,pass;
class AdminMain extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            calen_load:false
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
        }else{
            uname=JSON.parse(loggedin)["uname"];
            pass=JSON.parse(loggedin)["pass"];}
      }
    
      get_date(lpdate){
            console.log("lp "+lpdate);
        //post values
        var month=lpdate.getMonth()+1
        var getdate=lpdate.getDate()+'-'+month;
        var dateyear=String(lpdate.getFullYear());
        var doc=uname;
        var send={date:getdate,year:dateyear,doc:doc};
        console.log(send);
            axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/admin/view`,{date:getdate,year:dateyear,doc:doc}).then(res => {   
                if(res.data["message"]!=="Internal server error"){
                    console.log("admin gdateresponse: "+JSON.stringify(res.data));
                    for(var x in res.data) {
                        var slot=res.data[x];
                        console.log("res body "+slot);
                        //if day value is h- holiday lock all timings on that thing
                        if(slot["day"]==="h"){
                            for(var y=2;y<=11;y++)//10 time values
                                {data[2][y]=5;}
                        }else{//if not holiday or spl day parse timing slots
                            for(y in timings){
                                if(String(timings[y]) in slot){
                                    console.log(String(timings[y])+" oclock is "+ slot[timings[y]]);
                                    console.log("y value"+y);   
                                    //[ a- available ] [t- taken] [ c- cancelled ] [ h- holiday/doc leave]
                                    if(slot[timings[y]]==='a'){
                                        data[2][parseInt(y)+2]=0;
                                    }else if(slot[timings[y]]==='t'){//taken(appointment fixed)
                                        data[2][parseInt(y)+2]=1;
                                    }else if(slot[timings[y]]==='u'){//doc unavailable
                                        data[2][parseInt(y)+2]=3;
                                    }
                                }
                            }
                        }
                    }
            this.setState({calen_load:false});
                }
                })
    }
    onChange = (datec) => {
        console.log("date picker : "+datec);
        this.setState({calen_load:true});
       //resetting table
       for(var jks=0;jks<=12;jks++)
            data[2][jks]=0;
        //setting date and day
        data[0][0]=datec.getDate()+'-'+(datec.getMonth()+1)+'-'+datec.getFullYear();//first row date
        console.log("datec gdate: "+datec);
        data[1][0]=day[datec.getDay()];//second row day
        //get timings per day
        this.get_date(datec);//rest of all vertical time per day getting and parsing on data matrix
        this.setState({showModal:false})
      }
    logout(){
        this.setState({admin:{}});
        localStorage.clear();
        this.props.history.push('/admin');
      }
    get_desc(e){
        axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/getdoc`,{id:e}).then(res => { 
            if(res.data["message"]!=="Internal server error"){
            doc[1]=res.data;
            this.setState({desc_load:false});
            }
    })}
    selectcallback = (childData) => {
        this.setState({desc_load:true});
        this.setState({docselect:doclist[parseInt(childData)]['id']},()=>{
            this.onChange(date);
            this.setState({calen_load:true});});
        this.setState({docname:doclist[childData]})

        this.setState({docname:doclist[parseInt(childData)]['n']});
        doc[0]=doclist[parseInt(childData)]['n'];
        this.get_desc(doclist[childData]['id']);
    }
    renderTable() {
        return data[2].map((dat,index)=>{
            var cln,txt,dis;// arrays of -  classname , display text , button disable flag
                switch(dat){
                    case 0:
                        cln="appt-a";//available
                        txt=time[index];
                        dis=0;
                        break;
                    case 1:
                        cln="appt-t";
                        txt=time[index]+"\n taken ";//already booked taken
                        dis=1;
                        break;
                    case 2:
                        cln="appt-c";
                        txt=time[index]+"\n appointment cancelled ";// ur booked appointment cancelled
                        dis=1;
                        break;
                    case 3:
                        cln="appt-u";//doc unavailable
                        txt="unavailable";
                        dis=1;
                        break;
                    case 4:
                        cln="appt-b";//booked
                        txt=time[index]+"\n your appointment ";//your upcomming appointment
                        dis=0;
                        break;
                    case 5:
                        cln="appt-l";//locked
                        txt=time[index]+"\n --- ";//locked date as its not today or holiday
                        dis=0;
                        break;
                    default:
                        cln="appt-a";
                        txt=time[index-2];
                        dis=1;
                }
               return(<tr>
                    <td><button disabled={dis} className={cln} onClick={this.openappt} value={index}>{txt}</button></td>
                </tr>)
           })
        
    }
    openappt(e){
        console.log(e.currentTarget.value);
    }
    handleClickbook = () => {
        if (!this.state.showModal) {
          document.addEventListener("click", this.handleOutsideClickbook, false);
        } else {
          document.removeEventListener("click", this.handleOutsideClickbook, false);
        }
    
        this.setState(prevState => ({
          showModal: !prevState.showModal
        }));
      };
    
      handleOutsideClickbook = e => {
        if (!this.nodebook.contains(e.target)) this.handleClickbook();
      };
    render(){
        return(
        <div>
            {this.state.dclist_load?
                <span className="spinner-border spin-white"></span>
                :<Docsel className="container-fluid" parentCallback = {this.selectcallback} doc={doclist}/>
            }
            <div className="row">
                <div className="dp"></div>
                <div className="doc">{doc[0]}</div>
                <button className="logout-btn" onClick={this.logout}>Logout</button>
            </div>
            {
                this.state.desc_load? <span className="spinner-border spin-white"></span>:
                    <div className="description">{doc[1]}</div>
            }
            <div className="flexbox">
                    <div className="datepiktxt">{data[0][3]}</div>
                    <button className="datepikbtn" onClick={this.handleClickbook}>change date</button>
                    <div ref={nodebook => {this.nodebook = nodebook;}}>
                        {this.state.showModal && (
                            <Calendar className="modal-calendar" minDate={today} maxDate={maxdate} onChange={this.onChange} value={date} />
                        )}
                    </div>
            </div>
                <div className= {this.state.calen_load?"blur":null}>
                        <table className="table">
                            <tbody>
                                {this.renderTable()}
                            </tbody>
                        </table>
                </div>
        </div>)
    }
}

export default AdminMain;