const BASE_URL = "http://192.168.233.106:8081/api";

const authHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const jsonHeaders = () => ({
    "Content-Type": "application/json",
    ...authHeader(),
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const apiLogin = (tcNo, sifre) =>
    fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tcNo, sifre }),
    }).then((r) => r.json());

export const apiRegister = (kayitPaketi) =>
    fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kayitPaketi),
    });

// ─── Me endpoints ─────────────────────────────────────────────────────────────
const ROL_ENDPOINT = {
    DOKTOR: "/doktorlar/me",
    PERSONEL: "/personeller/me",
    BASHEKIM: "/bashekim/me",
    HASTA: "/hastalar/me",
};

export const apiGetMe = (rol) =>
    fetch(`${BASE_URL}${ROL_ENDPOINT[rol] ?? "/hastalar/me"}`, {
        headers: authHeader(),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r)));

// ─── Randevu ──────────────────────────────────────────────────────────────────
export const apiRandevuOlustur = (randevuPaketi) =>
    fetch(`${BASE_URL}/randevular`, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(randevuPaketi),
    });

// ─── Doktor ───────────────────────────────────────────────────────────────────
export const apiMuayeneUcretiGuncelle = (muayeneUcreti) =>
    fetch(`${BASE_URL}/doktorlar/ucret`, {
        method: "PUT",
        headers: jsonHeaders(),
        body: JSON.stringify({ muayeneUcreti }),
    });

// ─── Otopark ──────────────────────────────────────────────────────────────────
export const apiOtoparkDurum = () =>
    fetch(`${BASE_URL}/otopark/durum`).then((r) => r.json());