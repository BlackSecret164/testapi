import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ role }: { role: string }) => {
    const token = localStorage.getItem('adminToken');
    const userRole = localStorage.getItem('role');

    if (!token || userRole !== role) {
        return <Navigate to="/admin-login" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
