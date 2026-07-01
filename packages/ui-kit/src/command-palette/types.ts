import type { LucideIcon } from "lucide-react";

/**
 * Une action executable depuis la palette de commandes.
 * Structure volontairement plate pour rester facilement extensible.
 */
export interface CommandAction {
  /** Identifiant unique et stable. */
  readonly id: string;
  /** Libelle affiche et indexe pour la recherche. */
  readonly label: string;
  /** Groupe d'appartenance (titre de section). Defaut : "Commandes". */
  readonly group?: string;
  /** Termes supplementaires pour ameliorer la recherche floue. */
  readonly keywords?: readonly string[];
  /** Raccourci affiche a droite (ex. ["mod", "K"]). Purement indicatif. */
  readonly shortcut?: readonly string[];
  /** Icone optionnelle (Lucide). */
  readonly icon?: LucideIcon;
  /** Desactive l'action (non selectionnable). */
  readonly disabled?: boolean;
  /** Action executee a la selection. La palette se ferme ensuite. */
  perform(): void | Promise<void>;
}

/** Section de commandes (utilisee pour le rendu groupe). */
export interface CommandActionGroup {
  readonly name: string;
  readonly actions: readonly CommandAction[];
}
