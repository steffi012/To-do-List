import React, { useState } from "react";
import "./ListCard.css";
import { Button } from "react-bootstrap";
import Checkbox from "@mui/material/Checkbox";
import IconEdit from "../../Icons/svg/edit.svg";
import IconDelete from "../../Icons/svg/deleteicon.svg";
import { useFetchUsers } from "../../hooks/useFetchUser";
import { UsePublicRequest } from "../../hooks/useAPI";
import { useNavigate } from "react-router-dom";

interface ListCardProps {
  data: {
    id: string;
    title: string;
    dueDate: string;
    description: string;
    assignedUser: string;
    priority: string;
    status: "todo" | "done" | "incomplete";
  };
  onEdit: (updatedData: any) => void;
  onDelete: (id: string) => void;
}

const ListCard: React.FC<ListCardProps> = ({ data, onEdit, onDelete }) => {
  const { users = [], loading: usersLoading, error: usersError } = useFetchUsers();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { publicApiRequest } = UsePublicRequest();
  const navigate = useNavigate();

  const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const updatedData = {
      ...data,
      status: e.target.checked ? "done" : "incomplete",
    };
    try {
      await publicApiRequest({
        cmd: `/todo/${data.id}`,
        method: "PATCH",
        args: updatedData,
      });
      onEdit(updatedData);
    } catch (err) {
      console.error(err);
      setError("Failed to update task status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    navigate("/add_task", { state: { taskData: data, edit: true } });
  };

  const handleDeleteClick = async () => {
    setLoading(true);
    try {
      await publicApiRequest({
        cmd: `/todo/${data.id}`,
        method: "DELETE",
      });
      onDelete(data.id);
    } catch (err) {
      console.error(err);
      setError("Failed to delete the task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const assigned =
    users.find((u) => u.id ==  data.assignedUser)?.name || "Unassigned";

  return (
    <div className={`listWrapper ${data.status}`}>
      <div className="header">
        <div>
          <Checkbox
            checked={data.status === "done"}
            onChange={handleCheckboxChange}
            disabled={loading || usersLoading}
          />
          {data.title}
        </div>
        <div className="calendar">
          <Button
            variant="outline-primary"
            onClick={handleEditClick}
            disabled={loading || usersLoading}
            aria-label="Edit task"
          >
            <img src={IconEdit} alt="Edit" />
          </Button>
          <Button
            variant="outline-primary"
            onClick={handleDeleteClick}
            disabled={loading || usersLoading}
            aria-label="Delete task"
          >
            <img src={IconDelete} alt="Delete" />
          </Button>
        </div>
      </div>

      <div className="content">{data.description}</div>

      <div className="footer">
        <div className="place">
          <Button variant="outline-primary" disabled>
            {data.priority}
          </Button>
        </div>
        <div className="place">
          <Button
            variant={data.status === "done" ? "success" : "secondary"}
            disabled
          >
            {data.status === "done" ? "Task Completed" : "Incomplete Task"}
          </Button>
        </div>
        <div className="date">{data.dueDate}</div>
        <div className="place">Assigned by: {assigned}</div>
      </div>

      {usersError && <div className="error-message">{usersError}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ListCard;
