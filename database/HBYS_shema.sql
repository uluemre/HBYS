--
-- PostgreSQL database dump
--

\restrict lULR67rXzVMRqknXCA8cdFi5UvcuFskTLgm7QMEkWwb5v1dmTuDN4TjgA7vdxMn

-- Dumped from database version 16.12
-- Dumped by pg_dump version 16.12

-- Started on 2026-02-24 10:45:06

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
-- TOC entry 2 (class 3079 OID 16934)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 243 (class 1255 OID 16895)
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
-- TOC entry 221 (class 1259 OID 16653)
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
-- TOC entry 220 (class 1259 OID 16652)
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
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 220
-- Name: doktorlar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doktorlar_id_seq OWNED BY public.doktorlar.id;


--
-- TOC entry 223 (class 1259 OID 16665)
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
-- TOC entry 222 (class 1259 OID 16664)
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
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 222
-- Name: hastalar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hastalar_id_seq OWNED BY public.hastalar.id;


--
-- TOC entry 235 (class 1259 OID 16842)
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
-- TOC entry 234 (class 1259 OID 16841)
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
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 234
-- Name: kullanicilar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kullanicilar_id_seq OWNED BY public.kullanicilar.id;


--
-- TOC entry 231 (class 1259 OID 16732)
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
-- TOC entry 230 (class 1259 OID 16731)
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
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 230
-- Name: otopark_kayitlari_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.otopark_kayitlari_id_seq OWNED BY public.otopark_kayitlari.id;


--
-- TOC entry 219 (class 1259 OID 16638)
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
-- TOC entry 218 (class 1259 OID 16637)
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
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 218
-- Name: personeller_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personeller_id_seq OWNED BY public.personeller.id;


--
-- TOC entry 217 (class 1259 OID 16629)
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
-- TOC entry 216 (class 1259 OID 16628)
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
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 216
-- Name: poliklinikler_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.poliklinikler_id_seq OWNED BY public.poliklinikler.id;


--
-- TOC entry 225 (class 1259 OID 16676)
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
-- TOC entry 224 (class 1259 OID 16675)
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
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 224
-- Name: randevular_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.randevular_id_seq OWNED BY public.randevular.id;


--
-- TOC entry 233 (class 1259 OID 16745)
-- Name: sikayet_oneri; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sikayet_oneri (
    id integer NOT NULL,
    hasta_id integer,
    kategori character varying(50),
    mesaj text,
    oncelik_durumu character varying(20),
    tarih date DEFAULT CURRENT_DATE,
    bashekim_cevabi text
);


ALTER TABLE public.sikayet_oneri OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16744)
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
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 232
-- Name: sikayet_oneri_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sikayet_oneri_id_seq OWNED BY public.sikayet_oneri.id;


--
-- TOC entry 236 (class 1259 OID 16865)
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
-- TOC entry 227 (class 1259 OID 16696)
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
-- TOC entry 226 (class 1259 OID 16695)
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
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 226
-- Name: tahliller_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tahliller_id_seq OWNED BY public.tahliller.id;


--
-- TOC entry 239 (class 1259 OID 16888)
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
-- TOC entry 238 (class 1259 OID 16879)
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
-- TOC entry 237 (class 1259 OID 16875)
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
-- TOC entry 240 (class 1259 OID 16921)
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
-- TOC entry 241 (class 1259 OID 16925)
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
-- TOC entry 229 (class 1259 OID 16714)
-- Name: yatislar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.yatislar (
    id integer NOT NULL,
    hasta_id integer,
    oda_no character varying(10),
    yatak_no character varying(10),
    yatis_tarihi timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    taburcu_tarihi timestamp without time zone,
    personel_id integer
);


ALTER TABLE public.yatislar OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16713)
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
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 228
-- Name: yatislar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.yatislar_id_seq OWNED BY public.yatislar.id;


--
-- TOC entry 4845 (class 2604 OID 16656)
-- Name: doktorlar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doktorlar ALTER COLUMN id SET DEFAULT nextval('public.doktorlar_id_seq'::regclass);


--
-- TOC entry 4846 (class 2604 OID 16668)
-- Name: hastalar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hastalar ALTER COLUMN id SET DEFAULT nextval('public.hastalar_id_seq'::regclass);


--
-- TOC entry 4857 (class 2604 OID 16845)
-- Name: kullanicilar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kullanicilar ALTER COLUMN id SET DEFAULT nextval('public.kullanicilar_id_seq'::regclass);


--
-- TOC entry 4853 (class 2604 OID 16735)
-- Name: otopark_kayitlari id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otopark_kayitlari ALTER COLUMN id SET DEFAULT nextval('public.otopark_kayitlari_id_seq'::regclass);


--
-- TOC entry 4843 (class 2604 OID 16641)
-- Name: personeller id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personeller ALTER COLUMN id SET DEFAULT nextval('public.personeller_id_seq'::regclass);


--
-- TOC entry 4842 (class 2604 OID 16632)
-- Name: poliklinikler id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.poliklinikler ALTER COLUMN id SET DEFAULT nextval('public.poliklinikler_id_seq'::regclass);


--
-- TOC entry 4847 (class 2604 OID 16679)
-- Name: randevular id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.randevular ALTER COLUMN id SET DEFAULT nextval('public.randevular_id_seq'::regclass);


--
-- TOC entry 4855 (class 2604 OID 16748)
-- Name: sikayet_oneri id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sikayet_oneri ALTER COLUMN id SET DEFAULT nextval('public.sikayet_oneri_id_seq'::regclass);


