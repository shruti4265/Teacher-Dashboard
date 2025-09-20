import React from "react";
import { Link } from "react-router-dom";
function Frontpage(){
    return(
        <div>
          <Link to="/teacherDashboard">Teacher DashBoard</Link>
        </div>
    );
};
export default Frontpage;