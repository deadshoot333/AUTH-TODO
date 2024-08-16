import { useEffect, useState } from "react";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import Auth from "./components/Auth";
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["Email", "AuthToken"]);
  const userEmail = cookies.Email;
  const authToken = cookies.AuthToken;
  const [tasks, setTasks] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${userEmail}`);
      const fetched_data = await response.json();
      setTasks(fetched_data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, [authToken]);

  const sortedTasks = tasks?.sort(
    (a, b) => new Date(a.TODO_DATE) - new Date(b.TODO_DATE)
  );

  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken && (
        <div>
          <ListHeader listName={"Welcome To AUTH TODO✅"} getData={getData} />
          <p className="user-email"> Welcome Back {userEmail}</p>
          {sortedTasks?.map((task) => (
            <ListItem key={task.ID} task={task} getData={getData} />
          ))}
           <p className='copyright'>© Arqam Designs, LLC</p>
        </div>
      )}
    </div>
  );
};

export default App;
