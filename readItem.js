//Modules
const { BrowserWindow } = require("electron");

let offScreenWindow;

//Export readItem function
module.exports = (url, callback) => {
  // creat offscreen window
  offScreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true,
      nodeIntegration: false //set to false by default for security
    }
  });

  //load item url
  offScreenWindow.loadURL(url);

  //wait for content to finish loading
  offScreenWindow.webContents.on("did-finish-load", e => {
    //get page title
    let title = offScreenWindow.getTitle();

    //get screenshot (thumbnail)
    offScreenWindow.webContents.capturePage().then(image => {
      //get image as dataURL
      let screenshot = image.toDataURL();

      //Execute callback with new item object
      callback({ title, screenshot, url });

      //clean up
      offScreenWindow.close();
      offScreenWindow = null;
    });
  });
};
