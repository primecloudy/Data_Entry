import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load users from backend
  const loadUsers = () => {
    setIsLoading(true);

    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load users:", err);
        setIsLoading(false);
      });
  };

  // Only admin loads users
  useEffect(() => {
    if (user?.role === "admin") {
      loadUsers();
    }
  }, [user]);

  // Create user
  const handleCreateUser = async (e) => {
    e.preventDefault();

    const { username, password, role } = newUser;

    if (!username || !password) {
      alert("⚠️ Username and Password are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ " + data.message);
        loadUsers();
        setNewUser({ username: "", password: "", role: "user" });
      } else {
        alert("❌ " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Server error");
    }
  };

  // Delete user
  const handleDelete = async (username) => {
    if (username === "admin") {
      alert("❌ Cannot delete admin account!");
      return;
    }

    if (!window.confirm(`Delete user "${username}" ?`)) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${username}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("🗑️ " + data.message);
        loadUsers();
      } else {
        alert("❌ " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Delete failed");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Restrict non admin
  if (!user || user.role !== "admin") {
    return (
      <div className="dashboard-container">
        <div className="access-denied">
          <div className="access-denied-icon">🚫</div>
          <h3>Access Denied</h3>
          <p>You must be an <strong>Admin</strong> to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>

        <div className="header-right">
          <span className="user-welcome">
            Welcome, {user.username}
          </span>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Create User */}
      <div className="dashboard-card">
        <div className="card-header">
          <h2>Create New User</h2>
        </div>

        <form onSubmit={handleCreateUser} className="user-form">
          <input
            type="text"
            placeholder="Username"
            className="form-input"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="form-input"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />

          <select
            className="form-select"
            value={newUser.role}
            onChange={(e) =>
              setNewUser({ ...newUser, role: e.target.value })
            }
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="create-user-btn">
            Create
          </button>
        </form>
      </div>

      {/* Users List */}
      <div className="dashboard-card">
        <div className="card-header">
          <h2>Registered Users ({users.length})</h2>

          <button className="refresh-btn" onClick={loadUsers}>
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users
                  .filter((u) => u.username !== "admin")
                  .map((u, index) => (
                    <tr key={index}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="username">
                            {u.username}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className={`role-badge ${u.role}`}>
                          {u.role}
                        </span>
                      </td>

                      <td>
                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(u.username)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                {users.filter((u) => u.username !== "admin").length === 0 && (
                  <tr>
                    <td colSpan="3" className="no-users">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;