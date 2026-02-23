--
-- PostgreSQL database dump
--

\restrict p9jjd0Q5OykVcCIyOsVYnQ60h6CWqLwvRXB11csaotuZrdfW7f4ZoyX2yDn4HNB

-- Dumped from database version 16.12
-- Dumped by pg_dump version 16.12

-- Started on 2026-02-23 10:02:36

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 241 (class 1255 OID 16895)
-- Name: fn_randevu_tamamla(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_randevu_tamamla() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Eğer bir tahlil eklendiyse, ilgili randevunun durumunu güncelle
    UPDATE randevular 
    SET durum = 'Tamamlandı' 
    WHERE id = NEW.randevu_id; -- Yeni eklenen tahlilin randevu_id'sini kullan
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_randevu_tamamla() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16653)
-- Name: doktorlar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doktorlar (
    id integer NOT NULL,
    ad_soyad character varying(100) NOT NULL,
    uzmanlik_alani character varying(100) NOT NULL,
    poliklinik_id integer,
    unvan character varying(50),
    tc_no character(11),
    kullanici_id integer
);


ALTER TABLE public.doktorlar OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16652)
-- Name: doktorlar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doktorlar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doktorlar_id_seq OWNER TO postgres;

--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 219
-- Name: doktorlar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doktorlar_id_seq OWNED BY public.doktorlar.id;


--
-- TOC entry 222 (class 1259 OID 16665)
-- Name: hastalar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hastalar (
    id integer NOT NULL,
    tc_no character varying(11) NOT NULL,
    ad_soyad character varying(255) NOT NULL,
    dogum_tarihi date,
    cinsiyet character(1),
    kan_grubu character varying(255),
    telefon character varying(255),
    adres character varying(255),
    kullanici_id integer,
    CONSTRAINT check_cinsiyet CHECK ((cinsiyet = ANY (ARRAY['E'::bpchar, 'K'::bpchar]))),
    CONSTRAINT check_dogum_tarihi CHECK ((dogum_tarihi <= CURRENT_DATE)),
    CONSTRAINT check_kan_grubu CHECK (((kan_grubu)::text = ANY ((ARRAY['A Rh+'::character varying, 'A Rh-'::character varying, 'B Rh+'::character varying, 'B Rh-'::character varying, 'AB Rh+'::character varying, 'AB Rh-'::character varying, '0 Rh+'::character varying, '0 Rh-'::character varying])::text[]))),
    CONSTRAINT check_phone_length CHECK (((length((telefon)::text) >= 10) AND (length((telefon)::text) <= 11)))
);


ALTER TABLE public.hastalar OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16664)
-- Name: hastalar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hastalar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hastalar_id_seq OWNER TO postgres;

--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 221
-- Name: hastalar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hastalar_id_seq OWNED BY public.hastalar.id;


--
-- TOC entry 234 (class 1259 OID 16842)
-- Name: kullanicilar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kullanicilar (
    id integer NOT NULL,
    tc_no character varying(11) NOT NULL,
    sifre character varying(255) NOT NULL,
    rol character varying(20) NOT NULL,
    CONSTRAINT check_tc_length CHECK ((length((tc_no)::text) = 11))
);


ALTER TABLE public.kullanicilar OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16841)
-- Name: kullanicilar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kullanicilar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kullanicilar_id_seq OWNER TO postgres;

--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 233
-- Name: kullanicilar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kullanicilar_id_seq OWNED BY public.kullanicilar.id;


--
-- TOC entry 230 (class 1259 OID 16732)
-- Name: otopark_kayitlari; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.otopark_kayitlari (
    id integer NOT NULL,
    plaka character varying(15) NOT NULL,
    arac_tipi character varying(20),
    giris_saati timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cikis_saati timestamp without time zone,
    hasta_id integer
);


ALTER TABLE public.otopark_kayitlari OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16731)
-- Name: otopark_kayitlari_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.otopark_kayitlari_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.otopark_kayitlari_id_seq OWNER TO postgres;

--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 229
-- Name: otopark_kayitlari_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.otopark_kayitlari_id_seq OWNED BY public.otopark_kayitlari.id;


