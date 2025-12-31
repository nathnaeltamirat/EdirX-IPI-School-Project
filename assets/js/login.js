document.addEventListener("DOMContentLoaded", () => {
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
    } else {
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
        window.location.href = "../../pages/ManagerDashboard.html";
      }, 3000);
    }
  });
});
