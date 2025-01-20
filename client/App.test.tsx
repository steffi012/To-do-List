import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./src/pages/Login"; 
import { AuthProvider } from "./src/context/AuthContext";
import TaskList from "./src/pages/TaskList/TaskList";
import PrivateRoute from "./src/components/PrivateRoute/PrivateRoute";
import AddTask from "./src/pages/AddTask/AddTask";
import {it,expect,describe} from 'vitest' ;
import "@testing-library/jest-dom/vitest"

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


describe('Component Rendering Tests', () => {
  it('renders Login component without crashing', () => {
    render(
      <Router>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </Router>
    );
   const heading=screen.getByRole("heading")
   expect(heading).toBeInTheDocument()
   expect(heading).toHaveTextContent(/Login Page/i)
  });
})

describe('Component Rendering Tests', () => {
  it('renders Task List component without crashing', () => {
    render(
      <Router>
        <AuthProvider>
          <TaskList />
        </AuthProvider>
      </Router>
    );
   const heading=screen.getByRole("paragraph")
   expect(heading).toBeInTheDocument()
   expect(heading).toHaveTextContent(/Loading tasks.../i)
  });
  screen.debug()
})

describe('Component Rendering Tests', () => {
  it('renders Add Task component without crashing', () => {
    render(
      <Router>
        <AuthProvider>
          <AddTask />
        </AuthProvider>
      </Router>
    );
   const heading=screen.getByRole("button")
   expect(heading).toBeInTheDocument()
   expect(heading).toHaveTextContent(/Submit Task/i)
  });
})