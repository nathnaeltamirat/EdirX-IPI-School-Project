import { edir } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const manageModal = document.getElementById("manageModal");
  const container = document.getElementById("container");
  const addBtn = document.querySelector(".add-edir-btn");
  const modal = document.getElementById("edirModal");
  const cancel = document.querySelectorAll(".cancel-btn");
  const create = document.querySelector(".create-btn");
  const manageEdir = document.querySelector(".manage");
  const removeEdir = document.querySelector(".remove");
  //requesting and making it active or in active
  removeEdir.addEventListener("click", () => {
    let message = removeEdir.innerText;
    let msg1 = document.getElementById("msg1");
    let id = parseInt(removeEdir.dataset.id);
    console.log(id);
    if (message == "Delete") {
      let edir = JSON.parse(localStorage.getItem("edir"));
      let user = JSON.parse(localStorage.getItem("User"));
      let active = user.active;
      console.log(edir);
      edir.splice(id, 1);
      if (parseInt(active) == parseInt(id)) {
        user = { ...user, active: false };
        localStorage.setItem("User", JSON.stringify(user));
      }
      localStorage.setItem("edir", JSON.stringify(edir));
      msg1.innerText = "Edir is successfully deleted";
      msg1.classList.remove("error");
      msg1.classList.add("success");
      setTimeout(() => {
        manageModal.style.display = "none";
        msg1.innerText = "";
        populateEdirs(false, null);
      }, 2000);
    } else if (message == "Leave edir") {
      let edir = JSON.parse(localStorage.getItem("edir"));
      let user = JSON.parse(localStorage.getItem("User"));
      let active = user.active;

      if (parseInt(active) == parseInt(id)) {
        user = { ...user, active: false };
        localStorage.setItem("User", JSON.stringify(user));
      }
      let curr_edir = edir[id];
      let modified_memabers = curr_edir.meambers.filter(
        (item) => item != user.email
      );
      curr_edir.meambers = modified_memabers;
      edir[id] = curr_edir;
      console.log(edir);
      updateEdirs(edir);
      msg1.innerText = "Left the Edir successfully";
      msg1.classList.remove("error");
      msg1.classList.add("success");
      setTimeout(() => {
        manageModal.style.display = "none";
        msg1.innerText = "";
        populateEdirs(false, null);
      }, 2000);
    }
  });
  manageEdir.addEventListener("click", () => {
    let id = parseInt(removeEdir.dataset.id);
    let msg1 = document.getElementById("msg1");
    let message = manageEdir.innerText;
    if (message == "Activate Edir") {
      let user = JSON.parse(localStorage.getItem("User"));
      user = { ...user, active: manageEdir.dataset.id };
      localStorage.setItem("User", JSON.stringify(user));
      msg1.innerText = "Edir is successfully activated";
      msg1.classList.remove("error");
      msg1.classList.add("success");
      setTimeout(() => {
        manageModal.style.display = "none";
        manageEdir.innerText = "Inactivate Edir";
        msg1.innerText = "";
      }, 2000);
    } else if (message == "Request to join edir") {
      console.log(manageEdir.dataset.id);
      const date = new Date();
      let edir = JSON.parse(localStorage.getItem("edir"));
      let user = JSON.parse(localStorage.getItem("User"));
      console.log("edir", edir);

      let new_edir = edir[id];
      let found = false;
      for (let i = 0; i < new_edir.requests.length; i++) {
        if (user.email == new_edir.requests[i].email) {
          found = true;
        }
      }
      if (found) {
        msg1.innerText = "Request was sent before";
        msg1.classList.remove("success");
        msg1.classList.add("error");
        setTimeout(() => {
          manageModal.style.display = "none";
          manageEdir.innerText = "Activate Edir";
          msg1.innerText = "";
        }, 2000);
        return;
      }
      new_edir.requests.push({ email: user.email, timestamp: date });

      edir[id] = new_edir;
      updateEdirs(edir);
      msg1.innerText = "Request sent";
      msg1.classList.remove("error");
      msg1.classList.add("success");
      console.log(edir);
      setTimeout(() => {
        manageModal.style.display = "none";
        manageEdir.innerText = "Activate Edir";
        msg1.innerText = "";
      }, 2000);
    } else if (message == "Inactivate Edir") {
      let user = JSON.parse(localStorage.getItem("User"));
      user = { ...user, active: false };
      localStorage.setItem("User", JSON.stringify(user));
      msg1.innerText = "Edir is successfully deactivated";
      msg1.classList.remove("error");
      msg1.classList.add("success");

      setTimeout(() => {
        manageModal.style.display = "none";
        manageEdir.innerText = "Activate Edir";
        msg1.innerText = "";
      }, 2000);
    }
  });
  //displaying
  container.addEventListener("click", (event) => {
    let article = event.target.closest("article");
    if (article) {
      manageModal.style.display = "flex";
      const curr_email = JSON.parse(localStorage.getItem("User")).email;
      const owner = article.dataset.owner;
      const meambers = JSON.parse(article.dataset.meambers);
      const id = article.dataset.id;
      console.log(curr_email == meambers[0]);
      if (meambers.includes(curr_email)) {
        const user = JSON.parse(localStorage.getItem("User"));
        removeEdir.classList.add("red");
        removeEdir.classList.add("btn");
        if (parseInt(user.active) == parseInt(id)) {
          manageEdir.innerText = "Inactivate Edir";
        } else {
          manageEdir.innerText = "Activate Edir";
        }

        if (owner == curr_email) {
          removeEdir.innerText = "Delete";
        } else {
          removeEdir.innerText = "Leave edir";
        }
        manageEdir.dataset.id = id;
        removeEdir.dataset.id = id;
      } else {
        console.log("not in");
        let removeEdir = document.querySelector(".remove");
        manageEdir.innerText = "Request to join edir";
        removeEdir.innerHTML = "";
        removeEdir.classList.remove("red");
        removeEdir.classList.remove("btn");
        manageEdir.dataset.id = id;
        removeEdir.dataset.id = id;
      }
    }
  });

  //searching edir
  const search = document.querySelector("#search");
  search.addEventListener("click", () => {
    let name = document.querySelector("#search_input").value;
    if (name == "") {
      populateEdirs(false, null);
    } else {
      let edir = getEdirs();
      const new_edir = edir.filter((item) => {
        return item.name.toLowerCase().startsWith(name.toLowerCase());
      });
      populateEdirs(true, new_edir);
      if (new_edir.length == 0) {
        let not_found = document.createElement("img");
        not_found.classList.add("not_found");
        not_found.src = "../assets/images/404.png";
        console.log(not_found);
        document.getElementById("container").appendChild(not_found);
      }
    }
  });

  //managing create edir
  addBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });
  cancel.forEach((item) => {
    item.addEventListener("click", (e) => {
      modal.style.display = "none";
      manageModal.style.display = "none";
    });
  });

  create.addEventListener("click", () => {
    let edir_name = document.querySelector("#edir_name").value;
    let edir_description = document.querySelector("#edir_description").value;
    console.log(edir_name);
    let msg = document.querySelector("#msg");
    if (edir_name == "" || edir_description == "") {
      msg.classList.remove("success");
      msg.classList.add("error");
      msg.innerText = "Please fill all the required fields";
    } else {
      let curr_edir = getEdirs();
      let email = JSON.parse(localStorage.getItem("User")).email;
      let new_edir = {
        owner: email,
        name: edir_name.toLowerCase(),
        description: edir_description,
        events: [],
        meambers: [email],
        requests: [],
      };
      curr_edir.push(new_edir);
      updateEdirs(curr_edir);
      msg.classList.remove("errror");
      msg.classList.add("success");
      msg.innerText = "Succesfully created new Edir";
      setTimeout(() => {
        populateEdirs(false, null);
        modal.style.display = "none";
      }, 3000);
    }
  });

  //populating edir
  const populateEdirs = (searchable, data) => {
    console.log("container", container);
    let edir;
    if (searchable == true) {
      edir = data;
    } else {
      edir = getEdirs();
    }
    container.innerHTML = "";
    console.log(edir);
    for (let i = 0; i < edir.length; i++) {
      let article = document.createElement("article");
      let figure = document.createElement("figure");
      let figCaption = document.createElement("figcaption");
      let img_link = getRandomImage();
      let img = document.createElement("img");
      img.src = img_link;
      img.alt = "Image edir";
      figCaption.innerText = edir[i].name;
      article.dataset.meambers = JSON.stringify(edir[i].meambers);
      article.dataset.owner = edir[i].owner;
      article.dataset.id = i;
      figure.appendChild(img);
      figure.appendChild(figCaption);
      article.appendChild(figure);
      container.appendChild(article);
    }
  };

  //geting random image
  const getRandomImage = () => {
    const images = [
      "../assets/images/random_images_edir/image1.png",
      "../assets/images/random_images_edir/image2.png",
      "../assets/images/random_images_edir/image3.png",
      "../assets/images/random_images_edir/image4.png",
      "../assets/images/random_images_edir/image5.png",
    ];
    const index = Math.floor(Math.random() * 5);
    return images[index];
  };

  //getting edir from localstorage
  const getEdirs = () => {
    let stored = localStorage.getItem("edir");
    if (stored) return JSON.parse(stored);
    localStorage.setItem("edir", JSON.stringify(edir));
    return [...edir];
  };

  //updating edir
  const updateEdirs = (new_edir) => {
    localStorage.setItem("edir", JSON.stringify(new_edir));
  };

  populateEdirs(false, null);
});
