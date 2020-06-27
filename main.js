// Modules
const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron");
const windowStateKeeper = require("electron-window-state");
const readItem = require("./readItem");
// const readerJS = require("./renderer/readerJS");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let readerWindow;

nativeTheme.themeSource = "light";

//listen for new item request
ipcMain.on("new-item", (e, itemUrl) => {
  //get new item and send to renderer
  readItem(itemUrl, item => {
    e.sender.send("new-item-success", item);
  });
});

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  let state = windowStateKeeper({
    defaultWidth: 500,
    defaultHeight: 650
  });

  mainWindow = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    minWidth: 350,
    maxWidth: 650,
    minHeight: 300,
    webPreferences: { nodeIntegration: true, enableRemoteModule: true }
  });

  readerWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 350,
    maxWidth: 2000,
    maxHeight: 2000,
    minHeight: 300,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false
    }
  });

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile("renderer/main.html");
  // readerWindow.loadURL("https://electronjs.org");

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  //manage window state
  state.manage(mainWindow);

  // Listen for window being closed
  mainWindow.on("closed", () => {
    mainWindow = null;

    // if main window closes, then also close readerWindow
    readerWindow.close();
    readerWindow = null;
  });

  //listen for close event and hide window, rather than destroying
  readerWindow.on("close", e => {
    e.preventDefault();
    readerWindow.hide();
  });
}

// Electron `app` is ready
app.on("ready", () => {
  console.log("App is ready");
  createWindow();
});

// Quit when all windows are closed - (Not macOS - Darwin)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

ipcMain.on("show-window", (event, contentURL, readerJS) => {
  readerWindow.loadURL(contentURL);
  readerWindow.show();

  // event.reply("reader-loaded");
  // readerWindow.webContents.executeJavaScript("alert('hello from ipcMain')");
  // console.log("readerJS: ", readerJS);
  readerWindow.webContents
    .executeJavaScript('{ document.createElement("div") }')
    .catch(e => {
      console.log("button error: ", e.message);
    });
});
