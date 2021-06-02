import React from 'react';
import { Route, Redirect } from "react-router-dom";
/*
const GuardedRoute = ({ component: Component, auth, ...rest }) =>{
    console.log(auth === "true");
    return (
        <Route {...rest} render={(props) => (
            auth === "true"
                ? <Component {...props} />
                : <Redirect to='/rosterWeb/admin/' />
        )} />
    )
}
*/
const GuardedRoute = ({ auth, ...rest }) => {
    console.log(auth === "true");
    //return auth === "true" ? <Route {...rest} /> : <Redirect to="/rosterWeb/admin/" />;
    if (auth === "true"){
        return <Route {...rest} />
    } else {
        return <Redirect to="/rosterWeb/admin/" />; 
    }
  };

export default GuardedRoute;