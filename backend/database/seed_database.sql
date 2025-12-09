-- =====================================================
-- KIDS ACTIVITY - KOMPLETNA BAZA PODATAKA
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Obriši sve postojeće podatke
TRUNCATE TABLE reviews;
TRUNCATE TABLE reservations;
TRUNCATE TABLE time_slots;
TRUNCATE TABLE activities;
TRUNCATE TABLE locations;
TRUNCATE TABLE children;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 1. KORISNICI (1 admin, 5 roditelja, 30 institucija)
-- =====================================================
-- Lozinka za sve: password123 (bcrypt hash)

INSERT INTO users (id, name, email, password, role_as, created_at, updated_at) VALUES

-- ADMIN (role_as = 1)
(1, 'Admin Sistema', 'admin@kidsactivity.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 1, NOW(), NOW()),

-- RODITELJI (role_as = 0)
(2, 'Marko Petrović', 'marko.petrovic@gmail.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 0, NOW(), NOW()),
(3, 'Ana Jovanović', 'ana.jovanovic@gmail.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 0, NOW(), NOW()),
(4, 'Nikola Stojanović', 'nikola.stojanovic@gmail.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 0, NOW(), NOW()),
(5, 'Jelena Nikolić', 'jelena.nikolic@gmail.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 0, NOW(), NOW()),
(6, 'Stefan Đorđević', 'stefan.djordjevic@gmail.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 0, NOW(), NOW()),

-- INSTITUCIJE (role_as = 2) - ID 7-36
-- Plivanje (7-10)
(7, 'Plivački klub Delfin', 'delfin@swim.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(8, 'Aqua Kids Beograd', 'info@aquakids.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(9, 'Škola plivanja Poseidon', 'poseidon@gmail.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(10, 'Baby Swim Studio', 'babyswim@studio.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),

-- Fudbal (11-14)
(11, 'FK Mala Zvezda', 'malazvezda@fk.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(12, 'Fudbalska akademija Partizanče', 'partizance@akademija.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(13, 'Soccer Kids Academy', 'info@soccerkids.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(14, 'Mali Golman Škola', 'maligolman@skola.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),

-- Ples (15-17)
(15, 'Baletski studio Arabesque', 'arabesque@balet.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(16, 'Hip-Hop Dance Crew', 'hiphop@dance.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(17, 'Latino Kids Dance', 'latino@kids.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),

-- Edukacija (18-21)
(18, 'English Kids Academy', 'english@kids.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(19, 'Mala škola velikih znanja', 'malaskola@znanje.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(20, 'Matematički klub Pitagora', 'pitagora@math.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(21, 'Centar za učenje Einstein', 'einstein@centar.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),

-- Umetnost (22-24)
(22, 'Likovna radionica Paleta', 'paleta@art.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(23, 'Kreativni atelje Mali Pikaso', 'pikaso@atelje.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(24, 'Keramika studio Glinenko', 'glinenko@keramika.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),

-- Gimnastika (25-26)
(25, 'Gimnastički klub Olimp', 'olimp@gimnastika.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(26, 'Ritmička gimnastika Gracija', 'gracija@ritam.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),

-- Rođendani (27-28)
(27, 'Igraonica Čarobni zamak', 'zamak@igraonica.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(28, 'Party Kids Proslavlje', 'party@kids.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),

-- Klizanje (29)
(29, 'Škola klizanja Ice Stars', 'icestars@klizanje.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),

-- Priroda (30-31)
(30, 'Izviđački odred Vuk', 'vuk@izvidjaci.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(31, 'Eko kamp Zelena dolina', 'zelena@dolina.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),

-- Muzika (32-34)
(32, 'Muzička škola Harmonija', 'harmonija@muzika.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(33, 'Rock School Kids', 'rock@school.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(34, 'Dečji hor Zvončići', 'zvoncici@hor.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),

-- IT (35-36)
(35, 'Code Kids Akademija', 'code@kids.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW()),
(36, 'Robotika lab Junior', 'robotika@lab.rs', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4sZPVzFWxJHZ2M4G', 2, NOW(), NOW());

-- =====================================================
-- 2. DECA (minimum 2 po roditelju)
-- =====================================================

INSERT INTO children (id, parent_user_id, first_name, last_name, age, medical_restrictions, note, created_at, updated_at) VALUES
-- Marko Petrović (ID 2)
(1, 2, 'Luka', 'Petrović', 7, NULL, 'Voli fudbal i plivanje', NOW(), NOW()),
(2, 2, 'Mia', 'Petrović', 5, NULL, 'Zainteresovana za balet', NOW(), NOW()),

-- Ana Jovanović (ID 3)
(3, 3, 'Stefan', 'Jovanović', 10, 'Alergija na kikiriki', 'Napredni plivač', NOW(), NOW()),
(4, 3, 'Sara', 'Jovanović', 8, NULL, 'Voli likovne aktivnosti', NOW(), NOW()),
(5, 3, 'Nina', 'Jovanović', 4, NULL, 'Najmlađa, tek počinje sa aktivnostima', NOW(), NOW()),

-- Nikola Stojanović (ID 4)
(6, 4, 'Vuk', 'Stojanović', 12, NULL, 'Trenira fudbal 3 godine', NOW(), NOW()),
(7, 4, 'Tara', 'Stojanović', 9, 'Astma - izbegavati naporne aktivnosti', 'Voli muziku i ples', NOW(), NOW()),

-- Jelena Nikolić (ID 5)
(8, 5, 'Andrej', 'Nikolić', 6, NULL, 'Energično dete, voli sport', NOW(), NOW()),
(9, 5, 'Lena', 'Nikolić', 11, NULL, 'Odlična u školi, zanima je programiranje', NOW(), NOW()),

-- Stefan Đorđević (ID 6)
(10, 6, 'Marija', 'Đorđević', 8, NULL, 'Ritmička gimnastika joj je strast', NOW(), NOW()),
(11, 6, 'Filip', 'Đorđević', 13, 'Lakša povreda kolena - pazi na skokove', 'Svira gitaru', NOW(), NOW()),
(12, 6, 'Ana', 'Đorđević', 5, NULL, 'Voli crtanje i bojenje', NOW(), NOW());

-- =====================================================
-- 3. LOKACIJE (po instituciji)
-- =====================================================

INSERT INTO locations (id, institution_user_id, address, city, created_at, updated_at) VALUES
-- Plivanje
(1, 7, 'Bulevar oslobođenja 115', 'Beograd', NOW(), NOW()),
(2, 8, 'Takovska 28', 'Beograd', NOW(), NOW()),
(3, 9, 'Narodnog fronta 45', 'Novi Sad', NOW(), NOW()),
(4, 10, 'Kneza Miloša 12', 'Beograd', NOW(), NOW()),

-- Fudbal
(5, 11, 'Humska 1', 'Beograd', NOW(), NOW()),
(6, 12, 'Ljutice Bogdana 1a', 'Beograd', NOW(), NOW()),
(7, 13, 'Bulevar Mihajla Pupina 10', 'Novi Sad', NOW(), NOW()),
(8, 14, 'Cara Dušana 88', 'Niš', NOW(), NOW()),

-- Ples
(9, 15, 'Makedonska 22', 'Beograd', NOW(), NOW()),
(10, 16, 'Cara Lazara 15', 'Kragujevac', NOW(), NOW()),
(11, 17, 'Zmaj Jovina 5', 'Novi Sad', NOW(), NOW()),

-- Edukacija
(12, 18, 'Kralja Petra 55', 'Beograd', NOW(), NOW()),
(13, 19, 'Vojvode Stepe 120', 'Beograd', NOW(), NOW()),
(14, 20, 'Futoška 17', 'Novi Sad', NOW(), NOW()),
(15, 21, 'Vožda Karađorđa 8', 'Kragujevac', NOW(), NOW()),

-- Umetnost
(16, 22, 'Skadarska 33', 'Beograd', NOW(), NOW()),
(17, 23, 'Jovana Subotića 12', 'Subotica', NOW(), NOW()),
(18, 24, 'Strahinjića Bana 44', 'Beograd', NOW(), NOW()),

-- Gimnastika
(19, 25, 'Pariske komune 20', 'Beograd', NOW(), NOW()),
(20, 26, 'Đorđa Stanojevića 5', 'Novi Sad', NOW(), NOW()),

-- Rođendani
(21, 27, 'Bulevar kralja Aleksandra 200', 'Beograd', NOW(), NOW()),
(22, 28, 'Laze Kostića 9', 'Novi Sad', NOW(), NOW()),

-- Klizanje
(23, 29, 'Arsenija Čarnojevića 58', 'Beograd', NOW(), NOW()),

-- Priroda
(24, 30, 'Avalski drum bb', 'Beograd', NOW(), NOW()),
(25, 31, 'Fruškogorski put 15', 'Sremski Karlovci', NOW(), NOW()),

-- Muzika
(26, 32, 'Višnjićeva 7', 'Beograd', NOW(), NOW()),
(27, 33, 'Jevrejska 10', 'Novi Sad', NOW(), NOW()),
(28, 34, 'Đure Jakšića 3', 'Beograd', NOW(), NOW()),

-- IT
(29, 35, 'Bulevar Zorana Đinđića 64', 'Beograd', NOW(), NOW()),
(30, 36, 'Mišarska 25', 'Beograd', NOW(), NOW());

-- =====================================================
-- 4. AKTIVNOSTI (smislene po kategoriji)
-- =====================================================

INSERT INTO activities (id, institution_user_id, name, image_url, description, category, age_from, age_to, price, created_at, updated_at) VALUES

-- PLIVANJE (institucije 7-10)
(1, 7, 'Škola plivanja za početnike', NULL, 'Naučite vaše dete da pliva uz naše iskusne instruktore. Program je prilagođen uzrastu i sposobnostima svakog deteta. Mali grupe do 6 polaznika garantuju individualni pristup.', 'plivanje', 4, 8, 4500.00, NOW(), NOW()),
(2, 7, 'Napredni kurs plivanja', NULL, 'Za decu koja već znaju da plivaju. Usavršavanje svih plivačkih stilova i priprema za takmičenja. Treninzi 3 puta nedeljno.', 'plivanje', 8, 16, 5500.00, NOW(), NOW()),
(3, 8, 'Aqua Baby - plivanje za bebe', NULL, 'Rani kontakt sa vodom za bebe od 6 meseci do 3 godine. Roditelj je u vodi sa detetom. Razvoj motorike i samopouzdanja.', 'plivanje', 1, 3, 5000.00, NOW(), NOW()),
(4, 9, 'Rekreativno plivanje', NULL, 'Opušteni časovi plivanja za decu koja žele da uživaju u vodi bez pritiska takmičenja. Jednom nedeljno, subotom.', 'plivanje', 6, 14, 3000.00, NOW(), NOW()),
(5, 10, 'Vaterpolo za decu', NULL, 'Uvod u vaterpolo kroz igru. Razvoj timskog duha, koordinacije i plivačkih veština istovremeno.', 'plivanje', 8, 14, 4000.00, NOW(), NOW()),

-- FUDBAL (institucije 11-14)
(6, 11, 'Mali fudbal za najmlađe', NULL, 'Prva fudbalska iskustva za vaše mališane. Kroz igru učimo osnove fudbala, razvijamo motoriku i ljubav prema sportu.', 'fudbal', 4, 7, 3500.00, NOW(), NOW()),
(7, 11, 'Fudbalska škola - srednja grupa', NULL, 'Za decu koja već poznaju osnove. Rad na tehnici, taktici i fizičkoj pripremi. Treninzi 3x nedeljno.', 'fudbal', 8, 12, 4500.00, NOW(), NOW()),
(8, 12, 'Fudbalska akademija - takmičari', NULL, 'Profesionalni treninzi za mlade fudbalere koji žele da se takmiče. Pripreme za lige i turnire.', 'fudbal', 10, 16, 6000.00, NOW(), NOW()),
(9, 13, 'Fudbal za devojčice', NULL, 'Specijalizovana škola fudbala samo za devojčice. Prijateljska atmosfera i profesionalni pristup.', 'fudbal', 6, 14, 4000.00, NOW(), NOW()),
(10, 14, 'Škola golmana', NULL, 'Specijalizovani treninzi za mlade golmane. Rad na refleksima, pozicioniranju i hrabrosti.', 'fudbal', 8, 16, 5000.00, NOW(), NOW()),

-- PLES (institucije 15-17)
(11, 15, 'Klasičan balet za početnike', NULL, 'Uvod u svet baleta za najmlađe. Razvoj elegancije, koordinacije, muzikalnosti i discipline kroz igru.', 'ples', 4, 8, 4500.00, NOW(), NOW()),
(12, 15, 'Balet - napredni nivo', NULL, 'Za decu sa iskustvom u baletu. Rad na tehnici, priprema za nastupe i ispite.', 'ples', 8, 16, 5500.00, NOW(), NOW()),
(13, 16, 'Hip-Hop za početnike', NULL, 'Moderni plesovi i koreografije uz najnovije hitove. Izražavanje kroz pokret, razvoj ritma i koordinacije.', 'ples', 7, 14, 4000.00, NOW(), NOW()),
(14, 16, 'Breakdance radionica', NULL, 'Naučite osnovne breakdance poteze. Za energičnu decu koja vole izazove!', 'ples', 9, 16, 4500.00, NOW(), NOW()),
(15, 17, 'Latino plesovi za decu', NULL, 'Salsa, bachata i merengue prilagođeni deci. Veseli časovi puni energije i smeha.', 'ples', 6, 14, 4000.00, NOW(), NOW()),

-- EDUKACIJA (institucije 18-21)
(16, 18, 'Engleski kroz igru', NULL, 'Učenje engleskog jezika na zabavan način - kroz pesme, igre i priče. Prirodan pristup stranom jeziku.', 'edukacija', 4, 8, 5000.00, NOW(), NOW()),
(17, 18, 'Cambridge Exam Preparation', NULL, 'Priprema za Cambridge ispite (YLE, KET). Profesori sa međunarodnim sertifikatima.', 'edukacija', 9, 14, 7000.00, NOW(), NOW()),
(18, 19, 'Kreativna radionica za predškolce', NULL, 'Priprema za školu kroz igru. Razvoj pažnje, logike, fine motorike i socijalnih veština.', 'edukacija', 5, 7, 4000.00, NOW(), NOW()),
(19, 20, 'Matematika je zabavna!', NULL, 'Matematika kroz zanimljive probleme i igre. Razvoj logičkog mišljenja bez straha od brojeva.', 'edukacija', 6, 12, 4500.00, NOW(), NOW()),
(20, 21, 'Pomoć u učenju', NULL, 'Individualni i grupni časovi za sve predmete. Iskusni profesori, prilagođen pristup svakom detetu.', 'edukacija', 7, 15, 2500.00, NOW(), NOW()),

-- UMETNOST (institucije 22-24)
(21, 22, 'Crtanje i slikanje', NULL, 'Razvoj kreativnosti kroz različite likovne tehnike - akvarel, tempera, olovke, pasteli. Izložbe radova.', 'umetnost', 5, 14, 3500.00, NOW(), NOW()),
(22, 22, 'Ilustracija i strip', NULL, 'Naučite da crtate svoje likove i pravite stripove. Za mlade umetnike sa maštom!', 'umetnost', 8, 16, 4000.00, NOW(), NOW()),
(23, 23, 'Mala vajarska škola', NULL, 'Oblikovanje gline, plastelina i drugih materijala. 3D kreacije i razvoj prostorne inteligencije.', 'umetnost', 6, 14, 4000.00, NOW(), NOW()),
(24, 24, 'Keramika za decu', NULL, 'Pravljenje posuda, figurica i ukrasa od gline. Svako dete odnosi svoje radove kući!', 'umetnost', 7, 16, 4500.00, NOW(), NOW()),

-- GIMNASTIKA (institucije 25-26)
(25, 25, 'Sportska gimnastika - početni', NULL, 'Osnove sportske gimnastike za najmlađe. Razvoj snage, fleksibilnosti i koordinacije kroz igru.', 'gimnastika', 4, 8, 4000.00, NOW(), NOW()),
(26, 25, 'Sportska gimnastika - napredni', NULL, 'Za decu sa iskustvom. Rad na spravama, akrobatika, priprema za takmičenja.', 'gimnastika', 8, 16, 5500.00, NOW(), NOW()),
(27, 26, 'Ritmička gimnastika', NULL, 'Elegantne vežbe sa loptom, čunjevima, trakom i obručem uz muziku. Za devojčice svih uzrasta.', 'gimnastika', 5, 16, 5000.00, NOW(), NOW()),

-- ROĐENDANI (institucije 27-28)
(28, 27, 'Rođendan u igraonici - Standard', NULL, 'Organizacija rođendana: 2 sata zabave, animator, igre, balon ukrasi i torta. Do 15 dece.', 'rodjendani', 3, 10, 18000.00, NOW(), NOW()),
(29, 27, 'Rođendan u igraonici - Premium', NULL, 'Luksuzna proslava: 3 sata, 2 animatora, tematska dekoracija, foto-kutak, torta i sokovi. Do 20 dece.', 'rodjendani', 3, 12, 30000.00, NOW(), NOW()),
(30, 28, 'Tematski rođendan', NULL, 'Organizujemo rođendane na temu po vašem izboru: superheroji, princeze, dinosaurusi, Minecraft...', 'rodjendani', 4, 12, 25000.00, NOW(), NOW()),

-- KLIZANJE (institucija 29)
(31, 29, 'Škola klizanja za početnike', NULL, 'Naučite da klizate sigurno i sa stilom! Obezbeđena oprema za početnike. Mala grupe.', 'klizanje', 4, 10, 4000.00, NOW(), NOW()),
(32, 29, 'Klizanje - napredni', NULL, 'Usavršavanje tehnike i priprema za takmičenja u umetničkom klizanju.', 'klizanje', 8, 16, 5500.00, NOW(), NOW()),

-- PRIRODA (institucije 30-31)
(33, 30, 'Izviđački kurs vikend', NULL, 'Vikend u prirodi: orijentacija, preživljavanje, čvorovi, loženje vatre. Avantura za hrabre!', 'priroda', 8, 16, 6000.00, NOW(), NOW()),
(34, 30, 'Šumska škola', NULL, 'Redovne aktivnosti u prirodi - upoznavanje biljaka, životinja, ekologija kroz igru.', 'priroda', 5, 12, 4000.00, NOW(), NOW()),
(35, 31, 'Letnji eko kamp', NULL, 'Celodnevni boravak u prirodi tokom raspusta. Radionice, igre, kupanje, druženje.', 'priroda', 7, 14, 8000.00, NOW(), NOW()),

-- MUZIKA (institucije 32-34)
(36, 32, 'Klavir za početnike', NULL, 'Individualni časovi klavira. Klasična muzika i popularne melodije. Instrument obezbeđen za vežbanje.', 'muzika', 6, 16, 5000.00, NOW(), NOW()),
(37, 32, 'Violina za decu', NULL, 'Učenje violine od početka. Razvoj muzikalnosti, strpljenja i fine motorike.', 'muzika', 6, 14, 5500.00, NOW(), NOW()),
(38, 33, 'Gitara za početnike', NULL, 'Akustična i električna gitara. Naučite omiljene pesme i osnove muzičke teorije.', 'muzika', 8, 18, 4500.00, NOW(), NOW()),
(39, 33, 'Bubnjevi i udaraljke', NULL, 'Za decu punu energije! Naučite ritam i koordinaciju na bubnjevima.', 'muzika', 8, 18, 5000.00, NOW(), NOW()),
(40, 34, 'Dečji hor', NULL, 'Grupno pevanje, nastupi na priredbama i takmičenjima. Razvoj glasa i muzikalnosti.', 'muzika', 6, 14, 3000.00, NOW(), NOW()),

-- IT (institucije 35-36)
(41, 35, 'Scratch programiranje', NULL, 'Uvod u programiranje kroz vizuelni jezik Scratch. Kreiranje igara, animacija i priča.', 'it', 7, 12, 5500.00, NOW(), NOW()),
(42, 35, 'Python za tinejdžere', NULL, 'Pravo programiranje za starije. Osnove Python-a, projekti i priprema za budućnost.', 'it', 12, 18, 7000.00, NOW(), NOW()),
(43, 36, 'Robotika - LEGO', NULL, 'Gradnja i programiranje LEGO robota. STEM edukacija kroz praktičan rad i zabavu.', 'it', 7, 12, 6000.00, NOW(), NOW()),
(44, 36, 'Arduino radionica', NULL, 'Elektronika i programiranje za napredne. Pravljenje pravih uređaja i gadžeta!', 'it', 12, 18, 7500.00, NOW(), NOW());

-- =====================================================
-- 5. TERMINI (u budućnosti - sledeća 3 meseca)
-- =====================================================

INSERT INTO time_slots (id, activity_id, institution_user_id, location_id, date, time_from, time_to, available, capacity, booked, created_at, updated_at) VALUES

-- Plivanje termini (aktivnosti 1-5)
(1, 1, 7, 1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '10:00', '11:00', 1, 8, 2, NOW(), NOW()),
(2, 1, 7, 1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '11:00', '12:00', 1, 8, 0, NOW(), NOW()),
(3, 1, 7, 1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '10:00', '11:00', 1, 8, 1, NOW(), NOW()),
(4, 1, 7, 1, DATE_ADD(CURDATE(), INTERVAL 7 DAY), '10:00', '11:00', 1, 8, 0, NOW(), NOW()),
(5, 2, 7, 1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '14:00', '15:30', 1, 10, 3, NOW(), NOW()),
(6, 2, 7, 1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '14:00', '15:30', 1, 10, 0, NOW(), NOW()),
(7, 3, 8, 2, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '09:00', '09:45', 1, 6, 2, NOW(), NOW()),
(8, 3, 8, 2, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '09:00', '09:45', 1, 6, 0, NOW(), NOW()),
(9, 4, 9, 3, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '11:00', '12:00', 1, 12, 4, NOW(), NOW()),
(10, 5, 10, 4, DATE_ADD(CURDATE(), INTERVAL 7 DAY), '16:00', '17:30', 1, 14, 5, NOW(), NOW()),

-- Fudbal termini (aktivnosti 6-10)
(11, 6, 11, 5, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '17:00', '18:00', 1, 16, 8, NOW(), NOW()),
(12, 6, 11, 5, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '17:00', '18:00', 1, 16, 0, NOW(), NOW()),
(13, 7, 11, 5, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '18:00', '19:30', 1, 20, 12, NOW(), NOW()),
(14, 7, 11, 5, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '18:00', '19:30', 1, 20, 0, NOW(), NOW()),
(15, 8, 12, 6, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '17:00', '19:00', 1, 22, 15, NOW(), NOW()),
(16, 9, 13, 7, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '16:00', '17:30', 1, 16, 6, NOW(), NOW()),
(17, 10, 14, 8, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '15:00', '16:30', 1, 8, 3, NOW(), NOW()),

-- Ples termini (aktivnosti 11-15)
(18, 11, 15, 9, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '16:00', '17:00', 1, 12, 7, NOW(), NOW()),
(19, 11, 15, 9, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '16:00', '17:00', 1, 12, 0, NOW(), NOW()),
(20, 12, 15, 9, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '17:00', '18:30', 1, 10, 6, NOW(), NOW()),
(21, 13, 16, 10, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '18:00', '19:00', 1, 15, 9, NOW(), NOW()),
(22, 14, 16, 10, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '18:00', '19:30', 1, 12, 0, NOW(), NOW()),
(23, 15, 17, 11, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '17:00', '18:00', 1, 14, 5, NOW(), NOW()),

-- Edukacija termini (aktivnosti 16-20)
(24, 16, 18, 12, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '17:00', '18:00', 1, 10, 4, NOW(), NOW()),
(25, 16, 18, 12, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '17:00', '18:00', 1, 10, 0, NOW(), NOW()),
(26, 17, 18, 12, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '18:00', '19:30', 1, 8, 5, NOW(), NOW()),
(27, 18, 19, 13, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '10:00', '11:30', 1, 12, 6, NOW(), NOW()),
(28, 19, 20, 14, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '16:00', '17:00', 1, 8, 3, NOW(), NOW()),
(29, 20, 21, 15, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '15:00', '16:00', 1, 6, 2, NOW(), NOW()),

-- Umetnost termini (aktivnosti 21-24)
(30, 21, 22, 16, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '11:00', '12:30', 1, 10, 4, NOW(), NOW()),
(31, 21, 22, 16, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '11:00', '12:30', 1, 10, 0, NOW(), NOW()),
(32, 22, 22, 16, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '14:00', '15:30', 1, 8, 2, NOW(), NOW()),
(33, 23, 23, 17, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '10:00', '11:30', 1, 8, 3, NOW(), NOW()),
(34, 24, 24, 18, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '15:00', '17:00', 1, 6, 2, NOW(), NOW()),

-- Gimnastika termini (aktivnosti 25-27)
(35, 25, 25, 19, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '16:00', '17:00', 1, 14, 8, NOW(), NOW()),
(36, 25, 25, 19, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '16:00', '17:00', 1, 14, 0, NOW(), NOW()),
(37, 26, 25, 19, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '17:00', '18:30', 1, 12, 7, NOW(), NOW()),
(38, 27, 26, 20, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '17:00', '18:30', 1, 10, 6, NOW(), NOW()),

-- Rođendani termini (aktivnosti 28-30)
(39, 28, 27, 21, DATE_ADD(CURDATE(), INTERVAL 7 DAY), '14:00', '16:00', 1, 1, 0, NOW(), NOW()),
(40, 28, 27, 21, DATE_ADD(CURDATE(), INTERVAL 8 DAY), '14:00', '16:00', 1, 1, 0, NOW(), NOW()),
(41, 29, 27, 21, DATE_ADD(CURDATE(), INTERVAL 9 DAY), '11:00', '14:00', 1, 1, 0, NOW(), NOW()),
(42, 30, 28, 22, DATE_ADD(CURDATE(), INTERVAL 10 DAY), '15:00', '18:00', 1, 1, 0, NOW(), NOW()),

-- Klizanje termini (aktivnosti 31-32)
(43, 31, 29, 23, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '10:00', '11:00', 1, 10, 4, NOW(), NOW()),
(44, 31, 29, 23, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '10:00', '11:00', 1, 10, 0, NOW(), NOW()),
(45, 32, 29, 23, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '11:00', '12:30', 1, 8, 3, NOW(), NOW()),

-- Priroda termini (aktivnosti 33-35)
(46, 33, 30, 24, DATE_ADD(CURDATE(), INTERVAL 7 DAY), '09:00', '17:00', 1, 20, 8, NOW(), NOW()),
(47, 34, 30, 24, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '10:00', '12:00', 1, 15, 6, NOW(), NOW()),
(48, 35, 31, 25, DATE_ADD(CURDATE(), INTERVAL 14 DAY), '08:00', '18:00', 1, 25, 10, NOW(), NOW()),

-- Muzika termini (aktivnosti 36-40)
(49, 36, 32, 26, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '15:00', '15:45', 1, 1, 0, NOW(), NOW()),
(50, 36, 32, 26, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '16:00', '16:45', 1, 1, 0, NOW(), NOW()),
(51, 36, 32, 26, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '15:00', '15:45', 1, 1, 0, NOW(), NOW()),
(52, 37, 32, 26, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '17:00', '17:45', 1, 1, 0, NOW(), NOW()),
(53, 38, 33, 27, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '17:00', '18:00', 1, 4, 2, NOW(), NOW()),
(54, 39, 33, 27, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '18:00', '19:00', 1, 3, 1, NOW(), NOW()),
(55, 40, 34, 28, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '17:00', '18:30', 1, 20, 12, NOW(), NOW()),

-- IT termini (aktivnosti 41-44)
(56, 41, 35, 29, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '16:00', '17:30', 1, 12, 6, NOW(), NOW()),
(57, 41, 35, 29, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '16:00', '17:30', 1, 12, 0, NOW(), NOW()),
(58, 42, 35, 29, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '17:30', '19:00', 1, 10, 4, NOW(), NOW()),
(59, 43, 36, 30, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '15:00', '16:30', 1, 10, 5, NOW(), NOW()),
(60, 44, 36, 30, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '16:30', '18:00', 1, 8, 3, NOW(), NOW());

-- =====================================================
-- 6. REZERVACIJE (nekoliko primera)
-- =====================================================

INSERT INTO reservations (id, parent_user_id, child_id, time_slot_id, activity_id, institution_user_id, status, note, created_at, updated_at) VALUES
-- Marko Petrović - Luka (fudbal i plivanje)
(1, 2, 1, 11, 6, 11, 'confirmed', 'Luka jedva čeka trening!', NOW(), NOW()),
(2, 2, 1, 1, 1, 7, 'confirmed', NULL, NOW(), NOW()),
-- Marko Petrović - Mia (balet)
(3, 2, 2, 18, 11, 15, 'pending', 'Mia prvi put ide na balet', NOW(), NOW()),

-- Ana Jovanović - Stefan (napredni plivač)
(4, 3, 3, 5, 2, 7, 'confirmed', NULL, NOW(), NOW()),
-- Ana Jovanović - Sara (likovno)
(5, 3, 4, 30, 21, 22, 'confirmed', 'Sara obožava da crta', NOW(), NOW()),
-- Ana Jovanović - Nina (kreativna radionica)
(6, 3, 5, 27, 18, 19, 'pending', NULL, NOW(), NOW()),

-- Nikola Stojanović - Vuk (fudbal)
(7, 4, 6, 15, 8, 12, 'confirmed', 'Vuk je kapiten ekipe', NOW(), NOW()),
-- Nikola Stojanović - Tara (muzika - hor)
(8, 4, 7, 55, 40, 34, 'confirmed', NULL, NOW(), NOW()),

-- Jelena Nikolić - Andrej (gimnastika)
(9, 5, 8, 35, 25, 25, 'confirmed', NULL, NOW(), NOW()),
-- Jelena Nikolić - Lena (programiranje)
(10, 5, 9, 56, 41, 35, 'confirmed', 'Lena želi da nauči da pravi igrice', NOW(), NOW()),

-- Stefan Đorđević - Marija (ritmička gimnastika)
(11, 6, 10, 38, 27, 26, 'confirmed', NULL, NOW(), NOW()),
-- Stefan Đorđević - Filip (gitara)
(12, 6, 11, 53, 38, 33, 'pending', NULL, NOW(), NOW()),
-- Stefan Đorđević - Ana (crtanje)
(13, 6, 12, 30, 21, 22, 'confirmed', NULL, NOW(), NOW());

-- =====================================================
-- 7. RECENZIJE (nekoliko primera)
-- =====================================================

INSERT INTO reviews (id, user_id, institution_user_id, rating, comment, date, approved, institution_response, responded_at, created_at, updated_at) VALUES
(1, 2, 7, 5, 'Odlična škola plivanja! Luka je naučio da pliva za samo mesec dana. Instruktori su strpljivi i profesionalni.', CURDATE(), 1, 'Hvala vam na lepim rečima! Drago nam je da je Luka napredovao. Vidimo se na bazenima!', NOW(), NOW(), NOW()),
(2, 2, 11, 5, 'Mala Zvezda je fantastična! Moj sin obožava treninge i napreduje iz dana u dan.', DATE_SUB(CURDATE(), INTERVAL 5 DAY), 1, 'Hvala! Vuk je talentovan i vredan, zadovoljstvo je raditi sa njim.', NOW(), NOW(), NOW()),
(3, 3, 7, 4, 'Veoma dobra škola, jedina zamerka je što je ponekad gužva u svlačionicama.', DATE_SUB(CURDATE(), INTERVAL 10 DAY), 1, 'Hvala na povratnoj informaciji. Radimo na proširenju kapaciteta svlačionica.', NOW(), NOW(), NOW()),
(4, 3, 22, 5, 'Sara je oduševljena likovnom radionicom! Svake nedelje jedva čeka čas.', DATE_SUB(CURDATE(), INTERVAL 3 DAY), 1, NULL, NULL, NOW(), NOW()),
(5, 4, 12, 5, 'Profesionalna akademija sa odličnim trenerima. Vuk je značajno napredovao.', DATE_SUB(CURDATE(), INTERVAL 7 DAY), 1, 'Hvala! Vuk je pravi lider na terenu. Očekujemo velike stvari od njega!', NOW(), NOW(), NOW()),
(6, 4, 34, 4, 'Dečji hor je super, deca se lepo druže. Malo bi više nastupa bilo dobro.', DATE_SUB(CURDATE(), INTERVAL 14 DAY), 1, NULL, NULL, NOW(), NOW()),
(7, 5, 25, 5, 'Gimnastički klub Olimp je najbolji izbor za naše dete. Preporučujem svima!', DATE_SUB(CURDATE(), INTERVAL 2 DAY), 1, 'Hvala na preporuci! Andrej ima veliki potencijal.', NOW(), NOW(), NOW()),
(8, 5, 35, 5, 'Code Kids je fantastičan! Lena je napravila svoju prvu igricu i presrećna je.', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1, NULL, NULL, NOW(), NOW()),
(9, 6, 26, 5, 'Gracija je savršena za našu Mariju. Trenerice su divne i posvećene.', DATE_SUB(CURDATE(), INTERVAL 4 DAY), 1, 'Hvala vam! Marija je izuzetno talentovana i vredna devojčica.', NOW(), NOW(), NOW()),
(10, 6, 33, 4, 'Dobra škola gitare, Filip napreduje. Cena je malo viša ali vredna.', DATE_SUB(CURDATE(), INTERVAL 8 DAY), 1, NULL, NULL, NOW(), NOW());

-- =====================================================
-- KRAJ SKRIPTE
-- =====================================================
-- Podaci ubačeni:
-- - 1 admin
-- - 5 roditelja
-- - 30 institucija
-- - 12 dece
-- - 30 lokacija
-- - 44 aktivnosti
-- - 60 termina
-- - 13 rezervacija
-- - 10 recenzija
-- =====================================================

SELECT 'Baza uspešno popunjena!' AS Status;
