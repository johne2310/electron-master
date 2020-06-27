// module.exports = () => {

let readitClose = document.createElement("button");

readitClose.innerText = "Done";

// style the button
readitClose.style.position = "fixed";
readitClose.style.bottom = "15px";
readitClose.style.right = "15px";
readitClose.style.padding = "5px 10px";
readitClose.style.fontSize = "20px";
readitClose.style.fontWeight = "bold";
readitClose.style.background = "dodgerblue";
readitClose.style.color = "white";
readitClose.style.borderRadius = "1px";
readitClose.style.cursor = "default";
readitClose.style.boxShadow = "2px 2px 2px rgba(0,0,0,0.2)";

// // attach click listener to button
readitClose.onclick = e => {
  console.log("Done with item: ", e);
  alert("Hello from ReaderJS");
  console.log("Test");
  // Message parent (opener) window
  // window.opener.postMessage("item-done", "*");
};

// append to body tag

document.getElementsByTagName("body")[0].appendChild(readitClose);

// };
