import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/pending-users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setPendingUsers(res.data));
  }, []);

  const approveUser = (userId) => {
    axios.put(`http://localhost:5000/api/admin/approve-user/${userId}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(() => {
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    });
  };

  return (
    <div>
      <h2>Pending Users</h2>
      {pendingUsers.map(user => (
        <div key={user.id}>
          {user.email}
          <button onClick={() => approveUser(user.id)}>Approve</button>
        </div>
      ))}
    </div>
  );
}