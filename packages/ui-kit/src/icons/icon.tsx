import { forwardRef } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_MAP: Record<IconSize, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 22,
  xl: 28,
};

export interface IconProps extends Omit<LucideProps, "ref" | "size"> {
  /** Composant d'icone Lucide a afficher. */
  readonly icon: LucideIcon;
  /** Taille semantique (jeton) ou valeur libre en pixels. */
  readonly size?: IconSize | number;
  /**
   * Libelle accessible. Si absent, l'icone est purement decorative
   * (aria-hidden) et ignoree par les lecteurs d'ecran.
   */
  readonly label?: string;
}

/**
 * Enveloppe accessible autour des icones Lucide.
 * Gere la taille via des jetons et l'accessibilite (decorative vs signifiante).
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { icon: LucideGlyph, size = "md", label, ...props },
  ref,
) {
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size];
  return (
    <LucideGlyph
      ref={ref}
      size={pixelSize}
      aria-hidden={label === undefined ? true : undefined}
      aria-label={label}
      role={label === undefined ? undefined : "img"}
      {...props}
    />
  );
});
