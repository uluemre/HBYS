\# HBYS Veri Sözlüğü



Bu döküman, HBYSveritabanındaki tabloların yapısını ve kolon detaylarını içerir.



1\. Tablo: kullanicilar



Sisteme giriş yapan kullanıcı hesaplarını tutar.



| Kolon Adı | Veri Tipi    | Kısıtlamalar | Açıklama                           |

| --------- | ------------ | ------------ | ---------------------------------- |

| id        | SERIAL       | PRIMARY KEY  | Kullanıcı ID                       |

| tc\_no     | VARCHAR(11)  | UNIQUE       | Kullanıcı TC kimlik                |

| sifre     | VARCHAR(255) | NOT NULL     | Şifre (hashlenmeli)                |

| rol       | VARCHAR(20)  | NOT NULL     | Kullanıcı rolü (admin, doktor vb.) |





2\. Tablo: poliklinikler



| Kolon Adı   | Veri Tipi    | Kısıtlamalar | Açıklama       |

| ----------- | ------------ | ------------ | -------------- |

| id          | SERIAL       | PRIMARY KEY  | Poliklinik ID  |

| ad          | VARCHAR(100) | NOT NULL     | Poliklinik adı |

| kat\_bilgisi | INTEGER      | -            | Bulunduğu kat  |

| aciklama    | TEXT         | -            | Açıklama       |





3\. Tablo: doktorlar



| Kolon Adı      | Veri Tipi    | Kısıtlamalar                    | Açıklama                |

| -------------- | ------------ | ------------------------------- | ----------------------- |

| id             | SERIAL       | PRIMARY KEY                     | Doktor ID               |

| ad\_soyad       | VARCHAR(100) | NOT NULL                        | Doktor adı soyadı       |

| uzmanlik\_alani | VARCHAR(100) | -                               | Uzmanlık                |

| poliklinik\_id  | INTEGER      | FOREIGN KEY → poliklinikler(id) | Bağlı olduğu poliklinik |

| unvan          | VARCHAR(50)  | -                               | Ünvan                   |

| tc\_no          | VARCHAR(11)  | UNIQUE                          | TC kimlik               |

| kullanici\_id   | INTEGER      | FOREIGN KEY → kullanicilar(id)  | Giriş hesabı            |





4\. Tablo: hastalar



| Kolon Adı    | Veri Tipi    | Kısıtlamalar                   | Açıklama           |

| ------------ | ------------ | ------------------------------ | ------------------ |

| id           | SERIAL       | PRIMARY KEY                    | Hasta ID           |

| tc\_no        | VARCHAR(11)  | UNIQUE                         | TC kimlik          |

| ad\_soyad     | VARCHAR(255) | NOT NULL                       | Hasta adı soyadı   |

| dogum\_tarihi | DATE         | -                              | Doğum tarihi       |

| cinsiyet     | CHAR(1)      | -                              | E / K              |

| kan\_grubu    | VARCHAR(5)   | -                              | Kan grubu          |

| telefon      | VARCHAR(25)  | -                              | Telefon            |

| adres        | VARCHAR(255) | -                              | Adres              |

| kullanici\_id | INTEGER      | FOREIGN KEY → kullanicilar(id) | Hasta giriş hesabı |





5\. Tablo: randevular



| Kolon Adı      | Veri Tipi   | Kısıtlamalar                | Açıklama              |

| -------------- | ----------- | --------------------------- | --------------------- |

| id             | SERIAL      | PRIMARY KEY                 | Randevu ID            |

| hasta\_id       | INTEGER     | FOREIGN KEY → hastalar(id)  | Randevu sahibi        |

| doktor\_id      | INTEGER     | FOREIGN KEY → doktorlar(id) | Muayene edecek doktor |

| durum          | VARCHAR(20) | -                           | Aktif, iptal vb.      |

| sikayet        | TEXT        | -                           | Şikayet               |

| randevu\_tarihi | DATE        | NOT NULL                    | Randevu tarihi        |

| randevu\_saati  | TIMESTAMP   | NOT NULL                    | Saat                  |





6\. Tablo: yatislar



| Kolon Adı          | Veri Tipi   | Kısıtlamalar                  | Açıklama        |

| ------------------ | ----------- | ----------------------------- | --------------- |

| id                 | SERIAL      | PRIMARY KEY                   | Yatak ID        |

