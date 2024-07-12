import React, { useState, useEffect, useCallback } from 'react';
import TodoDataService from '../services/todos';
import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import moment from 'moment';

const TodosList = ({ token }) => {
  const [todos, setTodos] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const retrieveTodos = useCallback(() => {
    TodoDataService.getAll(token)
      .then((response) => {
        setTodos(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [token]);

  useEffect(() => {
    // Check if token is present to determine login status
    setIsLoggedIn(token !== null && token !== '');

    // Fetch todos only if logged in
    if (isLoggedIn) {
      retrieveTodos();
    } else {
      setTodos([]);
    }
  }, [token, isLoggedIn, retrieveTodos]);

  const deleteTodo = (todoId) => {
    TodoDataService.deleteTodo(todoId, token)
      .then((response) => {
        retrieveTodos();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const completeTodo = (todoId) => {
    TodoDataService.completeTodo(todoId, token)
      .then((response) => {
        retrieveTodos();
        console.log('completeTodo', todoId);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Container>
      {!isLoggedIn ? (
        <Alert variant="warning">
          You are not logged in. Please <Link to="/login">login</Link> to see
          your todos.
        </Alert>
      ) : (
        <div>
          <Link to={'/todos/create'}>
            <Button variant="outline-info" className="mb-3">
              Add To-do
            </Button>
          </Link>
          {todos.map((todo) => (
            <Card key={todo.id} className="mb-3">
              <Card.Body>
                <div>
                  <div
                    className={`${
                      todo.completed ? 'text-decoration-line-through' : ''
                    }`}
                  >
                    <Card.Title>{todo.title}</Card.Title>
                    <Card.Text>
                      <b>Memo:</b> {todo.memo}
                    </Card.Text>
                    <Card.Text>
                       Date created:{' '}
                      {moment(todo.created).format('Do MMMM YYYY')}
                    </Card.Text>
                  </div>
                </div>
                {!todo.completed && (
                  <Link to={`/todos/${todo.id}`} state={{ currentTodo: todo }}>
                    <Button variant="outline-info" className="me-2">
                      Edit
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline-danger"
                  onClick={() => deleteTodo(todo.id)}
                  className="me-2"
                >
                  Delete
                </Button>
                <Button
                  variant="outline-success"
                  onClick={() => completeTodo(todo.id)}
                >
                    Complete
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default TodosList;
