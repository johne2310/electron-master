// DOM nodes
let items = document.getElementById("items"); //see items id from main.html

//Modules
const fs = require("fs");
const { ipcRenderer, BrowserWindow } = require("electron");
const remote = require("electron").remote;

// const readerJS = require("./readerJS");

//Get content from readerJS
let readerJS;
fs.readFile(`${__dirname}/readerJS.js`, (err, data) => {
  readerJS = data.toString();
});

//track items in storage
exports.storage = JSON.parse(localStorage.getItem("readit-items")) || [];

//Listen for done message from readerJS
window.addEventListener("message", e => {
  console.log(e.data);
});

//Persist storage
exports.save = () => {
  localStorage.setItem("readit-items", JSON.stringify(this.storage));
};

//Set item as selected
exports.select = e => {
  //Remove currently selected item class
  document
    .getElementsByClassName("read-item selected")[0]
    .classList.remove("selected");

  //Add to selected class to clicked item
  e.currentTarget.classList.add("selected");
};

//move to newly selected item
exports.changeSelection = direction => {
  //get currently selected item
  let currentItem = document.getElementsByClassName("read-item selected")[0];

  //Handle up/down
  if (direction === "ArrowUp" && currentItem.previousElementSibling) {
    currentItem.classList.remove("selected");
    currentItem.previousElementSibling.classList.add("selected");
  } else if (direction === "ArrowDown" && currentItem.nextElementSibling) {
    currentItem.classList.remove("selected");
    currentItem.nextElementSibling.classList.add("selected");
  }
};

//open selected item
exports.open = () => {
  //only if have items (in case of menu open
  if (!this.storage.length) return;

  //get selected item
  let selectedItem = document.getElementsByClassName("read-item selected")[0];

  //get item's URL
  let contentURL = selectedItem.dataset.url;

  //send message to main process to load URL and show readerWindow
  // ipcRenderer.send("show-window", contentURL, readerJS);
  // readerJS();

  //Open item in proxy BrowserWindow
  let readerWin = window.open(
    contentURL,
    "",
    `
    width=1200,
    height=800,
    maxWidth=2000,
    maxHeight=2000,
    backgroundColor="#DEDEDE",
    nodeIntegration=1,
    contextIsolation=1
  `
  );

  readerWin.eval(readerJS);

  // Open item in proxy BrowserWindow
  // let readerWin = new BrowserWindow({
  //   width: 1200,
  //   height: 800,
  //   maxWidth: 2000,
  //   maxHeight: 2000,
  //   backgroundColor: "#DEDEDE",
  //   webPreferences: {
  //     nodeIntegration: false,
  //     contextIsolation: true,
  //     enableRemoteModule: true
  //   }
  // });
  //
  // readerWin.webContents.on("did-finish-load", () => {
  //   console.log("ready to show");
  //   readerJS();
  //   readerWin.webContents.executeJavaScript("readerJS()").catch(e => {
  //     console.log("readerJS error: ", e.message);
  //   });
  // });
};

ipcRenderer.on("reader-loaded", () => {
  console.log("readerWindow loaded");
  // remote.getCurrentWindow();
});

//Add new item
exports.addItem = (item, isNew = false) => {
  //create DOM node
  let itemNode = document.createElement("div");

  //Assign 'read-item' class
  itemNode.setAttribute("class", "read-item");

  //Set item url as data atttribute
  itemNode.setAttribute("data-url", item.url);

  //add inner  HTML
  itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`;

  //append new node to 'items'
  items.appendChild(itemNode);

  //Attach click handler to select
  itemNode.addEventListener("click", this.select);

  //Attach open to doubleclick handler
  itemNode.addEventListener("dblclick", this.open);

  //If this is the first item in the list then select it
  if (document.getElementsByClassName("read-item").length === 1) {
    itemNode.classList.add("selected");
  }

  //add to storage only if a new item (ie not loading from storage)
  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

//Add items from storage when the app loads
this.storage.forEach(item => {
  this.addItem(item);
});
