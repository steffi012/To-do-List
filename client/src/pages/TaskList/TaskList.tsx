import React, { useEffect, useState } from "react";
import ListCard from "./ListCard";
import "./TaskList.css";
import { UsePublicRequest } from "../../hooks/useAPI";
import bgImage from "../../Icons/icon/bgImage.png";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface TaskData {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  description: string;
  assignedUser: number;
  priority: string;
  tags: string[];
}

const TaskList: React.FC = () => {
  const [taskList, setTaskList] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { publicApiRequest } = UsePublicRequest();
  const navigate = useNavigate();


  useEffect(() => {
    getTaskList();
  }, []);

  const getTaskList = async () => {
    try {
      setLoading(true); // Set loading state to true
      const res = await publicApiRequest({
        cmd: "/todo",
        method: "GET",
      });
      setTaskList(res.data);
    } catch (err: any) {
      console.error("Error during listing:", err);
    } finally {
      setLoading(false); 
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  const handleAddButton = () => {
    setModalOpen(true);
    navigate("/add_task")
  };

  return (
    <>
      <div
        className="login-container1"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div>Steffi Mathew</div>
        <div className="taskbutton">
          <Button onClick={handleAddButton}>Add Task</Button>
        </div>
        <div className="task-list-wrapper">
          {taskList.length > 0 ? (
            taskList.map((task, index) => <ListCard key={index} data={task} />)
          ) : (
            <div>No tasks found.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskList;
