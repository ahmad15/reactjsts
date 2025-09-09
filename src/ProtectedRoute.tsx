import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Token from './models/token.model';

import Modal from './components/Modal';

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString!);

  return userToken?.tokenId
}

function reLogin() {
  sessionStorage.removeItem('token');
  window.location.href = '/login';
}

const ProtectedRoute = () => {
    const auth = getToken();

    if (!auth) {
      return <Navigate to="/login" replace />;
    }

    const decoded = jwtDecode<Token["credential"]>(auth);
    const expirationTime = decoded && decoded.exp ? (decoded.exp * 1000) - 60000 : null;
    const isExpired = expirationTime ? Date.now() > expirationTime : true;

    if (isExpired) {
      return <Modal
        id="session-expired"
        title="Session Expired"
        text="Your session has expired. Please log in again."
        btnOK="Login"
        isOpen={true}
        onProsess={() => reLogin()}
        onClose={() => reLogin()}
      />
    }

    return <Outlet />;
}

export default ProtectedRoute;