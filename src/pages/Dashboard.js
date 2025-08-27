import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current logged-in user
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    // If admin, fetch all users
    const fetchUsers = async () => {
      try {
        if (storedUser?.role === "admin") {
          const res = await API.get("/users");
          setUsers(res.data);
        }
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>
        {user?.role === "admin" ? "👑 Admin Dashboard" : "👤 User Dashboard"}
      </h2>

      {/* ✅ Admin Only Section */}
      {user?.role === "admin" && (
        <>
          <h3>Admin Panel</h3>
          <div className="admin-links">
            <ul>
              <li>
                <Link to="/add-question">➕ Add Question</Link>
              </li>
              <li>
                <Link to="/questions">📋 View Questions</Link>
              </li>
            </ul>
          </div>

          <h3>All Users</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ✅ User Only Section */}
      {user?.role === "user" && (
        <>
          <p>Welcome back, {user?.name} 🎉</p>
          <Link to="/questions">📋 Take a Quiz</Link>
        </>
      )}
    </div>
  );
};

export default Dashboard;
