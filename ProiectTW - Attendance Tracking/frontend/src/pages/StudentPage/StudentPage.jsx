import React, { useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./StudentPage.module.css";

function StudentPage() {
  const [text, setText] = useState("");

  const cookies = new Cookies();
  let userCookie = cookies.get("user");

  const textHandler = (event) => {
    setText(event.target.value);
  };
  const addUserPresentHandler = (e) => {
    e.preventDefault();
    axios
      .get(`http://localhost:8080/api/event/getEventById`, {
        params: { text: text },
      })
      .then((response) => {
        const idEvent = response.data.id;
        axios
          .post(`http://localhost:8080/api/userPresent`, {
            userId: userCookie.id,
            eventId: idEvent,
          })
          .then((res) => {})
          .catch((err) => console.log("Error to addUserPresent:", err));
        console.log(response.data.result);
        if(response.data.result=="No"){
          toast("The event doesn't exist!");
        }
        else if(response.data.result=="isClosed"){
          toast("The event exists but it is closed!");
        }else{
          toast("You have successfully registered!");
        }
        
      })
      .catch((err) => console.log("Error to getEventById:", err));
  };
  return (
    <div className={styles.mainBox}>
      <ToastContainer/>
      <h1>To attend the course, please enter the given code below:</h1>
      <input
        className={styles.input}
        type="text"
        value={text}
        onChange={textHandler}
      />
      <div className={styles.actions}>
        <button className={styles.button} onClick={addUserPresentHandler}>
          Add
        </button>
      </div>
    </div>
  );
}

export default StudentPage;
