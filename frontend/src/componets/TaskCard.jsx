import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setUserTasksCount, updateTaskStatus } from "../redux/task.slice";
import toast from "react-hot-toast";
import { deleteATask } from "../../../backend/controllers/task.conrollers";
import EditTaskModal from "./EditTaskModal";

const TaskCard = ({
  title,
  description,
  status,
  priority,
  _id,
  publishedAt,
}) => {
  const access_token = useSelector((store) => store.auth.token);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const priorityColor = {
    low: "bg-green-500",
    medium: "bg-yellow-400",
    high: "bg-red-500",
  };

  const statusColor = {
    pending: "bg-yellow-400",
    "in progress": "bg-blue-500",
    completed: "bg-green-500",
  };

  const handleStatusChange = async (e) => {
    try {
      const status = e.target.value;
      const response = await axios.post(
        "https://task-management-8pd4.onrender.com/task/updateStatus",
        { taskId: _id, status },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log(response.data);
      const { status: newStatus, _id: taskId } = response.data.task;
      dispatch(updateTaskStatus({ taskId, newStatus }));
      FetchAllTasksCount();
      toast.success("Task Status updated 👍");
    } catch (err) {
      console.log(err);
    }
  };

  const handleTaskDelete = async () => {
    try {
      const response = await axios.post(
        "https://task-management-8pd4.onrender.com/task/deleteTask",
        { taskId: _id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      // console.log(response.data.taskId);
      //   const { status: newStatus, _id: taskId } = response.data.task;
      //   dispatch(deleteATask({ taskId: response.taskId }));
      const id = await response.data.taskId;
      // dispatch(deleteATask({ taskId: response.data.taskId }));
      dispatch(deleteATask(id));
      toast.success("Task Deleted updated 👍");
    } catch (err) {
      console.log(err);
    }
  };

  const FetchAllTasksCount = async () => {
    try {
      const response = await axios.get(
        "https://task-management-8pd4.onrender.com/task/count",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          params: {},
        }
      );
      // console.log("gettung respoen", response.data);
      dispatch(setUserTasksCount(response.data));
      // dispatch(setUserTasks(response.data.tasks));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    FetchAllTasksCount();
  }, [dispatch, _id]);
  return (
    <div className="h-[155px] p-4 rounded-2xl border-2 border-black/40">
      <div className="flex items-center justify-between">
        <h1
          className={`text-2xl capitalize line-clamp-1 ${
            status === "completed" && "line-through decoration-1"
          }`}
        >
          {title}
        </h1>
        <div className="flex gap-2">
          <MdOutlineEdit
            onClick={openModal}
            size={24}
            className="hover:cursor-pointer"
          />
          <MdDeleteOutline
            size={24}
            className="hover:cursor-pointer"
            onClick={handleTaskDelete}
          />
        </div>
        <EditTaskModal
          isOpen={isOpen}
          onClose={closeModal}
          title={title}
          description={description}
          status={status}
          task_priority={priority}
          _id={_id}
          publishedAt={publishedAt}
        />
      </div>
      <p
        className={`line-clamp-2 capitalize ${
          status === "completed" && "line-through decoration-1"
        }`}
      >
        {description}
      </p>
      <div className="mt-2 flex justify-center gap-2 border-2 border-black/20 rounded-lg bg-gray-800 text-white">
        <label className="mr-2">
          <input
            type="radio"
            value="pending"
            checked={status === "pending"}
            onChange={handleStatusChange}
            className="mr-1"
          />
          Pending
        </label>
        <label className="mr-2">
          <input
            type="radio"
            value="in progress"
            checked={status === "in progress"}
            onChange={handleStatusChange}
            className="mr-1"
          />
          In Progress
        </label>
        <label>
          <input
            type="radio"
            value="completed"
            checked={status === "completed"}
            onChange={handleStatusChange}
            className="mr-1"
          />
          Completed
        </label>
      </div>

      <div className="flex justify-between items-center capitalize text-white">
        <div className="flex gap-2">
          <div
            className={`${priorityColor[priority]} rounded-lg px-4 text-center mt-3`}
          >
            {priority}
          </div>
          <div
            className={`${statusColor[status]} rounded-lg px-2 text-center mt-3`}
          >
            {status}
          </div>
        </div>
        <div className="pt-2 text-sm text-black">
          Created At : {new Date(publishedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
