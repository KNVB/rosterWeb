import React from 'react';
import { Route, Redirect } from "react-router-dom";

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

export default GuardedRoute;