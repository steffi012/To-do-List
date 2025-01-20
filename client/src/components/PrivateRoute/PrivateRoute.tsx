import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../pages/Header';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated !== true) {
      navigate("/"); 
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="outletWrap" style={{ height: '100vh', width: '100%' }}>
      <Header/>
      <Outlet />
    </div>
  );
};

export default PrivateRoute;
