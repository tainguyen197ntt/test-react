"use client";

import React from "react";

interface ComponentNameProps {
  // Define your props here
}

const ComponentName: React.FC<ComponentNameProps> = ({ props }) => {
  const registerServiceWorker = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker-1.js")
        .then((registration) => {
          console.log(
            "NEW Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  };

  const sendData = () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      console.log("Sending data to service worker");
      navigator.serviceWorker.controller.postMessage("Message from /HOME");
    } else {
      console.log("Service worker not ready");
    }
  };

  React.useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <div>
      <h1>ComponentName</h1>
      <p>This is a generated component.</p>
      <div>
        <button onClick={sendData}>Send Data</button>
      </div>
    </div>
  );
};

export default ComponentName;
