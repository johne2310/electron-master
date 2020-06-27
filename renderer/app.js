//Modules
const { ipcRenderer } = require("electron");
const items = require("./items");

//Dom nodes
let showModal = document.getElementById("show-modal"),
  closeModal = document.getElementById("close-modal"),
  modal = document.getElementById("modal"),
  addItem = document.getElementById("add-item"),
  itemUrl = document.getElementById("url"),
  search = document.getElementById("search"),
  itemsList = document.getElementsByClassName("read-item");

//filter items with 'search'
search.addEventListener("keyup", e => {
  Array.from(itemsList).filter(item => {
    //hide items that don't match search value
    // console.log("Search value: ", search.value);
    let hasMatch = item.innerText.toLowerCase().match(search.value);
    item.style.display = hasMatch ? "flex" : "none";
  });
});

document.addEventListener("keyup", e => {
  if (e.key === "Escape") {
    Array.from(document.getElementsByClassName("read-item")).forEach(item => {
      //show all items
      item.style.display = "flex";
      search.value = "";
    });
  }
});

//Navigate item selection using up/down arrows
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    items.changeSelection(e.key);
  }
});

//toggle modal buttons
const toggleModalButtons = () => {
  //check state of buttons
  if (addItem.disabled === true) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = "Add item";
    closeModal.style.display = "inline";
  } else {
    addItem.disabled = true;
    addItem.style.opacity = "0.5";
    addItem.innerText = "Adding...";
    closeModal.style.display = "none";
  }
};

//Show modal
showModal.addEventListener("click", e => {
  modal.style.display = "flex";
  itemUrl.focus();
});

//Hide modal
closeModal.addEventListener("click", e => {
  modal.style.display = "none";
});

//Handle new item
addItem.addEventListener("click", e => {
  //check a url exists
  if (itemUrl.value) {
    //send new item url to main process
    ipcRenderer.send("new-item", itemUrl.value);
    //disable buttons
    toggleModalButtons();
  }
});

//listen for new item from main process
ipcRenderer.on("new-item-success", (e, newItem) => {
  //display page details
  items.addItem(newItem, true);

  // enable buttons
  toggleModalButtons();
  //close modal and reset itemUrl
  modal.style.display = "none";
  itemUrl.value = "";
});

// handle enter key
itemUrl.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    addItem.click();
  }
});