--
-- TOC entry 218 (class 1259 OID 16638)
-- Name: personeller; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personeller (
    id integer NOT NULL,
    tc_no character(11) NOT NULL,
    ad_soyad character varying(100) NOT NULL,
    telefon character varying(15),
    rol character varying(50),
    birim_id integer,
    ise_giris_tarihi date DEFAULT CURRENT_DATE,
    kullanici_id integer
);


ALTER TABLE public.personeller OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16637)
-- Name: personeller_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personeller_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personeller_id_seq OWNER TO postgres;

--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 217
-- Name: personeller_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personeller_id_seq OWNED BY public.personeller.id;


--
-- TOC entry 216 (class 1259 OID 16629)
-- Name: poliklinikler; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.poliklinikler (
    id integer NOT NULL,
    ad character varying(100) NOT NULL,
    kat_bilgisi integer,
    aciklama text
);


ALTER TABLE public.poliklinikler OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16628)
-- Name: poliklinikler_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.poliklinikler_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.poliklinikler_id_seq OWNER TO postgres;

--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 215
-- Name: poliklinikler_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.poliklinikler_id_seq OWNED BY public.poliklinikler.id;


--
-- TOC entry 224 (class 1259 OID 16676)
-- Name: randevular; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.randevular (
    id integer NOT NULL,
    hasta_id integer,
    doktor_id integer,
    durum character varying(20) DEFAULT 'BEKLIYOR'::character varying,
    sikayet text,
    randevu_tarihi date,
    randevu_saati time without time zone,
    CONSTRAINT check_randevu_durum CHECK (((durum)::text = ANY ((ARRAY['ONAYLANDI'::character varying, 'BEKLEMEDE'::character varying, 'TAMAMLANDI'::character varying, 'IPTAL_EDILDI'::character varying])::text[])))
);


ALTER TABLE public.randevular OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16675)
-- Name: randevular_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.randevular_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.randevular_id_seq OWNER TO postgres;

--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 223
-- Name: randevular_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.randevular_id_seq OWNED BY public.randevular.id;


--
-- TOC entry 232 (class 1259 OID 16745)
-- Name: sikayet_oneri; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sikayet_oneri (
    id integer NOT NULL,
    hasta_id integer,
    kategori character varying(50),
    mesaj text,
    oncelik_durumu character varying(20),
    tarih date DEFAULT CURRENT_DATE
);


ALTER TABLE public.sikayet_oneri OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16744)
-- Name: sikayet_oneri_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sikayet_oneri_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sikayet_oneri_id_seq OWNER TO postgres;

--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 231
-- Name: sikayet_oneri_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sikayet_oneri_id_seq OWNED BY public.sikayet_oneri.id;


--
-- TOC entry 235 (class 1259 OID 16865)
-- Name: sirali_hastalar; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.sirali_hastalar AS
 SELECT id,
    tc_no,
    ad_soyad,
    dogum_tarihi,
    cinsiyet,
    kan_grubu,
    telefon,
    adres,
    kullanici_id
   FROM public.hastalar
  ORDER BY id;


ALTER VIEW public.sirali_hastalar OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16696)
-- Name: tahliller; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tahliller (
    id integer NOT NULL,
    hasta_id integer,
    doktor_id integer,
    tahlil_adi character varying(100),
    sonuc_degeri character varying(50),
    referans_araligi character varying(50),
    tarih timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    randevu_id integer
);


ALTER TABLE public.tahliller OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16695)
-- Name: tahliller_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tahliller_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tahliller_id_seq OWNER TO postgres;

--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 225
-- Name: tahliller_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tahliller_id_seq OWNED BY public.tahliller.id;


--
-- TOC entry 238 (class 1259 OID 16888)
-- Name: v_randevu_detaylari; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_randevu_detaylari AS
 SELECT r.id AS randevu_id,
    h.ad_soyad AS hasta_adi,
    h.tc_no AS hasta_tc,
    d.ad_soyad AS doktor_adi,
    d.uzmanlik_alani,
    p.ad AS poliklinik_adi,
    r.randevu_tarihi,
    r.randevu_saati,
    r.durum
   FROM (((public.randevular r
     JOIN public.hastalar h ON ((r.hasta_id = h.id)))
     JOIN public.doktorlar d ON ((r.doktor_id = d.id)))
     JOIN public.poliklinikler p ON ((d.poliklinik_id = p.id)));


