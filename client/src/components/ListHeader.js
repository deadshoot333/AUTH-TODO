import React, { useState } from "react";
import { useCookies } from "react-cookie";
import Modal from "./Modal";

const ListHeader = ({ listName }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [showModal, setShowModal] = useState(false);
  const signout = () => {
    console.log(`signout`);
    removeCookie("AuthToken");
    removeCookie("Email");
    window.location.reload()
  };
  return (
    <div className="list-header">
      <h1>{listName}</h1>
      <div className="button-container">
        <button className="create" onClick={() => setShowModal(true)}>
          ADD NEW
        </button>
        <button className="signout" onClick={signout}>
          SIGN OUT
        </button>
      </div>
      {showModal && <Modal mode={"create"} setShowModal={setShowModal} />}
    </div>
  );
};

export default ListHeader;
