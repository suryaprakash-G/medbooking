import React from 'react';
import history from './history';
import '../style/backbtn.css'
const styl = {
    padding: '0 10px 0 30px',
  };
const Back = () =>{
       return (<div>
        <button className="bck" onClick={() => history.goBack()}
         style={styl}
        > &laquo; Back</button>
        </div>);
   }
   export default Back;