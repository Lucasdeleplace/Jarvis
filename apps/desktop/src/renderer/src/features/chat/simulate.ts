/**
 * Simulation de reponses de l'assistant (aucune IA reelle).
 * Genere un contenu Markdown plausible puis le diffuse token par token.
 */

const CODE_SAMPLE = `\`\`\`typescript
// Exemple genere par la simulation
function saluer(nom: string): string {
  return \`Bonjour \${nom} !\`;
}

console.log(saluer("Jarvis"));
\`\`\``;

const GENERIC_RESPONSES: readonly string[] = [
  "Voici une reponse **simulee**. Aucune IA reelle n'est branchee pour le moment.",
  "Bonne question ! Je fonctionne actuellement en mode **demonstration**, sans modele reel.",
  "Compris. Ceci est une reponse generee localement pour tester le systeme de conversation.",
];

function pick<T>(items: readonly T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index] as T;
}

/** Construit une reponse Markdown en fonction du message de l'utilisateur. */
export function simulateResponse(prompt: string): string {
  const trimmed = prompt.trim();
  const wantsCode = /code|fonction|exemple|typescript|javascript|snippet/i.test(trimmed);

  const parts: string[] = [];
  parts.push(pick(GENERIC_RESPONSES));

  if (trimmed.length > 0) {
    parts.push(`\nVous avez ecrit : « ${trimmed.slice(0, 200)} ».`);
  }

  parts.push(
    [
      "\n### Ce que je pourrais faire (plus tard)",
      "- Discuter avec un vrai modele local (Ollama)",
      "- Rechercher dans vos fichiers",
      "- Automatiser des taches",
    ].join("\n"),
  );

  if (wantsCode) {
    parts.push("\nVoici un exemple de code :\n" + CODE_SAMPLE);
  }

  parts.push(
    [
      "\n| Fonction | Statut |",
      "| --- | --- |",
      "| Streaming | Actif |",
      "| Markdown | Actif |",
      "| IA reelle | A venir |",
    ].join("\n"),
  );

  return parts.join("\n");
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = (): void => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * Diffuse le texte fourni token par token via `onToken`.
 * S'interrompt proprement si le signal est declenche.
 */
export async function streamText(
  fullText: string,
  onToken: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const tokens = fullText.match(/\s+|\S+/g) ?? [fullText];
  for (const token of tokens) {
    try {
      await delay(12 + Math.random() * 34, signal);
    } catch {
      return;
    }
    if (signal?.aborted) return;
    onToken(token);
  }
}
