import {Fragment} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";

import User from "./models/user.model";

function setToken(userToken: User["authResponse"]) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString!);
  
  return userToken?.tokenId
}

function removeToken() {
  sessionStorage.removeItem('token');
}

function App() {
  return (
    <Router>
      <Fragment>
        <Routes>
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage getToken={getToken} removeToken={removeToken} />} />
          </Route>
          <Route path="/login" element={<LoginPage setToken={setToken} />} />
        </Routes>
      </Fragment>
    </Router>
  );
}

export default App;
