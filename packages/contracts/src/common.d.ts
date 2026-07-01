/**
 * Types transverses partages par l'ensemble des contrats.
 */
/** Resultat explicite (evite les exceptions silencieuses dans le domaine). */
export type Result<T, E = Error> = {
    readonly ok: true;
    readonly value: T;
} | {
    readonly ok: false;
    readonly error: E;
};
/** Identifiant opaque (branded type) pour eviter les melanges d'ids. */
export type Id<TBrand extends string> = string & {
    readonly __brand: TBrand;
};
/** Horodatage ISO 8601. */
export type IsoDateString = string;
/** Niveaux de journalisation supportes. */
export type LogLevel = "error" | "warn" | "info" | "debug";
//# sourceMappingURL=common.d.ts.map