ALTER VIEW public.v_randevu_detaylari OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16879)
-- Name: v_tahlil_istatistik; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_tahlil_istatistik AS
 SELECT tahlil_adi,
    count(*) AS test_sayisi,
    round((avg((sonuc_degeri)::double precision))::numeric, 2) AS ortalama_deger,
    min((sonuc_degeri)::double precision) AS en_dusuk,
    max((sonuc_degeri)::double precision) AS en_yuksek
   FROM public.tahliller
  GROUP BY tahlil_adi;


ALTER VIEW public.v_tahlil_istatistik OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16875)
-- Name: v_tahlil_ozet; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_tahlil_ozet AS
 SELECT tahlil_adi,
    count(*) AS toplam_sayi,
    avg((sonuc_degeri)::double precision) AS ortalama_deger
   FROM public.tahliller
  GROUP BY tahlil_adi;


ALTER VIEW public.v_tahlil_ozet OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16921)
-- Name: view_doktor_detaylari; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.view_doktor_detaylari AS
 SELECT d.id AS doktor_id,
    d.unvan,
    d.ad_soyad AS doktor_ad_soyad,
    d.uzmanlik_alani,
    p.ad AS poliklinik_adi,
    p.kat_bilgisi
   FROM (public.doktorlar d
     LEFT JOIN public.poliklinikler p ON ((d.poliklinik_id = p.id)));


ALTER VIEW public.view_doktor_detaylari OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16925)
-- Name: view_doktor_randevu_istatistik; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.view_doktor_randevu_istatistik AS
 SELECT d.ad_soyad,
    count(r.id) AS toplam_randevu_sayisi
   FROM (public.doktorlar d
     LEFT JOIN public.randevular r ON ((d.id = r.doktor_id)))
  GROUP BY d.id, d.ad_soyad;


ALTER VIEW public.view_doktor_randevu_istatistik OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16714)
-- Name: yatislar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.yatislar (
    id integer NOT NULL,
    hasta_id integer,
    oda_no character varying(10),
    yatak_no character varying(10),
    yatis_tarihi timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    taburcu_tarihi timestamp without time zone,
    sorumlu_hemsire_id integer
);


ALTER TABLE public.yatislar OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16713)
-- Name: yatislar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.yatislar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.yatislar_id_seq OWNER TO postgres;

--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 227
-- Name: yatislar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.yatislar_id_seq OWNED BY public.yatislar.id;


--
-- TOC entry 4808 (class 2604 OID 16656)
-- Name: doktorlar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doktorlar ALTER COLUMN id SET DEFAULT nextval('public.doktorlar_id_seq'::regclass);


--
-- TOC entry 4809 (class 2604 OID 16668)
-- Name: hastalar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hastalar ALTER COLUMN id SET DEFAULT nextval('public.hastalar_id_seq'::regclass);


--
-- TOC entry 4820 (class 2604 OID 16845)
-- Name: kullanicilar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kullanicilar ALTER COLUMN id SET DEFAULT nextval('public.kullanicilar_id_seq'::regclass);


--
-- TOC entry 4816 (class 2604 OID 16735)
-- Name: otopark_kayitlari id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otopark_kayitlari ALTER COLUMN id SET DEFAULT nextval('public.otopark_kayitlari_id_seq'::regclass);


--
-- TOC entry 4806 (class 2604 OID 16641)
-- Name: personeller id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personeller ALTER COLUMN id SET DEFAULT nextval('public.personeller_id_seq'::regclass);


--
-- TOC entry 4805 (class 2604 OID 16632)
-- Name: poliklinikler id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.poliklinikler ALTER COLUMN id SET DEFAULT nextval('public.poliklinikler_id_seq'::regclass);


--
-- TOC entry 4810 (class 2604 OID 16679)
-- Name: randevular id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.randevular ALTER COLUMN id SET DEFAULT nextval('public.randevular_id_seq'::regclass);


--
-- TOC entry 4818 (class 2604 OID 16748)
-- Name: sikayet_oneri id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sikayet_oneri ALTER COLUMN id SET DEFAULT nextval('public.sikayet_oneri_id_seq'::regclass);


--
-- TOC entry 4812 (class 2604 OID 16699)
-- Name: tahliller id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tahliller ALTER COLUMN id SET DEFAULT nextval('public.tahliller_id_seq'::regclass);


