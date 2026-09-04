-- 0029_dua_story_content.sql
--
-- Moves Dua and Stories from mobile/src/data/mock.ts + i18n into the
-- database, admin-editable from admin/index.html — the tables
-- themselves already existed (duas, stories, 0002_content_tables.sql)
-- and 0005_seed_content.sql already seeded a stale, English-only
-- subset (the app has never actually read from them; see that
-- migration's own header comment and supabase/README.md's stub
-- list). This migration:
--   1. inserts the remaining duas/stories 0005 never seeded (mock.ts
--      grew to 12 duas and 5 stories since 0005 was written)
--   2. adds dua_translations / story_translations — one row per
--      (item, lang), the same relational multi-language shape
--      quran_translations already uses, rather than a single-language
--      column or an embedded JSONB blob — so admin/index.html can
--      edit one language at a time the same way it already edits
--      Quran translations
--   3. seeds every row in every one of the 4 app languages (az/en/ru/
--      tr) from the *exact* text already live in
--      mobile/src/i18n/locales/*.json — copied verbatim (generated
--      with a script that reads those files directly), never
--      retyped or reworded, so this is a relocation of already-
--      reviewed content, not new content needing a fresh review
--   4. grants admins insert/update/delete on all four tables — 0015_
--      admin_panel.sql deliberately skipped duas/stories ("an admin
--      UI for tables the app doesn't read would just be confusing"),
--      which stops being true once mobile/app/child/dua.tsx and
--      stories/[id].tsx are switched over to read these tables
--
-- Games stays out of scope on purpose: its only real "content" is 3
-- short titles (mobile/src/data/mock.ts's `games`) — the actual game
-- logic is hardcoded in app/child/games/{find-pair,memory,word-
-- puzzle}.tsx, so a DB row for it wouldn't be meaningfully admin-
-- editable, the same reasoning worldSites already documented for
-- itself (see mock.ts's WorldSite comment).

-- ---------------------------------------------------------------------
-- Fill in the duas/stories 0005_seed_content.sql never got to.
-- title/subtitle here are just an English reference label for the
-- admin panel's row list — the real, per-language display text lives
-- in *_translations below.
-- ---------------------------------------------------------------------
insert into public.duas (slug, title, category, arabic, transliteration, sort_order)
values
  ('morning2', 'Waking-up Dua', 'Morning', 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', 'Alhamdu lillahil-ladhi ahyana ba''da ma amatana wa ilayhin-nushur', 2),
  ('morning3', 'Knowledge Dua', 'Morning', 'رَبِّ زِدْنِي عِلْمًا', 'Rabbi zidni ilma', 3),
  ('evening2', 'Protection Dua', 'Evening', 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', 'A''udhu bikalimatillahit-tammati min sharri ma khalaq', 5),
  ('evening3', 'Gratitude Dua', 'Evening', 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ', 'Rabbi awzi''ni an ashkura ni''mataka', 6),
  ('sleep2', 'Night Dua', 'Sleep', 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ', 'Allahumma qini adhabaka yawma tab''athu ''ibadak', 8),
  ('sleep3', 'Lying Down to Sleep', 'Sleep', 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ', 'Bismika rabbi wada''tu janbi wa bika arfa''uh', 9),
  ('eat2', 'After Eating', 'Eat', 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ', 'Alhamdu lillahil-ladhi at''amana wa saqana wa ja''alana muslimeen', 11),
  ('eat3', 'Beginning-and-End Dua', 'Eat', 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ', 'Bismillahi awwalahu wa akhirahu', 12)
on conflict (slug) do nothing;

insert into public.stories (slug, title, subtitle, icon, tone, unlock_level, sort_order)
values
  ('nuh', 'The Story of Prophet Nuh (AS)', 'The great flood', 'shield', 'green', 1, 3),
  ('yusuf', 'The Story of Prophet Yusuf (AS)', 'From the well to the palace', 'crown', 'purple', 10, 5)
on conflict (slug) do nothing;

-- musa was seeded by 0005 with unlock_level 5; mock.ts locks it behind
-- level 5 too (`locked: true`), so no change needed there.

-- ---------------------------------------------------------------------
-- dua_translations / story_translations
-- ---------------------------------------------------------------------
create table public.dua_translations (
  dua_id uuid not null references public.duas(id) on delete cascade,
  lang text not null,
  title text not null,
  meaning text not null,
  primary key (dua_id, lang)
);

alter table public.dua_translations enable row level security;

create policy "Anyone can view dua translations"
  on public.dua_translations for select
  to anon, authenticated
  using (true);

create policy "Admins can manage dua translations"
  on public.dua_translations for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create table public.story_translations (
  story_id uuid not null references public.stories(id) on delete cascade,
  lang text not null,
  title text not null,
  subtitle text not null,
  -- array of paragraph strings, in reading order — matches
  -- quiz_questions.options' existing jsonb-array-of-content shape.
  paragraphs jsonb not null,
  primary key (story_id, lang),
  constraint story_translations_paragraphs_is_array check (jsonb_typeof(paragraphs) = 'array')
);

alter table public.story_translations enable row level security;

create policy "Anyone can view story translations"
  on public.story_translations for select
  to anon, authenticated
  using (true);

create policy "Admins can manage story translations"
  on public.story_translations for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Admin write access on the base tables too — 0015_admin_panel.sql
-- deliberately skipped these (see this file's own header comment).
-- ---------------------------------------------------------------------
create policy "Admins can manage duas"
  on public.duas for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage stories"
  on public.stories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Seed every translation row, in all 4 app languages, copied verbatim
-- from mobile/src/i18n/locales/*.json (content.dua.*, content.
-- duaMeaning.*, content.stories.*, content.storyContent.*).
-- ---------------------------------------------------------------------
insert into public.dua_translations (dua_id, lang, title, meaning)
select d.id, x.lang, x.title, x.meaning
from public.duas d
cross join (values
  ('morning', 'az', 'Səhər duası', 'Ya Rəbbim! Biz Sənin köməyinlə səhərə çıxdıq, Sənin köməyinlə axşama çatırıq.'),
  ('morning', 'en', 'Morning Dua', 'O my Lord! With Your help we have reached the morning, and with Your help we reach the evening.'),
  ('morning', 'ru', 'Утренняя дуа', 'О мой Господь! С Твоей помощью мы дожили до утра, с Твоей помощью доживём до вечера.'),
  ('morning', 'tr', 'Sabah Duası', 'Ya Rabbi! Senin yardımınla sabaha ulaştık, senin yardımınla akşama ulaşırız.'),
  ('morning2', 'az', 'Oyanış duası', 'Bizi öldükdən (yuxudan) sonra dirildən Allaha həmd olsun, dönüş də Onadır.'),
  ('morning2', 'en', 'Waking-up Dua', 'Praise be to Allah who gave us life after taking it from us in sleep, and to Him is the return.'),
  ('morning2', 'ru', 'Дуа при пробуждении', 'Хвала Аллаху, Который оживил нас после того, как умертвил (сном), и к Нему возвращение.'),
  ('morning2', 'tr', 'Uyanma Duası', 'Bizi öldürdükten (uyuttuktan) sonra dirilten Allah''a hamd olsun, dönüş de O''nadır.'),
  ('morning3', 'az', 'Elm duası', 'Ya Rəbbim! Elmimi artır.'),
  ('morning3', 'en', 'Knowledge Dua', 'O my Lord, increase me in knowledge.'),
  ('morning3', 'ru', 'Дуа о знании', 'О мой Господь, приумножь мои знания.'),
  ('morning3', 'tr', 'İlim Duası', 'Ya Rabbi! İlmimi artır.'),
  ('evening', 'az', 'Axşam duası', 'Ya Rəbbim! Biz Sənin köməyinlə axşama çatdıq, Sənin köməyinlə səhərə çıxırıq.'),
  ('evening', 'en', 'Evening Dua', 'O my Lord! With Your help we have reached the evening, and with Your help we reach the morning.'),
  ('evening', 'ru', 'Вечерняя дуа', 'О мой Господь! С Твоей помощью мы дожили до вечера, с Твоей помощью доживём до утра.'),
  ('evening', 'tr', 'Akşam Duası', 'Ya Rabbi! Senin yardımınla akşama ulaştık, senin yardımınla sabaha ulaşırız.'),
  ('evening2', 'az', 'Qorunma duası', 'Allahın kamil sözlərinə sığınıram, yaratdıqlarının şərindən qorunmaq üçün.'),
  ('evening2', 'en', 'Protection Dua', 'I seek refuge in the perfect words of Allah from the evil of what He has created.'),
  ('evening2', 'ru', 'Дуа о защите', 'Я прибегаю к совершенным словам Аллаха от зла того, что Он сотворил.'),
  ('evening2', 'tr', 'Korunma Duası', 'Allah''ın eksiksiz sözlerine sığınırım, yarattıklarının şerinden korunmak için.'),
  ('evening3', 'az', 'Şükür duası', 'Ya Rəbbim! Mənə nemətinə şükür etməyi nəsib et.'),
  ('evening3', 'en', 'Gratitude Dua', 'O my Lord, enable me to be grateful for Your favor.'),
  ('evening3', 'ru', 'Дуа благодарности', 'О мой Господь, дай мне быть благодарным за Твою милость.'),
  ('evening3', 'tr', 'Şükür Duası', 'Ya Rabbi! Bana nimetine şükretmeyi nasip et.'),
  ('sleep', 'az', 'Yatmazdan əvvəl', 'Sənin adınla, Allahım, ölürəm (yatıram) və dirilirəm (oyanıram).'),
  ('sleep', 'en', 'Before Sleep', 'In Your name, O Allah, I die (sleep) and I live (wake up).'),
  ('sleep', 'ru', 'Перед сном', 'С Твоим именем, о Аллах, я умираю (сплю) и оживаю (просыпаюсь).'),
  ('sleep', 'tr', 'Uyumadan Önce', 'Senin adınla, Allah''ım, ölürüm (uyurum) ve dirilirim (uyanırım).'),
  ('sleep2', 'az', 'Gecə duası', 'Ya Rəbbim! Məni əzabından qoru.'),
  ('sleep2', 'en', 'Night Dua', 'O my Lord, protect me from Your punishment.'),
  ('sleep2', 'ru', 'Ночная дуа', 'О мой Господь, убереги меня от Твоего наказания.'),
  ('sleep2', 'tr', 'Gece Duası', 'Ya Rabbi! Beni azabından koru.'),
  ('sleep3', 'az', 'Yan üstə uzananda', 'Sənin adınla, Rəbbim, yanımı yerə qoyuram, yenə Sənin adınla qaldırıram.'),
  ('sleep3', 'en', 'Lying Down to Sleep', 'In Your name, my Lord, I lay down my side, and in Your name I raise it up again.'),
  ('sleep3', 'ru', 'Ложась спать', 'С Твоим именем, мой Господь, я ложусь на бок, и с Твоим именем я поднимаюсь.'),
  ('sleep3', 'tr', 'Yan Yatarken', 'Senin adınla, Rabbim, yanımı yere koyarım, yine senin adınla kaldırırım.'),
  ('eat', 'az', 'Yeməkdən əvvəl', 'Allahın adı ilə.'),
  ('eat', 'en', 'Before Eating', 'In the name of Allah.'),
  ('eat', 'ru', 'Перед едой', 'С именем Аллаха.'),
  ('eat', 'tr', 'Yemekten Önce', 'Allah''ın adıyla.'),
  ('eat2', 'az', 'Yeməkdən sonra', 'Bizi yedirən, içirdən və müsəlman edən Allaha həmd olsun.'),
  ('eat2', 'en', 'After Eating', 'Praise be to Allah who fed us, gave us drink, and made us Muslims.'),
  ('eat2', 'ru', 'После еды', 'Хвала Аллаху, Который накормил и напоил нас и сделал нас мусульманами.'),
  ('eat2', 'tr', 'Yemekten Sonra', 'Bizi doyuran, içiren ve Müslüman eden Allah''a hamd olsun.'),
  ('eat3', 'az', 'Əvvəli-sonu duası', 'Allahın adı ilə, əvvəlində də, sonunda da.'),
  ('eat3', 'en', 'Beginning-and-End Dua', 'In the name of Allah, at its beginning and at its end.'),
  ('eat3', 'ru', 'Дуа начала и конца', 'С именем Аллаха, в начале её и в конце.'),
  ('eat3', 'tr', 'Başı-Sonu Duası', 'Allah''ın adıyla, başında da sonunda da.')
) as x(slug, lang, title, meaning)
where d.slug = x.slug
on conflict (dua_id, lang) do nothing;

insert into public.story_translations (story_id, lang, title, subtitle, paragraphs)
select s.id, x.lang, x.title, x.subtitle, x.paragraphs::jsonb
from public.stories s
cross join (values
  ('yunus', 'az', 'Peyğəmbər Yunusun (ə.s) hekayəsi', 'Balığın içində', '["Yunus peyğəmbər (ə.s) Ninova şəhərinin xalqına Allahın elçisi olaraq göndərilmişdi. O, insanları Allaha inanmağa və doğru yola çağırırdı.","Xalqı ona uzun müddət qulaq asmadı. Yunus (ə.s) kədərləndi və Allahın icazəsini gözləmədən şəhəri tərk edib bir gəmiyə mindi.","Dənizdə güclü fırtına qopdu. Gəmini yüngülləşdirmək üçün püşk atıldı və növbə Yunusa (ə.s) düşdü. O, dənizə atıldı və Allahın əmri ilə böyük bir balıq onu ududu.","Balığın qarnında, dənizin dərinliyində, qaranlıq içində Yunus (ə.s) səhvini başa düşdü və bütün qəlbi ilə Allaha yalvardı: \"Səndən başqa ilah yoxdur, Sən pak və müqəddəssən, həqiqətən mən zalımlardan oldum.\"","Allah onun səmimi tövbəsini qəbul etdi. Balıq onu sahilə buraxdı. Yunus (ə.s) çox zəif idi, Allah ona kölgə və qida versin deyə üzərində bir bitki bitirdi.","Yunus (ə.s) xalqının yanına qayıtdı. Bu dəfə onlar artıq iman gətirmişdilər və xilas oldular. Bu hekayə bizə öyrədir: Allah, ürəkdən tövbə edən hər kəsi bağışlayır — hətta ən qaranlıq anda belə."]'),
  ('yunus', 'en', 'The Story of Prophet Yunus (AS)', 'Inside the whale', '["Prophet Yunus (peace be upon him) was sent by Allah as a messenger to the people of Nineveh. He called them to believe in Allah and follow the right path.","His people did not listen to him for a long time. Yunus (peace be upon him) became upset and left the city without waiting for Allah''s permission, boarding a ship.","A powerful storm hit the sea. To make the ship lighter, the sailors drew lots, and the lot fell on Yunus. He was thrown into the sea, and by Allah''s command, a huge fish swallowed him.","Inside the fish, in the depths of the dark sea, Yunus (peace be upon him) realized his mistake and called out to Allah with all his heart: \"There is no god but You, glory be to You, indeed I was among the wrongdoers.\"","Allah accepted his sincere repentance. The fish released him onto the shore. Yunus (peace be upon him) was very weak, so Allah made a plant grow over him to give him shade and food.","Yunus (peace be upon him) returned to his people. By then, they had already come to believe, and they were saved. This story teaches us: Allah forgives anyone who repents sincerely — even in the darkest moment."]'),
  ('yunus', 'ru', 'История пророка Юнуса (мир ему)', 'Внутри кита', '["Пророк Юнус (мир ему) был послан Аллахом посланником к жителям Ниневии. Он призывал их уверовать в Аллаха и следовать верному пути.","Его народ долго не слушал его. Юнус (мир ему) огорчился и покинул город, не дождавшись позволения Аллаха, и сел на корабль.","В море разразился сильный шторм. Чтобы облегчить корабль, моряки бросили жребий, и жребий пал на Юнуса. Его бросили в море, и по велению Аллаха огромная рыба проглотила его.","Внутри рыбы, в глубине тёмного моря, Юнус (мир ему) осознал свою ошибку и всем сердцем воззвал к Аллаху: «Нет божества, кроме Тебя, Пречист Ты, поистине я был из числа несправедливых».","Аллах принял его искреннее покаяние. Рыба выбросила его на берег. Юнус (мир ему) был очень слаб, и Аллах вырастил над ним растение, чтобы дать ему тень и пищу.","Юнус (мир ему) вернулся к своему народу. К тому времени они уже уверовали и были спасены. Эта история учит нас: Аллах прощает каждого, кто искренне кается, — даже в самый тёмный момент."]'),
  ('yunus', 'tr', 'Peygamber Yunus''un (AS) Hikayesi', 'Balığın içinde', '["Yunus Peygamber (a.s.), Ninova halkına Allah''ın elçisi olarak gönderildi. Onları Allah''a inanmaya ve doğru yola çağırdı.","Halkı onu uzun süre dinlemedi. Yunus (a.s.) üzüldü ve Allah''ın izni olmadan şehri terk edip bir gemiye bindi.","Denizde şiddetli bir fırtına koptu. Gemiyi hafifletmek için kura çekildi ve sıra Yunus''a düştü. Denize atıldı ve Allah''ın emriyle büyük bir balık onu yuttu.","Balığın karnında, karanlık denizin derinliklerinde Yunus (a.s.) hatasını anladı ve tüm kalbiyle Allah''a yalvardı: \"Senden başka ilah yoktur, Sen yücesin, gerçekten ben zalimlerden oldum.\"","Allah onun içten tövbesini kabul etti. Balık onu sahile bıraktı. Yunus (a.s.) çok güçsüzdü, Allah ona gölge ve besin versin diye üzerinde bir bitki yeşertti.","Yunus (a.s.) halkının yanına döndü. Bu kez onlar zaten iman etmişlerdi ve kurtuldular. Bu hikaye bize şunu öğretir: Allah, içtenlikle tövbe eden herkesi bağışlar — en karanlık anda bile."]'),
  ('ibrahim', 'az', 'Peyğəmbər İbrahim (ə.s)', 'Allahın dostu', '["İbrahim peyğəmbər (ə.s) bütlərə sitayiş edən bir cəmiyyətdə böyüdü, amma kiçik yaşlarından Allahın vəhdaniyyətinə inanırdı.","O, atasına və xalqına daş və taxta bütlərin heç kimə fayda və ya zərər verə bilmədiyini izah etməyə çalışdı, amma onu dinləmədilər.","Bir gün İbrahim (ə.s) böyük bütdən başqa hamısını sındırdı və baltanı ən böyük bütün boynuna asdı. Xalq geri qayıdanda ondan soruşdu, o isə dedi: \"Bunu bu böyük büt edib, ondan soruşun, əgər danışa bilirsə.\"","Xalq qəzəbləndi və onu böyük bir tonqalda yandırmaq qərarına gəldi. Amma Allah oda əmr etdi: \"Ey od, İbrahim üçün sərinlik və salamatlıq ol!\" Və İbrahim (ə.s) oddan zərər görmədən sağ çıxdı.","İbrahim (ə.s) sonralar oğlu İsmayıl (ə.s) ilə birlikdə Məkkədə Kəbəni tikdi — insanların Allaha ibadət etdiyi ilk ev.","İbrahim (ə.s) Allaha olan güclü etibarı və imanına görə \"Xəlilullah\" — Allahın dostu adlandırıldı. Bu hekayə bizə öyrədir: Allaha həqiqi imanla bağlanan hər kəsi O, hər çətinlikdə qoruyur."]'),
  ('ibrahim', 'en', 'Prophet Ibrahim (AS)', 'The friend of Allah', '["Prophet Ibrahim (peace be upon him) grew up in a society that worshipped idols, but from an early age he believed in the oneness of Allah.","He tried to explain to his father and his people that idols made of stone and wood could neither help nor harm anyone, but they would not listen to him.","One day, Ibrahim (peace be upon him) broke all the idols except the largest one and hung the axe on it. When the people returned and asked him, he said: \"The big one did it — ask it, if it can speak.\"","The people grew angry and decided to burn him in a great fire. But Allah commanded the fire: \"O fire, be cool and safe for Ibrahim!\" And Ibrahim (peace be upon him) came out unharmed.","Later, Ibrahim (peace be upon him) built the Kaaba in Makkah together with his son Ismail (peace be upon him) — the first house built for people to worship Allah.","Because of his strong trust and faith in Allah, Ibrahim (peace be upon him) was called \"Khalilullah\" — the Friend of Allah. This story teaches us: Allah protects everyone who holds firmly to true faith in Him, in every hardship."]'),
  ('ibrahim', 'ru', 'Пророк Ибрахим (мир ему)', 'Друг Аллаха', '["Пророк Ибрахим (мир ему) рос в обществе, поклонявшемся идолам, но с раннего возраста верил в единство Аллаха.","Он пытался объяснить своему отцу и народу, что идолы из камня и дерева не могут ни помочь, ни навредить, но его не слушали.","Однажды Ибрахим (мир ему) разбил всех идолов, кроме самого большого, и повесил топор на его шею. Когда народ вернулся и спросил его, он сказал: «Это сделал вот этот большой — спросите его, если он умеет говорить».","Народ разгневался и решил сжечь его в большом костре. Но Аллах повелел огню: «О огонь, будь прохладным и безопасным для Ибрахима!» И Ибрахим (мир ему) вышел невредимым.","Позже Ибрахим (мир ему) вместе со своим сыном Исмаилом (мир ему) построил Каабу в Мекке — первый дом, воздвигнутый для поклонения Аллаху.","За крепкое доверие и веру в Аллаха Ибрахима (мир ему) назвали «Халилуллах» — Друг Аллаха. Эта история учит нас: Аллах защищает каждого, кто искренне держится веры в Него, в любой трудности."]'),
  ('ibrahim', 'tr', 'Peygamber İbrahim (AS)', 'Allah''ın dostu', '["İbrahim Peygamber (a.s.), putlara tapan bir toplumda büyüdü, ama küçük yaşından itibaren Allah''ın birliğine inanıyordu.","Babasına ve halkına, taştan ve tahtadan yapılan putların kimseye fayda ya da zarar veremeyeceğini anlatmaya çalıştı, ama onu dinlemediler.","Bir gün İbrahim (a.s.) en büyüğü hariç tüm putları kırdı ve baltayı en büyük putun boynuna astı. Halk dönüp ona sorunca şöyle dedi: \"Bunu şu büyük put yaptı, ona sorun, eğer konuşabiliyorsa.\"","Halk öfkelendi ve onu büyük bir ateşte yakmaya karar verdi. Ama Allah ateşe şöyle emretti: \"Ey ateş, İbrahim için serin ve güvenli ol!\" Ve İbrahim (a.s.) hiç zarar görmeden çıktı.","Daha sonra İbrahim (a.s.), oğlu İsmail (a.s.) ile birlikte Mekke''de Kâbe''yi inşa etti — insanların Allah''a ibadet ettiği ilk ev.","İbrahim (a.s.), Allah''a olan güçlü güveni ve imanı nedeniyle \"Halilullah\" — Allah''ın dostu olarak anıldı. Bu hikaye bize şunu öğretir: Allah, O''na gerçek imanla bağlanan herkesi her zorlukta korur."]'),
  ('nuh', 'az', 'Peyğəmbər Nuhun (ə.s) hekayəsi', 'Böyük tufan', '["Nuh peyğəmbər (ə.s) xalqını uzun illər Allaha ibadət etməyə və doğru yola çağırdı, amma çox az adam ona inandı.","Xalqı ona istehza edir və inanmırdı. Allah Nuha (ə.s) böyük bir gəmi düzəltməsini əmr etdi.","Nuh (ə.s) illərlə səbrlə gəmini tikdi, ətrafındakılar ona gülsə də, o, Allahın əmrinə əməl etməkdə davam etdi.","Gəmi hazır olanda Allah ona hər heyvan növündən bir cüt və inananları gəmiyə mindirməsini buyurdu.","Böyük tufan başladı və bütün yer su altında qaldı. Yalnız gəmidəkilər xilas oldu.","Su çəkiləndən sonra gəmi bir dağın üstündə dayandı. Nuh (ə.s) və inananlar yenidən yer üzündə həyata başladılar. Bu hekayə bizə səbir və Allaha güvənməyin qiymətini öyrədir."]'),
  ('nuh', 'en', 'The Story of Prophet Nuh (AS)', 'The great flood', '["Prophet Nuh (peace be upon him) called his people to worship Allah and follow the right path for many years, but very few believed him.","His people mocked him and refused to believe. Allah commanded Nuh (peace be upon him) to build a great ship.","Nuh (peace be upon him) patiently built the ship for years, even as those around him laughed at him — he kept obeying Allah''s command.","When the ship was ready, Allah commanded him to bring aboard a pair of every kind of animal, along with the believers.","A great flood began, and the whole earth was covered in water. Only those aboard the ship were saved.","When the water receded, the ship came to rest on a mountain. Nuh (peace be upon him) and the believers began life on earth anew. This story teaches us the value of patience and trust in Allah."]'),
  ('nuh', 'ru', 'История пророка Нуха (мир ему)', 'Великий потоп', '["Пророк Нух (мир ему) много лет призывал свой народ поклоняться Аллаху и следовать верному пути, но поверили ему очень немногие.","Его народ насмехался над ним и не верил. Аллах повелел Нуху (мир ему) построить большой корабль.","Нух (мир ему) терпеливо строил корабль много лет, хотя окружающие смеялись над ним — он продолжал выполнять веление Аллаха.","Когда корабль был готов, Аллах повелел взять на него по паре каждого вида животных, а также верующих.","Начался великий потоп, и вся земля оказалась под водой. Спаслись только те, кто был на корабле.","Когда вода спала, корабль остановился на горе. Нух (мир ему) и верующие начали новую жизнь на земле. Эта история учит нас ценности терпения и доверия к Аллаху."]'),
  ('nuh', 'tr', 'Peygamber Nuh''un (AS) Hikayesi', 'Büyük tufan', '["Nuh Peygamber (a.s.), halkını uzun yıllar Allah''a ibadet etmeye ve doğru yola çağırdı, ama çok azı ona inandı.","Halkı onunla alay etti ve inanmadı. Allah, Nuh''a (a.s.) büyük bir gemi inşa etmesini emretti.","Nuh (a.s.) yıllarca sabırla gemiyi inşa etti, çevresindekiler ona gülse de Allah''ın emrine uymaya devam etti.","Gemi hazır olduğunda, Allah ona her hayvan türünden bir çift ile inananları gemiye almasını buyurdu.","Büyük bir tufan başladı ve tüm yeryüzü suyla kaplandı. Yalnızca gemidekiler kurtuldu.","Sular çekildikten sonra gemi bir dağın üzerinde durdu. Nuh (a.s.) ve inananlar yeryüzünde yeniden hayata başladı. Bu hikaye bize sabrın ve Allah''a güvenmenin değerini öğretir."]'),
  ('musa', 'az', 'Peyğəmbər Musa (ə.s)', 'Əsa və dəniz', '["Musa peyğəmbər (ə.s) Misirdə, zalım fironun hökm sürdüyü bir dövrdə dünyaya gəldi. Firon bütün yeni doğulan oğlan uşaqlarının öldürülməsini əmr etmişdi.","Anası Allahın vəhyi ilə balaca Musanı bir səbətə qoyub çaya buraxdı. Səbət Fironun sarayına çatdı və Musa (ə.s) orada, Fironun ailəsinin yanında böyüdü.","Böyüdükdən sonra Musa (ə.s) Misiri tərk etməli oldu. Illər sonra Tur dağında Allah ona vəhy göndərdi və onu peyğəmbər seçdi, əsasını möcüzəli bir əlamətə çevirdi.","Allah Musanı (ə.s) qardaşı Harunla (ə.s) birlikdə Fironun yanına göndərdi ki, İsrail oğullarını azad etsin və insanları haqqa çağırsın. Firon inadla imtina etdi.","Musa (ə.s) xalqını gecə vaxtı Misirdən çıxartdı. Firon və ordusu onları təqib edərək Qırmızı dənizin kənarında tutdular.","Allahın əmri ilə Musa (ə.s) əsası ilə dənizə vurdu və dəniz iki yerə ayrıldı. Xalq quru yolla dənizin o tayına keçdi, Firon və ordusu isə arxalarınca girəndə dəniz yenidən birləşdi.","Bu hekayə bizə öyrədir: Allah çətin anlarda Ona güvənən və səbir edən qullarına həmişə bir çıxış yolu göstərir."]'),
  ('musa', 'en', 'Prophet Musa (AS)', 'The staff and the sea', '["Prophet Musa (peace be upon him) was born in Egypt, during the rule of a cruel pharaoh who had ordered that every newborn boy be killed.","By Allah''s inspiration, his mother placed baby Musa in a basket and set it on the river. The basket reached Pharaoh''s palace, and Musa grew up there, among Pharaoh''s own family.","When he grew up, Musa (peace be upon him) had to leave Egypt. Years later, on Mount Sinai, Allah sent him revelation and chose him as a prophet, turning his staff into a miraculous sign.","Allah sent Musa (peace be upon him), together with his brother Harun (peace be upon him), to Pharaoh, to free the Children of Israel and call people to the truth. Pharaoh stubbornly refused.","Musa (peace be upon him) led his people out of Egypt at night. Pharaoh and his army chased after them and caught up with them at the shore of the Red Sea.","By Allah''s command, Musa (peace be upon him) struck the sea with his staff, and it split into two. His people crossed safely on dry land, but when Pharaoh and his army followed them in, the sea closed again.","This story teaches us: Allah always shows a way out to those who trust and remain patient in Him, even in the hardest moments."]'),
  ('musa', 'ru', 'Пророк Муса (мир ему)', 'Посох и море', '["Пророк Муса (мир ему) родился в Египте во времена жестокого фараона, который приказал убивать всех новорождённых мальчиков.","По внушению Аллаха его мать положила младенца Мусу в корзину и пустила по реке. Корзина попала во дворец фараона, и Муса вырос там, среди семьи фараона.","Повзрослев, Муса (мир ему) был вынужден покинуть Египет. Спустя годы на горе Синай Аллах ниспослал ему откровение и избрал его пророком, превратив его посох в чудесное знамение.","Аллах послал Мусу (мир ему) вместе с его братом Харуном (мир ему) к фараону, чтобы освободить сынов Исраила и призвать людей к истине. Фараон упрямо отказался.","Муса (мир ему) вывел свой народ из Египта ночью. Фараон со своим войском погнался за ними и настиг их на берегу Красного моря.","По велению Аллаха Муса (мир ему) ударил посохом по морю, и оно расступилось надвое. Его народ перешёл по суше на другой берег, а когда фараон с войском последовал за ними, море снова сомкнулось.","Эта история учит нас: Аллах всегда указывает путь тем, кто доверяет Ему и проявляет терпение, даже в самые трудные моменты."]'),
  ('musa', 'tr', 'Peygamber Musa (AS)', 'Asa ve deniz', '["Musa Peygamber (a.s.), Mısır''da, zalim bir firavunun hüküm sürdüğü bir dönemde doğdu. Firavun, yeni doğan tüm erkek çocukların öldürülmesini emretmişti.","Annesi, Allah''ın ilhamıyla küçük Musa''yı bir sepete koyup nehre bıraktı. Sepet Firavun''un sarayına ulaştı ve Musa (a.s.) orada, Firavun''un ailesinin yanında büyüdü.","Büyüdükten sonra Musa (a.s.) Mısır''ı terk etmek zorunda kaldı. Yıllar sonra Sina Dağı''nda Allah ona vahiy gönderdi ve onu peygamber seçti, asasını mucizevi bir işarete dönüştürdü.","Allah, Musa''yı (a.s.) kardeşi Harun (a.s.) ile birlikte Firavun''a gönderdi ki İsrailoğullarını özgür bıraksın ve insanları hakka çağırsın. Firavun inatla reddetti.","Musa (a.s.) halkını geceleyin Mısır''dan çıkardı. Firavun ve ordusu onları takip ederek Kızıldeniz kıyısında yakaladı.","Allah''ın emriyle Musa (a.s.) asasıyla denize vurdu ve deniz ikiye ayrıldı. Halkı kuru bir yoldan denizin diğer tarafına geçti; Firavun ve ordusu peşlerinden girince deniz yeniden birleşti.","Bu hikaye bize şunu öğretir: Allah, en zor anlarda bile O''na güvenen ve sabreden kullarına her zaman bir çıkış yolu gösterir."]'),
  ('yusuf', 'az', 'Peyğəmbər Yusufun (ə.s) hekayəsi', 'Quyudan saraya', '["Yusuf (ə.s) atası Yaqub peyğəmbərin çox sevdiyi oğlu idi. Bu, bəzi qardaşlarında paxıllıq yaratdı.","Qardaşları onu bir quyuya atdılar və atalarına yalan danışdılar.","Yusuf (ə.s) bir karvan tərəfindən tapıldı və Misirdə kölə olaraq satıldı.","Allah ona yuxu yozmaq bacarığı verdi. Bu bacarıq sayəsində Misir hökmdarının etimadını qazandı.","Yusuf (ə.s) böyük bir aclıq zamanı ölkəni müdrikliklə idarə etdi və xalqı xilas etdi.","İllər sonra qardaşları taxıl almaq üçün Misirə gəldilər, onu tanımadılar. Yusuf (ə.s) onları bağışladı və ailəsi ilə yenidən qovuşdu. Bu hekayə bizə səbir, bağışlamaq və Allaha güvənməyi öyrədir."]'),
  ('yusuf', 'en', 'The Story of Prophet Yusuf (AS)', 'From the well to the palace', '["Yusuf (peace be upon him) was the beloved son of Prophet Yaqub, which stirred jealousy in some of his brothers.","His brothers threw him into a well and lied to their father about what happened.","Yusuf (peace be upon him) was found by a passing caravan and sold as a slave in Egypt.","Allah gave him the ability to interpret dreams, which earned him the trust of Egypt''s ruler.","During a great famine, Yusuf (peace be upon him) governed the country wisely and saved its people.","Years later, his brothers came to Egypt to buy grain and did not recognize him. Yusuf (peace be upon him) forgave them and was reunited with his family. This story teaches us patience, forgiveness, and trust in Allah."]'),
  ('yusuf', 'ru', 'История пророка Юсуфа (мир ему)', 'От колодца до дворца', '["Юсуф (мир ему) был любимым сыном пророка Якуба, что вызвало зависть у некоторых его братьев.","Братья бросили его в колодец и солгали отцу о случившемся.","Юсуфа (мир ему) нашёл проходивший караван и продал его в рабство в Египте.","Аллах даровал ему способность толковать сны, благодаря чему он заслужил доверие правителя Египта.","Во время сильного голода Юсуф (мир ему) мудро управлял страной и спас её народ.","Спустя годы его братья приехали в Египет за зерном и не узнали его. Юсуф (мир ему) простил их и воссоединился со своей семьёй. Эта история учит нас терпению, прощению и доверию к Аллаху."]'),
  ('yusuf', 'tr', 'Peygamber Yusuf''un (AS) Hikayesi', 'Kuyudan saraya', '["Yusuf (a.s.), babası Yakub Peygamberin çok sevdiği oğluydu. Bu durum bazı kardeşlerinde kıskançlığa yol açtı.","Kardeşleri onu bir kuyuya attı ve babalarına yalan söyledi.","Yusuf (a.s.) geçmekte olan bir kervan tarafından bulundu ve Mısır''da köle olarak satıldı.","Allah ona rüya yorumlama yeteneği verdi. Bu yetenek sayesinde Mısır hükümdarının güvenini kazandı.","Büyük bir kıtlık döneminde Yusuf (a.s.) ülkeyi bilgelikle yönetti ve halkını kurtardı.","Yıllar sonra kardeşleri tahıl almak için Mısır''a geldi ve onu tanımadılar. Yusuf (a.s.) onları affetti ve ailesiyle yeniden kavuştu. Bu hikaye bize sabrı, affetmeyi ve Allah''a güvenmeyi öğretir."]')
) as x(slug, lang, title, subtitle, paragraphs)
where s.slug = x.slug
on conflict (story_id, lang) do nothing;
