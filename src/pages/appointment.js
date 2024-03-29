import React from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from '../style/appointment.module.scss';
import SimpleReactCalendar from 'simple-react-calendar'
import bs from '../style/bootstrap.min.module.css';
import cx from 'classnames';
import Back from '../components/back_btn'
import Docsel from '../components/doc_select'
  const time=["09:00 am","10:00 am","11:00 am","12:00 pm","01:00 pm","02:00 pm","03:00 pm","04:00 pm","05:00 pm","06:00 pm"];//12 hr format for displaying
  const day=["sun","mon","tue","wed","thu","fri","sat"];
  var data =  [
    ["01-02-2020","02-02-2020","03-02-2020","04-02-2020","05-02-2020","06-02-2020","07-02-2020"],
    ["mon","tue","wed","thu","fri","sat","sun"],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]
  ];
  var mail="";
  const timings=["9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];//server 24 hr format
  var doclist=[];//doctor json list with name and id and possible mor in future
  var date=new Date();//current/selected date throughout this file
  const today=new Date(date);
  var maxdate=new Date(date)
  maxdate.setDate(maxdate.getDate()+180);
  date.setHours(0,0,0,0);
  var gdatechk=[0,0,0,0,0,0,0];//get date all 7 date return check list
  var doc=["loading . . .   ",""];
  class Appointment extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          docselect:0,
          docname:" ",//doctor name
          curdate:today,//system date
          showModal: false,//datepicker toggle
          desc_load:true,//description loading flag
          dclist_load:true,//doc list loading flag
          calen_load:true//appointment calendar loading flag
        };
        this.check_login =this.check_login.bind(this);
        this.check_login();
        this.get_doc = this.get_doc.bind(this);
        this.get_desc = this.get_desc.bind(this);
        this.get_date = this.get_date.bind(this);
        this.logout=this.logout.bind(this);
        this.bookapt=this.bookapt.bind(this)
        this.onChange = this.onChange.bind(this);
        this.getdatechk = this.getdatechk.bind(this);
        axiosRetry(axios, { retries: 3 });
        this.selectcallback= this.selectcallback.bind(this);
      }
      componentDidMount() {
        this.get_doc();
    }
    check_login(){
        const loggedin = localStorage.getItem("user");
        if (loggedin!=null) {
            mail=JSON.parse(loggedin)["mail"];
            this.setState({user:JSON.parse(loggedin)});
        }
        else{
            alert("please login first");
            this.props.history.push('/');
        }
    }
    logout(){
        this.setState({user:{}});
        localStorage.clear();
        this.props.history.push('/');
      }
    get_desc(e){
        axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/getdoc`,{id:e}).then(res => { 
            if(res.data["message"]!=="Internal server error"){
            doc[1]=res.data;
            this.setState({desc_load:false});
            }
    })
    }
    //get vertical timimngs per day and put on the matrix in a given column in data matrix
    get_date(lpdate,i){
        if(lpdate<today){
            for(var y=2;y<=11;y++)//10 time values
                {data[y][i]=5;}
            gdatechk[i]=1;
            this.getdatechk()
            }
        else{
            //make unbookable for today
            if(lpdate.toDateString()===(today).toDateString()){
                for(y=2;y<=11;y++)//10 time values
                    {data[y][i]=5;}
                gdatechk[i]=1;
                } 
        //post values
        var month=lpdate.getMonth()+1
        var getdate=lpdate.getDate()+'-'+month;
        var dateyear=String(lpdate.getFullYear());
        var doc=this.state.docselect;
            axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/getdate`,{date:getdate,year:dateyear,doc:doc,mail:mail}).then(res => {   
                if(res.data["message"]!=="Internal server error"){
                    for(var x in res.data) {
                        var slot=res.data[x];
                        //if day value is h- holiday lock all timings on that thing
                        if(slot["day"]==="h"){
                            for(var y=2;y<=11;y++)//10 time values
                                {data[y][i]=5;}
                                gdatechk[i]=1;
                        }else{//if not holiday or spl day parse timing slots
                            for(y in timings){
                                if(String(timings[y]) in slot){
                                    //[ a- available ]  [ b- booked ]   [ c- cancelled ] [ h- holiday/doc leave]
                                    if(slot[timings[y]]==='a'){
                                        data[parseInt(y)+2][i]=0;
                                    }else if(slot[timings[y]]==='t'){//taken
                                        data[parseInt(y)+2][i]=1;
                                    }else if(slot[timings[y]]==='c'){//cancelled
                                        data[parseInt(y)+2][i]=2;
                                    }else if(slot[timings[y]]==='u'){//doc unavailable
                                        data[parseInt(y)+2][i]=3;
                                    }else if(slot[timings[y]]==='b'){//my booked
                                        data[parseInt(y)+2][i]=4;
                                    }
                                }
                            }
                        }
                    }
                    gdatechk[i]=1;
                    this.getdatechk()
                }
                })
            }
    }
    getdatechk(){
        var allchk=true;
        for(var i=0;i<=6;i++){
            if(gdatechk[i]!==1){
                allchk=false;
                break;
            }
        }
        if(allchk===true){
            this.setState({calen_load:false});
            for(i=0;i<=6;i++){gdatechk[i]=0;}}
    }
    get_doc(e){
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
        return data.map((dat, index) => {
            var td="ta";
            var ret;
            if(index=== 0){td="t1";//date row
            ret=<tr key={index} className={td}>
                    <td>{dat[0]}</td>
                    <td>{dat[1]}</td>
                    <td>{dat[2]}</td>
                    <td>{dat[3]}</td>
                    <td>{dat[4]}</td>
                    <td>{dat[5]}</td>
                    <td>{dat[6]}</td>
                </tr>;
            }
            else if(index===1){td="t2";//day row
            ret=<tr key={index} className={td}>
                    <td>{dat[0]}</td>
                    <td>{dat[1]}</td>
                    <td>{dat[2]}</td>
                    <td>{dat[3]}</td>
                    <td>{dat[4]}</td>
                    <td>{dat[5]}</td>
                    <td>{dat[6]}</td>
                </tr>;
            }
            else if(index>1){//rest of time slot in table
                var cln=[],txt=[],dis=[];// arrays of -  classname , display text , button disable flag
                for(var i=0;i<=6;i++){
                    switch(dat[i]){
                        case 0:
                            cln.push("appt-a");//available
                            txt.push(time[index-2]);
                            dis.push(0);
                            break;
                        case 1:
                            cln.push("appt-t");
                            txt.push(time[index-2]+"\n taken ");//already booked taken
                            dis.push(1);
                            break;
                        case 2:
                            cln.push("appt-c");
                            txt.push(time[index-2]+"\n appointment cancelled ");// ur booked appointment cancelled
                            dis.push(1);
                            break;
                        case 3:
                            cln.push("appt-u");//doc unavailable
                            txt.push("unavailable");
                            dis.push(1);
                            break;
                        case 4:
                            cln.push("appt-b");//booked
                            txt.push(time[index-2]+"\n your appointment ");//your upcomming appointment
                            dis.push(0);
                            break;
                        case 5:
                            cln.push("appt-l");//locked
                            txt.push(time[index-2]+"\n --- ");//locked date as its not today or holiday
                            dis.push(0);
                            break;
                        default:
                            cln.push("appt-a");
                            txt.push(time[index-2]);
                            dis.push(1);
                    }
                }
                ret=<tr key={index} className={td}>
                        <td><button disabled={dis[0]} className={styles[cln[0]]} onClick={this.bookapt} value={[index-2,0]}>{txt[0]}</button></td>
                        <td><button disabled={dis[1]} className={styles[cln[1]]} onClick={this.bookapt} value={[index-2,1]}>{txt[1]}</button></td>
                        <td><button disabled={dis[2]} className={styles[cln[2]]} onClick={this.bookapt} value={[index-2,2]}>{txt[2]}</button></td>
                        <td><button disabled={dis[3]} className={styles[cln[3]]} onClick={this.bookapt} value={[index-2,3]}>{txt[3]}</button></td>
                        <td><button disabled={dis[4]} className={styles[cln[4]]} onClick={this.bookapt} value={[index-2,4]}>{txt[4]}</button></td>
                        <td><button disabled={dis[5]} className={styles[cln[5]]} onClick={this.bookapt} value={[index-2,5]}>{txt[5]}</button></td>
                        <td><button disabled={dis[6]} className={styles[cln[6]]} onClick={this.bookapt} value={[index-2,6]}>{txt[6]}</button></td>
                    </tr>;
                   
            }
           return ret
        })
     }
     //book or check booked appointment
     bookapt(e){//params =  [0 -time slot index value ,  2 -day index (sratr week day is 0) ]
        if(this.state.calen_load===false){
            var bkval=e.currentTarget.value;
            var bookdate=new Date(this.state.curdate);
            bookdate.setDate(bookdate.getDate()-(3));
            bookdate.setDate(bookdate.getDate()+parseInt(bkval[2]));
            switch(data[parseInt(bkval[0])+2][parseInt(bkval[2])]){
                case 0:
                    //new booking function
                    this.props.history.push({pathname:'/form',
                    state: {bookdate:bookdate,
                        booktime:bkval[0],
                        doc:this.state.docselect,
                        docname:this.state.docname}});
                    break;
                case 4:
                    //already booked details 
                    this.props.history.push({pathname:'/appointment',
                    state: {
                        bookdate:bookdate.getDate()+"-"+(bookdate.getMonth()+1),
                        booktime:time[bkval[0]],
                        year:bookdate.getFullYear(),
                        doc:this.state.docselect,
                        docname:this.state.docname,
                        timed:timings[bkval[0]],

                    }});
                    break;
                default:
                    break;
            }
        }
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
//date picker clicked calendar dates change function
    onChange = (dateco) => {
        this.setState({calen_load:true});
       //resetting table
       for(var iks=0;iks<=11;iks++)
       for(var jks=0;jks<=6;jks++)
        data[iks][jks]=0;
        //setting week firstday
        var datec=new Date(dateco);
       datec.setDate(datec.getDate()-3);
       var lpdate=new Date(datec);
       lpdate.setHours(0,0,0,0);
        //vertical date fetching and parsing on data variable matrix
       for(var i=0;i<=6;i++){
           data[0][i]=lpdate.getDate()+'-'+(lpdate.getMonth()+1)+'-'+lpdate.getFullYear();//first row date
           data[1][i]=day[lpdate.getDay()];//second row day
           //get timings per day
            this.get_date(lpdate,i);//rest of all vertical time per day getting and parsing on data matrix
            //loop adding date
           lpdate.setDate(lpdate.getDate()+1);
        }
        this.setState({showModal:false})
      }
      
    render(){
        return(
        <div className={cx(bs.row,styles.appointment)}>
            <div className={cx(styles.sidepan,bs['col-lg-3'])}>
                <div>
                    <Back/>
                    {this.state.dclist_load?
                        <span className={cx(bs['spinner-border'],bs['spin-white'])}></span>
                        :<div className={styles.label}>
                            select doctor:<Docsel className={cx(bs['container-fluid'])} parentCallback = {this.selectcallback} doc={doclist}/></div>
                    }
                </div>
                <hr className={styles.solid}></hr>
                <div className={bs.row}>
                <img className={cx(bs.img,styles.dp)} src={"https://d23yysxhlq0p5m.cloudfront.net/dp/"+this.state.docselect+".jpg"}/>
                    <div className={styles.doc}>{doc[0]}</div>
                </div>{
                this.state.desc_load? <span className="spinner-border spin-white"></span>:
                    <div className={styles.description}>{doc[1]}</div>
                }
                <div className={bs['container-fluid']}></div>
                <button className={styles['logout-btn']} onClick={this.logout}>Logout</button>
                <div className={styles.mailid}>{mail}</div>
                
                
            </div>
            <div className={cx(styles.main,bs['col-lg-9'])}>
                <div className={styles.header}>
                Choose Appointment
                </div>
                <div className={bs.flexbox}>
                    <div className={styles.datepiktxt}>{data[0][3]}</div>
                    <input type="date" onChange={this.onChange} value={date} className={styles.datepiktxt}/>
                    <button className='datepikbtn' onClick={this.handleClickbook}>change date</button>
                    <div ref={nodebook => {this.nodebook = nodebook;}}>
                    {this.state.showModal && (
                        <Calendar className={styles['modal_calendar']} minDate={today} maxDate={maxdate} onChange={this.onChange} value={date} />
                        
                        //<SimpleReactCalendar onChange={this.onChange} activeMonth={date} />
                    )}
                </div>
                </div>
                
                <div className={styles.appointments}>
                        <div className= {this.state.calen_load?styles.blur:null}>
                        <table className={styles.table}>
                            <tbody>
                                {this.renderTable()}
                            </tbody>
                        </table>
                        </div>
                    </div>
            </div>
        </div>
        )
    }
}
export default Appointment;