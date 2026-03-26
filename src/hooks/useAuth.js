import { useState, useEffect } from "react";
import { apiLogin, apiGetMe, apiRegister } from "../api";

const MAX_DENEME = 3;

const parseApiPayload = (raw) => raw?.data ?? raw;

export const buildKullaniciFromMe = ({ me, rol, fallbackId, fallbackTc }) => ({
    id: me?.id ?? fallbackId ?? null,
    rol,
    tc: me?.tcNo ?? fallbackTc ?? null,
    adSoyad: me?.adSoyad || "—",
    cinsiyet: me?.cinsiyet || null,
    kanGrubu: me?.kanGrubu || null,
    telefon: me?.telefon || null,
    adres: me?.adres || null,
    dogumTarihi: me?.dogumTarihi || null,
    unvan: me?.unvan || (rol === "BASHEKIM" ? "Başhekim" : null),
    brans: me?.brans || me?.uzmanlikAlani || null,
    uzmanlikAlani: me?.uzmanlikAlani || null,
    poliklinikIsmi:
        me?.poliklinikIsmi || me?.poliklinik_adi || me?.uzmanlikAlani || null,
    iseGirisTarihi: me?.iseGirisTarihi || me?.ise_giris_tarihi || null,
    muayeneUcreti: me?.muayeneUcreti ?? null,
    gorev: me?.gorev || null,
    birimId: me?.birimId || me?.birim_id || null,
    birimAdi: me?.birimAdi || me?.birim_adi || null,
    poliklinikId: me?.poliklinikId || me?.poliklinik_id || null,
    vardiya: me?.vardiya || null,
    mesaiBaslangic: me?.mesaiBaslangic || me?.mesai_baslangic || null,
    mesaiBitis: me?.mesaiBitis || me?.mesai_bitis || null,
    durum: me?.durum || null,
    gunlukGorevler: me?.gunlukGorevler || [],
});

export function useAuth() {
    const [girisYapanKullanici, setGirisYapanKullanici] = useState(null);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [tcNo, setTcNo] = useState("");
    const [sifre, setSifre] = useState("");
    const [hataMesaji, setHataMesaji] = useState("");
    const [kayitModu, setKayitModu] = useState(false);
    const [denemeSayisi, setDenemeSayisi] = useState(0);
    const [isBanned] = useState(
        localStorage.getItem("system_ban") === "true"
    );
    const [beklemeSuresi, setBeklemeSuresi] = useState(() => {
        const saved = localStorage.getItem("lock_until");
        if (saved) {
            const kalan = Math.round((parseInt(saved) - Date.now()) / 1000);
            return kalan > 0 ? kalan : 0;
        }
        return 0;
    });

    // Otomatik giriş (token varsa)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setYukleniyor(false);
            return;
        }

        const decodeToken = (t) => {
            try {
                return JSON.parse(atob(t.split(".")[1]));
            } catch {
                return null;
            }
        };

        const payload = decodeToken(token);
        if (!payload) {
            localStorage.removeItem("token");
            setYukleniyor(false);
            return;
        }

        apiGetMe(payload.rol)
            .then((raw) => {
                const kisi = parseApiPayload(raw);
                if (kisi) {
                    setGirisYapanKullanici(
                        buildKullaniciFromMe({
                            me: kisi,
                            rol: payload.rol,
                            fallbackId: payload.id || payload.sub,
                            fallbackTc: payload.tcNo,
                        })
                    );
                }
            })
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setYukleniyor(false));
    }, []);

    // Bekleme geri sayımı
    useEffect(() => {
        if (beklemeSuresi <= 0) return;
        const timer = setInterval(() => {
            setBeklemeSuresi((prev) => {
                if (prev <= 1) {
                    localStorage.removeItem("lock_until");
                    setHataMesaji("");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [beklemeSuresi]);

    const handleGiris = async (e) => {
        if (e) e.preventDefault();
        setHataMesaji("");

        try {
            const rawLogin = await apiLogin(tcNo, sifre);
            const loginData = parseApiPayload(rawLogin);
            const loginSuccess = rawLogin?.success ?? false;
            const token = loginData?.token;
            const rol = loginData?.rol;

            if (loginSuccess && token && rol) {
                setDenemeSayisi(0);
                localStorage.setItem("token", token);

                const rawMe = await apiGetMe(rol);
                const kisi = parseApiPayload(rawMe);

                setGirisYapanKullanici(
                    buildKullaniciFromMe({
                        me: kisi,
                        rol,
                        fallbackId: loginData?.id,
                        fallbackTc: loginData?.tcNo || tcNo,
                    })
                );
            } else {
                const yeniDeneme = denemeSayisi + 1;
                const kalan = MAX_DENEME - yeniDeneme;
                setDenemeSayisi(yeniDeneme);

                if (kalan > 0) {
                    setHataMesaji(`❌ Hatalı T.C. veya şifre. Kalan hak: ${kalan}`);
                } else {
                    setHataMesaji("⛔ 3 kez hatalı giriş. 120 saniye bekleyiniz.");
                    localStorage.setItem("lock_until", (Date.now() + 120000).toString());
                    setBeklemeSuresi(120);
                    setDenemeSayisi(0);
                }
            }
        } catch {
            setHataMesaji("Bağlantı hatası.");
        }
    };

    const yeniHastaEkle = async (veri) => {
        setHataMesaji("");
        const kayitPaketi = {
            adSoyad: veri.adSoyad,
            tcNo: veri.tcNo,
            sifre: veri.sifre,
            telefon: veri.telefon,
            cinsiyet: veri.cinsiyet === "Erkek" ? "E" : "K",
            kanGrubu: veri.kanGrubu,
            adres: veri.adres,
            dogumTarihi: veri.dogumTarihi,
            rol: "HASTA",
        };

        try {
            const response = await apiRegister(kayitPaketi);
            const text = await response.text();

            if (response.ok) {
                alert("✅ Kayıt Başarılı!");
                setKayitModu(false);
                setTcNo(veri.tcNo);
            } else {
                let hata = "Kayıt hatası.";
                try {
                    hata = JSON.parse(text).message || hata;
                } catch { }
                setHataMesaji(`❌ ${hata}`);
            }
        } catch {
            setHataMesaji("❌ Bağlantı hatası.");
        }
    };

    const cikisYap = () => {
        localStorage.removeItem("token");
        setGirisYapanKullanici(null);
    };

    return {
        girisYapanKullanici,
        setGirisYapanKullanici,
        yukleniyor,
        tcNo, setTcNo,
        sifre, setSifre,
        hataMesaji, setHataMesaji,
        kayitModu, setKayitModu,
        beklemeSuresi,
        isBanned,
        handleGiris,
        yeniHastaEkle,
        cikisYap,
    };
}