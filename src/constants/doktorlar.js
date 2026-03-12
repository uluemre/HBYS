export const DOKTOR_HAVUZU = {
    "Acil Servis": [
        { id: 1, ad: "Dr. Ahmet Acil", unvan: "Uzm. Dr." },
        { id: 2, ad: "Dr. Ayşe Kurtaran", unvan: "Uzm. Dr." },
        { id: 42, ad: "Dr. Selim Aksoy", unvan: "Başhekim" },
    ],
    "Dahiliye (İç Hastalıkları)": [
        { id: 3, ad: "Dr. Mehmet İçel", unvan: "Doç. Dr." },
        { id: 4, ad: "Dr. Fatma Dahil", unvan: "Uzm. Dr." },
    ],
    "Göz Hastalıkları": [
        { id: 5, ad: "Dr. Ali Bakış", unvan: "Prof. Dr." },
        { id: 6, ad: "Dr. Nur Mercek", unvan: "Uzm. Dr." },
    ],
    "Kulak Burun Boğaz": [
        { id: 7, ad: "Dr. Hakan Duygu", unvan: "Doç. Dr." },
        { id: 8, ad: "Dr. Seda Kulak", unvan: "Uzm. Dr." },
    ],
    "Kardiyoloji": [
        { id: 9, ad: "Dr. Ömer Kalp", unvan: "Prof. Dr." },
        { id: 10, ad: "Dr. Arzu Damar", unvan: "Uzm. Dr." },
    ],
    "Ortopedi": [
        { id: 11, ad: "Dr. Kemal Kemik", unvan: "Doç. Dr." },
        { id: 12, ad: "Dr. Sibel Alçı", unvan: "Uzm. Dr." },
    ],
    "Kadın Doğum": [
        { id: 13, ad: "Dr. Zeynep Bebek", unvan: "Prof. Dr." },
        { id: 14, ad: "Dr. Canan Ana", unvan: "Uzm. Dr." },
    ],
    "Pediatri": [
        { id: 15, ad: "Dr. Can Çocuk", unvan: "Prof. Dr." },
        { id: 16, ad: "Dr. Elif Kreş", unvan: "Uzm. Dr." },
    ],
    "Nöroloji": [
        { id: 17, ad: "Dr. Sinan Beyin", unvan: "Doç. Dr." },
        { id: 18, ad: "Dr. Aslı Sinir", unvan: "Uzm. Dr." },
    ],
    "Genel Cerrahi": [
        { id: 19, ad: "Dr. Murat Bıçak", unvan: "Prof. Dr." },
        { id: 20, ad: "Dr. Filiz Neşter", unvan: "Doç. Dr." },
    ],
    "Üroloji": [
        { id: 21, ad: "Dr. Mert Üro", unvan: "Uzm. Dr." },
        { id: 22, ad: "Dr. Selim Böbrek", unvan: "Uzm. Dr." },
    ],
    "Göğüs Hastalıkları": [
        { id: 23, ad: "Dr. Yavuz Nefes", unvan: "Doç. Dr." },
        { id: 24, ad: "Dr. Tülay Akciğer", unvan: "Uzm. Dr." },
    ],
    "Dermatoloji": [
        { id: 25, ad: "Dr. Deniz Cilt", unvan: "Uzm. Dr." },
        { id: 26, ad: "Dr. Ece Deri", unvan: "Uzm. Dr." },
    ],
    "Psikiyatri": [
        { id: 27, ad: "Dr. Özgür Ruh", unvan: "Prof. Dr." },
        { id: 28, ad: "Dr. Melis Terapi", unvan: "Uzm. Dr." },
    ],
    "Fizik Tedavi": [
        { id: 29, ad: "Dr. Burak Fizik", unvan: "Doç. Dr." },
        { id: 30, ad: "Dr. Hale Hareket", unvan: "Uzm. Dr." },
    ],
    "Enfeksiyon": [
        { id: 31, ad: "Dr. Yavuz Mikrop", unvan: "Uzm. Dr." },
        { id: 32, ad: "Dr. Selin Virüs", unvan: "Uzm. Dr." },
    ],
    "Endokrinoloji": [
        { id: 33, ad: "Dr. Levent Hormon", unvan: "Prof. Dr." },
        { id: 34, ad: "Dr. Esra Şeker", unvan: "Uzm. Dr." },
    ],
    "Gastroenteroloji": [
        { id: 35, ad: "Dr. Cem Mide", unvan: "Doç. Dr." },
        { id: 36, ad: "Dr. Sevil Sindirim", unvan: "Uzm. Dr." },
    ],
    "Nefroloji": [
        { id: 37, ad: "Dr. Hasan Böbrek", unvan: "Prof. Dr." },
        { id: 38, ad: "Dr. Derya Nefro", unvan: "Uzm. Dr." },
    ],
    "Onkoloji": [
        { id: 39, ad: "Dr. Berk Tümör", unvan: "Prof. Dr." },
        { id: 40, ad: "Dr. Işıl Terapi", unvan: "Doç. Dr." },
    ],
};

export const DOKTOR_LISTESI = Object.entries(DOKTOR_HAVUZU).flatMap(
    ([poliklinik, liste]) => liste.map((doktor) => ({ ...doktor, poliklinik }))
);