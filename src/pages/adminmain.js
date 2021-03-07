import React from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import Docsel from '../components/doc_select'
import Calendar from 'react-calendar';
import bs from '../style/bootstrap.min.module.css';
import cx from 'classnames';
import styles from '../style/adminmain.module.scss';
const timings=["9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];//server 24 hr format
var doclist=[];//doctor json list with name and id and possible mor in future
var doc=["loading . . .   ",""];
var date=new Date();//current/selected date throughout this file
var maxdate=new Date(date);
const time=["09:00 am","10:00 am","11:00 am","12:00 pm","01:00 pm","02:00 pm","03:00 pm","04:00 pm","05:00 pm","06:00 pm"];//12 hr format for displaying
const day=["sun","mon","tue","wed","thu","fri","sat"];
var data =  [
    ["01-02-2020"],
    ["mon"],
    [0,0,0,0,0,0,0,0,0,0,0,0],[" "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "," "," "],
];
maxdate.setDate(maxdate.getDate()+180);
var uname,pass;
class AdminMain extends React.Component{
    constructor(props) {
        super(props);

        this.check_login =this.check_login.bind(this);
        this.check_login();
        if(uname==="admin")
            this.get_doc();
        else
            this.get_date(date);
        this.state = {
            docselect:uname,
            holiday:"",
            modload:false,
            calen_load:true,
            dclist_load:true,//doc list loading flag
            confirm_box:false
        };
        this.logout=this.logout.bind(this);
        this.openappt=this.openappt.bind(this);
        this.reset_table=this.reset_table.bind(this);
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
      get_doc(e){
          this.reset_table();
        axios.get(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/getdoc`,{}).then(res => {
          if(res.data["message"]!=="Internal server error"){
              doclist=res.data;
              doc[0]=doclist[0]['n'];
              this.get_desc(doclist[0]['id']);
              this.setState({docselect:doclist[0]['id']});
              this.setState({docname:doclist[0]['n']});
              this.onChange(date);
              this.setState({dclist_load:false});
          }
        })
    }
      get_date(lpdate){
        //post values
        var month=lpdate.getMonth()+1
        var getdate=lpdate.getDate()+'-'+month;
        var dateyear=String(lpdate.getFullYear());
        var doc=uname;
        this.setState({holiday:""});
        if(uname==="admin")
            doc=this.state.docselect;
        var send={date:getdate,year:dateyear,doc:doc};
        axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/admin/view`,send).then(res => {   
            if(res.data["message"]!=="Internal server error"){
                console.log("admin gdateresponse: "+JSON.stringify(res.data));
                    //if day value is h- holiday lock all timings on that thing
                    if(JSON.stringify(res.data["day"])==='{"S":"h"}'){
                        console.log("admin gdateresponse: "+JSON.stringify(res.data["day"]));
                        this.setState({holiday:" (holiday)"});
                        for(var y=0;y<=9;y++)//10 time values
                            {data[2][y]=5;}
                    }else{//if not holiday or spl day parse timing slots
                        for(y in timings){
                            if(String(timings[y]) in res.data){
                                console.log(String(timings[y])+" oclock is "+ JSON.stringify(res.data[timings[y]]));
                                console.log("y value"+y);   
                                //[ a- available ] [t- taken] [ c- cancelled ] [ h- holiday/doc leave]
                                if(res.data[timings[y]]['S']==='a'){
                                    data[2][parseInt(y)]=0;
                                }else if(res.data[timings[y]]['S']==='t'){//taken(appointment fixed)
                                    data[2][parseInt(y)]=1;
                                    this.get_details(lpdate,y);
                                }else if(res.data[timings[y]]['S']==='u'){//doc unavailable
                                    data[2][parseInt(y)]=3;
                                }
                            }
                        }
                    }
                
        this.setState({calen_load:false});
            }
            })
    }
    onChange = (datec) => {
        this.reset_table();
        date=datec;
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
    get_details(e,i){
        console.log(e);
        var month=e.getMonth()+1
        var getdate=e.getDate()+'-'+month;
        var year=String(e.getFullYear());
        var det={
        date:getdate,
        time:timings[i],
        year:year,
        pass:pass,
        uname:uname,
        doc:this.state.docselect}
        console.log(det);
        axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/admin/details`,det).then(res => { 
            if(res.data!=="error"&&res.data!=="no app"){
            console.log(res.data);
            data[4][i]=res.data["first name"].S+" "+res.data["last name"].S;
            data[5][i]=res.data.gen.S;
            data[6][i]=res.data.dob.S;
            data[7][i]=res.data.desc.S;
            data[8][i]=res.data.mail.S;
            this.setState({desc_load:false});
            }
    })
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
            var cln,txt,con;// arrays of -  classname , display text , button disable flag
                switch(dat){
                    case 0:
                        cln="appt-a";//available
                        con="mark doctor unavailable ?";
                        txt=time[index];
                        break;
                    case 1:
                        cln="appt-b";
                        con="cancel appointment ?";
                        txt=time[index]+"\n fixed ";//already booked taken
                        break;
                    case 3:
                        cln="appt-u";//doc unavailable
                        con="mark doctor available ?";
                        txt="unavailable";
                        break;
                    case 5:
                        cln="appt-l";//locked
                        txt=time[index]+"\n --- ";//locked date as its not today or holiday
                        break;
                    default:
                        cln="appt-a";
                        txt=time[index-2];
                }
               return(<tbody>
                    <tr key={index} className={"row"+index}>
                        {uname==="admin"?
                        <td><button className={cln} disabled={dat===5?1:0} onClick={() => { if(uname==="admin"){if (window.confirm(con)){console.log("adminmod-"+dat);this.openappt(index)}} }} value={[index]}>{txt}</button></td>:
                        <td><button className={cln}  value={[index]}>{txt}</button></td>
                    }
                        <td className="textblk">{data[4][index]}</td>
                        <td className="textblk">{data[5][index]}</td>
                        <td className="textblk">{data[6][index]}</td>
                        <td className="textblk">{data[7][index]}</td>
                        <td className="textblk">{data[8][index]}</td>
                    </tr>
                    </tbody>)
           })
        
    }
    reset_table(){
        for(var i=0;i<=11;i++)
            data[2][i]=0;
        for(i=3;i<=8;i++)
        for(var j=0;j<=10;j++){
            data[i][j]=" ";
        }
    }

    openappt(bkval){
        console.log(bkval);
        if(this.state.calen_load===false){
            //params setting
            var month=date.getMonth()+1;
            var getdate=date.getDate()+'-'+month;
            var params={
                doc:this.state.docselect,
                uname:uname,
                upass:pass,
                mod:"",
                time:"",
                year:String(date.getFullYear()),
                date:getdate
            }
            if(bkval==="hol"){
                console.log("holiday curdate: "+ date);
                if(this.state.holiday==="")
                    params["mod"]="hol";
                else
                    params["mod"]="wor";
                this.adminmod(params)
            }
            else{
                switch(data[2][bkval]){
                    case 0:
                        params["mod"]="ua";
                        params["time"]=timings[bkval]
                        this.adminmod(params)
                        break;
                    case 1:
                        params["mod"]="can";
                        params["time"]=timings[bkval]
                        this.adminmod(params)
                        break;
                    case 3:
                        params["mod"]="a";
                        params["time"]=timings[bkval]
                        this.adminmod(params)
                        break;
                    default:
                        break;
                }
            }
        }
    }
    adminmod(params){
        this.setState({calen_load:true});
        console.log(params);
        axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/admin/mod`,params).then(res => {
            //console.log(res.data);
          if(res.data==="success"){
            this.onChange(date);
          }
        }).catch(error => {
            this.setState({calen_load:false});
            alert("please try again");
          });
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
            <div className={cx(styles.row,styles.main)}>
            <img className="img dp" src={"https://d23yysxhlq0p5m.cloudfront.net/dp/"+this.state.docselect+".jpg"}/>
            {
                uname==="admin"?this.state.dclist_load?
                    <span className={cx(bs.spinner-border,bs.spin-white)}></span>
                    :<Docsel className={bs['container-fluid']} parentCallback = {this.selectcallback} doc={doclist}/>
                :<div className={styles.uname}>{uname}</div>
            }
            </div>
            <div className={bs.flexbox}>
            <button onClick={
                this.props.history.push('/admin/doc')}>doctor management</button>
            <button className={cx(styles[logout-btna],bs.flexbox)} onClick={this.logout}>Logout</button>
                    <div className={styles.datepiktxt}>{data[0][0]}</div>
                    <button className={styles.datepikbtn} onClick={this.handleClickbook}>change date</button>
                    <div ref={nodebook => {this.nodebook = nodebook;}}>
                        {this.state.showModal && (
                            <Calendar className="modal-calendar" maxDate={maxdate} onChange={this.onChange} value={date} />
                        )}
                    </div>
            </div>
                <div className= {this.state.calen_load?"blur":null} >
                    <button className="t2" onClick={() => { if (window.confirm("toggle holiday"))this.openappt("hol") }}>
                        {day[date.getDay()]+this.state.holiday} </button>
                        <table className={cx(styles.table,styles.chart)}>
                                {this.renderTable()}
                        </table>
                </div>
        </div>)
    }
}

export default AdminMain;