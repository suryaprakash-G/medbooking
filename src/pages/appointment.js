import React, { Suspense } from 'react';
import '../style/appointment.css';
import Back from '../components/back_btn'
var data =  [
    {date:"01-02-2020",day:"sun",1:1,2:0,3:1},
    {date:"02-02-2020",day:"mon",1:1,2:0,3:1},
    {date:"03-02-2020",day:"tue",1:1,2:0,3:1},
    {date:"04-02-2020",day:"wed",1:1,2:0,3:1},
    {date:"05-02-2020",day:"thu",1:1,2:0,3:1},
    {date:"06-02-2020",day:"fri",1:1,2:0,3:1},
    {date:"07-02-2020",day:"sat",1:1,2:0,3:1},
  ];
class Appointment extends React.Component{
    render(){
        return(
        <div className="appointment container-fluid row">
            <div className="sidepan col-3">
                <Back/>
                <hr className="solid"></hr>
                <row className="row">
                    <div className="dp"></div>
                    <div className="doc">surya</div>
                </row>
                <div className="description"></div>
            </div>
            <div className="main col-9">
                <div className="header">
                Appointment
                </div>
                <div className="calander">
                    <table>
                        <tr>
                            <th>sun</th>
                            <th>mon</th> 
                            <th>tue</th>
                            <th>wed</th>
                            <th>thu</th>
                            <th>fri</th>
                            <th>sat</th>
                        </tr>
                        <tr>
                                <td>9:00 am</td>
                                <td>9:00 am</td>
                                <td>9:00 am</td>
                                <td>9:00 am</td>
                                <td>9:00 am</td>
                                <td>9:00 am</td>
                                <td>9:00 am</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        )
    }
}
export default Appointment;