import { edir } from "./storage.js";
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("User"));
  const email_value = document.querySelector("#email_value");
  const msg = document.querySelector("#msg");
  const form = document.querySelector("form");
  const getEdirs = () => {
    let stored = localStorage.getItem("edir");
    if (stored) return JSON.parse(stored);
    localStorage.setItem("edir", JSON.stringify(edir));
    return [...edir];
  };
  const existChecker = (email) => {
    let local_db = localStorage.getItem("local_db");
    if (local_db) {
      local_db = JSON.parse(local_db);
      let exist = local_db.filter((item) => item.email == email);
      console.log(exist);
      if (exist.length == 0) {
        console.log("inside 0 length");
        return false;
      } else {
        console.log("not found");
        return true;
      }
    } else {
      return false;
    }
  };
  const updateEdirs = (new_edir) => {
    localStorage.setItem("edir", JSON.stringify(new_edir));
  };
  const updateUser = (new_email) => {
    let local_db = localStorage.getItem("local_db");
    local_db = JSON.parse(local_db);
    console.log(local_db);
    for (let i = 0; i < local_db.length; i++) {
      if (local_db[i].email == user.email) {
        local_db[i].email = new_email;
      }
    }
    console.log(local_db);
    let new_user = user;
    new_user.email = new_email;
    localStorage.setItem("User", JSON.stringify(new_user));
    localStorage.setItem("local_db", JSON.stringify(local_db));
  };
  const updateEmail = (email) => {
    let prevEmail = user.email;
    const edirs = getEdirs();
    console.log("prevEmail", prevEmail);
    for (let i = 0; i < edirs.length; i++) {
      if (edirs[i].owner == prevEmail) {
        edirs[i].owner = email;
      }
      for (let j = 0; j < edirs[i].meambers.length; j++) {
        if (edirs[i].meambers[j] == prevEmail) {
          edirs[i].meambers[j] = email;
          console.log("inside");
        }
      }
      for (let j = 0; j < edirs[i].requests.length; j++) {
        if (edirs[i].requests[j] == prevEmail) {
          edirs[i].requests[j] = email;
          console.log("inside 1");
        }
      }
    }
    if (existChecker(email)) {
      msg.innerText = "email exist";
      msg.classList.remove("success");
      msg.classList.add("error");
    } else {
      updateEdirs(edirs);
      updateUser(email);
      msg.innerText = "email changed successfully";
      msg.classList.remove("error");
      msg.classList.add("success");
    }
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let value = email_value.value;

    if (value != "" && value.endsWith("@gmail.com")) {
      updateEmail(value);
    } else {
      msg.innerText = "Invalid email";
      msg.classList.remove("success");
      msg.classList.add("error");
    }
  });
  console.log(email_value);
  email_value.value = user.email;
});
