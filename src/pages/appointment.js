import React from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import '../style/appointment.css';
import '../style/react_calendar.css';
import Back from '../components/back_btn'
import Docsel from '../components/doc_select'
  var time=["09:00 am","10:00 am","11:00 am","12:00 pm","01:00 pm","02:00 pm","03:00 pm","04:00 pm","05:00 pm","06:00 pm"];//12 hr format for displaying
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
  var timings=["9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];//server 24 hr format
  var doclist=[];
  doclist=[{
    "n": " ",
    "id": " ",
    "des": " ",
    "dep": " "
}];
  var date=new Date();//current/selected date throughout this file
  //var datpop=false;
  var doc=[" ","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh."];
  class Appointment extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          docselect:0,
          docname:" ",
          showModal: false
        };
        this.get_doc = this.get_doc.bind(this);
        this.get_desc = this.get_desc.bind(this);
        this.get_date = this.get_date.bind(this);
        this.onChange = this.onChange.bind(this);
        this.selectcallback= this.selectcallback.bind(this);
        this.get_doc();
      }
    get_desc(e){
        axios.post(`https://u69ys2399d.execute-api.ap-south-1.amazonaws.com/test`,{id:e}).then(res => { 
            if(res.data["message"]!=="Internal server error"){
            doc[1]=res.data;
            this.setState({docselect:e});
            }
    })
    }
    get_date(lpdate,i){
        //post values
        var month=lpdate.getMonth()+1
        var getdate=lpdate.getDate()+'-'+month;
        var dateyear=String(lpdate.getFullYear());
        var doc=this.state.docselect;
        //console.log("------"+doc+" "+dateyear+" "+getdate);
            axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/getdate`,{date:getdate,year:dateyear,doc:doc}).then(res => {   
                if(res.data["message"]!=="Internal server error"){
                    console.log("response: "+i+"  "+JSON.stringify(res.data));
                    for(var x in res.data) {
                        var slot=res.data[x];
                        console.log("res body "+slot);
                        for(var y in timings){
                            if(String(timings[y]) in slot){
                                console.log(String(timings[y])+" oclock is "+ slot[timings[y]]);
                                console.log("y value"+y);   
                                //[ a- available ]  [ b- booked ]   [ c- cancelled ] [ h- holiday/doc leave]
                                if(slot[timings[y]]==='a'){
                                    data[parseInt(y)+2][i]=0;
                                    //console.log("data["+(parseInt(y)+2)+"]["+i+"]");
                                }else if(slot[timings[y]]==='b'){
                                    data[parseInt(y)+2][i]=1;
                                }else if(slot[timings[y]]==='c'){
                                    data[parseInt(y)+2][i]=2;
                                }else if(slot[timings[y]]==='h'){
                                    data[parseInt(y)+2][i]=3;
                                }
                            }
                        }

                    }
                    this.setState({loading:false});
                }
                })
    }
    get_doc(e){
        axios.get(`https://u69ys2399d.execute-api.ap-south-1.amazonaws.com/test`,{}).then(res => {
            //console.log(res.data);
          if(res.data["message"]!=="Internal server error"){
              doclist=res.data;
              doc[0]=doclist[0]['n'];
              this.get_desc(doclist[0]['id']);
              this.setState({docselect:doclist[0]['id']});
              this.setState({docname:doclist[0]['n']});
              this.onChange(date);
          }
        })
    }
    selectcallback = (childData) => {
        //console.log("childdata: "+childData);
        this.setState({docselect:parseInt(childData)});
        this.setState({docname:doclist[childData]})
        doc[0]=doclist[parseInt(childData)]['n'];
        //console.log("selected doctor: "this.get_doc();+doclist[childData]['id']);
        this.get_desc(doclist[childData]['id']);

    }
    slotcolor(ind){
        var ret="appt-c";
        switch(ind){
            case 0:
               ret="appt-a";
               break;
           case 1:
               ret="appt-b";
               break;
           case 2:
               ret="appt-c";
               break;
            default:
                ret="appt-a";
        }
        return ret;
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
                var cln=[],txt=[];
                for(var i=0;i<=6;i++){
                    switch(dat[i]){
                        case 0:
                            cln.push("appt-a");
                            txt.push(time[index-2]);
                            break;
                        case 1:
                            cln.push("appt-t");
                            txt.push(time[index-2]+"\n( taken )");
                            break;
                        case 2:
                            cln.push("appt-c");
                            txt.push(time[index-2]+"\n( cancelled )");
                            break;
                        case 3:
                            cln.push("appt-h");
                            txt.push("leave");
                            break;
                        case 3:
                            cln.push("appt-b");
                            txt.push(time[index-2]+"\n( your appt )");
                            break;
                        default:
                            cln.push("appt-a");
                            txt.push(time[index-2]);
                    }
                }
                ret=<tr key={index} className={td}>
                        <td><div className={cln[0]}>{txt[0]}</div></td>
                        <td><div className={cln[1]}>{txt[1]}</div></td>
                        <td><div className={cln[2]}>{txt[2]}</div></td>
                        <td><div className={cln[3]}>{txt[3]}</div></td>
                        <td><div className={cln[4]}>{txt[4]}</div></td>
                        <td><div className={cln[5]}>{txt[5]}</div></td>
                        <td><div className={cln[6]}>{txt[6]}</div></td>
                    </tr>;
                   
            }
           return ret
        })
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

    onChange = (date) => {
       //resetting table
       for(var iks=1;iks<=11;iks++)
       for(var jks=0;jks<=6;jks++)
        data[iks][jks]=0;
       var lpdate=new Date();
       lpdate=date;
       lpdate.setDate(date.getDate()-3);
        
       for(var i=0;i<=6;i++){
           data[0][i]=lpdate.getDate()+'-'+(lpdate.getMonth()+1)+'-'+lpdate.getFullYear();
           data[1][i]=day[lpdate.getDay()];
           //get timings per day
            this.get_date(lpdate,i);
            //loop adding date
           lpdate.setDate(lpdate.getDate()+1);
           //datpop=false;
        }
       this.setState({seldate:date});
      }
    
      
    render(){
        return(
        <div className="appointment row">
            <div className="sidepan col-lg-3">
                <div className="row">
                    <Back/>                  
                    <Docsel className="container-fluid" parentCallback = {this.selectcallback} doc={doclist}/>
                </div>
                <hr className="solid"></hr>
                <row className="row">
                    <div className="dp"></div>
                    <div className="doc">{doc[0]}</div>
                </row>
                <div className="description">{doc[1]}</div>
            </div>
            <div className="main col-lg-9">
                <div className="header">
                Appointment
                </div>
                <div className="flexbox">
                    <div className="datepiktxt">{data[0][3]}</div>
                    <button className="datepikbtn" onClick={this.handleClick}>change date</button>
                    <div ref={node => {this.node = node;}}>
                    {this.state.showModal && (
                        <Calendar className="modal" onChange={this.onChange} value={date} />
                    )}
                </div>
                </div>
                
                <div className="appointments">
                        <table className="table">
                            {this.renderTable()}
                        </table>
                    </div>
            </div>
        </div>
        )
    }
}
export default Appointment;