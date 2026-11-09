import React, { useState, useEffect } from "react";
import { LEVELS, today, Field, statusTag, Track } from "../shared";

export default function Connexion({ db, setDb, setUid, go, toast }) {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", pw: "" });
  const [err, setErr] = useState("");
  const submit = () => {
    if (mode === "login") {
      const u = db.users.find(x => x.email === f.email.trim() && x.pw === f.pw);
      if (!u) return setErr("E-mail ou mot de passe incorrect.");
      if (u.blocked) return setErr("Ce compte est suspendu. Contactez l’administration.");
      setUid(u.id); go(u.role === "admin" ? "admin" : "profil");
    } else {
      if (f.name.trim().length < 3 || !/^\S+@\S+\.\S+$/.test(f.email) || f.pw.length < 6) return setErr("Nom, e-mail valide et mot de passe de 6 caractères minimum requis.");
      if (db.users.some(x => x.email === f.email)) return setErr("Cette adresse e-mail est déjà utilisée.");
      const u = { id: Date.now(), name: f.name, email: f.email, pw: f.pw, role: "candidat", blocked: false, profile: {} };
      setDb({ ...db, users: [...db.users, u] }); setUid(u.id); toast("Compte créé"); go("profil");
    }
  };
  return <div className="card" style={{ maxWidth: 420, margin: "20px auto" }}>
    <div className="tabs"><button className={"btn sm " + (mode === "login" ? "" : "sec")} onClick={() => { setMode("login"); setErr(""); }}>Connexion</button><button className={"btn sm " + (mode === "signup" ? "" : "sec")} onClick={() => { setMode("signup"); setErr(""); }}>Créer un compte</button></div>
    {mode === "signup" && <Field label="Nom complet"><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></Field>}
    <Field label="E-mail"><input type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></Field>
    <Field label="Mot de passe" error={err}><input type="password" value={f.pw} onChange={e => setF({ ...f, pw: e.target.value })} /></Field>
    <button className="btn" style={{ width: "100%" }} onClick={submit}>{mode === "login" ? "Se connecter" : "Créer mon compte"}</button>
    <p className="mut" style={{ marginTop: 14, fontSize: ".82rem" }}>Comptes de démonstration : admin@captalents.fr / admin123 · awa@exemple.fr / awa123</p>
  </div>;
}
