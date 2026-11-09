import React, { useState, useEffect } from "react";
import { LEVELS, today, Field, statusTag, Track } from "../shared";

export default function Profil({ db, setDb, user, go, toast }) {
  if (!user) return <div className="card">Connectez-vous pour accéder à votre espace. <button className="btn sm" onClick={() => go("connexion")}>Se connecter</button></div>;
  const [f, setF] = useState({ name: user.name, ...user.profile });
  const fields = ["phone", "city", "title", "skills", "bio"];
  const pct = Math.round((fields.filter(k => (f[k] || "").trim()).length / fields.length) * 100);
  const save = () => { setDb({ ...db, users: db.users.map(u => u.id === user.id ? { ...u, name: f.name, profile: { phone: f.phone, city: f.city, title: f.title, skills: f.skills, bio: f.bio } } : u) }); toast("Profil enregistré"); };
  const L = { phone: "Téléphone", city: "Ville", title: "Intitulé professionnel", skills: "Compétences (séparées par des virgules)" };
  return <div style={{ maxWidth: 640 }}>
    <h1>Mon espace candidat</h1>
    <div className="card" style={{ marginBottom: 14 }}><div className="row sp"><b>Profil complété à {pct} %</b><span className="mut">Un profil complet accélère l’étude de vos dossiers.</span></div><div className="bar" style={{ marginTop: 8 }}><i style={{ width: pct + "%" }} /></div></div>
    <div className="card">
      <Field label="Nom complet"><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></Field>
      {Object.keys(L).map(k => <Field key={k} label={L[k]}><input value={f[k] || ""} onChange={e => setF({ ...f, [k]: e.target.value })} /></Field>)}
      <Field label="Présentation"><textarea rows="4" value={f.bio || ""} onChange={e => setF({ ...f, bio: e.target.value })} /></Field>
      <button className="btn" onClick={save}>Enregistrer le profil</button>
    </div>
  </div>;
}
