import './Layout.css'
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="layout-container">
      <nav>
        <ul>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/vendors">Vendors</Link>
          </li>
          <li>
            <Link to="/product-categories">Product Categories</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  )
};

export default Layout;

