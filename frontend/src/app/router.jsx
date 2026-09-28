import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import AuthPage from '../features/auth/AuthPage';
import DashboardPage from '../features/products/DashboardPage';

function ProtectedRoute() {
  const token = useSelector((state) => state.auth.accessToken);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function AppShell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const logout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">
          mercado<span>.</span>
        </a>
        <div className="account-actions">
          <span className="user-name">{user?.name || 'Account'}</span>
          <button className="text-button" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  { path: '/login', element: <AuthPage mode="login" /> },
  { path: '/register', element: <AuthPage mode="register" /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [{ path: '/', element: <DashboardPage /> }],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default router;
