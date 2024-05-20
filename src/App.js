import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';

export default function App() {
  const [users, setUsers] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      city: '',
      zipcode: ''
    }
  });

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleDelete = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          setUsers(users.filter(user => user.id !== id));
        } else {
          console.error('Failed to delete user');
        }
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setCurrentUser(null);
  };

  const handleSaveEdit = () => {
    fetch(`https://jsonplaceholder.typicode.com/users/${currentUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(currentUser)
    })
      .then(response => response.json())
      .then(updatedUser => {
        setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
        handleCloseEdit();
      })
      .catch(error => console.error('Error updating user:', error));
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setCurrentUser({
      ...currentUser,
      [name]: value
    });
  };

  const handleAddUser = () => {
    setShowAdd(true);
  };

  const handleCloseAdd = () => {
    setShowAdd(false);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      address: {
        city: '',
        zipcode: ''
      }
    });
  };

  const handleSaveAdd = () => {
    fetch('https://jsonplaceholder.typicode.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })
      .then(response => response.json())
      .then(addedUser => {
        setUsers([...users, addedUser]);
        handleCloseAdd();
      })
      .catch(error => console.error('Error adding user:', error));
  };

  const handleChangeAdd = (e) => {
    const { name, value } = e.target;
    if (name === 'city' || name === 'zipcode') {
      setNewUser({
        ...newUser,
        address: {
          ...newUser.address,
          [name]: value
        }
      });
    } else {
      setNewUser({
        ...newUser,
        [name]: value
      });
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleAddUser}>
        Add New User
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>ZipCode</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address.city}</td>
              <td>{user.address.zipcode}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(user)}>
                  Edit
                </Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit User Modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNameEdit">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentUser?.name || ''}
                onChange={handleChangeEdit}
              />
            </Form.Group>
            <Form.Group controlId="formEmailEdit">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentUser?.email || ''}
                onChange={handleChangeEdit}
              />
            </Form.Group>
            <Form.Group controlId="formPhoneEdit">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={currentUser?.phone || ''}
                onChange={handleChangeEdit}
              />
            </Form.Group>
            <Form.Group controlId="formCityEdit">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={currentUser?.address.city || ''}
                onChange={(e) => {
                  const { value } = e.target;
                  setCurrentUser({
                    ...currentUser,
                    address: { ...currentUser.address, city: value }
                  });
                }}
              />
            </Form.Group>
            <Form.Group controlId="formZipcodeEdit">
              <Form.Label>ZipCode</Form.Label>
              <Form.Control
                type="text"
                name="zipcode"
                value={currentUser?.address.zipcode || ''}
                onChange={(e) => {
                  const { value } = e.target;
                  setCurrentUser({
                    ...currentUser,
                    address: { ...currentUser.address, zipcode: value }
                  });
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add User Modal */}
      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNameAdd">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleChangeAdd}
              />
            </Form.Group>
            <Form.Group controlId="formEmailAdd">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleChangeAdd}
              />
            </Form.Group>
            <Form.Group controlId="formPhoneAdd">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newUser.phone}
                onChange={handleChangeAdd}
              />
            </Form.Group>
            <Form.Group controlId="formCityAdd">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={newUser.address.city}
                onChange={handleChangeAdd}
              />
            </Form.Group>
            <Form.Group controlId="formZipcodeAdd">
              <Form.Label>ZipCode</Form.Label>
              <Form.Control
                type="text"
                name="zipcode"
                value={newUser.address.zipcode}
                onChange={handleChangeAdd}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdd}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveAdd}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
