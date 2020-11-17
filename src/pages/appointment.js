import React,{ useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import '../style/appointment.css';
import Back from '../components/back_btn'
import Docsel from '../components/doc_select'
  var time=["09:00 am","10:00 am","11:00 am","12:00 pm","01:00 pm","02:00 pm","03:00 pm","04:00 pm","05:00 pm","06:00 pm"];
  const day=["sun","mon","tue","wed","thu","fri","sat"];
  var data =  [
    ["01-02-2020","02-02-2020","03-02-2020","04-02-2020","05-02-2020","06-02-2020","07-02-2020"],
    ["mon","tue","wed","thu","fri","sat","sun"],
    [1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0],
    [1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0],
    [1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0],
    [1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0],
    [1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0]
  ];
  var doclist=Array();
  doclist=[{
    "n": " ",
    "id": " ",
    "des": " ",
    "dep": " "
}];
  var date=new Date;
  var datpop=false;
  var doc=[" ","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh."];
  class Appointment extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          pop: false,
          docselect:0,
          docname:" "
        };
        this.get_doc = this.get_doc.bind(this);
        this.get_desc = this.get_desc.bind(this);
        this.selectcallback= this.selectcallback.bind(this);

        this.get_doc();
      }
    get_desc(e){
        axios.post(`https://u69ys2399d.execute-api.ap-south-1.amazonaws.com/test`,{id:e}).then(res => { 
            if(res.data["message"]!="Internal server error"){
            doc[1]=res.data;
            this.setState({docselect:e});
            }
    })
    }
    get_date(lpdate){
        var ret={};
        //post values
        var month=lpdate.getMonth()+1
        var date=lpdate.getDate()+'-'+month;
        var dateyear=String(lpdate.getFullYear());
        var doc=this.state.docselect;
            axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/getdate`,{date:date,year:dateyear,doc:doc}).then(res => { 
                console.log(lpdate+"  "+res.data);    
                if(res.data["message"]!="Internal server error"){
                    ret=res.data;
                }
                })
        return ret;
    }
    get_doc(e){
        axios.get(`https://u69ys2399d.execute-api.ap-south-1.amazonaws.com/test`,{}).then(res => {
            console.log(res.data);
          if(res.data["message"]!="Internal server error"){
              doclist=res.data;
              doc[0]=doclist[0]['n'];
              this.get_desc(doclist[0]['id']);
              this.setState({docselect:doclist[0]['id']});
              this.setState({docname:doclist[0]['n']});
          }
        })
    }
    selectcallback = (childData) => {
        console.log("childdata: "+childData);
        this.setState({docselect:parseInt(childData)});
        this.setState({docname:doclist[childData]})
        doc[0]=doclist[parseInt(childData)]['n'];
        console.log("selected doctor: "+doclist[childData]['id']);
        this.get_desc(doclist[childData]['id']);

    }
    renderTable() {
        return data.map((dat, index) => {
            var td="ta";
            var ret;
            if(index==0){td="t1";//date row
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
            else if(index==1){td="t2";//day row
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
                
                ret=<tr key={index} className={td}>
                        <td className={dat[0]?"appt-a":"appt-b"}>{time[index-2]}</td>
                        <td className={dat[1]?"appt-a":"appt-b"}>{time[index-2]}</td>
                        <td className={dat[2]?"appt-a":"appt-b"}>{time[index-2]}</td>
                        <td className={dat[3]?"appt-a":"appt-b"}>{time[index-2]}</td>
                        <td className={dat[4]?"appt-a":"appt-b"}>{time[index-2]}</td>
                        <td className={dat[5]?"appt-a":"appt-b"}>{time[index-2]}</td>
                        <td className={dat[6]?"appt-a":"appt-b"}>{time[index-2]}</td>
                        
                    </tr>;
            }
           return ret
        })
     }
     togglePop = () => {
         this.setState({pop:datpop});
        datpop=!datpop;
       };

    onChange = (date) => {
       var lpdate=new Date;
       lpdate=date;
       lpdate.setDate(date.getDate()-3);
       
       for(var i=0;i<=6;i++){
           data[0][i]=lpdate.getDate()+'-'+(lpdate.getMonth()+1)+'-'+lpdate.getFullYear();
           data[1][i]=day[lpdate.getDay()];
           //get timings per day
            var slots=this.get_date(date);
            console.log("slots is "+JSON.stringify(slots));
            for (i in slots) {
            //if(slots)
            }

            console.log("loop "+lpdate);
           lpdate.setDate(lpdate.getDate()+1);
           
        }
       this.setState({seldate:date});
      };
      
    render(){
        return(
        <div className="appointment container-fluid row">
            <div className="sidepan col-3">
                <div className="row">
                    <Back/>                  
                    <Docsel parentCallback = {this.selectcallback} doc={doclist}/>
                </div>
                <hr className="solid"></hr>
                <row className="row">
                    <div className="dp"></div>
                    <div className="doc">{doc[0]}</div>
                </row>
                <div className="description">{doc[1]}</div>
            </div>
            <div className="main col-9">
                <div className="header">
                Appointment
                </div>
                <div className="flexbox">
                    <div className="datepiktxt">{data[0][3]}</div>
                    <button className="datepikbtn" onClick={this.togglePop}>change date</button>
                </div>
                <div className="flexbox">
                    {datpop?<div> <button onClick={this.togglePop}>x</button>
                    <Calendar onChange={this.onChange} value={date} />
                    </div>:null}
                </div>
                <div className="appointments">
                    <table>
                    {this.renderTable()}
                    </table>
                </div>
            </div>
        </div>
        )
    }
}
export default Appointment;