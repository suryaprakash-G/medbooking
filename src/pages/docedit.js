import React from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import styles from '../style/doc_edit.module.scss';
var uname,pass;
var doclist=[{id:"",n:""}];//doctor json list with name and id and possible mor in future
class Doc_edit extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            id:"",
            uname:"",
            pass:"",
            changed:false,
            editbox:false,
            load:true
        };
        this.check_login=this.check_login.bind(this);
        this.get_doc=this.get_doc.bind(this);
        this.listview=this.listview.bind(this);
        this.edit_men=this.edit_men.bind(this);
        this.c_uname=this.c_uname.bind(this);
        this.c_pass=this.c_pass.bind(this); 
        this.get_doc();
        axiosRetry(axios, { retries: 2 });
      }
      c_uname(e){this.setState({uname: e.currentTarget.value});this.setState({changed:true});}
      c_pass(e){this.setState({pass: e.currentTarget.value});this.setState({changed:true});}
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
      edit_men(id){
        this.setState({changed:false});
        this.setState({pass:""});
        this.setState({id:doclist[id.target.value]['id']})
        this.setState({uname:doclist[id.target.value]['n']})
        this.setState({showModal:true})
      }
      get_doc(e){
          this.setState({load:true})
        axios.get(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/getdoc`,{}).then(res => {
            //console.log(res.data);
          if(res.data["message"]!=="Internal server error"){
              doclist=res.data;
              this.setState({docselect:doclist[0]['id']});
              this.setState({docname:doclist[0]['n']});
              this.setState({dclist_load:false});
          }
        })
    }
    deldoc(e){
      console.log("delete doc "+e.currentTarget.value);
      axios.get(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/deldoc`,{}).then(res => {
          if(res.data["message"]!=="Internal server error"){
              doclist=res.data;
              this.setState({docselect:doclist[0]['id']});
              this.setState({docname:doclist[0]['n']});
              this.setState({dclist_load:false});
          }
        })
    }
    sendchanges(e){
      var id=e.target.value;
      axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/editdoc`,{id:id}).then(res => { 
            if(res.data["message"]!=="Internal server error"){
            alert("changes saved");
            this.setState({desc_load:false});
            }
    })
    }
    //rendering list of doctors for editing
    listview(){
        return doclist.map((dat, index) => {
            return <tr className="row"><button className="edit" onClick={this.edit_men} value={index}>{dat['n']}</button></tr>
        })
    }get_desc(e){
        axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/getdoc`,{id:e}).then(res => { 
            if(res.data["message"]!=="Internal server error"){
              
            }
    })
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
            <div className="header row">
              doctor management
            </div>
            <div ref={nodebook => {this.nodebook = nodebook;}}>
            {this.state.showModal && (
              <div>
              <div>{this.state.id}</div>
              <img onClick={console.log("dp edit")} className="img dp" src={"https://d23yysxhlq0p5m.cloudfront.net/dp/"+this.state.id+".jpg"}/>
              <input value={this.state.uname} onChange={this.c_uname} className="inputbox " placeholder="User Name" />
              <input value={this.state.pass} onChange={this.c_pass} className="inputbox " placeholder="pass" />
              <button onClick={this.deldoc} value={this.state.id}>delete</button>
              <button disabled={!this.state.changed} onClick={this.sendchanges} value={this.state.id}>save changes</button>
              </div>
            )}
            </div>
            <table className="doclst">
            {this.listview()}
            </table>
        </div>)
    }
}

export default Doc_edit;