import React from "react";
import "./ListCard.css"; // Import your CSS file
import { Button } from "react-bootstrap";
import Checkbox from "@mui/material/Checkbox";

interface ListCardProps {
  data: {
    title: string;
    dueDate: string;
    description: string;
    assignedBy: string;
    priority: string;
    status: string;
  };
}

const ListCard: React.FC<ListCardProps> = ({ data, onEdit, onNotify }) => {
  return (
    <div className="listWrapper">
      {/* Header */}
      <div className="header">
        <div>
          <Checkbox
            checked={data.status === "done"}
            // Add handler for checkbox change
            // onChange={handleCheckboxChange}
          />
          {data.title}
        </div>
        <div className="calendar">
          <div className="place">
            <Button variant="outline-primary">{data.priority}</Button>
          </div>
          <div className="place">
            <Button variant={data.status === "done" ? "success" : "secondary"}>
              {data.status === "done" ? "Task Completed" : "Incomplete Task"}
            </Button>
          </div>
          <div className="date">{data.dueDate}</div>
        </div>
      </div>

      <div className="content">{data.description}</div>

      <div className="footer">
        <div className="place">Assigned by: {data.assignedBy}</div>
      </div>
    </div>
  );
};

export default ListCard;
