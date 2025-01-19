import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // Adjust the path as per your folder structure
import { AuthProvider } from "./context/AuthContext";
import TaskList from "./pages/TaskList/TaskList";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import AddTask from "./pages/AddTask/AddTask";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/task_list" element={<TaskList />} />
            <Route path="/add_task" element={<AddTask />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
