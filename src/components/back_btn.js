import React from 'react';
import history from './history';
import styles from '../style/global.scss';
const styl = {
    padding: '0 10px 0 30px',
  };
const Back = () =>{
       return (<div>
        <button className={styles.bck} onClick={() => history.goBack()}
         style={styl}
        > &laquo; Back</button>
        </div>);
   }
   export default Back;