--
-- TOC entry 4849 (class 2604 OID 16699)
-- Name: tahliller id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tahliller ALTER COLUMN id SET DEFAULT nextval('public.tahliller_id_seq'::regclass);


--
-- TOC entry 4851 (class 2604 OID 16717)
-- Name: yatislar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yatislar ALTER COLUMN id SET DEFAULT nextval('public.yatislar_id_seq'::regclass);


--
-- TOC entry 5066 (class 0 OID 16653)
-- Dependencies: 221
-- Data for Name: doktorlar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doktorlar (id, ad_soyad, uzmanlik_alani, poliklinik_id, unvan, tc_no, kullanici_id) FROM stdin;
1	Dr. Ahmet Acil	Acil Tıp	1	Uzm. Dr.	10000000001	1
2	Dr. Ayşe Kurtaran	Acil Tıp	1	Uzm. Dr.	10000000002	2
3	Dr. Mehmet İçel	Dahiliye	2	Doç. Dr.	10000000003	3
4	Dr. Fatma Dahil	Dahiliye	2	Uzm. Dr.	10000000004	4
5	Dr. Ali Bakış	Göz Hastalıkları	3	Prof. Dr.	10000000005	5
6	Dr. Nur Mercek	Göz Hastalıkları	3	Uzm. Dr.	10000000006	6
7	Dr. Hakan Duygu	KBB	4	Doç. Dr.	10000000007	7
8	Dr. Seda Kulak	KBB	4	Uzm. Dr.	10000000008	8
9	Dr. Ömer Kalp	Kardiyoloji	5	Prof. Dr.	10000000009	9
10	Dr. Arzu Damar	Kardiyoloji	5	Uzm. Dr.	10000000010	10
11	Dr. Kemal Kemik	Ortopedi	6	Doç. Dr.	10000000011	11
12	Dr. Sibel Alçı	Ortopedi	6	Uzm. Dr.	10000000012	12
13	Dr. Zeynep Bebek	Kadın Doğum	7	Prof. Dr.	10000000013	13
14	Dr. Canan Ana	Kadın Doğum	7	Uzm. Dr.	10000000014	14
15	Dr. Can Çocuk	Pediatri	8	Prof. Dr.	10000000015	15
16	Dr. Elif Kreş	Pediatri	8	Uzm. Dr.	10000000016	16
17	Dr. Sinan Beyin	Nöroloji	9	Doç. Dr.	10000000017	17
18	Dr. Aslı Sinir	Nöroloji	9	Uzm. Dr.	10000000018	18
19	Dr. Murat Bıçak	Genel Cerrahi	10	Prof. Dr.	10000000019	19
20	Dr. Filiz Neşter	Genel Cerrahi	10	Doç. Dr.	10000000020	20
21	Dr. Mert Üro	Üroloji	11	Uzm. Dr.	10000000021	21
22	Dr. Selim Böbrek	Üroloji	11	Uzm. Dr.	10000000022	22
23	Dr. Yavuz Nefes	Göğüs Hastalıkları	12	Doç. Dr.	10000000023	23
24	Dr. Tülay Akciğer	Göğüs Hastalıkları	12	Uzm. Dr.	10000000024	24
25	Dr. Kerem Deri	Dermatoloji	13	Uzm. Dr.	10000000025	25
26	Dr. Deniz Cilt	Dermatoloji	13	Uzm. Dr.	10000000026	26
27	Dr. Özgür Ruh	Psikiyatri	14	Prof. Dr.	10000000027	27
28	Dr. Melis Terapi	Psikiyatri	14	Uzm. Dr.	10000000028	28
29	Dr. Burak Fizik	Fizik Tedavi	15	Doç. Dr.	10000000029	29
30	Dr. Hale Hareket	Fizik Tedavi	15	Uzm. Dr.	10000000030	30
31	Dr. Yavuz Mikrop	Enfeksiyon	16	Uzm. Dr.	10000000031	31
32	Dr. Selin Virüs	Enfeksiyon	16	Uzm. Dr.	10000000032	32
33	Dr. Ahmet Şeker	Endokrinoloji	17	Prof. Dr.	10000000033	33
34	Dr. Ebru Hormon	Endokrinoloji	17	Uzm. Dr.	10000000034	34
35	Dr. Cem Mide	Gastroenteroloji	18	Doç. Dr.	10000000035	35
36	Dr. Lale Bağırsak	Gastroenteroloji	18	Uzm. Dr.	10000000036	36
37	Dr. Erkan Süzgeç	Nefroloji	19	Prof. Dr.	10000000037	37
38	Dr. Gökhan Diyaliz	Nefroloji	19	Uzm. Dr.	10000000038	38
39	Dr. Berk Tümör	Onkoloji	20	Prof. Dr.	10000000039	39
40	Dr. Işıl Terapi	Onkoloji	20	Doç. Dr.	10000000040	40
42	Dr. Selim Aksoy	Acil Tıp	1	Başhekim	33333333333	85
\.


