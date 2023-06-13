import { useEffect } from "react";
import "./GoogleAuthError.css";
import { useNavigate } from "react-router-dom";

function GoogleAuthError() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/signup");
    }, 2000);
  }, []);

  return (
    <div id="google-auth-error">
      <img src="/google.png" alt="Google logo"></img>
      <h1>Invalid credentials or something went wrong. Redirecting...</h1>
    </div>
  );
}

export default GoogleAuthError;
