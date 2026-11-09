import React, { useState, useEffect } from "react";
import { LEVELS, today, Field, statusTag, Track } from "../shared";

export default function Candidater({ db, setDb, user, offerId, go, toast }) {
  const offer = db.offers.find(o => o.id === offerId);
  const [step, setStep] = useState(0);
  const p = user ? user.profile : {};
  const [f, setF] = useState({ name: user ? user.name : "", email: user ? user.email : "", phone: p.phone || "", exp: "", letter: "", cv: "", ok: false });
  const [err, setErr] = useState({});
  if (!offer) return <div className="card">Choisissez d’abord une offre dans la liste. <button className="btn sm" onClick={() => go("offres")}>Voir les offres</button></div>;
  if (!user) return <div className="card"><p>Connectez-vous pour postuler à « {offer.title} ».</p><button className="btn" onClick={() => go("connexion")}>Se connecter</button></div>;
  if (db.apps.some(a => a.offerId === offer.id && a.userId === user.id)) return <div className="card"><p>Vous avez déjà postulé à cette offre.</p><button className="btn" onClick={() => go("suivi")}>Suivre ma candidature</button></div>;
  const set = (k, v) => setF({ ...f, [k]: v });
  const check = () => {
    const e = {};
    if (step === 0) { if (f.name.trim().length < 3) e.name = "Saisissez votre nom complet."; if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Adresse e-mail invalide."; if (f.phone.trim().length < 6) e.phone = "Saisissez un numéro de téléphone."; }
    if (step === 1) { if (!f.exp) e.exp = "Indiquez votre expérience."; if (f.letter.trim().length < 30) e.letter = "Rédigez au moins 30 caractères."; }
    if (step === 2) { if (!f.cv) e.cv = "Ajoutez votre CV."; if (!f.ok) e.ok = "Confirmez l’exactitude des informations."; }
    setErr(e); return Object.keys(e).length === 0;
  };
  const next = () => { if (check()) { if (step < 2) setStep(step + 1); else submit(); } };
  const submit = () => {
    const a = { id: Date.now(), offerId: offer.id, userId: user.id, date: today(), exp: f.exp, letter: f.letter, cv: f.cv, level: 0, status: "en_cours", history: [] };
    setDb({ ...db, apps: [...db.apps, a] }); toast("Candidature envoyée"); go("suivi");
  };
  return <div style={{ maxWidth: 640 }}>
    <h1>Candidature : {offer.title}</h1>
    <div className="steps">{["Identité", "Parcours", "Dossier"].map((s, i) => <div key={s} className={i === step ? "on" : ""}>{s}</div>)}</div>
    <div className="card">
      {step === 0 && <>
        <Field label="Nom complet" error={err.name}><input value={f.name} onChange={e => set("name", e.target.value)} /></Field>
        <div className="two"><Field label="E-mail" error={err.email}><input type="email" value={f.email} onChange={e => set("email", e.target.value)} /></Field>
        <Field label="Téléphone" error={err.phone}><input value={f.phone} onChange={e => set("phone", e.target.value)} /></Field></div></>}
      {step === 1 && <>
        <Field label="Expérience" error={err.exp}><select value={f.exp} onChange={e => set("exp", e.target.value)}><option value="">Choisir…</option><option>Moins d’1 an</option><option>1 à 3 ans</option><option>3 à 5 ans</option><option>Plus de 5 ans</option></select></Field>
        <Field label="Lettre de motivation" error={err.letter}><textarea rows="6" value={f.letter} onChange={e => set("letter", e.target.value)} /></Field></>}
      {step === 2 && <>
        <Field label="CV (PDF)" error={err.cv}><input type="file" accept=".pdf,.doc,.docx" onChange={e => set("cv", e.target.files[0] ? e.target.files[0].name : "")} /></Field>
        <Field error={err.ok}><label><input style={{ width: "auto", marginRight: 8 }} type="checkbox" checked={f.ok} onChange={e => set("ok", e.target.checked)} />Je confirme l’exactitude de ces informations</label></Field></>}
      <div className="row sp">
        <button className="btn sec" disabled={step === 0} onClick={() => setStep(step - 1)}>Retour</button>
        <button className="btn" onClick={next}>{step < 2 ? "Continuer" : "Envoyer ma candidature"}</button>
      </div>
    </div>
  </div>;
}