--
-- TOC entry 5068 (class 0 OID 16665)
-- Dependencies: 223
-- Data for Name: hastalar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hastalar (id, tc_no, ad_soyad, dogum_tarihi, cinsiyet, kan_grubu, telefon, adres, kullanici_id) FROM stdin;
1	12345678901	Mehmet Demir	1985-05-20	E	A Rh+	05321112233	Ankara, Pursaklar	41
4	12345678902	İkinci Test Hasta	1995-05-05	K	A Rh-	05001112233	İstanbul	42
2	98765432109	Selin Aktaş	1992-11-10	K	0 Rh-	05442223344	İstanbul, Kadıköy	43
5	55544433322	Ahmet Yılmaz	1985-10-12	E	A Rh+	05321112233	İstanbul	44
6	66655544433	Zeynep Kaya	1992-04-25	K	B Rh-	05442223344	Ankara	45
7	77766655544	Murat Demir	1978-08-30	E	0 Rh+	05053334455	İzmir	46
8	88877766655	Elif Şahin	2000-01-15	K	AB Rh+	05554445566	Bursa	47
9	30000000001	Mehmet Demir	1985-05-20	E	A Rh+	05321112233	Ankara, Pursaklar	48
10	30000000002	Selin Aktaş	1992-11-10	K	0 Rh-	05442223344	İstanbul, Kadıköy	49
11	30000000003	Ali Yılmaz	1975-03-15	E	B Rh+	05053334455	İzmir, Karşıyaka	50
12	30000000004	Ayşe Kaya	2000-08-25	K	AB Rh-	05554445566	Bursa, Nilüfer	51
13	30000000005	Fatma Çelik	1960-12-05	K	A Rh-	05336667788	Antalya, Muratpaşa	52
14	30000000006	Mustafa Yıldız	1995-07-20	E	0 Rh+	05421119988	Konya, Selçuklu	53
15	30000000007	Zeynep Şahin	1988-02-14	K	B Rh-	05072223344	Eskişehir, Odunpazarı	54
16	30000000008	Caner Bulut	2010-05-30	E	AB Rh+	05524441122	Adana, Çukurova	55
17	30000000009	Ece Fırtına	1998-09-12	K	A Rh+	05315556677	Trabzon, Ortahisar	56
18	30000000010	Burak Deniz	1982-01-22	E	0 Rh-	05412228899	Gaziantep, Şahinbey	57
21	11122233344	Ahmet Yılmaz	1990-05-15	E	A Rh+	05551112233	Ankara/Çankaya	80
\.


