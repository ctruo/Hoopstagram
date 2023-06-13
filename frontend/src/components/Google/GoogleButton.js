import "./GoogleButton.css";

function GoogleButton() {
  async function openGoogleSSO() {
    window.open(
      "https://fair-erin-vulture-wig.cyclic.app/auth/google",
      "_self"
    );
  }

  return (
    <button className="google-btn" onClick={() => openGoogleSSO()}>
      <img src="google.png" alt="Google logo"></img>
      Sign in with Google
    </button>
  );
}

export default GoogleButton;
