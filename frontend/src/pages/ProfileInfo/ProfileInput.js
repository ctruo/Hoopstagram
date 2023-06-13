import { useState, useRef, useEffect } from "react";
import "./ProfileInput.css";
import useOutsideComponent from "../../hooks/useOutsideComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCheck } from "@fortawesome/free-solid-svg-icons";

function ProfileInput(props) {
  const { type, setter, state } = props;
  const [editMode, setEditMode] = useState(false);
  const focusRef = useRef();
  const wrapperRef = useRef(null);
  useOutsideComponent(wrapperRef, setEditMode);

  const label = type.charAt(0).toUpperCase() + type.slice(1);

  //focus on input when editMode is true
  useEffect(() => {
    if (editMode) {
      focusRef.current.focus();
    }
  }, [editMode]);

  function toggleEdit(e) {
    e.preventDefault();
    setEditMode(!editMode);
  }

  let placeholder;
  if (type === "password") {
    placeholder = "Set new password";
  }

  let inputType = "text";
  if (type === "email") {
    inputType = "email";
  }

  return (
    <div className="profile-input">
      <label htmlFor={type}>{label}</label>
      <div className="input-and-btn" ref={wrapperRef}>
        <input
          type={inputType}
          ref={focusRef}
          autoComplete="off"
          id={type}
          name={type}
          value={state}
          onChange={(e) => setter(e.target.value)}
          disabled={!editMode}
          placeholder={placeholder}
        />
        <button onClick={(e) => toggleEdit(e)} className="profile-input-btn">
          {editMode ? (
            <FontAwesomeIcon icon={faCheck} className="fa-xl" />
          ) : (
            <FontAwesomeIcon icon={faPenToSquare} className="fa-xl" />
          )}
        </button>
      </div>
    </div>
  );
}
export default ProfileInput;