--
-- TOC entry 5080 (class 0 OID 16842)
-- Dependencies: 235
-- Data for Name: kullanicilar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kullanicilar (id, tc_no, sifre, rol) FROM stdin;
82	88888888888	$2a$10$JkAGsBcRhSrmP4WqhcOE5u1VnRMfJSs/ULglw8IjoLpqZenZTPN7C	HASTA
41	12345678901	$2a$06$JRVIFs36t9P9K91nva1nJ.J5qMwk80zVzfASDpcWz3Cp90MGMeGni	HASTA
42	12345678902	$2a$06$GJqS5H6PEWGtNEOcKErX9OLnyVqvadslDF98lkK0iuT1nlsi2GZom	HASTA
43	98765432109	$2a$06$4ppundUSQ49Ytmr815GCge36JgHsGDfgFsEFe4usf0uhnF.kt8qQW	HASTA
44	55544433322	$2a$06$2V4CVbMT8zlrk./QV6MC0ewF/9hNl3fEBtCGnsmXQntHYpDeoUzDi	HASTA
45	66655544433	$2a$06$2.4vuskFaxWTxFkiJTRoS.8m6TL5XKltHux56jAoIUHABtXvhOAKa	HASTA
46	77766655544	$2a$06$SJUJxwx2Ac1Z.nVJ4x0is.gQveHZlxLMSx/C1yM6RZWKvN9vf9VJG	HASTA
47	88877766655	$2a$06$2hfBomN.0dnGiW/NYY2soOYbtrN5EStgKI0s.G6z4LI5H1jc70B.6	HASTA
48	30000000001	$2a$06$GifuiO16FCPJtYawx2KhI.OrPFAuZhBicOBUs3asmTj5KBym1305W	HASTA
49	30000000002	$2a$06$60o2Imukvw4BJEptOwQScuIy/UqDQZOH1XeczXCKDIgTLM8F4z9a.	HASTA
50	30000000003	$2a$06$w1sDMZ0GbvavFxB9b5nQM.9xrYixxb844dwvqmOFgE.YWQtD1Beci	HASTA
51	30000000004	$2a$06$Q4p4wSEuyqJtiLcjNVFuJeLE0OdzYe311/QfwrDyKC/LKLJ0R9bw6	HASTA
52	30000000005	$2a$06$mh.VngKcsgWakwSuXAdZoe8WRxvv/7Ueh.x0BwRwpve8lCPAB.yQC	HASTA
53	30000000006	$2a$06$XvB0r48o8FeEd/CsGf..Ye2jIJJ4GhnUmas5WtuJAYFnIYXmapHnG	HASTA
54	30000000007	$2a$06$2A5kfHRYLdUt4GGuEk7BlupRgD5/qkIJgPfG95l5q3b180K5T1Dsy	HASTA
55	30000000008	$2a$06$7aJpLCXUBVBNaQucAyk1aeaha4k6hAz51IxFvtypHu/yy0cpy1mQG	HASTA
56	30000000009	$2a$06$6tEaN3E4q293AnSWzLJ64u/gAwXHYlgi1xbnKacQMo6VPVuiy.236	HASTA
57	30000000010	$2a$06$a9P3l0ER96SoMaD.9sbTFuVtwk33w3ADZAC6nFsKofBuvbaStlkCe	HASTA
58	20000000001	$2a$06$h6686K14SIOo5r4RPWf0HuPrbOskB3WAtDRNk70LGtX9GFxKxizAW	PERSONEL
59	20000000002	$2a$06$q5ZBLyPKfvO2X1QDICE6..moHhYLcMkLmH9iDXlvqpSqD3JFPE2OK	PERSONEL
60	20000000003	$2a$06$v/qsbjdjs8c6AsX/sJSxcu7WnvcAl3IPuRlssq.N09PJCtxvswL8S	PERSONEL
61	20000000004	$2a$06$41mcfqRKrBaUVC//L5/dYurI5ZMU2EXfF55onqU4tFP6HXd9Jjawu	PERSONEL
62	20000000005	$2a$06$jY6PndHoitWvxnKc8D8NpecuSX2NbVfM.xRD25uIyeU9ieDKIMO0W	PERSONEL
63	20000000006	$2a$06$gqPkzEBsHIaY0YVNXj3TG.zwoUrouOID9fyIwiq7N5B.wbENbgdxO	PERSONEL
64	20000000007	$2a$06$JDn0PnohexwesSudGK556.f/NJH1OGhQkBMDlqBoy4BwzWC8SEK9S	PERSONEL
65	20000000008	$2a$06$FMOz0sYXRL.G9P4bHqfy6eNkX03DdFlwWv3uqra8R6lSKXx04KBqO	PERSONEL
66	20000000009	$2a$06$SIkuJVnbgZi0ofMufoHDK.fBG29dswKGkTl79uNfSdvZrKA/YWd8O	PERSONEL
67	20000000010	$2a$06$vC7LaEKbjZO324kSRHObwu785XAS4xDDR/4TsiKlgP.dfH/5ulakS	PERSONEL
68	20000000011	$2a$06$26TlU/YTAsZSwjsagED/y.t5BYKhFxcYXb7O6h7sGi7yNOEAJE0ie	PERSONEL
69	20000000012	$2a$06$UMBGqVQXnazVVSzPtr2Si.VJ0i4gvc2RjWDfBB6e.K2mitVkIt8jy	PERSONEL
83	99999999999	$2a$10$xMaSg5Qr5PtynkxGklP4U.S/gaNBOKbQnga4TOSiF1C2CbPbzWOA.	HASTA
70	20000000013	$2a$06$pyQqyOjZp13nmQp0tVIC.uvaXLzNFVAcKXTxwO7gCaQMX2RiAwg46	PERSONEL
71	20000000014	$2a$06$/6BN62dk0w3yXyz8iCk.xO7Nparand4y.zmYMiitNZuiWAv1EzaH.	PERSONEL
72	20000000015	$2a$06$j1puyg6T447hhn2rM0AOh.pD3pO9dKjYSiY.62kkwTKOOvFaVzyfK	PERSONEL
81	12345678909	$2a$06$eWzxG3ZpJmscFn4sGrx07eCNdYHdzqGaWvv7ifiGStdXxZmDQR8zq	HASTA
78	11111111111	$2a$06$ZNLfYpwvHh3vxgALdJzxre87VMW5thEtRtU/.onR3VqEQ7x1pJBhi	PERSONEL
80	11122233344	$2a$06$5I3c8A9Nw4vc8TGO9bMC9eHwEqYFARe5UCxqvHE1SIkuriPSli9q6	HASTA
1	10000000001	$2a$06$xLtsjl7wIO7v7fJ1uCD7ZuejOgIFex8mCf85aw9vTrcrr8P1PjUIK	DOKTOR
2	10000000002	$2a$06$N1abHHOvUWqZ3kK3uW5HF./n7lCD4YazYYQ6Pb2GZOCEC8LJ0sH1W	DOKTOR
3	10000000003	$2a$06$eaMwqJNn8gn.BHP0v0zA7O7U.y31CtkOB2.s3dOYPeta05dhrHg2m	DOKTOR
4	10000000004	$2a$06$o.rjj4F0P25AIal3/JrKYe4NYpo1SFuLHNwIMxKssFK72dftoymlm	DOKTOR
5	10000000005	$2a$06$tKx.48jwY22QJcfsHs5QBelUiKzrf7fiCn4YlV.d92w27.TOJG3IS	DOKTOR
6	10000000006	$2a$06$RxkbaXD/fM26/Q8ghdggd.WNr34MyEO6kfiLjBfXF6J043S2cw5K2	DOKTOR
7	10000000007	$2a$06$8nshQbo5qtLL.sa8ZGt/v.crfVjy96vB4xTZo1yqhBn9y0k6SQrZe	DOKTOR
8	10000000008	$2a$06$jJh2BaEINWFZNKvoUej3/ecf.1k36pNbz6Osrzp5CgwSiYgMnmpoi	DOKTOR
9	10000000009	$2a$06$tY0GKsoPsfagFyVEFOxB3eua9u//1QJgY3.mYle68Ea11RoK9bYfC	DOKTOR
10	10000000010	$2a$06$JIbNHNSaqvVFOkthi2Ahx.SSuMb1sQ3nD4qUjLTCr6uuwG37k.v/.	DOKTOR
11	10000000011	$2a$06$nXwvb3rIAcBnor2nHbKSvOVbP1lUamuSR.a8CVP4mNZWi67tbf49y	DOKTOR
12	10000000012	$2a$06$nkqR7RPB4ChK/d45KvPng..2d9m4fRllCacVNIYbDGWdVi5wVeGda	DOKTOR
13	10000000013	$2a$06$h46MFN5H8J.2WMJ4yA2vqeh2am97SSIqC0fw1RGyUkygt8EWl5k0q	DOKTOR
14	10000000014	$2a$06$P1OYvnfTOJruK.91xhPZFeIW06IKyjrsLmxoxTn0Ye3vQqH9Mza.a	DOKTOR
15	10000000015	$2a$06$uo8la60Y1CImc7Mk2qrZTOlv0HwPchHz.JO1SfhJEWwA4KQ5b6BUW	DOKTOR
16	10000000016	$2a$06$QDI9pdd6irYxqemkMGvYF.3czqNwIzewE6ijqR.SPVTLuVaAzlPM.	DOKTOR
17	10000000017	$2a$06$eDrRKBqo5NdZlH5AdzRVPuRUUZAMTspan7Pt7nxKtm6dzlaONDc1W	DOKTOR
18	10000000018	$2a$06$Gd7fjF7tCFiBIBUTCQlz1uKb3ioGbBoj7r1zwEavTa48h9tdlVIoi	DOKTOR
19	10000000019	$2a$06$mkD3q2ZgaH17Grpu8h6D9enUEbVts55YLF6pkhsZYqjvr206c661C	DOKTOR
20	10000000020	$2a$06$kx9X0WVcwNvzDVeVWWVq5.Fa6duRDuAbrN4AE.VZ5oC6dyE5FytwK	DOKTOR
21	10000000021	$2a$06$bHw9BqhWcAJuGXV39Qypx.Tt9CE5IQCnW3.7TYklVSu4jZgC/QnDG	DOKTOR
22	10000000022	$2a$06$npejS1EgiOzV8oLKuo1Z1OTHT6r5iWNsnU7CssbB2sprcd2zC/5MO	DOKTOR
23	10000000023	$2a$06$TvdaapxNUNuCr0uTo.cypuoJDjf/TRwaETB2a26esu2jKc6KrD3My	DOKTOR
24	10000000024	$2a$06$B5VQWIYwGSM6rpemkRiQYOwvOaBqQWqdkEynjWEq.4N6UiIqGUDqy	DOKTOR
25	10000000025	$2a$06$mFEtnH9yetlwlzmrJKMLyebPQXk7Kz9PgBac6dqbVl2QOflV0/aZa	DOKTOR
26	10000000026	$2a$06$1jelOX1PQMfO5m40q3RohebGJaxH03v.Q9HzBwN1LiZGpkV73qICq	DOKTOR
27	10000000027	$2a$06$x8NepR2H9f68OUEWHaqL9edn6P/vnzQ.99oYLarTBLO0jJ6/ldPn2	DOKTOR
28	10000000028	$2a$06$q5MNO5QUcyrl.Cg1Wg87pOzrVu18zp1KGPmu1EqH6zO4kEs5d4VtO	DOKTOR
29	10000000029	$2a$06$3vdFJTVi9EwkvaIywf2XJ.9n/9mZTy2RLouje4Tqw9fd4QXhUb2jO	DOKTOR
30	10000000030	$2a$06$aibfSeiPVKaulg7pZ1buvez7Ujx3v35stredkQBK.7/ofGohGzxiu	DOKTOR
31	10000000031	$2a$06$uJVlCcqQ91fjzrVe7cNtVe0LCNNl.MjfKJUdogLlk5q5JN75ZUFfa	DOKTOR
32	10000000032	$2a$06$Laj4j22XHmBGLUxSWEeueOlpVDOAbKRIEiUugUvWBsfzVFo/Ilvtq	DOKTOR
33	10000000033	$2a$06$sBLNcfFLePlAjoYFRC3xTeibyg1dJRlSWz17sQcELMO/4DvCjv7lC	DOKTOR
34	10000000034	$2a$06$1FEN482h/RO6dxTp1vrm8ukCrxzQjjQ38GYqIFYvHwXuuDlzVaeAm	DOKTOR
35	10000000035	$2a$06$IVlbufpBptjyEquEqOwpZuDu4HX7iDTsymW5eSpUGtlzZzEW/QJau	DOKTOR
36	10000000036	$2a$06$wKpct2URrq9qTuGO4YtMleFbwpzOm9j5RMxVfWloN4HuV7UWEWgFW	DOKTOR
37	10000000037	$2a$06$DlNHyJBl9pI3g2ekpU7DZu5HK8ykbpYJsAxF6lMtXgo.YFc1ThIii	DOKTOR
38	10000000038	$2a$06$uy9dPhMvWLScLnsbzMWlxek9cRXlVBJ1wX.SY/SnCEmy10YYGiljO	DOKTOR
39	10000000039	$2a$06$1cRzUAEi7B8IcRpw66sULOngO0bAc7UlGIsEub1t93Df1Dg6bZPx2	DOKTOR
40	10000000040	$2a$06$D39bQyJE9/u5SVkhgnMPl.0T3t9J7zJI2wAsZ1uYkBQzJMOc9D9IW	DOKTOR
85	33333333333	$2a$06$6uvbOWnT7o7XlFjtaR5VJudIcVeNG8GUpOvPpmNZe.M90rusbCpue	BASHEKIM
\.


