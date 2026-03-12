import React from 'react';

const LoginForm = ({ handleGiris, tcNo, setTcNo, sifre, setSifre, hataMesaji, beklemeSuresi, isBanned, onKayitModu }) => {
    return (
        <div className="login-page-wrapper">
            <div className="login-card">
                <div className="hbys-baslik-konteynir">
                    <div className="hbys-ikon">🏥</div>
                    <h1 className="hbys-dev-logo">HBYS</h1>
                    <p className="hbys-alt-metin">Hastane Bilgi Yönetim Sistemi</p>
                </div>
                <form onSubmit={handleGiris} className="login-form">
                    <input
                        type="text"
                        placeholder="T.C. Kimlik No"
                        maxLength="11"
                        value={tcNo}
                        onChange={e => setTcNo(e.target.value)}
                        className="login-input"
                        disabled={isBanned || beklemeSuresi > 0}
                    />
                    <input
                        type="password"
                        placeholder="Şifre"
                        value={sifre}
                        onChange={e => setSifre(e.target.value)}
                        className="login-input"
                        disabled={isBanned || beklemeSuresi > 0}
                    />
                    {hataMesaji && <p className="hata-mesaji-kutusu">{hataMesaji}</p>}
                    <button
                        type="submit"
                        className="login-submit-btn"
                        disabled={isBanned || beklemeSuresi > 0}
                    >
                        {isBanned
                            ? "SİSTEMDEN BANLANDINIZ"
                            : beklemeSuresi > 0
                                ? `Bekleyiniz (${beklemeSuresi}s)`
                                : "Sisteme Giriş"}
                    </button>
                </form>
                <button className="register-action-btn" onClick={onKayitModu}>
                    HASTA KAYDI İÇİN TIKLAYIN
                </button>
            </div>
        </div>
    );
};

export default LoginForm;