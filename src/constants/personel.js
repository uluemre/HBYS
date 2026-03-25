    export const PERSONEL_GOREVLERI = [
  "HEMSIRE",
  "HASTA_KABUL",
  "TIBBI_SEKRETER",
  "HASTA_BAKICI",
  "LABORATUVAR_PERSONELI",
  "RADYOLOJI_TEKNISYENI",
  "TEMIZLIK",
  "GUVENLIK",
  "ARSIV",
  "AMBULANS_SOFORU",
  "OTOPARK_GOREVLISI",
  "DIYETISYEN",
  "PSIKOLOG"
];

export const gorevEtiketi = (gorev) => {
  const map = {
    HEMSIRE: "Hemşire",
    HASTA_KABUL: "Hasta Kabul",
    TIBBI_SEKRETER: "Tıbbi Sekreter",
    HASTA_BAKICI: "Hasta Bakıcı",
    LABORATUVAR_PERSONELI: "Laboratuvar Personeli",
    RADYOLOJI_TEKNISYENI: "Radyoloji Teknisyeni",
    TEMIZLIK: "Temizlik",
    GUVENLIK: "Güvenlik",
    ARSIV: "Arşiv",
    AMBULANS_SOFORU: "Ambulans Şoförü",
    OTOPARK_GOREVLISI: "Otopark Görevlisi",
    DIYETISYEN: "Diyetisyen",
    PSIKOLOG: "Psikolog",
    PERSONEL: "Personel"
  };

  return map[gorev] || gorev || "—";
};