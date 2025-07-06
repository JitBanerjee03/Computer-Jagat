import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import 'bootstrap/dist/css/bootstrap.min.css'; //Import Bootstrap
//import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';

const router=createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {path:'/',element:<Home/>},
      {path:'/login',element:<Login/>},
      {path:'/register',element:<Register/>},
      {path:'/forgot-password',element:<ForgotPassword/>}
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
