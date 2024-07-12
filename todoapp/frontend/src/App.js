import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Signup from './components/signup';
import Login from './components/login';
import AddTodo from './components/AddTodo';
import TodosList from './components/TodosList';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

import TodoDataService from './services/todos';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [, setError] = useState('');

  async function login(user = null) {
    TodoDataService.login(user)
      .then((response) => {
        setToken(response.data.token);
        setUser(user.username);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', user.username);
        setError('');
      })
      .catch((e) => {
        console.log('login', e);
        setError(e.toString());
      });
  }

  async function logout() {
    setToken('');
    setUser('');
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
  }

  async function signup(user = null) {
    TodoDataService.signup(user)
      .then((response) => {
        setToken(response.data.token);
        setUser(user.username);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', user.username);
      })
      .catch((e) => {
        console.log(e);
        setError(e.toString());
      });
  }

  return (
    <div className="App">
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>TodosApp</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link className="nav-link" to={'/todos'}>
                Todos
              </Link>
              {user ? (
                <Link className="nav-link" onClick={logout}>
                  Logout ({user})
                </Link>
              ) : (
                <>
                  <Link className="nav-link" to={'/login'}>
                    Login
                  </Link>
                  <Link className="nav-link" to={'/signup'}>
                    Sign Up
                  </Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<TodosList token={token} />} />
          <Route path="/todos" element={<TodosList token={token} />} />
          <Route path="/todos/create" element={<AddTodo token={token} />} />
          <Route path="/todos/:id" element={<AddTodo token={token} />} />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/signup" element={<Signup signup={signup} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
