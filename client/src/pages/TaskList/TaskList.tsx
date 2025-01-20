import React, { useEffect, useState, useCallback } from "react";
import ListCard from "./ListCard";
import "./TaskList.css";
import { UsePublicRequest } from "../../hooks/useAPI";
import bgImage from "../../Icons/icon/bgImage.png";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Pagination,
  InputLabel,
  FormControl,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { useFetchUsers } from "../../hooks/useFetchUser";

interface TaskData {
  id: string;
  title: string;
  status: "todo" | "done" | "incomplete";
  dueDate: string;
  description: string;
  assignedUser: number;
  priority: string;
  tags: string[];
}

const TaskList: React.FC = () => {
  const [taskList, setTaskList] = useState<TaskData[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [userFilter, setUserFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tasksPerPage] = useState<number>(2);
  const [sortOption, setSortOption] = useState<string>("");
  const { publicApiRequest } = UsePublicRequest();
  const navigate = useNavigate();
  const {
    users = [],
    loading: usersLoading,
    error: usersError,
  } = useFetchUsers();

  useEffect(() => {
    getTaskList();
  }, []);

  useEffect(() => {
    filterAndSortTasks();
  }, [
    taskList,
    searchQuery,
    statusFilter,
    userFilter,
    sortOption,
    currentPage,
  ]);

  const getTaskList = async () => {
    try {
      setLoading(true);
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

  const handleAddButton = () => {
    navigate("/add_task");
  };

  const handleEditTask = (updatedTask: TaskData) => {
    setTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskList((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const filterAndSortTasks = () => {
    let tasks = [...taskList];

    if (statusFilter) {
      tasks = tasks.filter((task) => task.status === statusFilter);
    }
    if (userFilter !== null) {
      tasks = tasks.filter((task) => task.assignedUser === userFilter);
    }
    if (searchQuery) {
      tasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOption === "title") {
      tasks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "dueDate") {
      tasks.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    }
    const startIndex = (currentPage - 1) * tasksPerPage;
    const paginatedTasks = tasks.slice(startIndex, startIndex + tasksPerPage);
    setFilteredTasks(paginatedTasks);
  };

  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setCurrentPage(1);
    }, 300),
    []
  );

  const totalPages = Math.ceil(
    taskList.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!statusFilter || task.status === statusFilter) &&
        (userFilter === null || task.assignedUser === userFilter)
    ).length / tasksPerPage
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <div className="spinner"></div>
        <Typography>Loading tasks...</Typography>
      </Box>
    );
  }

  return (
    <Box
      className="login-container1"
      sx={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        minHeight: "calc(100vh - 30px)",
        height: "calc(100vh - 30px)",
      }}
    >
      <Box
        className="task-filters"
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <TextField
            variant="outlined"
            label="Search by title"
            onChange={(e) => handleSearch(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Filter by status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="done">Done</MenuItem>
              <MenuItem value="incomplete">Incomplete</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Filter by user</InputLabel>
            <Select
              value={userFilter || ""}
              onChange={(e) => setUserFilter(Number(e.target.value) || null)}
              label="Filter by user"
            >
              <MenuItem value="">All</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} {/* Displaying user name here */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              label="Sort by"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="dueDate">Due Date</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          onClick={handleAddButton}
          sx={{
            whiteSpace: "nowrap",
            flexGrow: 1,
            height: "100%",
          }}
        >
          Add Task
        </Button>
      </Box>
      <Box className="task-list-wrapper">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <ListCard
              key={task.id}
              data={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))
        ) : (
          <Typography>No tasks found.</Typography>
        )}
      </Box>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ marginTop: "10px" }}
      />
    </Box>
  );
};

export default TaskList;
