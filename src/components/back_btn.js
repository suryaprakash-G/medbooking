import React from 'react';
import history from './history';
import styles from '../style/global.scss';
const Back = () =>{
       return (<div>
        <button className="bck" onClick={() => history.goBack()}
        > &laquo; Back</button>
        </div>);
   }
   export default Back;