import React from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import '../style/doc_edit.scss';
import '../style/react_calendar.scss';
var doclist=[];//doctor json list with name and id and possible mor in future
class Doc_edit extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            load:true
        };
        this.check_login=this.check_login.bind(this);
        this.get_doc=this.get_doc.bind(this);
        this.listview=this.listview.bind(this);
        axiosRetry(axios, { retries: 2 });
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
          this.setState({load:true})
        axios.get(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/getdoc`,{}).then(res => {
            //console.log(res.data);
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
    //rendering list of doctors for editing
    listview(){
        return doclist.map((dat, index) => {
            return <div>{}</div>
        })
    }
    render(){
        return(
        <div>
            <div className="header row">
              doctor management
              {this.listview()}
            </div>
        </div>)
    }
}

export default Doc_edit;