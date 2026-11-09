import React from "react";
export const LEVELS = ["Pré-sélection RH", "Entretien technique", "Décision finale"];
export const today = () => new Date().toLocaleDateString("fr-FR");
export const SEED = {
  users: [
    { id: 1, name: "Administrateur", email: "admin@captalents.fr", pw: "admin123", role: "admin", blocked: false, profile: {} },
    { id: 2, name: "Awa Mensah", email: "awa@exemple.fr", pw: "awa123", role: "candidat", blocked: false, profile: { phone: "+228 90 00 00 00", city: "Lomé", title: "Développeuse front-end", skills: "React, TypeScript, CSS", bio: "Trois ans d’expérience en produits web." } },
  ],
  offers: [
    { id: 1, title: "Développeur React", dept: "Technologie", loc: "Lomé", type: "CDI", desc: "Concevoir et maintenir des interfaces React pour nos clients.", open: true },
    { id: 2, title: "Chargé de recrutement", dept: "Ressources humaines", loc: "Accra", type: "CDD", desc: "Piloter les campagnes de recrutement de bout en bout.", open: true },
    { id: 3, title: "Comptable", dept: "Finance", loc: "Lomé", type: "Stage", desc: "Soutenir l’équipe dans la clôture mensuelle.", open: true },
  ],
  apps: [
    { id: 1, offerId: 1, userId: 2, date: today(), exp: "3 ans", letter: "Je souhaite rejoindre votre équipe technique.", cv: "cv-awa.pdf", level: 1, status: "en_cours", history: [{ level: 0, decision: "Validé", by: "Administrateur", date: today(), note: "Profil solide." }] },
  ],
};
export const load = () => { try { const s = localStorage.getItem("captalents"); return s ? JSON.parse(s) : SEED; } catch (e) { return SEED; } };

export function Field({ label, error, children }) {
  return <div className="f"><label>{label}</label>{children}{error && <div className="err" role="alert">{error}</div>}</div>;
}
export const statusTag = (a) => a.status === "acceptee" ? <span className="tag o">Acceptée</span> : a.status === "rejetee" ? <span className="tag b">Refusée</span> : <span className="tag w">En cours · {LEVELS[a.level]}</span>;
export function Track({ a }) {
  return <div className="track" aria-label="Niveaux de validation">{LEVELS.map((l, i) => {
    const cls = a.status === "acceptee" || i < a.level ? "done" : i === a.level ? (a.status === "rejetee" ? "no" : "cur") : "";
    return <div key={l} className={cls}>{l}</div>;
  })}</div>;
}