--
-- TOC entry 5076 (class 0 OID 16732)
-- Dependencies: 231
-- Data for Name: otopark_kayitlari; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.otopark_kayitlari (id, plaka, arac_tipi, giris_saati, cikis_saati, hasta_id) FROM stdin;
1	06 ABC 123	HASTA	2026-02-17 17:27:42.78535	\N	1
2	34 XYZ 999	PERSONEL	2026-02-17 17:27:42.78535	\N	\N
3	34 ABC 123	Binek	2026-02-18 10:00:00	\N	1
4	06 XYZ 789	SUV	2026-02-18 11:30:00	\N	2
5	06 ABC 123	Binek	2026-02-19 15:23:01.109113	\N	1
\.


--
-- TOC entry 5064 (class 0 OID 16638)
-- Dependencies: 219
-- Data for Name: personeller; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personeller (id, tc_no, ad_soyad, telefon, rol, birim_id, ise_giris_tarihi, kullanici_id) FROM stdin;
1	20000000001	Hüseyin Teknik	\N	TEKNIK_SERVIS	1	2026-02-18	58
2	20000000002	Merve Laborant	\N	LABORANT	16	2026-02-18	59
3	20000000003	Murat Güvenlik	\N	GUVENLIK	3	2026-02-18	60
4	20000000004	Selin Sekreter	\N	SEKRETER	2	2026-02-18	61
5	20000000005	Ahmet Danışma	\N	DANISMA	1	2026-02-18	62
6	20000000006	Fatma Hemşire	\N	HEMSIRE	7	2026-02-18	63
7	20000000007	Kemal Bilgiİşlem	\N	BILGI_ISLEM	10	2026-02-18	64
8	20000000008	Lale Eczacı	\N	ECZACI	17	2026-02-18	65
9	20000000009	Burak Temizlik	\N	TEMIZLIK	5	2026-02-18	66
10	20000000010	Ece Arşiv	\N	ARSIV	4	2026-02-18	67
11	20000000011	Okan Şoför	\N	AMBULANS_SOFORU	1	2026-02-18	68
12	20000000012	Gözde Diyetisyen	\N	DIYETISYEN	18	2026-02-18	69
13	20000000013	Deniz Psikolog	\N	PSIKOLOG	14	2026-02-18	70
14	20000000014	Caner Otopark	\N	OTOPARK_GOREVLISI	1	2026-02-18	71
15	20000000015	Seda HastaBakıcı	\N	HASTA_BAKICI	20	2026-02-18	72
\.


