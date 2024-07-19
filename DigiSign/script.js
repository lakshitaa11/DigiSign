let isDrawing = false;
let lastX = 0;
let lastY = 0;
let undoStack = [];

const colorPicker = document.getElementById("colorPicker");
const canvasColor = document.getElementById("canvasColor");
const canvas = document.getElementById("myCanvas");
const undoButton = document.getElementById("undoButton");
const clearButton = document.getElementById("clearButton");
const saveButton = document.getElementById("saveButton");
const retrieveButton = document.getElementById("retrieveButton");
const fontPicker = document.getElementById("fontPicker");

const ctx = canvas.getContext("2d");

colorPicker.addEventListener("change", (event) => {
  ctx.strokeStyle = event.target.value;
});

canvasColor.addEventListener("change", (event) => {
  ctx.fillStyle = event.target.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  undoStack.push(canvas.toDataURL());
});

canvas.addEventListener("mousedown", (event) => {
  isDrawing = true;
  lastX = event.offsetX;
  lastY = event.offsetY;
});

canvas.addEventListener("mousemove", (event) => {
  if (!isDrawing) return;
  ctx.lineWidth = fontPicker.value;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();
  lastX = event.offsetX;
  lastY = event.offsetY;
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  undoStack.push(canvas.toDataURL());
});

undoButton.addEventListener("click", () => {
  if (undoStack.length > 0) {
    undoStack.pop();
    let img = new Image();
    img.src = undoStack[undoStack.length - 1] || "";
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
});

clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  undoStack.push(canvas.toDataURL());
});

saveButton.addEventListener("click", () => {
  localStorage.setItem("canvasContents", canvas.toDataURL());
  const link = document.createElement("a");
  link.download = "signature.png";
  link.href = canvas.toDataURL();
  link.click();
});

retrieveButton.addEventListener("click", () => {
  const savedCanvas = localStorage.getItem("canvasContents");
  if (savedCanvas) {
    const img = new Image();
    img.src = savedCanvas;
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
});
