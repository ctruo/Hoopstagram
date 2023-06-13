import { useEffect } from "react";

//custom hook
//changes state when clicking outside of this component
//used in UserMenu.js, ProfileInput.js
function useOutsideComponent(ref, stateSetter) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        stateSetter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, stateSetter]);
}

export default useOutsideComponent;
