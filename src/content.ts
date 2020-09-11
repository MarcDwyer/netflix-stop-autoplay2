import { debounce } from "./util";
import { Requests, IsExtEnabled } from "./request_types";

function disableAutoPlay() {
  const url = new URL(document.location.href);
  const { pathname } = url;
  if (pathname.startsWith("/watch")) {
    return;
  }
  const videos = Array.from(document.querySelectorAll("video"));
  for (const video of videos) {
    video.src = "";
  }
}
function setIsEnabled({ payload }: IsExtEnabled) {
  const stopAutoplay = payload;

  if (stopAutoplay) {
    window.addEventListener("DOMContentLoaded", disableAutoPlay);

    document.addEventListener(
      "DOMNodeInserted",
      debounce(disableAutoPlay, 200)
    );
  }
}
chrome.runtime.sendMessage({ type: Requests.isEnabled });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let isResponseAsync = false;

  if ("type" in request) {
    console.log(request);
    switch (request.type) {
      case Requests.isEnabled:
        setIsEnabled(request as IsExtEnabled);
        break;
    }
  }
  return isResponseAsync;
});
