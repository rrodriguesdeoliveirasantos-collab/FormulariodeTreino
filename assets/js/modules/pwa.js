// assets/js/modules/pwa.js

export function setupPWA() {
    const botaoInstalar = document.getElementById("instalarApp");
    let deferredPrompt;

    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (botaoInstalar) botaoInstalar.style.display = "block";
    });

    if (botaoInstalar) {
        botaoInstalar.addEventListener("click", async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log("Resultado:", outcome);
            deferredPrompt = null;
        });
    }

    // Service Worker - caminho ajustado para estar na raiz
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register("/service-worker.js")
            .then(registration => console.log('Service Worker registered:', registration))
            .catch(error => console.error('Service Worker registration failed:', error));
    }
}

export function setupSplash() {
    window.addEventListener("load", () => {
        const splash = document.getElementById("splash-screen");
        const app = document.querySelector(".app");

        if (app) app.style.opacity = "1";
        if (!splash) return;

        setTimeout(() => {
            splash.style.opacity = "0";
            setTimeout(() => splash.style.display = "none", 500);
        }, 1200);
    });
}