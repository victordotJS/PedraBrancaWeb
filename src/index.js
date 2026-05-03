import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Cadastro from "./Pages/Cadastro";
import Home from "./Pages/Home";
import Relatorio from "./Pages/Relatorio";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import "./App.css";

import { auth } from './Services/firebase'

import { Navigate } from 'react-router-dom';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'cadastro',
        element: <Cadastro />,
      },
      {
        path: 'relatorio',
        element: <Relatorio />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: '/',
        element: <ProtectedRoute />,
      },
    ],
  },
]);

function AppLayout() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setLoggedIn(!!user);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      {loggedIn && <Navbar />}
      <Outlet />
    </>
  );
}

function ProtectedRoute() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setLoggedIn(!!user);
    });

    return unsubscribe;
  }, []);

  return loggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />;
}

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);