import React from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import '../style/doc_edit.scss';
var uname,pass;
var doclist=[];//doctor json list with name and id and possible mor in future
class Doc_edit extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            editbox:false,
            load:true
        };
        this.check_login=this.check_login.bind(this);
        this.get_doc=this.get_doc.bind(this);
        this.listview=this.listview.bind(this);
        this.edit_men=this.edit_men.bind(this);
        this.get_doc();
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
      edit_men(id){
        console.log("id = "+id.target.value);
        this.setState({editbox:true})
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
    //rendering list of doctors for editing
    listview(){
        return doclist.map((dat, index) => {
            return <tr className="row"><button className="edit" onClick={this.edit_men} value={dat['id']}>{dat['n']}</button></tr>
        })
    }get_desc(e){
        axios.post(`https://bqhdj6kx2j.execute-api.ap-south-1.amazonaws.com/test/getdoc`,{id:e}).then(res => { 
            if(res.data["message"]!=="Internal server error"){
            //doc[1]=res.data;
            this.setState({desc_load:false});
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
                <div/>
            )}
            </div>
            <table className="doclst">
            {this.listview()}
            </table>
        </div>)
    }
}

export default Doc_edit;