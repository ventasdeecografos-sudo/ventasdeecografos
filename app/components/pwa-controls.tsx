"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocale } from "./site-shell";

const INSTALL_DISMISSED_KEY = "ventasdeecografos-install-dismissed";
const INSTALL_DISMISSED_EVENT = "ventasdeecografos-install-dismissed-change";
let installDismissedInMemory = false;

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isIosDevice() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isAppInstalled() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

function subscribeToInstallation(onChange: () => void) {
  const standalone = window.matchMedia("(display-mode: standalone)");
  standalone.addEventListener("change", onChange);
  window.addEventListener("appinstalled", onChange);
  return () => {
    standalone.removeEventListener("change", onChange);
    window.removeEventListener("appinstalled", onChange);
  };
}

function subscribeToPlatform(onChange: () => void) {
  window.addEventListener("orientationchange", onChange);
  return () => window.removeEventListener("orientationchange", onChange);
}

function subscribeToInstallDismissal(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(INSTALL_DISMISSED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(INSTALL_DISMISSED_EVENT, onChange);
  };
}

function subscribeToConnectivity(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

function getIosSnapshot() {
  return isIosDevice();
}

function getDismissalSnapshot() {
  return readInstallDismissal();
}

function getConnectivitySnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return false;
}

function getServerConnectivitySnapshot() {
  return true;
}

function readInstallDismissal() {
  try {
    return (
      installDismissedInMemory ||
      window.localStorage.getItem(INSTALL_DISMISSED_KEY) === "true"
    );
  } catch (error) {
    console.error("Could not read the PWA installation preference.", error);
    return installDismissedInMemory;
  }
}

export function PwaControls() {
  const english = useLocale() === "en";
  const isIos = useSyncExternalStore(subscribeToPlatform, getIosSnapshot, getServerSnapshot);
  const isInstalled = useSyncExternalStore(
    subscribeToInstallation,
    isAppInstalled,
    getServerSnapshot,
  );
  const isDismissed = useSyncExternalStore(
    subscribeToInstallDismissal,
    getDismissalSnapshot,
    getServerSnapshot,
  );
  const isOffline = !useSyncExternalStore(
    subscribeToConnectivity,
    getConnectivitySnapshot,
    getServerConnectivitySnapshot,
  );
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [connectionRestored, setConnectionRestored] = useState(false);

  useEffect(() => {
    let wasOffline = !navigator.onLine;
    const handleOffline = () => {
      wasOffline = true;
      setConnectionRestored(false);
    };
    const handleOnline = () => {
      if (wasOffline) setConnectionRestored(true);
      wasOffline = false;
    };
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      if (!isAppInstalled()) setInstallPrompt(event as InstallPromptEvent);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch((error: unknown) => {
          console.error("Could not register the PWA service worker.", error);
        });
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  function dismissInstallPrompt() {
    installDismissedInMemory = true;
    setShowIosInstructions(false);
    try {
      window.localStorage.setItem(INSTALL_DISMISSED_KEY, "true");
    } catch (error) {
      console.error("Could not save the PWA installation preference.", error);
    }
    window.dispatchEvent(new Event(INSTALL_DISMISSED_EVENT));
  }

  async function installApp() {
    if (!installPrompt) return;
    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (outcome === "dismissed") dismissInstallPrompt();
    } catch (error) {
      console.error("Could not display the PWA installation prompt.", error);
      setInstallPrompt(null);
    }
  }

  if (isOffline || connectionRestored) {
    return (
      <div
        className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[60] mx-auto max-w-xl rounded-2xl border border-blue-200 bg-white p-4 shadow-xl"
        role="status"
        aria-live="polite"
      >
        {isOffline ? (
          <>
            <p className="font-bold text-slate-900">
              {english ? "You are offline" : "Estás sin conexión"}
            </p>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              {english
                ? "The catalog, quotes, contact forms and admin panel need internet. No private information is saved for offline use."
                : "El catálogo actualizado, las cotizaciones, los formularios y el panel requieren Internet. No guardamos información privada para uso sin conexión."}
            </p>
          </>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-800">
              {english
                ? "Connection restored. Refresh to load current information."
                : "Conexión restablecida. Actualiza para cargar información reciente."}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="min-h-11 rounded-full bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800"
              >
                {english ? "Refresh" : "Actualizar"}
              </button>
              <button
                type="button"
                onClick={() => setConnectionRestored(false)}
                aria-label={english ? "Dismiss connection notice" : "Cerrar aviso de conexión"}
                className="min-h-11 min-w-11 rounded-full text-xl text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const canOfferInstall = !isInstalled && !isDismissed && (isIos || installPrompt);
  if (!canOfferInstall) return null;

  return (
    <aside className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[60] mx-auto max-w-xl rounded-2xl border border-blue-100 bg-white p-4 shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-slate-900">
            {english ? "Add ventasdeecografos to your home screen" : "Agrega ventasdeecografos a tu pantalla de inicio"}
          </p>
          {showIosInstructions ? (
            <p className="mt-2 text-sm leading-5 text-slate-600">
              {english
                ? "In Safari, tap Share, then choose “Add to Home Screen”."
                : "En Safari, toca “Compartir” y luego elige “Añadir a pantalla de inicio”."}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={dismissInstallPrompt}
          aria-label={english ? "Dismiss installation notice" : "Cerrar aviso de instalación"}
          className="min-h-11 min-w-11 rounded-full text-xl text-slate-500 hover:bg-slate-100"
        >
          ×
        </button>
      </div>
      <button
        type="button"
        onClick={isIos ? () => setShowIosInstructions((visible) => !visible) : installApp}
        className="mt-3 min-h-11 rounded-full bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800"
      >
        {isIos
          ? english ? "How to install" : "Cómo instalar"
          : english ? "Install app" : "Instalar aplicación"}
      </button>
    </aside>
  );
}
