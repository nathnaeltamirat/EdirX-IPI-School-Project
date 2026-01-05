import { edir } from "./storage.js";
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("User"));
  const active = parseInt(user.active);
  const edir_name = document.querySelector(".edir_name");
  const getEdirs = () => {
    let stored = localStorage.getItem("edir");
    if (stored) return JSON.parse(stored);
    localStorage.setItem("edir", JSON.stringify(edir));
    return [...edir];
  };

  const analytics = () => {
    const edir = getEdirs();
    const total_memabers = edir[active].meambers.length;
    const total_events = edir[active].events.length;
    const total_requests = edir[active].requests.length;
    return {
      total_memabers,
      total_events,
      total_requests,
    };
  };
  const validate = () => {
    const edir = getEdirs();
    const active = user.active;
    return active && parseInt(active) < edir.length;
  };
  const isAdmin = () => {
    const edir = getEdirs();
    return edir[active].owner == user.email;
  };
  const updateEdirs = (new_edir) => {
    localStorage.setItem("edir", JSON.stringify(new_edir));
  };
  const deleteMeamber = (email) => {
    let top = document.querySelector(".top");
    let edir = getEdirs();
    let new_edir = edir[active];
    let persons = new_edir.meambers.filter((item) => item != email);
    new_edir.meambers = persons;
    edir[active] = new_edir;
    updateEdirs(edir);
    top.classList.add("popup");
    top.classList.add("red");
    top.innerText = `${email} removed from the edir`;
    setTimeout(() => {
      top.classList.remove("popup");
      top.innerText = "";
      top.classList.remove("green");
    }, 3000);
    overall_populate(false, null);
  };
  const usermanagmentPopulate = (flag, query) => {
    let ul_container = document.querySelector(".usermanagment .container ul");
    const edir = getEdirs()[active];
    const owner = edir.owner;
    ul_container.innerText = "";
    if (flag == false) {
      let meambers = edir.meambers;

      for (let i = 0; i < meambers.length; i++) {
        let li = document.createElement("li");
        let email = document.createElement("span");
        email.innerText = meambers[i];
        let role = document.createElement("span");
        if (meambers[i] == owner) {
          role.innerText = "Manager";
          li.appendChild(email);
          li.appendChild(role);
          ul_container.appendChild(li);
          continue;
        } else {
          role.innerText = "Meamber";
          let del_button = document.createElement("button");
          del_button.dataset.email = meambers[i];
          del_button.innerText = "Delete";

          li.appendChild(email);
          li.appendChild(role);
          li.appendChild(del_button);
          ul_container.appendChild(li);
        }
      }
    } else {
      let meambers = query;
      console.log(meambers);
      for (let i = 0; i < meambers.length; i++) {
        let li = document.createElement("li");
        let email = document.createElement("span");
        email.innerText = meambers[i];
        let role = document.createElement("span");
        if (meambers[i] == owner) {
          role.innerText = "Manager";
          li.appendChild(email);
          li.appendChild(role);
          ul_container.appendChild(li);
          continue;
        } else {
          role.innerText = "Meamber";
          let del_button = document.createElement("button");
          del_button.dataset.email = meambers[i];
          del_button.innerText = "Delete";

          li.appendChild(email);
          li.appendChild(role);
          li.appendChild(del_button);
          ul_container.appendChild(li);
        }
      }
    }
  };
  const delete_container = document.querySelector(".usermanagment ul");
  delete_container.addEventListener("click", (e) => {
    let deletor = e.target.closest("button");

    if (deletor) {
      let name = deletor.dataset.email;
      console.log(name);
      deleteMeamber(name);
    }
    console.log(deletor);
  });
  const search = document.querySelector("#search");
  search.addEventListener("click", () => {
    let name = document.querySelector("#search_input").value;
    if (name == "") {
      overall_populate(false, null);
    } else {
      let edir = getEdirs()[active];
      let meambers = edir.meambers.filter((item) =>
        item.startsWith(name.toLowerCase())
      );
      if (meambers.length > 0) {
        overall_populate(true, meambers);
      } else {
        overall_populate(true, meambers);
      }
    }
  });

  const overall_populate = (flag, data) => {
    let img = document.querySelector(".container img");
    let container_active = document.querySelector(
      ".container .container_active"
    );
    if (validate() && isAdmin()) {
      edir_name.innerText = getEdirs()[active].name;
      img.style.display = "none";
      container_active.style.display = "block";
      const { total_memabers, total_events, total_requests } = analytics();
      let iterrator = [total_memabers, total_events, total_requests];
      console.log(
        `total event: ${total_events}, total meambers: ${total_memabers},  total requests ${total_requests}`
      );
      let all_p = document.querySelectorAll("main section p");
      console.log(all_p);
      for (let i = 0; i < all_p.length; i++) {
        let curr = all_p[i];
        console.log(iterrator[i]);
        curr.innerText = iterrator[i];
      }
      if (!flag) {
        usermanagmentPopulate(false, null);
      } else {
        usermanagmentPopulate(true, data);
      }
    } else {
      container_active.style.display = "none";
      img.style.display = "block";
      edir_name.innerText = "";
    }
  };
  overall_populate(false, null);
});
