import Nav from "../components/Nav";
import TodoListItem from "../components/TodoListItem";
import AddTask from "../components/AddTask";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthRequired } from "../middlewares/auth_required";
import Script from "next/script";
import { useAppContext } from "../context/AppContext";

export default function Home() {
    useAuthRequired();
    const app = useAppContext();
    const API_BASE_URL = "https://todo-app-csoc.herokuapp.com/";
    const [profileName, setProfileName] = useState("");
    const [avatarImage, setAvatarImage] = useState("");
    const [taskList, setTaskList] = useState([]);

    function getTasks() {
        try {
            iziToast.destroy();
            iziToast.info({
                title: "Welcome",
                message: "Loading all todos"
            });
        } catch (e) {
            iziToast.destroy();
            iziToast.error({
                title: "Error",
                message: "An error occurred"
            });
        }
        axios({
            headers: {
                Authorization: "Token " + app.token
            },
            url: API_BASE_URL + "todo/",
            method: "get"
        })
            .then(function (response) {
                const { data, status } = response;
                setTaskList(data);
                iziToast.destroy();
                iziToast.success({
                    title: "Success",
                    message: "Loaded all todos successfully"
                });
            })
            .catch(function (err) {
                iziToast.destroy();
                iziToast.error({
                    title: "Error",
                    message: "An error occured"
                });
            });
    }

    const addNewTask = task => {
        const temp = [...taskList, task];
        setTaskList(temp);
    };

    const deleteTask = id => {
        let temp = [...taskList];
        temp = temp.filter(task => {
            return task.id != id;
        });
        setTaskList(temp);
    };

    useEffect(async () => {
        if (!app.token) {
            try {
                iziToast.destroy();
                iziToast.error({
                    title: "Unauthorized",
                    message: "You need to login before you can visit."
                });
            } catch (e) {}
            return;
        }
        await axios
            .get(API_BASE_URL + "auth/profile/", {
                headers: {
                    Authorization: "Token " + app.token
                }
            })
            .then(response => {
                setAvatarImage(
                    "https://ui-avatars.com/api/?name=" +
                        response.data.name +
                        "&background=fff&size=33&color=007bff"
                );
                setProfileName(response.data.name);
                getTasks();
            })
            .catch(error => {
                if (typeof document == "object") {
                    iziToast.destroy();
                    iziToast.error({
                        title: "Error",
                        message: "An error occured"
                    });
                }
            });
    }, []);

    return (
        <div>
            <Script src="/iziToast.min.js" />
            <Nav profileName={profileName} avatarImage={avatarImage} page="index" />
            <center>
                <AddTask addNewTask={addNewTask} />
                <ul className="flex-col mt-9 max-w-sm mb-3 ">
                    <span className="inline-block bg-blue-600 py-1 mb-2 px-9 text-sm text-white font-bold rounded-full ">
                        Available Tasks
                    </span>
                    {taskList.map(task => (
                        <TodoListItem
                            task={task.title}
                            id={task.id}
                            key={task.id}
                            deleteTask={deleteTask}
                        />
                    ))}
                </ul>
            </center>
        </div>
    );
}
