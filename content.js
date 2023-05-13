let startTime;

window.addEventListener("load", () => {
  startTime = new Date().getTime();
});

window.addEventListener("unload", () => {
  const elapsedTime = new Date().getTime() - startTime;
  chrome.runtime.sendMessage({ type: "addTime", elapsedTime });
});
