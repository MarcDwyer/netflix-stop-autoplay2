import React, { useEffect, useState } from "react";
import { FaPowerOff } from "react-icons/fa/index";
import { Requests, IsExtEnabled } from "../request_types";
import { ActionTypes } from "../action_types";
import "./Popup.scss";

export default function Popup() {
  const [isEnabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: Requests.isEnabled });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      let isResponseAsync = false;

      if ("type" in request) {
        switch (request.type) {
          case Requests.isEnabled:
            let r = request as IsExtEnabled;
            setEnabled(r.payload);
            break;
        }
      }
      return isResponseAsync;
    });
  }, []);
  const enabled = typeof isEnabled === "boolean" && isEnabled;
  return (
    <div className="popupContainer">
      <div className="inner">
        {typeof isEnabled === "boolean" && (
          <FaPowerOff
            className={enabled ? "enabled" : "disabled"}
            onClick={() => {
              const action = { type: ActionTypes.isEnabled };
              chrome.runtime.sendMessage(action);
            }}
          />
        )}
      </div>
    </div>
  );
}
