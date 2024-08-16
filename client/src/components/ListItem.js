import React, { useState } from "react";
import TickIcon from "./TickIcon";
import ProgressBar from "./ProgressBar";
import Modal from "./Modal";

const ListItem = ({ task, getData }) => {
  const [showModal, setShowModal] = useState(false);

  const deleteTask = async () => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${task.ID}`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        console.log("Deleted Successfully");
        getData(); 
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <li className="list-item">
      <div className="info-container">
        <TickIcon />
        <p>{task.TITLE}</p>
        <ProgressBar progress={task.PROGRESS} />
      </div>
      <div className="button-container">
        <button className="edit" onClick={() => setShowModal(true)}>
          EDIT
        </button>
        <button className="delete" onClick={deleteTask}>DELETE</button>
      </div>
      {showModal && (
        <Modal
          mode={"edit"}
          setShowModal={setShowModal}
          task={task}
          getData={getData}
        />
      )}
    </li>
  );
};

export default ListItem;