--
-- TOC entry 5062 (class 0 OID 16629)
-- Dependencies: 217
-- Data for Name: poliklinikler; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.poliklinikler (id, ad, kat_bilgisi, aciklama) FROM stdin;
1	Acil Servis	0	7/24 Acil Müdahale Ünitesi
2	İç Hastalıkları (Dahiliye)	1	Genel Dahiliye ve Check-up
3	Göz Hastalıkları	2	Göz ve Görme Sağlığı
4	Kulak Burun Boğaz (KBB)	2	Baş ve Boyun Cerrahisi
5	Kardiyoloji	3	Kalp ve Damar Sağlığı
6	Ortopedi ve Travmatoloji	1	Kemik ve Kas Sistemi
7	Kadın Hastalıkları ve Doğum	2	Kadın Sağlığı ve Doğum Ünitesi
8	Çocuk Sağlığı ve Hastalıkları	1	Pediatri Ünitesi
9	Nöroloji	4	Beyin ve Sinir Sistemi
10	Genel Cerrahi	3	Cerrahi Operasyon Merkezi
11	Üroloji	2	Böbrek ve Boşaltım Sistemi
12	Göğüs Hastalıkları	3	Solunum Yolları Sağlığı
13	Dermatoloji (Cildiye)	4	Deri ve Zührevi Hastalıklar
14	Psikiyatri	4	Ruh Sağlığı ve Hastalıkları
15	Fizik Tedavi ve Rehabilitasyon	0	Fiziksel Terapi Ünitesi
16	Enfeksiyon Hastalıkları	1	Bulaşıcı Hastalıklar Ünitesi
17	Endokrinoloji	3	Hormon ve Metabolizma Bozuklukları
18	Gastroenteroloji	3	Sindirim Sistemi Hastalıkları
19	Nefroloji	3	Böbrek Yetmezliği ve Tedavisi
20	Onkoloji	5	Kanser Tanı ve Tedavi Merkezi
\.


--
-- TOC entry 5070 (class 0 OID 16676)
-- Dependencies: 225
-- Data for Name: randevular; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.randevular (id, hasta_id, doktor_id, durum, sikayet, randevu_tarihi, randevu_saati) FROM stdin;
41	1	3	BEKLEMEDE	\N	2026-02-20	\N
29	9	27	BEKLEMEDE	Uyku bozukluğu	2026-02-22	16:00:00
21	1	3	BEKLEMEDE	Mide bulantısı ve yanma	2026-02-19	09:00:00
22	2	5	BEKLEMEDE	Gözlerde kızarıklık ve kaşıntı	2026-02-19	10:30:00
23	11	9	BEKLEMEDE	Göğüs ağrısı ve nefes darlığı	2026-02-19	14:00:00
24	4	15	BEKLEMEDE	Halsizlik ve ateş	2026-02-20	11:15:00
25	5	17	BEKLEMEDE	Şiddetli baş ağrısı	2026-02-20	15:45:00
26	6	11	BEKLEMEDE	Bel ağrısı	2026-02-21	08:30:00
28	8	8	BEKLEMEDE	Kulak ağrısı	2026-02-22	10:00:00
30	10	39	BEKLEMEDE	Rutin Onkoloji kontrolü	2026-02-23	09:45:00
36	2	1	BEKLEMEDE	Mide Yanması	2026-03-10	10:00:00
27	7	25	BEKLEMEDE	Ciltte döküntü	2026-02-21	13:20:00
\.


--
-- TOC entry 5078 (class 0 OID 16745)
-- Dependencies: 233
-- Data for Name: sikayet_oneri; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sikayet_oneri (id, hasta_id, kategori, mesaj, oncelik_durumu, tarih, bashekim_cevabi) FROM stdin;
1	1	YEMEK	Öğle yemeği biraz soğuktu.	Düşük	2026-02-17	DB Testi: Başarılı
\.


