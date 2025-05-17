import React from 'react'
import { useEffect, useState, useRef } from 'react';
import './App.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Lottie from 'lottie-react';
import congratsAnim from './animations/congrats.json';
import explodeAnim from './animations/explode.json';
import congratsSound from './sounds/icarly-cheers.mp3';
import detonate from './sounds/bokudan.mp3';
import killerQueenExplosion from './sounds/killer-queen-kaboom.mp3';
function App() {
    const [todos, setTodos] = useState([]);
    const congratsPlayer = useRef(null);
    const explodePlayer = useRef(null);
    const [congratsReady, setCongratsReady] = useState(false);
    const [explodeReady, setExplodeReady] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [explosivity, setExplosivity] = useState("green");
    //const [todoPos, setTodoPos] = useState(0);
    const determineExplosivity = (id) => {
        const currentDate = new Date();
        const todo = todos.find(todo => todo.id === id);
        const dueDate = todo.dueDate;
        currentDate.setHours(0, 0, 0, 0);
        const date = new Date(dueDate);
        date.setHours(0, 0, 0, 0);
        const timeDifference = date.getTime() - currentDate.getTime();
        const dayDifference = timeDifference / 86400000;
        if (dayDifference < 0) {
            deleteTask(id);
        }
        else if (dayDifference >= 0 && dayDifference <= 4) {
            console.log("hey");
            setExplosivity("red");
            console.log(explosivity);
            
        }
        else if (dayDifference >= 5 && dayDifference <= 10) {
            
            setExplosivity("yellow");
        }
        else {
            setExplosivity("green");
        }

        //console.log(explosivity);

    }

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
                "dueDate": currentDate
            }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed To Create Todo');
                return response.json();
            })
            .then(data => {
                console.log('Todo created', data);
                setTodos(todos => [...todos, data]);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const editTodo = (id) => {
        const todoToUpdate = todos.find(todo => todo.id === id);
        determineExplosivity(todoToUpdate.id);
        fetch(`https://localhost:7144/Todo/${todoToUpdate.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todoToUpdate),
        })
            .then(data => {
                console.log('Todo updated', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }

    const deleteTask = (id, wasDefused) => {
        if (wasDefused) {
            setCongratsReady(true)
            //congratsPlayer.current.stop;
            new Audio(congratsSound).play();
            setTimeout(() => {
                congratsPlayer.current?.play;
            }, 0); 
            
        }
        else {
            const explodeSound = new Audio(detonate);
            explodeSound.play();
            
            //explodeSound.onended();
            setExplodeReady(true)
            //explodePlayer.current.stop;
            setTimeout(() => {
                explodePlayer.current?.play;
                new Audio(killerQueenExplosion).play();
            }, 800); 
        }
        const todoToDelete = todos.find(todo => todo.id === id);
        fetch(`https://localhost:7144/Todo/${todoToDelete.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todoToDelete),
        })
            .then(data => {
                console.log('Todo deleted', data);
                const todosAfterDelete = todos.filter(todo => todo.id !== id);
                setTodos(todosAfterDelete);
            })
            .catch(error => {
                console.error('Error:', error);
            });

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
        setCurrentDate(new Date());
    }, []);

    const sortedTodos = [...todos].sort((a, b) => a.urgency - b.urgency);
    //setTodos(sortedTodos);


    return (
        <div className="bg-neutral-900 min-h-screen">
            {congratsReady && (
                <Lottie className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-500 h-200 position: absolute z-10 pointer-events-none top: explosionPosition.top + window.scrollY," lottieRef={animation => {
                    congratsPlayer.current = animation;
                }} loop={false} animationData={congratsAnim} onComplete={() => setCongratsReady(false)}></Lottie>
            )}
            {explodeReady && (
                <Lottie className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-600 h-300 position: absolute z-10 pointer-events-none" lottieRef={animation => {
                    explodePlayer.current = animation;
                }} loop={false} animationData={explodeAnim} onComplete={() => setExplodeReady(false)}></Lottie>
            )}
            <div className="flex flex-col justify-start items-center position: relative">
                <header>
                    <h1 className="text-3xl font-bold text-white">Do It Or Explode!</h1>
                </header>

                <div className="pt-5 flex flex-col items-center">
                    {sortedTodos.map(todo => (
                        <div key={todo.id} className="flex items-center">
                            <button className="mr-10 w-30 h-16 text-1xl bg-neutral-900 font-bold text-white rounded hover:bg-neutral-800" onClick={() => deleteTask(todo.id, true)}>Defuse Task ✅</button>
                            <div className={`mb-10 bg-${explosivity}-900 w-150 h-42 rounded hover:bg-${explosivity}-800`}>
                                <div className="flex items-center">
                                    <span className="ml-2 mt-2 font-bold text-white">Name</span>
                                    <input className={`ml-2 mt-2 w-50 h-8 bg-${explosivity}-600 rounded hover:bg-${explosivity}-500 font-bold text-white`} type="text" value={todo.name} onChange={(e) => handleInputChange(todo.id, 'name', e.target.value)} onBlur={() => editTodo(todo.id)}></input>
                                </div>
                                <div className="flex items-center">
                                    <span className="ml-2 mt-2 font-bold text-white">Description</span>
                                    <input className={`ml-2 mt-2 w-100 h-8 bg-${explosivity}-600 rounded hover:bg-${explosivity}-500 font-bold text-white`} type="text" value={todo.description} onChange={(e) => handleInputChange(todo.id, 'description', e.target.value)} onBlur={() => editTodo(todo.id)}></input>
                                </div>
                                <div className="flex items-center">
                                    <span className="ml-2 mt-2 font-bold text-white">Due Date</span>
                                    <DatePicker className={`ml-2 mt-2 w-75 h-8 bg-${explosivity}-600 rounded hover:bg-${explosivity}-500 font-bold text-white`}
                                        dateFormat="yyyy-MM-dd" selected={todo.dueDate ? new Date(todo.dueDate) : null} onChange={(date) => handleInputChange(todo.id, 'dueDate', date)} onBlur={() => editTodo(todo.id)}/>                         
                                </div>
                                <div className="flex items-center">
                                    <span className="ml-2 mt-2 font-bold text-white">Urgency</span>
                                    <select className={`ml-2 mt-2 w-75 h-8 bg-${explosivity}-600 rounded hover:bg-${explosivity}-500 font-bold text-white`} type="text" value={todo.urgency} onChange={(e) => handleInputChange(todo.id, 'urgency', e.target.value)} onBlur={() => editTodo(todo.id)}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </select>                          
                                </div>                       
                            </div>
                            <button className="ml-10 w-30 h-16 text-1xl bg-neutral-900 font-bold text-white rounded hover:bg-neutral-800" onClick={() => deleteTask(todo.id, false)}>Explode Task ❌</button>
                        </div>
                    ))}
                    <button className="mt-4 w-150 h-16 text-3xl bg-neutral-900 font-bold text-white rounded hover:bg-neutral-800" onClick={() => addTask()}>+</button> 
                </div>
            </div>
        </div>
    );
}


export default App