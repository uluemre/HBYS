export const HASTANELER = [
    { id: 1, ad: "İstanbul Şehir Hastanesi", il: "İstanbul" },
    { id: 2, ad: "Ankara Merkez Hastanesi", il: "Ankara" },
    { id: 3, ad: "İzmir Eğitim ve Araştırma Hastanesi", il: "İzmir" },
    { id: 4, ad: "Bursa Devlet Hastanesi", il: "Bursa" },
    { id: 5, ad: "Antalya Bölge Hastanesi", il: "Antalya" },
    { id: 6, ad: "Adana Şehir Hastanesi", il: "Adana" },
    { id: 7, ad: "Konya Eğitim Hastanesi", il: "Konya" },
    { id: 8, ad: "Gaziantep Merkez Hastanesi", il: "Gaziantep" },
    { id: 9, ad: "Kocaeli Şehir Hastanesi", il: "Kocaeli" },
    { id: 10, ad: "Samsun Devlet Hastanesi", il: "Samsun" },
];

export const POLIKLINIKLER = [
    "Acil Servis",
    "Dahiliye (İç Hastalıkları)",
    "Göz Hastalıkları",
    "Kulak Burun Boğaz",
    "Kardiyoloji",
    "Ortopedi",
    "Kadın Doğum",
    "Pediatri",
    "Nöroloji",
    "Genel Cerrahi",
    "Üroloji",
    "Göğüs Hastalıkları",
    "Dermatoloji",
    "Psikiyatri",
    "Fizik Tedavi",
    "Enfeksiyon",
    "Endokrinoloji",
    "Gastroenteroloji",
    "Nefroloji",
    "Onkoloji",
];

export const SAAT_SECENEKLERI = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
];

export const BASHEKIM_DEMO_NOBETLERI = [
    { id: 1, doktor: "Dr. Ahmet Acil", poliklinik: "Acil Servis", tarih: "2026-03-12", saat: "08:00 - 16:00", durum: "Planlandı" },
    { id: 2, doktor: "Dr. Ayşe Kurtaran", poliklinik: "Acil Servis", tarih: "2026-03-12", saat: "16:00 - 00:00", durum: "Planlandı" },
    { id: 3, doktor: "Dr. Mehmet İçel", poliklinik: "Dahiliye (İç Hastalıkları)", tarih: "2026-03-13", saat: "09:00 - 17:00", durum: "Onaylı" },
    { id: 4, doktor: "Dr. Ali Bakış", poliklinik: "Göz Hastalıkları", tarih: "2026-03-13", saat: "09:00 - 17:00", durum: "Onaylı" },
    { id: 5, doktor: "Dr. Ömer Kalp", poliklinik: "Kardiyoloji", tarih: "2026-03-14", saat: "09:00 - 17:00", durum: "Planlandı" },
];

export const BASHEKIM_DEMO_SIKAYETLERI = [
    { id: 1, hasta: "Ayşe Demir", konu: "Bekleme Süresi", birim: "Kardiyoloji", tarih: "2026-03-10", durum: "Açık", mesaj: "Randevu saatime rağmen uzun süre bekledim." },
    { id: 2, hasta: "Murat Aydın", konu: "Personel İletişimi", birim: "Acil Servis", tarih: "2026-03-09", durum: "İnceleniyor", mesaj: "Kayıt bölümünde daha yönlendirici bir iletişim beklerdim." },
    { id: 3, hasta: "Elif Çetin", konu: "Temizlik", birim: "Ortopedi", tarih: "2026-03-08", durum: "Çözüldü", mesaj: "Bekleme alanında temizlik daha sık yapılmalı." },
    { id: 4, hasta: "Hakan Yılmaz", konu: "Yönlendirme", birim: "Göz Hastalıkları", tarih: "2026-03-07", durum: "Açık", mesaj: "Poliklinik odalarını bulmakta zorlandım." },
];

export const TETKIK_SABLONLARI = {
    "Dahiliye (İç Hastalıkları)": ["Hemogram", "Biyokimya"],
    "Kardiyoloji": ["Troponin", "EKG Değerlendirme", "Biyokimya"],
    "Göz Hastalıkları": ["Göz Tansiyonu Ölçümü"],
    "Kulak Burun Boğaz": ["CRP", "Tam Kan Sayımı"],
    "Ortopedi": ["Vitamin D", "CRP"],
    "Kadın Doğum": ["Beta HCG", "Hemogram"],
    "Pediatri": ["Hemogram", "CRP"],
    "Nöroloji": ["B12 Vitamini", "Hemogram"],
    "Genel Cerrahi": ["Biyokimya", "Hemogram"],
    "Üroloji": ["Tam İdrar Tahlili", "Biyokimya"],
    "Göğüs Hastalıkları": ["CRP", "Hemogram"],
    "Dermatoloji": ["IgE", "Hemogram"],
    "Psikiyatri": ["B12 Vitamini", "D Vitamini"],
    "Fizik Tedavi": ["D Vitamini", "B12 Vitamini"],
    "Enfeksiyon": ["CRP", "Hemogram"],
    "Endokrinoloji": ["TSH", "Açlık Glukozu"],
    "Gastroenteroloji": ["ALT", "AST", "Biyokimya"],
    "Nefroloji": ["Kreatinin", "Üre"],
    "Onkoloji": ["Biyokimya", "Hemogram"],
    "Acil Servis": ["Hemogram", "CRP"],
};