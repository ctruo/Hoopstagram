import { Navigate } from "react-router-dom";

//routes for only logged in users to view/use
const LoggedInRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default LoggedInRoute;
