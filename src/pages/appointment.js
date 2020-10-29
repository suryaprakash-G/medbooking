import React from 'react';
import '../style/appointment.css';
import Back from '../components/back_btn'
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