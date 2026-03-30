// src/api/tahlil.js - Bu dosyayı src/api/index.js'e ekleyin veya ayrı import edin

const BASE_URL = "http://192.168.233.106:8081/api";

const authHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const jsonHeaders = () => ({
    "Content-Type": "application/json",
    ...authHeader(),
});

// ─── Doktor: Tahlil İste ──────────────────────────────────────────────────────
export const apiTahlilIste = (randevuId, parametre) =>
    fetch(`${BASE_URL}/tahlil/iste`, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify({ randevuId, parametre }),
    });

// ─── Lab: Sonuç Gir ───────────────────────────────────────────────────────────
export const apiTahlilSonucGir = (tahlilId, sonuc, birim, referans) =>
    fetch(`${BASE_URL}/tahlil/sonuc`, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify({ tahlilId, sonuc, birim, referans }),
    });

// ─── Hasta: Sonuçları Gör ─────────────────────────────────────────────────────
export const apiTahlilSonuclariGetir = () =>
    fetch(`${BASE_URL}/tahlil/sonuclar`, {
        headers: authHeader(),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r)));

// ─── Doktor: Tahlil listesi (randevuya göre bekleyen) ─────────────────────────
export const apiTahlilListesiGetir = () =>
    fetch(`${BASE_URL}/tahlil/liste`, {
        headers: authHeader(),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r)));
