import React from 'react'
import { useEffect, useState } from 'react';
import './App.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function App() {
    const [todos, setTodos] = useState([]);
    //const [nameInput, setName] = React.useState('');
    //const [descriptionInput, setDescription] = React.useState('');
    //const [dueDateInput, setDueDate] = React.useState('');
    const addTask = () => {
        fetch('https://localhost:7144/Todo', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({
                "id": 0,
                "name": "",
                "description": "",
                "urgency": 0,
                "dueDate": "2025-05-10T00:00:00"
            }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed To Create Todo');
                return response.json();
            })
            .then(data => {
                console.log('Todo created', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        //newList.push()
        //newList.push(<input type="text" value={input} onChange={(e) => setInput(e.target.value)}></input>);
        //newList.push(5);
        //newTodos.push();
        //setTodos(newTodos);

        //alert("Add a name, description, urgency, and due date!");
    }

    const handleInputChange = (id, field, value) => {
        const changedTodos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, [field]: value };
            }
            return todo;
        });
        setTodos(changedTodos);
    }

    useEffect(() => {
        fetch('https://localhost:7144/Todo')
            .then(res => res.json())
            .then(data => setTodos(data));
    }, []);



    return (
        <div className="bg-neutral-900 min-h-screen flex flex-col justify-start items-center">
            <header>
                <h1 className="text-3xl font-bold text-white">Do It Or Explode!</h1>
            </header>
            <div className="pt-5 flex flex-col">
                {todos.map(todo => (
                    <div key={todo.id} className="mb-10 bg-green-900 w-150 h-42 rounded hover:bg-green-800">
                        <div className="flex items-center">
                            <span className="ml-2 mt-2 font-bold text-white">Name</span>
                            <input className="ml-2 mt-2 w-50 h-8 bg-green-600 rounded hover:bg-green-500 font-bold text-white" type="text" value={todo.name} onChange={(e) => handleInputChange(todo.id, 'name', e.target.value)}></input>
                        </div>
                        <div className="flex items-center">
                            <span className="ml-2 mt-2 font-bold text-white">Description</span>
                            <input className="ml-2 mt-2 w-100 h-8 bg-green-600 rounded hover:bg-green-500 font-bold text-white" type="text" value={todo.description} onChange={(e) => handleInputChange(todo.id, 'description', e.target.value)}></input>
                        </div>
                        <div className="flex items-center">
                            <span className="ml-2 mt-2 font-bold text-white">Due Date</span>
                            <DatePicker className="ml-2 mt-2 w-75 h-8 bg-green-600 rounded hover:bg-green-500 font-bold text-white"
                                dateFormat="yyyy-MM-dd" selected={todo.dueDate ? new Date(todo.dueDate) : null} onChange={(date) => handleInputChange(todo.id, 'dueDate', date)} />                         
                        </div>
                        <div className="flex items-center">
                            <span className="ml-2 mt-2 font-bold text-white">Urgency</span>
                            <select className="ml-2 mt-2 w-75 h-8 bg-green-600 rounded hover:bg-green-500 font-bold text-white" type="text" value={todo.urgency} onChange={(e) => handleInputChange(todo.id, 'urgency', e.target.value)}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>                          
                        </div>
                    </div>
                ))}
                <button className="mt-4 w-150 h-16 text-3xl bg-neutral-900 font-bold text-white rounded hover:bg-neutral-800" onClick={() => addTask()}>+</button>     
            </div>
        </div>
    );
}


export default App