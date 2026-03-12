import React from 'react';

export const PatientProfileInfo = ({ hasta }) => (
    <div className="profile-card-container">
        <div className="profile-header-main">
            <div className="profile-avatar-large">👤</div>
            <h3>{hasta.adSoyad || hasta.hastaAdSoyad || "Hasta Bilgisi Yok"}</h3>
            <span className="badge-rol">{hasta.rol === 'PERSONEL' ? 'PERSONEL PROFİLİ' : 'HASTA PROFİLİ'}</span>
        </div>
        <div className="profile-grid">
            <div className="profile-item"><strong>Ad Soyad</strong> <span>{hasta.adSoyad || hasta.hastaAdSoyad}</span></div>
            <div className="profile-item"><strong>T.C. Kimlik</strong> <span>{hasta.tc}</span></div>
            {hasta.rol === 'PERSONEL' ? (
                <>
                    <div className="profile-item"><strong>Telefon</strong> <span>{hasta.telefon || "Bilgi Yok"}</span></div>
                    <div className="profile-item"><strong>Rol</strong> <span>{hasta.rol}</span></div>
                    <div className="profile-item"><strong>İşe Giriş Tarihi</strong> <span>{hasta.iseGirisTarihi || "Belirtilmemiş"}</span></div>
                </>
            ) : (
                <>
                    <div className="profile-item"><strong>Cinsiyet</strong> <span>{hasta.cinsiyet === 'E' ? 'Erkek' : 'Kadın'}</span></div>
                    <div className="profile-item"><strong>Kan Grubu</strong> <span>{hasta.kanGrubu || "Belirtilmemiş"}</span></div>
                    <div className="profile-item"><strong>Telefon</strong> <span>{hasta.telefon || "Bilgi Yok"}</span></div>
                    <div className="profile-item full-width"><strong>Adres</strong> <span>{hasta.adres || "Bilgi Yok"}</span></div>
                </>
            )}
        </div>
    </div>
);

export const DoctorProfileInfo = ({ doktor }) => (
    <div className="profile-card-container doctor-theme">
        <div className="profile-header-main">
            <div className="profile-avatar-large">👨‍⚕️</div>
            <h3>{doktor.adSoyad || doktor.doktorAdSoyad || "Doktor Bilgisi Yok"}</h3>
            <span className="badge-rol">SAĞLIK PERSONELİ</span>
        </div>
        <div className="profile-grid">
            <div className="profile-item"><strong>Ad Soyad</strong> <span>{doktor.adSoyad || doktor.doktorAdSoyad}</span></div>
            <div className="profile-item"><strong>T.C. Kimlik</strong> <span>{doktor.tc}</span></div>
            <div className="profile-item"><strong>Unvan</strong> <span>{doktor.unvan || "Uzman Doktor"}</span></div>
            <div className="profile-item"><strong>Uzmanlık Alanı</strong> <span>{doktor.uzmanlikAlani || doktor.brans || "Genel Poliklinik"}</span></div>
            <div className="profile-item"><strong>Poliklinik</strong> <span>{doktor.poliklinikIsmi || "Merkez Poliklinik"}</span></div>
            <div className="profile-item"><strong>Kurumsal E-Posta</strong> <span>{doktor.tc}@hastane.com</span></div>
        </div>
    </div>
);