--
-- TOC entry 5072 (class 0 OID 16696)
-- Dependencies: 227
-- Data for Name: tahliller; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tahliller (id, hasta_id, doktor_id, tahlil_adi, sonuc_degeri, referans_araligi, tarih, randevu_id) FROM stdin;
1	1	3	B12 Vitamini	120	200 - 900 pg/mL	2026-02-18 00:00:00	\N
2	2	5	Glikoz (Açlık Kan Şekeri)	145	70 - 100 mg/dL	2026-02-18 00:00:00	\N
3	1	3	Demir (Serum)	35	50 - 170 ug/dL	2026-02-18 00:00:00	\N
4	1	3	Glikoz (Açlık)	145	70 - 100 mg/dL	2026-02-18 00:00:00	\N
5	2	5	B12 Vitamini	120	200 - 900 pg/mL	2026-02-18 00:00:00	\N
7	4	15	Demir (Serum)	35	50 - 170 ug/dL	2026-02-18 00:00:00	\N
8	1	3	Kolesterol	210	120 - 200 mg/dL	2026-02-18 00:00:00	\N
9	7	25	B12 Vitamini	250	200-900	2026-02-19 00:00:00	27
\.


--
-- TOC entry 5074 (class 0 OID 16714)
-- Dependencies: 229
-- Data for Name: yatislar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.yatislar (id, hasta_id, oda_no, yatak_no, yatis_tarihi, taburcu_tarihi, personel_id) FROM stdin;
1	1	304	A-12	2026-02-24 09:58:05.322169	\N	6
\.


--
-- TOC entry 5097 (class 0 OID 0)
-- Dependencies: 220
-- Name: doktorlar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doktorlar_id_seq', 42, true);


--
-- TOC entry 5098 (class 0 OID 0)
-- Dependencies: 222
-- Name: hastalar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hastalar_id_seq', 21, true);


--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 234
-- Name: kullanicilar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kullanicilar_id_seq', 85, true);


--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 230
-- Name: otopark_kayitlari_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.otopark_kayitlari_id_seq', 5, true);


--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 218
-- Name: personeller_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personeller_id_seq', 15, true);


--
-- TOC entry 5102 (class 0 OID 0)
-- Dependencies: 216
-- Name: poliklinikler_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.poliklinikler_id_seq', 20, true);


--
-- TOC entry 5103 (class 0 OID 0)
-- Dependencies: 224
-- Name: randevular_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.randevular_id_seq', 41, true);


--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 232
-- Name: sikayet_oneri_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sikayet_oneri_id_seq', 1, true);


--
-- TOC entry 5105 (class 0 OID 0)
-- Dependencies: 226
-- Name: tahliller_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tahliller_id_seq', 12, true);


--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 228
-- Name: yatislar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.yatislar_id_seq', 1, true);


--
-- TOC entry 4871 (class 2606 OID 16658)
-- Name: doktorlar doktorlar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doktorlar
    ADD CONSTRAINT doktorlar_pkey PRIMARY KEY (id);


--
-- TOC entry 4873 (class 2606 OID 16672)
-- Name: hastalar hastalar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hastalar
    ADD CONSTRAINT hastalar_pkey PRIMARY KEY (id);


--
-- TOC entry 4875 (class 2606 OID 16769)
-- Name: hastalar hastalar_tc_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hastalar
    ADD CONSTRAINT hastalar_tc_no_key UNIQUE (tc_no);


--
-- TOC entry 4891 (class 2606 OID 16847)
-- Name: kullanicilar kullanicilar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kullanicilar
    ADD CONSTRAINT kullanicilar_pkey PRIMARY KEY (id);


--
-- TOC entry 4893 (class 2606 OID 16849)
-- Name: kullanicilar kullanicilar_tc_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kullanicilar
    ADD CONSTRAINT kullanicilar_tc_no_key UNIQUE (tc_no);


--
-- TOC entry 4887 (class 2606 OID 16738)
-- Name: otopark_kayitlari otopark_kayitlari_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otopark_kayitlari
    ADD CONSTRAINT otopark_kayitlari_pkey PRIMARY KEY (id);


--
-- TOC entry 4867 (class 2606 OID 16644)
-- Name: personeller personeller_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personeller
    ADD CONSTRAINT personeller_pkey PRIMARY KEY (id);


--
-- TOC entry 4869 (class 2606 OID 16646)
-- Name: personeller personeller_tc_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personeller
    ADD CONSTRAINT personeller_tc_no_key UNIQUE (tc_no);


--
-- TOC entry 4865 (class 2606 OID 16636)
-- Name: poliklinikler poliklinikler_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.poliklinikler
    ADD CONSTRAINT poliklinikler_pkey PRIMARY KEY (id);


--
-- TOC entry 4877 (class 2606 OID 16684)
-- Name: randevular randevular_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.randevular
    ADD CONSTRAINT randevular_pkey PRIMARY KEY (id);


--
-- TOC entry 4889 (class 2606 OID 16753)
-- Name: sikayet_oneri sikayet_oneri_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sikayet_oneri
    ADD CONSTRAINT sikayet_oneri_pkey PRIMARY KEY (id);


--
-- TOC entry 4883 (class 2606 OID 16702)
-- Name: tahliller tahliller_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tahliller
    ADD CONSTRAINT tahliller_pkey PRIMARY KEY (id);


--
-- TOC entry 4879 (class 2606 OID 16905)
-- Name: randevular unique_doktor_randevu; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.randevular
    ADD CONSTRAINT unique_doktor_randevu UNIQUE (doktor_id, randevu_tarihi, randevu_saati);


