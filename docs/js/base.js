// Connexion à Firebase partagée par toutes les pages.
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { getFirestore, connectFirestoreEmulator, doc, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";
export { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
export { doc, collection, onSnapshot, getDoc, getDocs, deleteDoc, writeBatch, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

// En local, on parle aux émulateurs Firebase plutôt qu'au vrai projet.
const local = ["localhost", "127.0.0.1"].includes(location.hostname);
const config = local ? { apiKey: "demo", authDomain: "demo-lucie.firebaseapp.com", projectId: "demo-lucie", appId: "demo" } : firebaseConfig;
function ouvrir(nom) {
  const app = initializeApp(config, nom);
  const auth = getAuth(app), db = getFirestore(app);
  if (local) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "127.0.0.1", 8085);
  }
  return { auth, db };
}
export const { auth, db } = ouvrir();

// La page admin a sa propre connexion, pour ne pas remplacer l'identifiant anonyme du navigateur.
export const espaceAdmin = () => ouvrir("admin");

// Identifiant anonyme du navigateur. Firebase le garde lui même d'une visite à l'autre.
export function connexion() {
  return new Promise((ok, ko) => {
    const stop = onAuthStateChanged(auth, u => {
      stop();
      if (u) ok(u.uid); else signInAnonymously(auth).then(r => ok(r.user.uid), ko);
    }, ko);
  });
}

// Écrit un document en passant par le compteur limites/{uid} (10 écritures par minute).
// faire(tx) fait ses lectures puis renvoie la fonction qui écrit, car une transaction lit avant d'écrire.
export async function ecrire(uid, cible, faire) {
  const lim = doc(db, "limites", uid);
  await runTransaction(db, async tx => {
    const s = await tx.get(lim), l = s.exists() ? s.data() : null;
    const neuf = !l || !l.debut || Date.now() - l.debut.toMillis() > 61000;
    if (!neuf && l.n >= 10) { const e = new Error("trop vite"); e.code = "trop-vite"; throw e; }
    const ecrit = await faire(tx);
    tx.set(lim, { debut: neuf ? serverTimestamp() : l.debut, n: neuf ? 1 : l.n + 1, maj: serverTimestamp(), cible });
    ecrit(tx);
  });
}
