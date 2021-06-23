/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import axios from "axios";
// import iziToast from "../static/iziToast.min";

export default function TodoListItem(props) {
    const API_BASE_URL = "https://todo-app-csoc.herokuapp.com/";
    const [task, setTask] = useState(props.task);
    const [editMode, setEditMode] = useState(false);
    const editTask = (id) => {
        setEditMode(true);
    };

    const deleteTask = (id) => {
        axios({
            headers: {
                Authorization: "Token " + localStorage.getItem("token")
            },
            url: API_BASE_URL + "todo/" + id + "/",
            method: "delete"
        })
            .then(function ({ data, status }) {
                props.deleteTask(id);
                iziToast.destroy();
                iziToast.success({
                    title: "Success",
                    message: "Deleted todo"
                });
            })
            .catch(function (error) {
                iziToast.destroy();
                iziToast.error({
                    title: "Error",
                    message: "An error occurred"
                });
            });
    };

    const updateTask = (id) => {
        const todoText = task.trim();
        if (!todoText) {
            iziToast.destroy();
            iziToast.error({
                title: "Error",
                message: "Enter some text"
            });
            return;
        }
        axios({
            headers: {
                Authorization: "Token " + localStorage.getItem("token")
            },
            url: API_BASE_URL + "todo/" + id + "/",
            method: "patch",
            data: { title: todoText }
        })
            .then(function ({ data, status }) {
                setEditMode(false);
                iziToast.destroy();
                iziToast.success({
                    title: "Success",
                    message: "Updated todo"
                });
            })
            .catch(function (err) {
                iziToast.destroy();
                iziToast.error({
                    title: "Error",
                    message: "An error occurred"
                });
            });
    };

    return (
        <>
            <li className="border flex border-gray-500 rounded px-2 py-2 justify-between items-center mb-2">
                <input
                    id={`input-button-${props.id}`}
                    type="text"
                    className={`${
                        editMode ? "" : "hideme"
                    } appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring  todo-edit-task-input`}
                    placeholder="Edit The Task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <div id={`done-button-${props.id}`} className={`${editMode ? "" : "hideme"}`}>
                    <button
                        className="bg-transparent hover:bg-gray-500 text-gray-700 text-sm  hover:text-white py-2 px-3 border border-gray-500 hover:border-transparent rounded todo-update-task"
                        type="button"
                        onClick={() => updateTask(props.id)}>
                        Done
                    </button>
                </div>
                <div
                    id={`task-${props.id}`}
                    className={`todo-task  text-gray-600 ${editMode ? "hideme" : ""}`}>
                    {task}
                </div>
                <span id={`task-actions--${props.id}`} className={`${editMode ? "hideme" : ""}`}>
                    <button
                        style={{ marginRight: "5px" }}
                        type="button"
                        onClick={() => editTask(props.id)}
                        className="bg-transparent hover:bg-yellow-500 hover:text-white border border-yellow-500 hover:border-transparent rounded px-2 py-2">
                        <img
                            src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                            width="18px"
                            height="20px"
                            alt="Edit"
                        />
                    </button>
                    <button
                        type="button"
                        className="bg-transparent hover:bg-red-500 hover:text-white border border-red-500 hover:border-transparent rounded px-2 py-2"
                        onClick={() => deleteTask(props.id)}>
                        <img
                            src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                            width="18px"
                            height="22px"
                            alt="Delete"
                        />
                    </button>
                </span>
            </li>
        </>
    );
}
