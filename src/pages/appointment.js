import React, { Suspense } from 'react';
import SimpleReactCalendar from 'simple-react-calendar'
import '../style/appointment.css';
import Back from '../components/back_btn'
  var curdate="1-2-2020";
  var time=["09:00 am","10:00 am","11:00 am","12:00 pm","01:00 pm","02:00 pm","03:00 pm","04:00 pm","05:00 pm","06:00 pm"];
  var data =  [
    ["01-02-2020","02-02-2020","03-02-2020","04-02-2020","05-02-2020","06-02-2020","07-02-2020"],
    ["sun","mon","tue","wed","thu","fri","sat"],
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
  var doc=["surya","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh."];
class Appointment extends React.Component{
    
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
    render(){
        return(
        <div className="appointment container-fluid row">
            <div className="sidepan col-3">
                <Back/>
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
                    <div className="datepiktxt">{curdate}</div>
                    <button className="datepikbtn">change date</button>
                </div>
                <div className="calender">
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