--
-- TOC entry 4881 (class 2606 OID 16894)
-- Name: randevular unique_doktor_randevu_cakismasi; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.randevular
    ADD CONSTRAINT unique_doktor_randevu_cakismasi UNIQUE (doktor_id, randevu_tarihi, randevu_saati);


--
-- TOC entry 4885 (class 2606 OID 16720)
-- Name: yatislar yatislar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yatislar
    ADD CONSTRAINT yatislar_pkey PRIMARY KEY (id);


--
-- TOC entry 4911 (class 2620 OID 16896)
-- Name: tahliller trg_tahlil_eklendi; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_tahlil_eklendi AFTER INSERT ON public.tahliller FOR EACH ROW EXECUTE FUNCTION public.fn_randevu_tamamla();


--
-- TOC entry 4896 (class 2606 OID 16855)
-- Name: doktorlar doktorlar_kullanici_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doktorlar
    ADD CONSTRAINT doktorlar_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES public.kullanicilar(id);


--
-- TOC entry 4897 (class 2606 OID 16659)
-- Name: doktorlar doktorlar_poliklinik_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doktorlar
    ADD CONSTRAINT doktorlar_poliklinik_id_fkey FOREIGN KEY (poliklinik_id) REFERENCES public.poliklinikler(id);


--
-- TOC entry 4898 (class 2606 OID 16929)
-- Name: doktorlar fk_doktor_poliklinik; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doktorlar
    ADD CONSTRAINT fk_doktor_poliklinik FOREIGN KEY (poliklinik_id) REFERENCES public.poliklinikler(id);


--
-- TOC entry 4900 (class 2606 OID 16911)
-- Name: randevular fk_randevu_doktor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.randevular
    ADD CONSTRAINT fk_randevu_doktor FOREIGN KEY (doktor_id) REFERENCES public.doktorlar(id);


--
-- TOC entry 4901 (class 2606 OID 16906)
-- Name: randevular fk_randevu_hasta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.randevular
    ADD CONSTRAINT fk_randevu_hasta FOREIGN KEY (hasta_id) REFERENCES public.hastalar(id);


--
-- TOC entry 4904 (class 2606 OID 16897)
-- Name: tahliller fk_tahlil_randevu; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tahliller
    ADD CONSTRAINT fk_tahlil_randevu FOREIGN KEY (randevu_id) REFERENCES public.randevular(id);


--
-- TOC entry 4899 (class 2606 OID 16850)
-- Name: hastalar hastalar_kullanici_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hastalar
    ADD CONSTRAINT hastalar_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES public.kullanicilar(id);


--
-- TOC entry 4909 (class 2606 OID 16739)
-- Name: otopark_kayitlari otopark_kayitlari_hasta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otopark_kayitlari
    ADD CONSTRAINT otopark_kayitlari_hasta_id_fkey FOREIGN KEY (hasta_id) REFERENCES public.hastalar(id);


--
-- TOC entry 4894 (class 2606 OID 16647)
-- Name: personeller personeller_birim_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personeller
    ADD CONSTRAINT personeller_birim_id_fkey FOREIGN KEY (birim_id) REFERENCES public.poliklinikler(id);


--
-- TOC entry 4895 (class 2606 OID 16860)
-- Name: personeller personeller_kullanici_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personeller
    ADD CONSTRAINT personeller_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES public.kullanicilar(id);


--
-- TOC entry 4902 (class 2606 OID 16690)
-- Name: randevular randevular_doktor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.randevular
    ADD CONSTRAINT randevular_doktor_id_fkey FOREIGN KEY (doktor_id) REFERENCES public.doktorlar(id);


--
-- TOC entry 4903 (class 2606 OID 16685)
-- Name: randevular randevular_hasta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.randevular
    ADD CONSTRAINT randevular_hasta_id_fkey FOREIGN KEY (hasta_id) REFERENCES public.hastalar(id);


--
-- TOC entry 4910 (class 2606 OID 16754)
-- Name: sikayet_oneri sikayet_oneri_hasta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sikayet_oneri
    ADD CONSTRAINT sikayet_oneri_hasta_id_fkey FOREIGN KEY (hasta_id) REFERENCES public.hastalar(id);


--
-- TOC entry 4905 (class 2606 OID 16708)
-- Name: tahliller tahliller_doktor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tahliller
    ADD CONSTRAINT tahliller_doktor_id_fkey FOREIGN KEY (doktor_id) REFERENCES public.doktorlar(id);


--
-- TOC entry 4906 (class 2606 OID 16703)
-- Name: tahliller tahliller_hasta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tahliller
    ADD CONSTRAINT tahliller_hasta_id_fkey FOREIGN KEY (hasta_id) REFERENCES public.hastalar(id);


--
-- TOC entry 4907 (class 2606 OID 16721)
-- Name: yatislar yatislar_hasta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yatislar
    ADD CONSTRAINT yatislar_hasta_id_fkey FOREIGN KEY (hasta_id) REFERENCES public.hastalar(id);


--
-- TOC entry 4908 (class 2606 OID 16726)
-- Name: yatislar yatislar_sorumlu_hemsire_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yatislar
    ADD CONSTRAINT yatislar_sorumlu_hemsire_id_fkey FOREIGN KEY (personel_id) REFERENCES public.personeller(id);


-- Completed on 2026-02-24 10:45:06

--
-- PostgreSQL database dump complete
--

\unrestrict lULR67rXzVMRqknXCA8cdFi5UvcuFskTLgm7QMEkWwb5v1dmTuDN4TjgA7vdxMn

