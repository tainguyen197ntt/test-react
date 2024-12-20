"use client";

import Image from "next/image";
import { Ubuntu } from "next/font/google";
import { useEffect } from "react";
import Link from "next/link";
import React from "react";
const ubuntu_font = Ubuntu({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            console.log("Notification permission granted");
            // Register service worker
            registerServiceWorker();
            const notification = new Notification("Hi there!");
          } else {
            console.error("Notification permission denied");
          }
        })
        .catch((error) => {
          console.error("Error requesting notification permission", error);
        });
    }
  };

  const registerServiceWorker = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );

          return registration;
        })
        .then((registration) => {
          subscribeToPush(registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  };

  const sendData = () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      console.log("Sending data to service worker");
      navigator.serviceWorker.controller.postMessage("Message from /page");
    } else {
      console.log("Service worker not ready");
    }
  };

  const fetchingAPI = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/data`)
      .then((response) => response.json())
      .then((data) => {
        console.log("API data:", data);
      })
      .catch((error) => {
        console.error("Error fetching API data", error);
      });
  };

  const checkApi = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/notification`)
      .then((response) => response.json())
      .then((data) => {
        console.log("API data:", data);
      })
      .catch((error) => {
        console.error("Error fetching API data", error);
      });
  };

  const subscribeToPush = async (registration: any) => {
    const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_KEY as string;
    console.log(
      "Public Vapid Key:",
      process.env.NEXT_PUBLIC_API_URL,
      process.env.NEXT_PUBLIC_VAPID_KEY
    );
    const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
      console.log("Push subscription:", JSON.stringify(subscription));

      // Send subscription to server
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notification/subscribe`, {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error subscribing to push", error);
    }
  };

  const sendApiToNotification = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/notification/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {
        console.error("Error fetching API data", error);
      });
  };

  return (
    <div className={ubuntu_font.className}>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <div
              onClick={requestNotificationPermission}
              className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              Click here to enable notifications
            </div>
            <div className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
              <Link href="/home">Home</Link>
            </div>
            <div
              onClick={sendData}
              className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              Send Data to Service Worker
            </div>
          </div>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <div
              onClick={fetchingAPI}
              className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              Get API
            </div>
          </div>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <div
              onClick={checkApi}
              className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              Check Get API
            </div>
            <div
              onClick={sendApiToNotification}
              className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              Send API to show notification
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
