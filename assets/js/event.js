import { edir } from "./storage.js";
document.addEventListener("DOMContentLoaded", () => {
  const img = document.querySelector(".container img");
  const event = document.querySelector(".event");
  const edir_name = document.querySelector(".event .edir_name");
  const edir_description = document.querySelector(".event p");
  const user = JSON.parse(localStorage.getItem("User"));
  const inner_event = document.querySelector(".inner_event");
  const inp = document.querySelector(".send-event input");
  const btn = document.querySelector(".send-event button");
  const active = user.active;
  const validate = () => {
    const edir = getEdirs();
    return active && parseInt(active) < edir.length;
  };
  const updateEdirs = (new_edir) => {
    localStorage.setItem("edir", JSON.stringify(new_edir));
  };
  const getEdirs = () => {
    let stored = localStorage.getItem("edir");
    if (stored) return JSON.parse(stored);
    localStorage.setItem("edir", JSON.stringify(edir));
    return [...edir];
  };
  const getEvents = () => {
    if (validate()) {
      const edir = getEdirs()[active];
      return edir.events.reverse();
    }
  };

  const sendEvent = (text) => {
    const edir = getEdirs();
    const curr_edir = edir[active];
    const email = user.email;
    const time = new Date();
    curr_edir.events.push({
      event: text,
      timestamp: time,
      email: email,
    });
    edir[active] = curr_edir;
    updateEdirs(edir);
    populate();
  };
  btn.addEventListener("click", () => {
    let value = inp.value;
    if (value) {
      sendEvent(value);
      inp.value = "";
    }
  });
  const populate = () => {
    if (validate()) {
      inner_event.innerText = "";
      const edir = getEdirs()[active];
      edir_name.innerText = edir.name;
      edir_description.innerText = edir.description;
      img.style.display = "none";
      event.style.display = "block";
      const events = getEvents();
      for (let i = 0; i < events.length; i++) {
        let d = new Date(events[i].timestamp);
        d = d.toLocaleDateString();
        let event_list = document.createElement("div");
        event_list.classList.add("event_list");
        let event_item = document.createElement("div");
        event_item.classList.add("event-item");
        let text = document.createElement("span");
        text.innerText = events[i].event;
        let sub_text = document.createElement("small");
        sub_text.innerText = `${d} by ${events[i].email} `;
        event_item.appendChild(text);
        event_item.appendChild(sub_text);
        event_list.appendChild(event_item);
        inner_event.appendChild(event_list);
      }
    } else {
      event.style.display = "none";
      img.style.display = "block";
    }
  };
  populate();

  console.log(validate());
});
