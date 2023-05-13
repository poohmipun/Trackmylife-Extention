let timerId;
let startTime;
let elapsedTime = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message);
  if (message.type === "startTimer" && !timerId) {
    // check if timer is already running
    startTime = new Date().getTime() - elapsedTime;
    timerId = setInterval(updateTime, 1000);
  } else if (message.type === "stopTimer" && timerId) {
    clearInterval(timerId);
    timerId = null;
    elapsedTime = new Date().getTime() - startTime;
  } else if (message.type === "resetTimer") {
    clearInterval(timerId);
    timerId = null;
    elapsedTime = 0;
    document.getElementById("timer").textContent = "00:00:00"; // reset timer display
  }
});

function updateTime() {
  console.log("Updating time...");
  const currentTime = new Date().getTime();
  elapsedTime = currentTime - startTime;
  const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
  const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
  const timeString = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  chrome.runtime.sendMessage({ type: "updateTime", timeString });
  if (timerId) {
    window.requestAnimationFrame(updateTime);
  }
}