| hasta\_id           | INTEGER     | FOREIGN KEY → hastalar(id)    | Yatan hasta     |

| oda\_no             | VARCHAR(10) | -                             | Oda numarası    |

| yatak\_no           | VARCHAR(10) | -                             | Yatak numarası  |

| yatis\_tarihi       | TIMESTAMP   | -                             | Yatış tarihi    |

| taburcu\_tarihi     | TIMESTAMP   | -                             | Çıkış tarihi    |

| personel\_id | INTEGER     | FOREIGN KEY → personeller(id) | Sorumlu hemşire |





7\. Tablo: personeller



| Kolon Adı        | Veri Tipi    | Kısıtlamalar                   | Açıklama               |

| ---------------- | ------------ | ------------------------------ | ---------------------- |

| id               | SERIAL       | PRIMARY KEY                    | Personel ID            |

| tc\_no            | VARCHAR(11)  | UNIQUE                         | TC kimlik              |

| ad\_soyad         | VARCHAR(100) | NOT NULL                       | Personel adı           |

| telefon          | VARCHAR(15)  | -                              | Telefon                |

| rol              | VARCHAR(50)  | -                              | Hemşire, teknisyen vb. |

| birim\_id         | INTEGER      | -                              | Çalıştığı birim        |

| ise\_giris\_tarihi | DATE         | -                              | İşe giriş              |

| kullanici\_id     | INTEGER      | FOREIGN KEY → kullanicilar(id) | Giriş hesabı           |





8\. Tablo: sikayet\_oneri



| Kolon Adı    | Veri Tipi   | Kısıtlamalar               | Açıklama       |

| ------------ | ----------- | -------------------------- | -------------- |

| id           | SERIAL      | PRIMARY KEY                | Kayıt ID       |

| hasta\_id     | INTEGER     | FOREIGN KEY → hastalar(id) | Şikayet sahibi |

| kategori     | VARCHAR(50) | -                          | Tür            |

| mesaj        | TEXT        | -                          | İçerik         |

| oncelik\_durumu | VARCHAR(20) | -                       |Öncelik sırası |

| tarih        | DATE        | -                          | Tarih          |

| bashekim_cevabi        | TEXT        | -                | Yanıt      |





9\. Tablo: otopark\_kayitlari



| Kolon Adı   | Veri Tipi   | Kısıtlamalar               | Açıklama       |

| ----------- | ----------- | -------------------------- | -------------- |

| id          | SERIAL      | PRIMARY KEY                | Kayıt ID       |

| plaka       | VARCHAR(15) | -                          | Araç plakası   |

| arac\_tipi   | VARCHAR(20) | -                          | Araç tipi      |

| giris\_saati | TIMESTAMP   | -                          | Giriş zamanı   |

| cikis\_saati | TIMESTAMP   | -                          | Çıkış zamanı   |

| hasta\_id    | INTEGER     | FOREIGN KEY → hastalar(id) | İlişkili hasta |





10\. Tablo: tahliller



| Kolon Adı        | Veri Tipi    | Kısıtlamalar                 | Açıklama       |

| ---------------- | ------------ | ---------------------------- | -------------- |

| id               | SERIAL       | PRIMARY KEY                  | Tahlil ID      |

| hasta\_id         | INTEGER      | FOREIGN KEY → hastalar(id)   | Hasta          |

| doktor\_id        | INTEGER      | FOREIGN KEY → doktorlar(id)  | İsteyen doktor |

| tahlil\_adi       | VARCHAR(100) | -                            | Tahlil adı     |

| sonuc\_degeri     | VARCHAR(50)  | -                            | Sonuç          |

| referans\_araligi | VARCHAR(50)  | -                            | Normal değer   |

| tarih            | TIMESTAMP    | -                            | Yapılma zamanı |

| randevu\_id       | INTEGER      | FOREIGN KEY → randevular(id) | Bağlı randevu  |





Genel İlişki Özeti



Kullanıcı → Doktor (1-1)



Kullanıcı → Hasta (1-1)



Kullanıcı → Personel (1-1)



Poliklinik → Doktor (1-N)



Doktor → Randevu (1-N)



Hasta → Randevu (1-N)



Hasta → Tahlil (1-N)



Doktor → Tahlil (1-N)



Randevu → Tahlil (1-N)



Hasta → Yatak (1-N geçmiş kayıt)



Personel → Yatak (1-N)

