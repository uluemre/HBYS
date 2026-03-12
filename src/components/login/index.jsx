import React from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export const Login = ({
    handleGiris, tcNo, setTcNo, sifre, setSifre, hataMesaji,
    kayitModu, setKayitModu, yeniHastaEkle, geriDon, beklemeSuresi, isBanned
}) => {
    console.log("kayitModu:", kayitModu);

    if (kayitModu === true) {
        console.log("REGISTER FORM RENDER EDİLİYOR");
        return (
            <RegisterForm
                yeniHastaEkle={yeniHastaEkle}
                hataMesaji={hataMesaji}
                onGeriDon={geriDon}
            />
        );
    }

    return (
        <LoginForm
            handleGiris={handleGiris}
            tcNo={tcNo}
            setTcNo={setTcNo}
            sifre={sifre}
            setSifre={setSifre}
            hataMesaji={hataMesaji}
            beklemeSuresi={beklemeSuresi}
            isBanned={isBanned}
            onKayitModu={() => {
                console.log("kayitModu set ediliyor");
                setKayitModu(true);
            }}
        />
    );
};