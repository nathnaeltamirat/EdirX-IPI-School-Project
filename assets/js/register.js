document.addEventListener("DOMContentLoaded", () => {
  const incryptSaver = (email, password) => {
    let hashed_password = [];
    for (let i = 0; i < password.length; i++) {
      hashed_password[i] = password[i].codePointAt(0).toString();
    }
    hashed_password = hashed_password.join("");
    let local_db = localStorage.getItem("local_db");
    if (local_db) {
      local_db = JSON.parse(local_db);
      let new_user = {
        email: email,
        password: hashed_password,
      };
      local_db.push(new_user);
      localStorage.setItem("local_db", JSON.stringify(local_db));
    } else {
      let new_user = {
        email: email,
        password: hashed_password,
      };
      local_db = [new_user];
      localStorage.setItem("local_db", JSON.stringify(local_db));
    }
  };
  let existChecker = (email) => {
    let local_db = localStorage.getItem("local_db");
    if (local_db) {
      local_db = JSON.parse(local_db);
      let exist = local_db.filter((item) => item.email == email);
      console.log(exist);
      if (exist.length == 0) {
        console.log("inside 0 length");
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };
  let signInfForm = document.querySelector(".signInfForm");
  signInfForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let full_name = document.querySelector("#full_name").value;
    let dob = document.querySelector("#dob").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    let passwordAgain = document.querySelector("#passwordAgain").value;
    let phone_number = document.querySelector("#phone_number").value;
    let id_document = document.querySelector("#id_document").value;
    let msg = document.querySelector("#msg");
    let young = false;
    let birth_date = new Date(dob);
    let today = new Date();
    let age = today.getFullYear() - birth_date.getFullYear();
    let month = today.getMonth() - birth_date.getMonth();
    let day = today.getDay() - birth_date.getDay();

    if (month < 0 || (month == 0 && day < 0)) {
      age--;
    }
    if (age < 18) {
      young = true;
    }

    if (
      !full_name ||
      !dob ||
      !email ||
      !password ||
      !passwordAgain ||
      !phone_number ||
      !id_document
    ) {
      msg.classList.remove("success");
      msg.classList.add("error");
      msg.innerHTML = "All fields are required";
    } else if (password.length < 8) {
      msg.classList.remove("success");
      msg.classList.add("error");
      msg.innerHTML = "Password must be at least 8 characters";
    } else if (password != passwordAgain) {
      msg.classList.remove("success");
      msg.classList.add("error");
      msg.innerHTML = "Password must match";
    } else if (young == true) {
      msg.classList.remove("success");
      msg.classList.add("error");
      msg.innerHTML = "Not old enough";
    } else if (existChecker(email) == true) {
      msg.classList.remove("success");
      msg.classList.add("error");
      msg.innerHTML = "User already exist";
    } else {
      let User = {
        full_name,
        dob,
        email,
        phone_number,
        id_document,
      };
      incryptSaver(email, password);
      //saving on local storage
      localStorage.setItem("User", JSON.stringify(User));
      msg.classList.remove("error");
      msg.classList.add("success");
      msg.innerHTML =
        "Succesfully registerd you will be redirected in 3 seconds";
      setTimeout(() => {
        const repoName = window.location.pathname.split("/")[1]; // get repo folder
        window.location.href = `/${repoName}/pages/SignIn.html`;
      }, 3000);
    }
  });
});
