import React, { useState } from 'react';

const validateTC = (tc) => {
    if (tc.length !== 11 || tc[0] === '0') return false;
    const digits = tc.split('').map(Number);
    const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
    const digit10 = ((oddSum * 7) - evenSum) % 10;
    const totalSum = digits.slice(0, 10).reduce((a, b) => a + b, 0);
    const digit11 = totalSum % 10;
    return digits[9] === digit10 && digits[10] === digit11;
};

export const Login = ({ 
    handleGiris, tcNo, setTcNo, sifre, setSifre, hataMesaji, 
    kayitModu, setKayitModu, yeniHastaEkle, geriDon, beklemeSuresi, isBanned 
}) => {
    const [kayitAd, setKayitAd] = useState("");
    const [kayitTc, setKayitTc] = useState("");
    const [kayitSifre, setKayitSifre] = useState("");
    const [kayitTelefon, setKayitTelefon] = useState("");
    const [kayitCinsiyet, setKayitCinsiyet] = useState("Erkek");
    const [kayitKanGrubu, setKayitKanGrubu] = useState("A+");
    const [kayitAdres, setKayitAdres] = useState("");
    const [kayitDogumTarihi, setKayitDogumTarihi] = useState("");
    const [kayitHata, setKayitHata] = useState("");

    const handleKayitOlSubmit = async () => {
        setKayitHata("");
        
        // --- KONTROLLER ---
        if (!kayitAd || !kayitTc || !kayitSifre || !kayitTelefon || !kayitAdres) {
            setKayitHata("Lütfen tüm alanları doldurunuz!");
            return;
        }
        if (!validateTC(kayitTc)) return setKayitHata("Geçersiz T.C. Kimlik Numarası!");
        if (kayitSifre.length < 5 || !/[A-Z]/.test(kayitSifre) || !kayitSifre.includes('.')) {
            return setKayitHata("Şifre: En az 5 hane, 1 Büyük Harf ve Nokta (.) içermeli!");
        }

        // --- GÖNDERİM ---
        await yeniHastaEkle({ 
            adSoyad: kayitAd, 
            tcNo: kayitTc, 
            sifre: kayitSifre,
            telefon: kayitTelefon, 
            cinsiyet: kayitCinsiyet, // "Erkek" veya "Kadın" olarak gider, App.jsx'de 'E'/'K' olur
            kanGrubu: kayitKanGrubu, 
            adres: kayitAdres, 
            dogumTarihi: kayitDogumTarihi
        });
    };

    if (kayitModu) {
        return (
            <div className="login-page-wrapper">
                <div className="login-card" style={{ maxWidth: '500px' }}>
                    <h2>Hasta Kayıt İşlemleri</h2>
                    <div className="login-form">
                        <input type="text" placeholder="Ad Soyad" className="login-input" value={kayitAd} onChange={e => setKayitAd(e.target.value)} />
                        <input type="text" placeholder="T.C. Kimlik No" maxLength="11" className="login-input" value={kayitTc} onChange={e => setKayitTc(e.target.value.replace(/\D/g,""))} />
                        <input type="password" placeholder="Şifre" className="login-input" value={kayitSifre} onChange={e => setKayitSifre(e.target.value)} />
                        <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                            <input type="date" className="login-input" value={kayitDogumTarihi} onChange={e => setKayitDogumTarihi(e.target.value)} />
                            <input type="text" placeholder="Telefon" maxLength="11" className="login-input" value={kayitTelefon} onChange={e => setKayitTelefon(e.target.value.replace(/\D/g,""))} />
                        </div>
                        <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                            <select className="login-input" value={kayitCinsiyet} onChange={e => setKayitCinsiyet(e.target.value)}>
                                <option value="Erkek">Erkek</option><option value="Kadın">Kadın</option>
                            </select>
                            <select className="login-input" value={kayitKanGrubu} onChange={e => setKayitKanGrubu(e.target.value)}>
                                <option value="A+">A+</option><option value="A-">A-</option>
                                <option value="B+">B+</option><option value="B-">B-</option>
                                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                <option value="0+">0+</option><option value="0-">0-</option>
                            </select>
                        </div>
                        <textarea placeholder="Adres" className="login-input" style={{ height: '60px' }} value={kayitAdres} onChange={e => setKayitAdres(e.target.value)} />
                        {kayitHata && <p className="hata-mesaji-kutusu">{kayitHata}</p>}
                        {hataMesaji && <p className="hata-mesaji-kutusu">{hataMesaji}</p>}
                        <button type="button" className="login-submit-btn" onClick={handleKayitOlSubmit}>Kaydı Tamamla</button>
                        <button type="button" className="back-link-btn" onClick={geriDon}>← Giriş Ekranına Dön</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page-wrapper">
            <div className="login-card">
                <div className="hbys-baslik-konteynir">
                    <div className="hbys-ikon">🏥</div>
                    <h1 className="hbys-dev-logo">HBYS</h1>
                    <p className="hbys-alt-metin">Hastane Bilgi Yönetim Sistemi</p>
                </div>
                <form onSubmit={handleGiris} className="login-form">
                    <input type="text" placeholder="T.C. Kimlik No" maxLength="11" value={tcNo} onChange={e => setTcNo(e.target.value)} className="login-input" disabled={isBanned || beklemeSuresi > 0} />
                    <input type="password" placeholder="Şifre" value={sifre} onChange={e => setSifre(e.target.value)} className="login-input" disabled={isBanned || beklemeSuresi > 0} />
                    {hataMesaji && <p className="hata-mesaji-kutusu">{hataMesaji}</p>}
                    <button type="submit" className="login-submit-btn" disabled={isBanned || beklemeSuresi > 0}>
                        {isBanned ? "SİSTEMDEN BANLANDINIZ" : beklemeSuresi > 0 ? `Bekleyiniz (${beklemeSuresi}s)` : "Sisteme Giriş"}
                    </button>
                </form>
                <button className="register-action-btn" onClick={() => setKayitModu(true)}>HASTA KAYDI İÇİN TIKLAYIN</button>
            </div>
        </div>
    );
};