import { getKey } from "./util";
import { ActionTypes } from "./action_types";
import { Requests, IsExtEnabled } from "./request_types";

export type StopAutoplay = boolean | undefined;

let stopAutoplay = getKey<StopAutoplay>("stopAutoplay");

if (stopAutoplay === undefined) {
  stopAutoplay = true;
  chrome.storage.sync.set({ stopAutoplay: true });
}

function setIcon() {
  if (typeof stopAutoplay === "boolean") {
    if (!stopAutoplay) {
      chrome.browserAction.setIcon({
        path: "icon_red.png",
      });
    } else {
      chrome.browserAction.setIcon({
        path: "icon_green.png",
      });
    }
  }
}
setIcon();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // onMessage must return "true" if response is async.
  let isResponseAsync = false;

  if ("type" in request) {
    switch (request.type) {
      case ActionTypes.isEnabled:
        stopAutoplay = !stopAutoplay;
        chrome.storage.sync.set({ stopAutoplay });
        chrome.runtime.sendMessage({
          type: Requests.isEnabled,
          payload: stopAutoplay,
        });
        setIcon();
        break;
      case Requests.isEnabled:
        const p: IsExtEnabled = {
          type: Requests.isEnabled,
          payload: stopAutoplay,
        };
        if (sender.tab && sender.tab.id) {
          chrome.tabs.sendMessage(sender.tab.id, p);
          return;
        }
        chrome.runtime.sendMessage(p);
        break;
      default:
        console.log("Default case ran");
    }
  }

  return isResponseAsync;
});
