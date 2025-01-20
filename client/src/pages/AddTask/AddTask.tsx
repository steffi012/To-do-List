import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import bgImage from "../../Icons/icon/bgImage.png";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
} from "@mui/material";
import { UsePublicRequest } from "../../hooks/useAPI";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().min(1, "Due date is required"),
  assignedUser: z.string().min(1, "Assigned user is required"),
  priority: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type Task = z.infer<typeof taskSchema>;

export default function AddTask() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Task>({
    resolver: zodResolver(taskSchema),
  });

  const navigate = useNavigate();
  const { publicApiRequest } = UsePublicRequest();

  const { state } = useLocation();
  const taskData = state?.taskData;
  const edit = state?.edit || false;

  useEffect(() => {
    if (taskData) {
      setValue("title", taskData.title);
      setValue("description", taskData.description);
      setValue("dueDate", taskData.dueDate);
      setValue("assignedUser", taskData.assignedUser);
      setValue("priority", taskData.priority);
      setValue("tags", taskData.tags || []);
    }
    fetchUsers();
  }, [taskData, setValue]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await publicApiRequest({
        cmd: "/users",
        method: "GET",
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: Task) => {
    setLoading(true);
    setError(null);
    try {
      await publicApiRequest({
        cmd: edit ? `/todo/${taskData.id}` : "/todo",
        method: edit ? "PATCH" : "POST",
        args: { ...data, status: "todo", tags: data.tags || [] },
      });
      navigate("/task_list");
    } catch (err) {
      console.error(err);
      setError("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          {edit ? "Edit Task" : "Add Task"}
        </Typography>

        {loading && (
          <Box display="flex" justifyContent="center" mb={2}>
            <CircularProgress />
          </Box>
        )}
        {error && <Typography color="error">{error}</Typography>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Task Title"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />

              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  {...register("priority")}
                  defaultValue={taskData?.priority || ""}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Due Date"
                type="date"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register("dueDate")}
                error={!!errors.dueDate}
                helperText={errors.dueDate?.message}
                InputLabelProps={{ shrink: true }}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Assigned User</InputLabel>
                <Select
                  {...register("assignedUser")}
                  defaultValue={taskData?.assignedUser || ""}
                >
                  {users.length > 0 ? (
                    users.map((user: any) => (
                      <MenuItem key={user.id || taskData?.assignedUser} value={user.id || taskData?.assignedUser}>
                        {user.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">
                      {loading ? "Loading users..." : "No users available"}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={loading}
          >
            {edit ? "Update Task" : "Add Task"}
          </Button>
        </form>
      </Container>
    </Box>
  );
}
