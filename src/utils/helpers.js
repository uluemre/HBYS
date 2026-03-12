import { HASTANELER, SAAT_SECENEKLERI } from '../constants/hastaneler';
import { DOKTOR_LISTESI } from '../constants/doktorlar';

export const normalizeText = (text = "") =>
    text
        .toLocaleLowerCase('tr-TR')
        .replaceAll("ı", "i")
        .replaceAll("ğ", "g")
        .replaceAll("ü", "u")
        .replaceAll("ş", "s")
        .replaceAll("ö", "o")
        .replaceAll("ç", "c")
        .trim();

export const formatTarih = (tarihStr) => {
    try {
        return new Date(tarihStr).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    } catch {
        return tarihStr;
    }
};

export const futureDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
};

export const slotSirala = (a, b) => {
    const aDate = new Date(`${a.tarih}T${a.saat}`);
    const bDate = new Date(`${b.tarih}T${b.saat}`);
    return aDate - bDate;
};

export const createInitialSlots = () => {
    const slots = [];
    let id = 1000;

    HASTANELER.forEach((hastane, hIndex) => {
        DOKTOR_LISTESI.forEach((doktor, dIndex) => {
            const gun1 = futureDate(((hIndex + dIndex) % 5) + 1);
            const gun2 = futureDate(((hIndex + dIndex + 2) % 7) + 3);

            const saat1 = SAAT_SECENEKLERI[(doktor.id + hastane.id) % SAAT_SECENEKLERI.length];
            const saat2 = SAAT_SECENEKLERI[(doktor.id + hastane.id + 3) % SAAT_SECENEKLERI.length];

            slots.push({
                id: id++,
                hastaneId: hastane.id,
                doktorId: doktor.id,
                poliklinik: doktor.poliklinik,
                tarih: gun1,
                saat: saat1,
                durum: "MUSAIT",
            });

            slots.push({
                id: id++,
                hastaneId: hastane.id,
                doktorId: doktor.id,
                poliklinik: doktor.poliklinik,
                tarih: gun2,
                saat: saat2,
                durum: ((doktor.id + hastane.id) % 7 === 0) ? "DOLU" : "MUSAIT",
            });
        });
    });

    return slots;
};