import { createHashRouter, RouterProvider } from "react-router-dom";
import Layout from "../layouts";
import About from "../pages/About";
import Board from "../pages/Board";
import Login from "../pages/Login";
import Article from "../pages/Article";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <About />
      },
      {
        path: "board",
        element: <Board />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/article/:id/:name",
    element: <Article />
  }
]);

export { router, RouterProvider };
