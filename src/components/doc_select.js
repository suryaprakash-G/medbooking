import React from 'react';

   class Docsel extends React.Component {
  
    changedoc = (e) => {
        this.props.parentCallback(e.target.value);
      }
       render(){return (
        <div>
            <select onChange={this.changedoc} name="doctors" id="doclist">  
            {
                this.props.doc.map((dat, index)  => {
                    return <option value={index}>{dat['n']}</option>
                })
            }
            </select>
        </div>
    );}
   }
   export default Docsel;