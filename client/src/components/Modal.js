import { useState } from "react";
import { useCookies } from "react-cookie";

const Modal = ({ mode, setShowModal, task, getData }) => {
  const editMode = mode === "edit";
  const [cookies] = useCookies(["Email"]);
  const [data, setData] = useState({
    user_email: cookies.Email,
    title: editMode ? task.TITLE : "",
    progress: editMode ? task.PROGRESS : 0,
    todo_date: editMode ? task.TODO_DATE : new Date().toISOString(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode) {
      await editData();
    } else {
      await postData();
    }
  };

  const postData = async () => {
    try {
      const response = await fetch("http://localhost:8000/todos", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 201) {
        console.log("Added Successfully");
        setShowModal(false);
        getData(); 
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const editData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${task.ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        console.log("Edited Successfully");
        getData(); 
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {mode} your task</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            required
            maxLength={30}
            placeholder="Your Task Goes Here"
            name="title"
            value={data.title}
            onChange={handleChange}
          />
          <br />
          <label htmlFor="range">Drag to Select Your Current Progress</label>
          <input
            required
            type="range"
            id="range"
            name="progress"
            min="0"
            max="100"
            value={data.progress}
            onChange={handleChange}
          />
          <input
            className={mode}
            type="submit"
            value={editMode ? "Save" : "Create"}
          />
        </form>
      </div>
    </div>
  );
};

export default Modal;
