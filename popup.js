let timerId;
let startTime;

function updateTime() {
  console.log("Updating time...");
  const elapsedTime = new Date().getTime() - startTime;
  const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
  const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
  const timeString = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  chrome.runtime.sendMessage({ type: "updateTime", timeString });
}

document.addEventListener("DOMContentLoaded", function () {
  // Initialize the timer display
  updateTime();

  document.getElementById("startBtn").addEventListener("click", (event) => {
    console.log("Sending startTimer message...");
    event.preventDefault();
    chrome.runtime.sendMessage({ type: "startTimer" });
  });

  document.getElementById("pauseBtn").addEventListener("click", (event) => {
    event.preventDefault();
    chrome.runtime.sendMessage({ type: "stopTimer" });
  });

  document.getElementById("resetBtn").addEventListener("click", (event) => {
    event.preventDefault();
    chrome.runtime.sendMessage({ type: "resetTimer" });
    startTime = new Date().getTime(); // reset the start time
    clearInterval(timerId); // stop the timer
    document.getElementById("timer").textContent = "00:00:00"; // update the timer display to show "00:00:00"
  });
});

if (chrome && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "updateTime") {
      const { timeString } = message;
      document.getElementById("timer").textContent = timeString;
    }
  });
}
