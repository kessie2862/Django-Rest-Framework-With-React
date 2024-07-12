import React, { useState } from 'react';
import TodoDataService from '../services/todos';
import { Link, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

const AddTodo = ({ token }) => {
  const location = useLocation();
  const editing = location.state && location.state.currentTodo;
  const initialTodoTitle = editing ? location.state.currentTodo.title : '';
  const initialTodoMemo = editing ? location.state.currentTodo.memo : '';

  const [title, setTitle] = useState(initialTodoTitle);
  const [memo, setMemo] = useState(initialTodoMemo);
  const [submitted, setSubmitted] = useState(false);

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangeMemo = (e) => {
    setMemo(e.target.value);
  };

  const saveTodo = () => {
    const data = {
      title,
      memo,
      completed: false,
    };

    if (editing) {
      TodoDataService.updateTodo(location.state.currentTodo.id, data, token)
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      TodoDataService.createTodo(data, token)
        .then((response) => {
          setSubmitted(true);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <Container>
      {submitted ? (
        <div>
          <h4>Todo submitted successfully</h4>
          <Link to="/todos/">Back to Todos</Link>
        </div>
      ) : (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{editing ? 'Edit' : 'Create'} Todo</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="e.g. buy gift tomorrow"
              value={title}
              onChange={onChangeTitle}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={memo}
              onChange={onChangeMemo}
            />
          </Form.Group>
          <Button variant="info" onClick={saveTodo}>
            {editing ? 'Edit' : 'Add'} To-do
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default AddTodo;
