import { useEffect, useState } from "react";
import type { AppInfo } from "@jarvis/contracts";

export function App(): JSX.Element {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [pong, setPong] = useState<string>("");

  useEffect(() => {
    void window.jarvis.getAppInfo().then(setAppInfo);
  }, []);

  return (
    <div className="flex min-h-full items-center justify-center bg-slate-950 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          Jarvis <span className="text-indigo-400">.</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Base technique operationnelle. Aucune fonctionnalite metier n'est encore
          implementee.
        </p>

        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Application</dt>
            <dd className="font-mono">{appInfo?.name ?? "..."}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Version</dt>
            <dd className="font-mono">{appInfo?.version ?? "..."}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Plateforme</dt>
            <dd className="font-mono">{appInfo?.platform ?? "..."}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => {
            void window.jarvis.ping().then(setPong);
          }}
          className="mt-6 w-full rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Tester le pont IPC
        </button>

        {pong !== "" && (
          <p className="mt-3 text-center text-sm text-emerald-400">
            Reponse du process principal : {pong}
          </p>
        )}
      </div>
    </div>
  );
}