--
-- TOC entry 4814 (class 2604 OID 16717)
-- Name: yatislar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yatislar ALTER COLUMN id SET DEFAULT nextval('public.yatislar_id_seq'::regclass);


--
-- TOC entry 4834 (class 2606 OID 16658)
-- Name: doktorlar doktorlar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doktorlar
    ADD CONSTRAINT doktorlar_pkey PRIMARY KEY (id);


--
-- TOC entry 4836 (class 2606 OID 16672)
-- Name: hastalar hastalar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hastalar
    ADD CONSTRAINT hastalar_pkey PRIMARY KEY (id);


--
-- TOC entry 4838 (class 2606 OID 16769)
-- Name: hastalar hastalar_tc_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hastalar
    ADD CONSTRAINT hastalar_tc_no_key UNIQUE (tc_no);


--
-- TOC entry 4854 (class 2606 OID 16847)
-- Name: kullanicilar kullanicilar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kullanicilar
    ADD CONSTRAINT kullanicilar_pkey PRIMARY KEY (id);


--
-- TOC entry 4856 (class 2606 OID 16849)
-- Name: kullanicilar kullanicilar_tc_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kullanicilar
    ADD CONSTRAINT kullanicilar_tc_no_key UNIQUE (tc_no);


--
-- TOC entry 4850 (class 2606 OID 16738)
-- Name: otopark_kayitlari otopark_kayitlari_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otopark_kayitlari
    ADD CONSTRAINT otopark_kayitlari_pkey PRIMARY KEY (id);


--
-- TOC entry 4830 (class 2606 OID 16644)
-- Name: personeller personeller_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personeller
    ADD CONSTRAINT personeller_pkey PRIMARY KEY (id);


--
-- TOC entry 4832 (class 2606 OID 16646)
-- Name: personeller personeller_tc_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personeller
    ADD CONSTRAINT personeller_tc_no_key UNIQUE (tc_no);


--
-- TOC entry 4828 (class 2606 OID 16636)
-- Name: poliklinikler poliklinikler_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.poliklinikler
    ADD CONSTRAINT poliklinikler_pkey PRIMARY KEY (id);


--
-- TOC entry 4840 (class 2606 OID 16684)
-- Name: randevular randevular_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.randevular
    ADD CONSTRAINT randevular_pkey PRIMARY KEY (id);


--
-- TOC entry 4852 (class 2606 OID 16753)
-- Name: sikayet_oneri sikayet_oneri_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sikayet_oneri
    ADD CONSTRAINT sikayet_oneri_pkey PRIMARY KEY (id);


--
-- TOC entry 4846 (class 2606 OID 16702)
-- Name: tahliller tahliller_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tahliller
    ADD CONSTRAINT tahliller_pkey PRIMARY KEY (id);


--
-- TOC entry 4842 (class 2606 OID 16905)
-- Name: randevular unique_doktor_randevu; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.randevular
    ADD CONSTRAINT unique_doktor_randevu UNIQUE (doktor_id, randevu_tarihi, randevu_saati);


--
-- TOC entry 4844 (class 2606 OID 16894)
-- Name: randevular unique_doktor_randevu_cakismasi; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.randevular
    ADD CONSTRAINT unique_doktor_randevu_cakismasi UNIQUE (doktor_id, randevu_tarihi, randevu_saati);


--
-- TOC entry 4848 (class 2606 OID 16720)
-- Name: yatislar yatislar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yatislar
    ADD CONSTRAINT yatislar_pkey PRIMARY KEY (id);


--
-- TOC entry 4874 (class 2620 OID 16896)
-- Name: tahliller trg_tahlil_eklendi; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_tahlil_eklendi AFTER INSERT ON public.tahliller FOR EACH ROW EXECUTE FUNCTION public.fn_randevu_tamamla();


--
-- TOC entry 4859 (class 2606 OID 16855)
-- Name: doktorlar doktorlar_kullanici_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doktorlar
    ADD CONSTRAINT doktorlar_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES public.kullanicilar(id);


--
-- TOC entry 4860 (class 2606 OID 16659)
-- Name: doktorlar doktorlar_poliklinik_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doktorlar
    ADD CONSTRAINT doktorlar_poliklinik_id_fkey FOREIGN KEY (poliklinik_id) REFERENCES public.poliklinikler(id);


