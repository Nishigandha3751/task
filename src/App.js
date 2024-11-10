import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

function App() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ name: '', position: '', email: '', phone: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:4000/');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const addEmployee = async () => {
    try {
      await axios.post('http://localhost:4000/add', formData);
      fetchEmployees();
      setFormData({ name: '', position: '', email: '', phone: '' });
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const updateEmployee = async () => {
    try {
      await axios.put(`http://localhost:4000/update/${editId}`, formData);
      fetchEmployees();
      setEditId(null);
      setFormData({ name: '', position: '', email: '', phone: '' });
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/delete/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editId ? updateEmployee() : addEmployee();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (employee) => {
    setEditId(employee.id);
    setFormData({
      name: employee.name,
      position: employee.position,
      email: employee.email,
      phone: employee.phone,
    });
  };

  return (
    <div className="app-container">
      <h1>Employee Management</h1>
      <form className="employee-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Position"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
        />
        <button type="submit" className="submit-button">
          {editId ? 'Update Employee' : 'Add Employee'}
        </button>
      </form>

      <h2>Employee List</h2>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>{employee.email}</td>
              <td>{employee.phone}</td>
              <td>
                <button onClick={() => handleEdit(employee)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => deleteEmployee(employee.id)} className="delete-button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
