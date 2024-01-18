import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserPresentItem from "./UserPresentItem";
import styles from "./CardEvent2.module.css";


function CardEvent2(props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [changeStateButton, setChangeStateButton] = useState(true);
  const [changeStateButtonIsOpen, setChangeStateButtonIsOpen] = useState(true);
  const [stateEvent, setStateEvent] = useState("Loading");
  const [usersSelected, setUsersSelected] = useState("");

  useEffect(() => {
    if (props.eventInputs.isOpen == 1) {
      setStateEvent("Close");
    } else {
      setStateEvent("Open");
    }

    axios
      .get(`http://localhost:8080/api/userPresent`)
      .then((response) => {
        const users = response.data;
        const selectedUsers = users.filter(
          (user) => user.EventId == props.eventInputs.id
        );
        console.log("Verif Aici");
        console.log(props.eventInputs);
        console.log(selectedUsers);
        setUsersSelected(selectedUsers);
      })
      .catch((error) => {
        console.log("Error getUserPresent events:", error);
      });
  }, []);

  const openPopupHandler = () => {
    setIsPopupOpen(true);
  };
  const closePopupHandler = () => {
    setIsPopupOpen(false);
  };
  const deleteEventGroup = () => {
    setChangeStateButton(false);
    axios
      .delete(`http://localhost:8080/api/event/${props.eventInputs.id}`)
      .then((response) => {
        props.deleteEvent(response.data);
      })
      .catch((error) => {
        console.log("Error delete events:", error);
      });
  };

  const changeStateEventHandler = () => {
    setChangeStateButtonIsOpen(false);
    if (stateEvent == "Close") {
      setStateEvent("Open");
      toast("The event closed!");
    } else {
      setStateEvent("Close");
      toast("The event opened!");
    }
    axios
      .patch(`http://localhost:8080/api/event/${props.eventInputs.id}`, {
        isOpen: !props.eventInputs.isOpen,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log("Error axios to updateEvent:" + err));
  };

  const convertToCSV = (objArray) => {
    const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let str = '';

    str += 'Last Name,First Name,Email,Phone\r\n';

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (const index in array[i]) {
        if (line !== '') line += ',';
        line += array[i][index];
      }
      str += line + '\r\n';
    }

    return str;
  };

  const downloadCSV = () => {
    const csvData = convertToCSV(usersSelected);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'users.csv');
    link.click();
  };
  
  return (
    <>
      <div className={styles.transactionBox} onClick={openPopupHandler}>
        <p >{props.eventInputs.name}</p>
        <p >{props.eventInputs.text}</p>

        <button id="buttonBasic" onClick={changeStateEventHandler}>
          {/* {props.eventInputs.isOpen == 1 ? setStateEvent("Close") : setStateEvent("Open")} */}
          {stateEvent}
        </button>
        <button id="buttonBasic" onClick={deleteEventGroup}>Delete</button>
      </div>
      {isPopupOpen && changeStateButton && (
        <div className={styles.popupContainer}>
          <div className={styles.modal}>
            <div className={styles.box}>
              <p className={styles.numeEvent}>{props.eventInputs.name}</p>
              <div className={styles.closeIcon}>
                <FontAwesomeIcon
                  className={styles.iconStyle}
                  icon={faXmark}
                  onClick={closePopupHandler}
                />
              </div>
            </div>
            <div className={styles.table}>
              <div className={styles.tableName}>
                <div className={styles.tableCell}>Last Name</div>
                <div className={styles.tableCell}>First Name</div>
                <div className={styles.tableCell}>Email</div>
                <div className={styles.tableCell}>Contact</div>
              </div>

              {usersSelected !== null ? (
                usersSelected.map((user) => (
                  <UserPresentItem key={user.id} user={user} />
                ))
              ) : (
                <h2 className={styles.titleForNoCompanies}>
                  Found no companies!
                </h2>
              )}


            </div>
            <button className={styles.exportCSV} onClick={downloadCSV}>Export as CSV</button>

          </div>
        </div>
      )}
    </>
  );
}

export default CardEvent2;