--
-- TOC entry 4861 (class 2606 OID 16929)
-- Name: doktorlar fk_doktor_poliklinik; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doktorlar
    ADD CONSTRAINT fk_doktor_poliklinik FOREIGN KEY (poliklinik_id) REFERENCES public.poliklinikler(id);


--
-- TOC entry 4863 (class 2606 OID 16911)
-- Name: randevular fk_randevu_doktor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.randevular
    ADD CONSTRAINT fk_randevu_doktor FOREIGN KEY (doktor_id) REFERENCES public.doktorlar(id);


--
-- TOC entry 4864 (class 2606 OID 16906)
-- Name: randevular fk_randevu_hasta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.randevular
    ADD CONSTRAINT fk_randevu_hasta FOREIGN KEY (hasta_id) REFERENCES public.hastalar(id);


--
-- TOC entry 4867 (class 2606 OID 16897)
-- Name: tahliller fk_tahlil_randevu; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tahliller
    ADD CONSTRAINT fk_tahlil_randevu FOREIGN KEY (randevu_id) REFERENCES public.randevular(id);


--
-- TOC entry 4862 (class 2606 OID 16850)
-- Name: hastalar hastalar_kullanici_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hastalar
    ADD CONSTRAINT hastalar_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES public.kullanicilar(id);


--
-- TOC entry 4872 (class 2606 OID 16739)
-- Name: otopark_kayitlari otopark_kayitlari_hasta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otopark_kayitlari
    ADD CONSTRAINT otopark_kayitlari_hasta_id_fkey FOREIGN KEY (hasta_id) REFERENCES public.hastalar(id);


--
-- TOC entry 4857 (class 2606 OID 16647)
-- Name: personeller personeller_birim_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personeller
    ADD CONSTRAINT personeller_birim_id_fkey FOREIGN KEY (birim_id) REFERENCES public.poliklinikler(id);


--
-- TOC entry 4858 (class 2606 OID 16860)
-- Name: personeller personeller_kullanici_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personeller
    ADD CONSTRAINT personeller_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES public.kullanicilar(id);


--
-- TOC entry 4865 (class 2606 OID 16690)
-- Name: randevular randevular_doktor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.randevular
    ADD CONSTRAINT randevular_doktor_id_fkey FOREIGN KEY (doktor_id) REFERENCES public.doktorlar(id);


--
-- TOC entry 4866 (class 2606 OID 16685)
-- Name: randevular randevular_hasta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.randevular
    ADD CONSTRAINT randevular_hasta_id_fkey FOREIGN KEY (hasta_id) REFERENCES public.hastalar(id);


--
-- TOC entry 4873 (class 2606 OID 16754)
-- Name: sikayet_oneri sikayet_oneri_hasta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sikayet_oneri
    ADD CONSTRAINT sikayet_oneri_hasta_id_fkey FOREIGN KEY (hasta_id) REFERENCES public.hastalar(id);


--
-- TOC entry 4868 (class 2606 OID 16708)
-- Name: tahliller tahliller_doktor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tahliller
    ADD CONSTRAINT tahliller_doktor_id_fkey FOREIGN KEY (doktor_id) REFERENCES public.doktorlar(id);


--
-- TOC entry 4869 (class 2606 OID 16703)
-- Name: tahliller tahliller_hasta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tahliller
    ADD CONSTRAINT tahliller_hasta_id_fkey FOREIGN KEY (hasta_id) REFERENCES public.hastalar(id);


--
-- TOC entry 4870 (class 2606 OID 16721)
-- Name: yatislar yatislar_hasta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yatislar
    ADD CONSTRAINT yatislar_hasta_id_fkey FOREIGN KEY (hasta_id) REFERENCES public.hastalar(id);


--
-- TOC entry 4871 (class 2606 OID 16726)
-- Name: yatislar yatislar_sorumlu_hemsire_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yatislar
    ADD CONSTRAINT yatislar_sorumlu_hemsire_id_fkey FOREIGN KEY (sorumlu_hemsire_id) REFERENCES public.personeller(id);


-- Completed on 2026-02-23 10:02:36

--
-- PostgreSQL database dump complete
--

\unrestrict p9jjd0Q5OykVcCIyOsVYnQ60h6CWqLwvRXB11csaotuZrdfW7f4ZoyX2yDn4HNB

