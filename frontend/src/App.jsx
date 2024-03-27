import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setUserTasks } from "./redux/task.slice";
import { LandingPage } from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const access_token = useSelector((store) => store.auth.token);
  const auth = useSelector((store) => store.auth);
  const tasks = useSelector((store) => store.task.tasks);
  const dispatch = useDispatch();
  console.log("Store", auth);
  console.log("tasks", tasks);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "https://task-management-8pd4.onrender.com/task/get",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          params: {
            page: 1,
          },
        }
      );
      dispatch(setUserTasks(response.data.tasks));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [auth?.token, dispatch]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/register"
          element={!auth?.token ? <Register /> : <Navigate to="/tasks" />}
        />
        <Route
          path="/login"
          element={!auth?.token ? <Login /> : <Navigate to="/tasks" />}
        />
        <Route
          path="/tasks"
          element={auth?.token ? <Tasks /> : <Navigate to="/login" />}
        />

        <Route path="/" element={<LandingPage />} />

        <Route
          path="/profile"
          element={auth?.token ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;
