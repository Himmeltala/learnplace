import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <Link to="/">关于</Link>
        <Link to="/board">面板</Link>
        <button onClick={() => navigate("/board")}>面板</button>
        <button onClick={() => navigate("/article/1001/HelloWorld")}>
          文章
        </button>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
