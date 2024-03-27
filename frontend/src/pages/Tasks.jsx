import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Modal from "../componets/Modal";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { MdLogout } from "react-icons/md";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import TaskCard from "../componets/TaskCard";
import { addATask, setUserTasks, setUserTasksCount } from "../redux/task.slice";
import { logout } from "../redux/auth.slice";

const Tasks = () => {
  const access_token = useSelector((store) => store.auth.token);
  const tasks = useSelector((store) => store.task.tasks);
  const dispatch = useDispatch();

  const task_count = useSelector((store) => store.task.count);
  console.log("Ciiunts", task_count);

  const [createTaskLoading, setCreateTaskLoading] = useState(false);
  const [statusQuery, setStatusQuery] = useState("");
  const [priorityQuery, setPriorityQuery] = useState("");
  const [page, setPage] = useState(1);
  const [allTasksCount, setAllTasksCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  console.log("TOALTAE", totalPages);

  const [isOpen, setIsOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/task/get", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          status: statusQuery,
          priority: priorityQuery,
          page,
        },
      });
      dispatch(setUserTasks(response.data.tasks));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const FetchAllTasksCount = async () => {
    try {
      const response = await axios.get("http://localhost:3000/task/count", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          priority: priorityQuery,
          status: statusQuery,
        },
      });
      // console.log("ers", response.data);
      dispatch(setUserTasksCount(response.data));
      setAllTasksCount(response.data.queriedTaskCount);
      // dispatch(setUserTasks(response.data.tasks));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    FetchAllTasksCount();
  }, [page, dispatch, allTasksCount, totalPages]);

  useEffect(() => {
    setPage(1);
    fetchTasks();
    FetchAllTasksCount();
  }, [statusQuery, priorityQuery]);

  useEffect(() => {
    if (task_count.queriedTaskCount === 0) {
      setTotalPages(Math.ceil(task_count.allTasksCount / 3));
    } else {
      setTotalPages(Math.ceil(task_count.queriedTaskCount / 3));
    }
  }, [task_count.queriedTaskCount, task_count.allTasksCount]);

  const createTask = async (data) => {
    try {
      setCreateTaskLoading(true);
      const { title, description, priority, status } = data;

      if (!title) {
        return toast.error("Add a title");
      }

      if (!description) {
        return toast.error("Add some description");
      }

      if (!priority) {
        return toast.error("Select priority");
      }
      const response = await axios.post(
        "http://localhost:3000/task/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log(response.data);
      setIsOpen(false);
      dispatch(addATask(response.data.newTask));
      toast.success("Task Created 👍");
    } catch (err) {
      console.log(err);
    } finally {
      setCreateTaskLoading(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <div className="flex justify-center flex-col items-center">
        <h1 className="text-4xl mb-5">Your Tasks</h1>
        <div className="flex gap-3 items-center">
          <div>Filter by Status</div>
          <div
            onClick={() => setStatusQuery("")}
            className={`border-2 border-black/50 text-black px-3 py-1 text-center rounded-full ${
              statusQuery == "" && "bg-gray-800 text-white"
            } hover:cursor-pointer`}
          >
            All{" "}
            <span className="bg-purple-500 rounded-full px-2 ml-1">
              {task_count.allTasksCount}
            </span>
          </div>
          <div
            onClick={() => setStatusQuery("pending")}
            className={`border-2 border-black/50 text-black px-3 py-1 text-center rounded-full ${
              statusQuery == "pending" && "bg-gray-800 text-white"
            } hover:cursor-pointer`}
          >
            Pending{" "}
            <span className="bg-yellow-400 rounded-full px-2 ml-1">
              {task_count.pendingTasksCount}
            </span>
          </div>

          <div
            onClick={() => setStatusQuery("in progress")}
            className={`border-2 border-black/50 text-black px-3 py-1 text-center rounded-full ${
              statusQuery == "in progress" && "bg-gray-800 text-white"
            } hover:cursor-pointer`}
          >
            In Progess{" "}
            <span className="bg-blue-500 rounded-full px-2 ml-1">
              {task_count.inProgressTasksCount}
            </span>
          </div>

          <div
            onClick={() => setStatusQuery("completed")}
            className={`border-2 border-black/50 text-black px-3 py-1 text-center rounded-full ${
              statusQuery == "completed" && "bg-gray-800 text-white"
            } hover:cursor-pointer`}
          >
            Completed{" "}
            <span className="bg-green-500 rounded-full px-2 ml-1">
              {task_count.completedTasksCount}
            </span>
          </div>

          <div className="ml-2 border-l-2  border-black px-2">
            Filter by Priority
          </div>
          <div
            onClick={() => setPriorityQuery("low")}
            className={`border-2 ${
              priorityQuery === "low" && "bg-green-500 text-white"
            } border-green-500 w-24 text-center rounded-full hover:cursor-pointer`}
          >
            Low
          </div>
          <div
            onClick={() => setPriorityQuery("medium")}
            className={`border-2 ${
              priorityQuery === "medium" && "bg-yellow-400 text-white"
            } border-yellow-400 w-24 text-center rounded-full hover:cursor-pointer`}
          >
            Medium
          </div>

          <div
            onClick={() => setPriorityQuery("high")}
            className={`border-2 ${
              priorityQuery === "high" && "bg-red-500 text-white"
            } border-red-500 w-24 text-center rounded-full hover:cursor-pointer`}
          >
            High
          </div>

          <div
            onClick={handleLogout}
            className="no-underline hover:underline border-l-black  border-l-2 flex gap-2 px-2 items-center hover:cursor-pointer"
          >
            <MdLogout size={20} />
            <span>Logout</span>
          </div>
        </div>

        {/* Tasks here */}
        <button
          onClick={openModal}
          className="mt-6 px-6 py-2 rounded-md font-medium bg-indigo-500 text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] flex items-center"
        >
          <FaPlus className="mr-3" /> Add a task
        </button>

        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          createTask={createTask}
          createTaskLoading={createTaskLoading}
        />

        <div className="w-[500px] mt-4 flex flex-col gap-2 p-4 rounded-lg">
          {tasks && tasks.map((task) => <TaskCard {...task} key={task._id} />)}
          {tasks.length === 0 && (
            <div className="bg-gray-800 text-white h-10 flex justify-center rounded-full items-center">
              <h1>No task found!</h1>
            </div>
          )}

          {tasks.length >= 3 && (
            <div className="flex justify-end gap-3 items-center mt-1">
              <button
                disabled={page == 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                <FaArrowAltCircleLeft
                  size={35}
                  className={`${
                    page == 1 ? "text-gray-400" : "text-gray-800"
                  } hover:cursor-pointer`}
                />
              </button>
              Page : {page}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                <FaArrowAltCircleRight
                  size={35}
                  className={`${
                    page === totalPages ? "text-gray-400" : "text-gray-800"
                  } hover:cursor-pointer`}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
