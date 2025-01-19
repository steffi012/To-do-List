import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
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
  Grid,
  Container,
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
  const [users, setUsers] = useState<any[]>([]); // State to store fetched users
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Task>();
  const navigate = useNavigate();
  const { publicApiRequest } = UsePublicRequest();

  useEffect(() => {
    userSelect();
  }, []);

  // Fetch users for the "Assigned User" field
  const userSelect = async () => {
    setLoading(true);
    try {
      const res = await publicApiRequest({
        cmd: "/users",
        method: "GET",
      });
      setUsers(res.data); 
    } catch (err) {
      setError("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data: Task) => {
    setLoading(true);
    try {
      console.log(data); 
      navigate("/tasks"); 
    } catch (err) {
      setError("Error adding task");
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
          Add Task
        </Typography>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Task Title"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register("title", { required: true })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />

              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register("description", { required: true })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Due Date"
                type="date"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register("dueDate", { required: true })}
                error={!!errors.dueDate}
                helperText={errors.dueDate?.message}
                InputLabelProps={{ shrink: true }}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Assigned User</InputLabel>
                <Select
                  label="Assigned User"
                  {...register("assignedUser", { required: true })}
                  error={!!errors.assignedUser}
                >
                  {users.length > 0 ? (
                    users.map((user: any) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">No users available</MenuItem>
                  )}
                </Select>
                {errors.assignedUser && <Typography color="error">{errors.assignedUser.message}</Typography>}
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  label="Priority"
                  {...register("priority")}
                  defaultValue="Low"
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
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
          >
            Submit
          </Button>
        </form>
      </Container>
    </Box>
  );
}
