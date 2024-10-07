import React from 'react'
import { formatDate } from '../helper/postReport';

const GridSendReport = (props) => {
  const {submittedBy, submittedIn, verified} = props;

  let name = submittedBy?.split(" ")[0] || "";
  let date = submittedIn;
  let row = name + " "+ date;

/* 
  if(name===null || !name.lenght>0){
    row=":";
  }
*/

  return (
      <div className="flex justify-center m-0 p-0 ">
          { verified ? row : "Not Sent"}
      </div>
  );
}
export default GridSendReport;