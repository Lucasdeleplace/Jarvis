import { useState } from "react";
import { Button, Check, Copy, Icon } from "@jarvis/ui-kit";

export interface CopyButtonProps {
  readonly text: string;
  readonly label?: string;
  readonly className?: string;
}

/** Bouton de copie avec retour visuel temporaire. */
export function CopyButton({ text, label, className }: CopyButtonProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={() => void copy()}
      aria-label={label ?? "Copier"}
    >
      <Icon icon={copied ? Check : Copy} size="xs" />
      {label ? <span>{copied ? "Copie" : label}</span> : null}
    </Button>
  );
}
