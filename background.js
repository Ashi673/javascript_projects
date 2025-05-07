// Set the alarm when extension is installed or reloaded
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed. Setting alarm...");
    chrome.alarms.create("eatCandyReminder", {
        delayInMinutes: 0.1,        // For testing: triggers after ~6 seconds
        periodInMinutes: 30         // Actual interval for live use
    });
});

// Listen for the alarm and inject overlay into active tab
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "eatCandyReminder") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;
            const tabId = tabs[0].id;

            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: () => {
                    if (document.getElementById("eat-candy-overlay")) return;

                    const overlay = document.createElement("div");
                    overlay.id = "eat-candy-overlay";
                    overlay.style.position = "fixed";
                    overlay.style.top = "0";
                    overlay.style.left = "0";
                    overlay.style.width = "100%";
                    overlay.style.height = "100%";
                    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
                    overlay.style.color = "white";
                    overlay.style.display = "flex";
                    overlay.style.flexDirection = "column";
                    overlay.style.justifyContent = "center";
                    overlay.style.alignItems = "center";
                    overlay.style.fontSize = "2rem";
                    overlay.style.zIndex = "999999";
                    overlay.innerText = "🍬Time to To Eat Candy!";

                    overlay.addEventListener("click", () => {
                        overlay.remove();
                    });

                    document.body.appendChild(overlay);
                }
            });
        });
    }
});
