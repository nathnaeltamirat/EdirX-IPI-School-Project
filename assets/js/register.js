document.addEventListener("DOMContentLoaded", () => {
  const signInfForm = document.querySelector(".signInfForm");
  signInfForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const full_name = document.querySelector("#full_name").value;
    const dob = document.querySelector("#dob").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const passwordAgain = document.querySelector("#passwordAgain").value;
    const phone_number = document.querySelector("#phone_number").value;
    const id_document = document.querySelector("#id_document").value;
    const msg = document.querySelector("#msg");
    let young = false;
    const birth_date = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birth_date.getFullYear();
    const month = today.getMonth() - birth_date.getMonth();
    const day = today.getDay() - birth_date.getDay();
    
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
    }
    const User = {
      full_name,
      dob,
      email,
      phone_number,
      id_document,
    };

    //saving on local storage
    localStorage.setItem("User", JSON.stringify(User));
    msg.classList.remove("error");
    msg.classList.add("success");
    msg.innerHTML = "Succesfully registerd you will be redirected in 3 seconds";
    setTimeout(() => {
      window.location.href = "../../pages/SignIn.html";
    }, 3000);
  });
});
