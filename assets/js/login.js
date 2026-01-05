document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("User");
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
  const hasher = (password) => {
    let hashed_password = [];
    for (let i = 0; i < password.length; i++) {
      hashed_password[i] = password[i].codePointAt(0).toString();
    }
    hashed_password = hashed_password.join("");
    return hashed_password;
  };
  const verifier = (email, password) => {
    let local_db = localStorage.getItem("local_db");
    local_db = JSON.parse(local_db);
    let exist = local_db.filter((item) => item.email == email);
    let db_email = exist[0].email;
    let db_password = exist[0].password;
    let hashed_password = hasher(password);
    console.log(hashed_password, db_password);
    if (hashed_password != db_password) {
      return false;
    }
    return true;
  };
  const loginForm = document.querySelector(".login-form");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const msg = document.querySelector("#msg");

    if (!email || !password) {
      msg.classList.remove("success");
      msg.classList.add("error");
      msg.innerHTML = "All fields are required";
    } else if (password.length < 8) {
      msg.classList.remove("success");
      msg.classList.add("error");
      msg.innerHTML = "Password must be at least 8 characters";
    } else if (existChecker(email) == false) {
      msg.classList.remove("success");
      msg.classList.add("error");
      msg.innerHTML = "User not found please check your email";
    } else {
      if (verifier(email, password)) {
        const User = {
          email,
        };
        //saving on local storage
        localStorage.setItem("User", JSON.stringify(User));
        msg.classList.remove("error");
        msg.classList.add("success");
        msg.innerHTML =
          "Succesfully registerd you will be redirected in 3 seconds";
        setTimeout(() => {
          window.location.href = "../../pages/EdirPage.html";
        }, 3000);
      } else {
        msg.classList.remove("success");
        msg.classList.add("error");
        msg.innerHTML = "Invalid credential";
      }
    }
  });
});
