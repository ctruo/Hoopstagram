import { Navigate } from "react-router-dom";

//routes for users not logged in yet
//prevents logged in users from accessing sign-up/login forms again
const LoggedOutRoute = ({ user, children }) => {
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default LoggedOutRoute;
