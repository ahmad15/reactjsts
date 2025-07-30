import { Navigate, Outlet } from 'react-router-dom';

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString!);
  return userToken?.tokenId
}

const ProtectedRoute = () => {
    const auth = getToken(); // determine if authorized, from context or however you're doing it    

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return auth ? <Outlet /> : <Navigate replace to="/login" />;
}

export default ProtectedRoute;