import { edir } from "./storage.js";
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("User"));
  const active = parseInt(user.active);
  const container_inner = document.querySelector(".container_inner");
  const img = document.querySelector(".container img");
  const edir_name = document.querySelector(".edir_name");
  const edir_description = document.querySelector(".edir_description");
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
  const accept = (person) => {
    const edir = getEdirs();
    const new_edir = edir[active];
    new_edir.meambers.push(person.email);
    console.log("first", new_edir);
    const new_requests = new_edir.requests.filter(
      (item) => item.email != person.email
    );
    console.log("new request", new_requests);
    new_edir.requests = new_requests;
    console.log("new edir", new_edir);
    edir[active] = new_edir;
    updateEdirs(edir);
    populate();
  };
  const remove = (person) => {
    const edir = getEdirs();
    const new_edir = edir[active];
    console.log("first", new_edir);
    const new_requests = new_edir.requests.filter(
      (item) => item.email != person.email
    );
    console.log("new request", new_requests);
    new_edir.requests = new_requests;
    console.log("new edir", new_edir);
    edir[active] = new_edir;
    updateEdirs(edir);
    populate();
  };
  const getEdirs = () => {
    let stored = localStorage.getItem("edir");
    if (stored) return JSON.parse(stored);
    localStorage.setItem("edir", JSON.stringify(edir));
    return [...edir];
  };

  container_inner.addEventListener("click", (e) => {
    let approve = e.target.closest(".approve");
    let decline = e.target.closest(".decline");
    let top = document.querySelector(".top");
    if (approve) {
      let person = JSON.parse(approve.dataset.person);
      accept(person);
      top.classList.add("popup");
      top.classList.add("green");
      top.innerText = "Accepted";
      setTimeout(() => {
        top.classList.remove("popup");
        top.innerText = "";
        top.classList.remove("green");
      }, 3000);
    }
    if (decline) {
      let person = JSON.parse(decline.dataset.person);
      remove(person);
      top.classList.add("popup");
      top.classList.add("red");
      top.innerText = "Declined";
      setTimeout(() => {
        top.classList.remove("popup");
        top.innerText = "";
        top.classList.remove("red");
      }, 3000);
    }
    console.log(approve, decline);
  });

  const getrequest = () => {
    const edir = getEdirs();
    if (edir) {
      return edir[active].requests.reverse();
    }
    return [];
  };

  const populate = () => {
    if (validate() && isAdmin()) {
      let edir = getEdirs()[active];
      edir_name.innerText = edir.name;
      edir_description.innerText = edir.description;
      container_inner.style.display = "block";
      container_inner.innerText = "";
      img.style.display = "none";
      const request = getrequest();
      if (request.length == 0) {
        img.style.display = "block";
        img.src = "../assets/images/completed.png";
        return;
      }
      console.log(request);
      for (let i = 0; i < request.length; i++) {
        let d = new Date(request[i].timestamp);
        d = d.toLocaleDateString();
        let request_card = document.createElement("div");
        let request_info = document.createElement("div");
        request_card.classList.add("request-card");
        request_info.classList.add("request-info");
        request_card.appendChild(request_info);
        let name = document.createElement("span");
        name.innerText = request[i].email;
        name.classList.add("name");
        let time = document.createElement("time");
        time.innerText = d;
        time.classList.add("time");
        request_info.appendChild(name);
        request_info.appendChild(time);
        let actions = document.createElement("div");
        actions.classList.add("actions");
        let approve = document.createElement("button");
        let decline = document.createElement("button");
        approve.dataset.person = JSON.stringify(request[i]);
        decline.dataset.person = JSON.stringify(request[i]);
        approve.innerText = "Approve";
        decline.innerText = "Decline";
        approve.classList.add("approve");
        decline.classList.add("decline");
        actions.appendChild(approve);
        actions.appendChild(decline);
        request_card.appendChild(actions);
        console.log(request_card);
        container_inner.appendChild(request_card);
      }
    } else {
      edir_name.innerText = "";
      edir_name.innerText = "";
      img.style.display = "block";
      img.src = "../assets/images/invalid.png";
      container_inner.style.display = "none";
    }
  };

  const getEvents = () => {
    if (validate()) {
      const edir = getEdirs()[active];
      return edir.events.reverse();
    }
  };
  populate();
});
