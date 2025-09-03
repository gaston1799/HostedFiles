// ==UserScript==
// @name Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @namespace gaston.presence
// @version 1.3.1
// @description Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @match *://*.roblox.com/*
// @run-at document-idle
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @connect localhost
// @connect 127.0.0.1
// @connect users.roblox.com
// @connect avatar.roblox.com
// @connect inventory.roblox.com
// @connect economy.roblox.com
// @connect catalog.roblox.com
// @license MIT
// @name:en Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:es Roblox Presence Dashboard + Fit Cloner (paquetes de USD + Último visto) - terminado
// @name:el Roblox Παρουσία Πίνακας Παρουσίου + Fit Cloner (πακέτα USD + Τελευταία είδηση) - τελείωσε
// @name:eo Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Vidita) - Finita
// @name:fi ROBLOX INSIDOR Dashboard + Fit Cloner (USD -pakkaukset + viimeksi nähty) - Valmis
// @name:de Roblox -Präsenz Dashboard + Fit Cloner (USD Packs + zuletzt gesehen) - fertiggestellt
// @name:ar Roblox Loving Dashboard + Fit Cloner (حزم الدولار + آخر مرة) - انتهى
// @name:cs Dashboard Present Present Presention + Fit Cloner (USD Packs + naposledy) - hotový
// @name:bg Roblox присъствие табло за управление + Fit Cloner (USD пакети + Last See) - завършен
// @name:da Roblox Presence Dashboard + Fit Cloner (USD Packs + sidst set) - Færdig
// @name:he לוח מחוונים של נוכחות Roblox + Fit Cloner (חבילות USD + שנראה לאחרונה) - סיים
// @name:ko Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) - 완성
// @name:id Dasbor kehadiran roblox + fit cloner (paket usd + terakhir terlihat) - selesai
// @name:fr ROBLOX présence tableau de bord + cloner Fit (packs USD + dernier vu) - Fini
// @name:hu Roblox jelenléti Dashboard + Fit Cloner (USD csomagok + utoljára látva) - Kész
// @name:hr Roblox prisutnost nadzorne ploče + fit cloner (USD paketi + zadnji put vidljivo) - gotov
// @name:ka Roblox Perence Dashboard + Fit Cloner (USD პაკეტები + ბოლოს ნახეს) - დასრულდა
// @name:mr रोब्लॉक्स उपस्थिती डॅशबोर्ड + फिट क्लोनर (यूएसडी पॅक + अंतिम पाहिले) - समाप्त
// @name:it ROBLOX Presence Dashboard + Fit Cloner (pacchetti USD + ultimo visto) - finito
// @name:ja Robloxのプレゼンスダッシュボード +フィットクローナー（USDパック +最後に見た） - 終了
// @name:pt-BR Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:nl Roblox aanwezigheid dashboard + fit cloner (USD Packs + laatst gezien) - voltooid
// @name:ro Roblox prezență Dashboard + Fit Cloner (pachete USDS + ultima dată) - terminat
// @name:sv Roblox närvaro instrumentpanel + fit cloner (USD -paket + senast sett) - färdig
// @name:sr Роблок присутност Дасхбоард + Фит Цлонер (УСД пакети + последњи виђен) - Завршено
// @name:sk Dashboard prítomnosti Roblox + Fit Cloner (USD Packs + Last See) - Dokončené
// @name:th Roblox Presence Dashboard + Fit Cloner (USD แพ็ค + เห็นล่าสุด) - เสร็จสิ้น
// @name:ru Roblox Present Dashboard + Fit Cloner (пакеты USD + последний вид) - закончен
// @name:pl ROBLOX PTASKA PRZEDSTAWICA DASKA + FIT CLONER (paczki USD + ostatnio widziane) - gotowe
// @name:nb Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:aa Robloksi Dashborxi + Fit Kiloon (USD Paaks + ellecabo seen) - gaba kaleh
// @name:vi Bảng điều khiển hiện diện Roblox + Fit Cloner (gói USD + nhìn thấy lần cuối) - đã hoàn thành
// @name:uk Roblox присутність приладів + Fit Cloner (USD Packs + Last Beef) - закінчений
// @name:ckb داشبۆردێکی ئامادەیی ڕۆبلۆکس + فیت کلۆنەر (پاکەکانی USD + دوایین بینین) — تەواو بوو
// @name:zh-CN Roblox Stickent仪表板 + FIT克隆器（USD Packs + Last看到） - 完成
// @name:tr Roblox Varlık Gösterge Tablosu + Fit Cloner (USD Paketler + Son Görüldü) - Bitmiş
// @name:fr-CA ROBLOX présence tableau de bord + cloner Fit (packs USD + dernier vu) - Fini
// @name:ug روبلوكىس مەۋجۇتلۇقى باشقۇرۇش تاختىسى + ماسلاشتۇرۇلغان كلون (USD بولاق + ئەڭ ئاخىرقى قېتىم) - تاماملاندى
// @name:zh-TW Roblox Stickent儀表板 + FIT克隆器（USD Packs + Last看到） - 完成
// @name:ab Roblox Presence Dashboard + Аклонер иақәшәо ​​(USD Packs + Аҵыхәтәантәи абара) — ихыркәшоуп
// @name:ast Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:ak Roblox a ɛwɔ hɔ Dashboard + Fit Cloner (USD Packs + nea etwa to a wohu) — awie .
// @name:as Roblox উপস্থিতি ডেচবোৰ্ড + ফিট ক্ল'নাৰ (USD পেক + শেষ দেখা) — সমাপ্ত
// @name:av Roblox Presence Deasence + Клонер (USD Packs + Ахирисеб бихьана) — лъугӀизабуна
// @name:af Roblox Presence Dashboard + Fit Cloner (USD Packs + Last gesien) - Voltooi
// @name:ba Resence приборҙар таҡтаһы + Fit Cloner (USD пакеттар + Һуңғы күрелгән) — тамамланды
// @name:ae Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:am ሮቢቶክስ መኖር ዳሽቦርድ + ተስማሚ ሰኔ (የአሜሪካ ፓኬጆች + የመጨረሻ መታየት) - ተጠናቅቋል
// @name:ay Roblox Presence Dashboard + Fit Cloner (USD Packs + Qhipa uñt’ata) — tukuyata
// @name:az ROBLOX HƏDİYYƏSİ TƏMİRLİ + FIT Cloner (USD paketləri + Son görülmüşdür) - bitdi
// @name:bn রোব্লক্স উপস্থিতি ড্যাশবোর্ড + ফিট ক্লোনার (ইউএসডি প্যাকস + সর্বশেষ দেখা) - সমাপ্ত
// @name:ce Roblox Presence Dashboard + Fit Cloner (USD Packs + ТӀаьххьара гина) — чекхъяьлла
// @name:br Roblox presencia pante
// @name:bi Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:ca ROLLOX Presència de comandament + Cloner Fit (Packs USD + per última vegada) - Acabat
// @name:bh Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:bo རོབ་ལོགསི་(Ressence Pashshard) + གྱོན་ཆས་རིགས་མཚུངས་བཟོ་ཆས་(ཨ་སྒོར་གྱི་ཐུམ་སྒྲིལ་+ མཐའ་མཇུག་གི་མཐོང་བ་) — མཇུག་སྒྲིལ།
// @name:bm Roblox Presence Dashboard + Fit Cloner (USD pakew + yelen laban) — a banna .
// @name:be Прыборная панэль Roblox + Cloner Fit (пакеты USD + апошні бачылі) - скончана
// @name:bs Predanost Roblox-a Nadzorna ploča + FIT Cloner (USD paketi + zadnji viđen) - Završeno
// @name:cy Dangosfwrdd Presenoldeb Roblox + Cloner Fit (Pecynnau USD + Gweld Diwethaf) - Gorffennwyd
// @name:chr Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:co Roblox Presenza Dashboard + Fit Cloner (Packs USD + l'ultimu vistu) - finitu
// @name:ch I Manma'gås-ta gi i Ropblota + Fit Fina'na' gi i Manma'gås-ta (USD Packs + Uttimo na Seino) — manma'gåsi
// @name:cu Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:dz རོབ་ལོགསི་པེརེསི་ནེསི་ ཌེཤ་བོརཌ་ + ཕིཊི་ ཀླན་ནར་ (ཡུ་ཨེསི་ཌི་ ཐུམ་སྒྲིལ་ + མཇུག་འཚོལ་) —མཇུག་བསྡུ་ཡོདཔ།
// @name:ceb Roblox Pressue Dashboard + Haom Cloner (USD packs + Katapusan nga nakita) - nahuman
// @name:cr Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:cv Roblox Presence панелĕ + Fit Cloner (USD Packs + Laste Seen) —
// @name:dv ރޮބްލޮކްސް ޕްރެޒެންސް ޑޭޝްބޯޑް + ފިޓް ކްލޯނަރ (ޔޫއެސްޑީ ޕެކްސް + އެންމެ ފަހުން ފެނުނު) — ނިމިއްޖެ
// @name:fa داشبورد حضور Roblox + Cloner Fit (بسته های USD + آخرین دیده شده) - به پایان رسید
// @name:ee Roblox ƒe anyinɔnɔ Dashboard + Fit Cloner (USD Packs + mamlɛtɔ si wokpɔ) — wowu enu
// @name:fo Roblox Nærverandi stýriborð + Fitt kloner (USD Pakkar + Seinast Sæð) — liðugt
// @name:et Roblox Presentay armatuurlaud + sobiv klooner (USD pakid + viimati nähtud) - viimistletud
// @name:ga Roblox Láithreacht Painéal na nIonstraimí + Fit Cloner (USD Packs + le feiceáil go deireanach) - Críochnaithe
// @name:fil Roblox Presence Dashboard + Fit Cloner (USD Packs + Huling Nakita) - Tapos na
// @name:eu ROBLOX Presentzia Arbela + Fit Cloner (USD paketeak + azken ikusi) - amaitu da
// @name:fy Roblox oanwêzigens Dashboard + Fit Cloner (USD-pakketten + lêst sjoen) - Klear
// @name:fj Na Roblox Plassbord Dashboard + Fit Cronor (SD Packs + Ni oti sa oti .
// @name:ff Roblox Pre Dashboard + Fit Cloner (Kuutorɗe USD + Yiylo cakkitiiɗo) — gasi
// @name:gsw-berne Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:hi Roblox Presence डैशबोर्ड + फिट क्लोनर (USD पैक + अंतिम देखा) - समाप्त
// @name:ho Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:ha Roblox kasance Dashboard Dashboard + Fit Cloner (US fakitoci + na ƙarshe gani) - gama
// @name:hmn Roblox muaj cov dashboard + haum cloner (USD pob + kawg pom) - tiav lawm
// @name:gu રોબ્લોક્સ હાજરી ડેશબોર્ડ + ફિટ ક્લોનર (યુએસડી પેક્સ + છેલ્લે જોયું) - સમાપ્ત
// @name:gd Reblox làthaireachd deas-bhòrd + fialaidh clune (pacaidean USD + mu dheireadh) - crìochnaichte
// @name:gv Dashboard Presence Roblox + Cloner Fit (USD Packs + y Sheen.
// @name:gn Roblox Presencia Dashboard + Cloner de ajuste (paquetes de USD + última ojehecháva) — Oñemohu'ãva
// @name:gl Dashboard Roblox Presence + Fit Cloner (USD Packs + Last Visto) - Rematado
// @name:ht Roblox prezans tablodbò + anfòm kloner (USD pake + dènye wè) - fini
// @name:jv Dashboard Presensi Roblox + pas Cloner (bungkus USD) katon pungkasan) - rampung
// @name:ie Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:iu Roblox Fresence Dashbord + Fit-ᑯᑦ ᑎᑎᕋᐅᔭᒐᖏᑦ (USD-ᑯᑦ ᐸᐃᑉᐹᑦ + ᑭᖑᓪᓕᖅᐹᒥ ᑕᑯᔭᖏᑦ) — ᐱᔭᕇᖅᑕᐅᓯᒪᔪᑦ
// @name:hy ROBLOX- ի ներկայության վահանակ + Fit Cloner (USD փաթեթներ + Վերջին տեսած) - ավարտված
// @name:hz Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:ig ROBBOX Source Dashbox + dabara adaba (mkpọchi USD + hụrụ ikpeazụ) - Emechara
// @name:is Roblox viðveru mælaborð + Fit Cloner (USD pakkar + síðast séð) - Lokið
// @name:ik Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:ia Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:ki Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:kk Roblox құрамының бақылау тақтасы + Fit Cloner (USD пакеттері + соңғы көрінді) - аяқталды
// @name:ku Roblox hebûna Dashboard + Cloner Fit (Packs USD + dîtina paşîn) - qediya
// @name:kl Roblox-ip dashboard + Fit-kloner (USD-pakke + Kingulleq Seen) — naammassineqarpoq
// @name:kr Dashboard Robloxbe + Cloner kalkal (USD Packs + Seen dareye) — tamotəna
// @name:kg Roblox Tablo de la présence + Cloner Fit (Packs USD + Nsuka Seen) — me manisa
// @name:ks Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:kj Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:km ផ្ទាំងគ្រប់គ្រងវត្តមានរបស់ Roblox + សមក្រិនសម (កញ្ចប់ដុល្លារ + បានឃើញចុងក្រោយ) - បានបញ្ចប់
// @name:kn ರಾಬ್ಲಾಕ್ಸ್ ಉಪಸ್ಥಿತಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ + ಫಿಟ್ ಕ್ಲೋನರ್ (ಯುಎಸ್‌ಡಿ ಪ್ಯಾಕ್‌ಗಳು + ಕೊನೆಯದಾಗಿ ನೋಡಲಾಗಿದೆ) - ಮುಗಿದಿದೆ
// @name:kv Roblox Presence Dashboard + Fit Cloner (USD пакетъяс + Бӧръя Seen) — помавліс .
// @name:lo ປະກົດຕົວຂອງ RoboBox + Cloner ທີ່ເຫມາະສົມ (ຖົງ USD + ເຫັນສຸດທ້າຍ) - ສໍາເລັດຮູບ
// @name:lg Roblox Presence Dashboard + Fit Cloner (USD Packs + Yasembayo okulabibwa) — Ewedde
// @name:ln Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — Esili
// @name:lb Roblox Präsenz Dashboard + fit Zousaz (USD Packs + lescht gesinn) - fäerdeg
// @name:ky Roblox панелинин пальтосу + FIT CLONER (USD Packs + акыркы жолу көрүндү) - Аякталды
// @name:la Cloner + Fit Roblox praesas ashboard (Pagesings + Pages) - complevit
// @name:lif Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:kw Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:lt „Roblox“ buvimo prietaisų skydelis + „Fit Cloner“ (USD pakuotės + paskutinį kartą
// @name:mk Dashboard за присуство на Roblox + Fit Cloner (УСД пакувања + последно видено) - Завршено
// @name:ml റോബ്ലോക്സ് സാന്നിധ്യം ഡാഷ്ബോർഡ് + ഫിറ്റ് ക്ലോണർ (യുഎസ്ഡി പായ്ക്ക് + അവസാനം കണ്ടു) - പൂർത്തിയായി
// @name:mh Ej juon wāween eo em̧m̧an . + + +
// @name:mo Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:lv Roblox klātbūtnes informācijas panelis + fit cloner (USD pakotnes + pēdējo reizi redzētā) - pabeigts
// @name:mt Roblox Presence Dashboard + Fit Cloner (USD Packs + l-aħħar li rajt) - lest
// @name:ms Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) - Selesai
// @name:mn Roblox Est Est Oidd самбар + тохирох CLONER (SATE PASTER CLATER (SASTABS + СОНГУУЛЬД) - дууссан
// @name:mg Ny fanatrehan'ny Roblox + mifanentana amin'ny fonosana USD + Last) - Vita
// @name:mi Roblox Te Papatohu Rererangi + Whakapaahia te Cloner (Utu USD + I kitea) - Kua oti
// @name:oc Tabla de Junta de Presencia Roblox + Ajuste Cloner (Packs USD + Último Vieda) — terminado
// @name:na Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:nn Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:nv Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:nd Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:nr 1. U-Ama 1000 100 10.
// @name:my Roblox ရှိနေခြင်း Dashboard + Fit Cloner (USD Packs + Fit Cloner) - ပြီးဆုံး
// @name:ny Roblox Kukhalapo kwa Broblox + Oft Clonger (Paketi ya USD + yomwe idawoneka) - yatha
// @name:ne रोबलोक्स उपस्थिति ड्यासबोर्ड + फिट क्लोनर (USD प्याकहरू + अन्तिम देखिएको) - समाप्त भयो
// @name:ng Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:pt Painel de Presença Roblox + CLONER FIT (USD PACKS + Last visto) - terminado
// @name:om Roblox Argamuu Daashboordii + Fit Cloner (USD packs + yeroo dhumaaf kan argame) — xumurame .
// @name:qu Roblox presencia tabla de mando + fit cloner (USD packs + último rikusqa) — tukusqa
// @name:rm Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:pa ਰੋਬਲੋਕਸ ਹਾਜ਼ਰ ਡੈਸ਼ਬੋਰਡ + ਫਿਟ ਕਲੋਨਰ (ਯੂਐਸਡੀ ਪੈਕਸ + ਆਖਰੀ ਵਾਰ ਵੇਖੇ ਗਏ) - ਖਤਮ
// @name:os Roblox Presence Dashboard + Fit Cloner (USD Packs + Фæстаг фенд) — фæцис
// @name:or ରୋବ୍ଲକ୍ସ ଉପସ୍ଥିତି ଡ୍ୟାସବୋର୍ଡ + ଫିଟ୍ କ୍ଲୋନର୍ (USD ପ୍ୟାକ୍ + ଶେଷ ଦେଖାଯାଉଥିବା) - ସମାପ୍ତ ହେଲା |
// @name:ps د روبلوکس شتون ډشبورډ + فټ کلون (USD PADCO) - وروستی لیدل شوی) - بشپړ شوی) - بشپړ شوی
// @name:pt-PT Painel de Presença Roblox + CLONER FIT (USD PACKS + Last visto) - terminado
// @name:pi Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:sh Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:se Roblox Presence-dávvirtávval + Fitkloner (USD-pakeahtat + Maŋimuš oidnon) — loahpahii
// @name:sco Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:sc Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:si රොබ්ලොක්ස් පැවැත්මේ පුවරුව + FIT CILN (USD ඇසුරුම් + අවසන් වරට දැකිය හැකිය) - අවසන්
// @name:sg Roblox Présence Dashboard + Fit cloner (PaquetsUS’ Dernière see) — a hunzi .
// @name:rn Igipande c'imbere c'i Roblox + Igitabo c'Icuba c'Umubiri (USD Packs + ya nyuma) — kirangiye
// @name:sa roblox present dashboard + फिट क्लोनर (USD पैक + अंतिम देखा) — समाप्त
// @name:sd رابلوڪس موجودگي ڊيش بورڊ + فٽ ڪلينر (يو ايس ڊي پيڪ + آخري ڏٺو ويو) - ختم ٿيل
// @name:rw Kubaho kwa roblox dashboard + fit cloner (USD Packs + Yanyuma
// @name:su Roblox Girl Dashboard + Cloner Cloner (USD Bungkus + Katuhu) - bérés
// @name:sn Roblox kuvapo dashboard + kukwana clow (USD mapaketi + yekupedzisira kuoneka) - wapedza
// @name:ss Roblox Bukhona Dashboard + Fat Cloner (USD Packs + Kugcineni Kubonakala) — kuphelile
// @name:sm Roblox auai dashboard + fetaui i le cloner (USD pack + mulimuli na vaaia) - ua uma
// @name:st Roblox Extan Boasboard + Fit Cloner (Lipakete tsa USD + tsa ho qetela) - li qetile
// @name:syr Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:sl Nadzorna plošča prisotnost Roblox + fit Cloner (USD paketi + zadnji videz) - končana
// @name:sq Paneli i pranisë roblox + kloner i përshtatshëm (pako USD + e parë e fundit) - përfunduar
// @name:sw Dashibodi ya uwepo wa Roblox + Fit Cloner (Pakiti za USD + zilizoonekana mara ya mwisho) - Imemalizika
// @name:so Jimicelinta Roblox DASHBAROBOBOBOBOX + Ku habboon Truneer (Xirmooyinka USD + la arkay) - dhammeeyay
// @name:to Roblox 'i ai Dashboard + Fit Cloner (Packs 'a e USD + 'Oku 'osi 'a e Seen) — 'osi
// @name:ti ሮብሎክስ ህላወ ዳሽቦርድ + ፊት ክሎነር (USD Packs + Last seen) — ተዛዚሙ
// @name:tl Roblox Presence Dashboard + Fit Cloner (USD Packs + Huling Nakita) - Tapos na
// @name:ta ரோப்லாக்ஸ் பிரசென்ஸ் டாஷ்போர்டு + ஃபிட் குளோனர் (யு.எஸ்.டி பேக்குகள் + கடைசியாக பார்த்தது) - முடிந்தது
// @name:tt Роблоксның булуы тактасы + Fit's loner (АКШ пакетлар + соңгы күзәтү) - бетте
// @name:tk Roblox barlyk paneli + sag plita
// @name:ts Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — Yi hetiwile
// @name:te రాబ్లాక్స్ ఉనికి డాష్‌బోర్డ్ + ఫిట్ క్లోనిర్ (యుఎస్‌డి ప్యాక్‌లు + చివరిగా చూడవచ్చు) - పూర్తయింది
// @name:tn Dashboard ya Boteng jwa Roblox + Modiri yo o Tshwanelang (Diphuthelwana tsa USD + Bofelong) — e ne ya fetsa
// @name:tg Ҳузури РОБОХОЗИ РОЙГОН + Cloner Cloner (бастаҳои USD + Street Dect) - ба итмом расид
// @name:yi ראָבלאָקס בייַזייַן דאַשבאָרד + פּאַסיק קלאָנער (וסד פּאַקס + לעצטע געזען) - פאַרטיק
// @name:yo ROBLEL DASHOLDEBLETLEVEL BAD BAD Clelor (Awọn akopọ USD + ti o kẹhin) - pari
// @name:tw Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:xh I-Roblox Porb Dashboard + i-clower ye-clower (iipakethi ze-USD + ibonwa) igqityiwe
// @name:za Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @name:ve Dashibodo ya u vha hone ha Roblox + Cloner ya Vhuḓi (Phakhethe dza USD + U fhedzisela u vhonala) — yo fhela
// @name:uz Robokx mavjudligi-yarojki + fitble Cloner (USD paketlar + oxirgi ko'rilgan) - tugadi
// @name:ty Roblox Presence Dashboard + Te hoho'a (USD Packs + hopea) —
// @name:wo Roblox présence présence + Fit Cloner (Pack USD + Soppi Sen) - jeexal
// @name:ur روبلوکس کی موجودگی ڈیش بورڈ + فٹ کلونر (USD پیک + آخری دیکھا) - ختم ہوا
// @name:zu I-Roblox Presence Dashboard + Fit Cloner (amaphakethe we-USD + agcinwe) - aqediwe
// @description:bg Проследявайте множество потребители; шоу последно видяно; Присъединете се; Показване/клониране годни; USD-оптимален комбо Robux; Динамична добавка/премахване
// @description:ar تتبع العديد من المستخدمين ؛ عرض آخر مرة. ينضم؛ عرض/استنساخ usd-optimal Robux Combo ؛ إضافة/إزالة ديناميكية
// @description:el Παρακολούθηση πολλών χρηστών. Εμφάνιση τελευταίας εμφάνισης? ενώνω; Εμφάνιση/κλώνη; USD-βέλτιστο robux combo; δυναμική προσθήκη/κατάργηση
// @description:cs Sledovat více uživatelů; Show naposledy vidět; připojit; Show/Clone Fit; USD-optimální robux combo; Dynamic ADD/DEMENT
// @description:da Spor flere brugere; Vis sidst set; Deltag i; Show/Clone Fit; USD-optimal Robux Combo; Dynamisk tilføj/fjern
// @description:de Mehrere Benutzer verfolgen; Zeigen Sie zuletzt gesehen; verbinden; Show/Klonanpassung; USD-optimale Robux-Kombination; Dynamisches Hinzufügen/Entfernen
// @description:eo Spuri plurajn uzantojn; spektaklo laste vidita; aliĝu; Montri/kloni taŭgan; USD-optimuma Robux-kombo; Dinamika Aldono/Forigi
// @description:en Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:fi Seurata useita käyttäjiä; Näytä viimeksi nähty; liittyä; Näytä/klooni sopii; USD-optimaalinen robux-yhdistelmä; dynaaminen lisää/poista
// @description:es Rastrear múltiples usuarios; espectáculo por última vez visto; unirse; show/clon Fit; Combo Robux óptimo de USD; Agregar/eliminar dinámico
// @description:he עקוב אחר מספר משתמשים; להראות לאחרונה נראה; לְהִצְטַרֵף; הצגה/שיבוט התאמה; משולבת רובוקס אופטימלית USD; הוסף/הסר דינמי
// @description:hu Több felhasználó nyomon követése; show utoljára látta; csatlakozik; show/klón illeszkedik; USD-optimális Robux kombináció; Dinamikus hozzáadás/eltávolítás
// @description:ko 여러 사용자를 추적합니다. 마지막으로 본 보여주십시오. 가입하다; 쇼/클론 핏; USD- 최적의 Robux 콤보; 동적 추가/제거
// @description:it Tenere traccia di più utenti; mostra l'ultima volta visto; giuntura; Show/Clone Fit; Combo Robux Ottimale USD; Aggiungi/Rimuovi dinamici
// @description:ja 複数のユーザーを追跡します。最後に見たことを示します。参加する;表示/クローンフィット。 USD-Optimal Robuxコンボ。動的な追加/削除
// @description:fr Suivre plusieurs utilisateurs; montrer la dernière fois vue; rejoindre; show / clone ajustement; Combo robux optimal USD; Ajouter dynamique / supprimer
// @description:mr एकाधिक वापरकर्त्यांचा मागोवा घ्या; शेवटचे पाहिलेले दर्शवा; सामील व्हा; शो/क्लोन फिट; यूएसडी-ऑप्टिमल रोबक्स कॉम्बो; डायनॅमिक जोडा/काढा
// @description:hr Pratite više korisnika; Show zadnji put viđen; Pridružite se; Show/Clone Fit; USD-optimalni Robux Combo; dinamično dodavanje/uklanjanje
// @description:id Melacak banyak pengguna; Tunjukkan yang terakhir terlihat; bergabung; Tampilkan/Klon Fit; Kombo Robux USD-optimal; Dinamis Tambah/Hapus
// @description:ka აკონტროლეთ მრავალი მომხმარებელი; შოუ ბოლოს ნანახი; შეუერთდით; შოუ/კლონი ჯდება; USD- ოპტიმალური Robux Combo; დინამიური დამატება/ამოღება
// @description:nb Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:th ติดตามผู้ใช้หลายคน แสดงให้เห็นครั้งสุดท้าย; เข้าร่วม; แสดง/โคลนพอดี; คอมโบ Robux ที่ดีที่สุดของ USD; เพิ่ม/ลบแบบไดนามิก
// @description:pt-BR Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:ro Urmăriți mai mulți utilizatori; Spectacolul văzut ultima dată; Alătură -te; Show/Clone Fit; Combo robux optim USD; Adăugare/eliminare dinamică
// @description:ru Отслеживать несколько пользователей; показывать в последний раз видно; присоединиться; Показать/клон подходит; USD-Optimal Robux Combo; динамическое добавление/удаление
// @description:nl Volg meerdere gebruikers; Toon laatst gezien; meedoen; Show/Clone Fit; USD-optimale Robux Combo; Dynamisch toevoegen/verwijderen
// @description:pl Śledzić wielu użytkowników; Pokaż ostatnio widziany; dołączyć; Pokaż/Klon Fit; Optymalna kombinacja Robux; Dynamiczny dodaj/usuń
// @description:sk Sledovať viac používateľov; show naposledy videná; pripojiť; show/klonovanie; USD-OPTIMAL ROBUX COMBO; Dynamic Pridať/odstrániť
// @description:sr Пратите више корисника; Прикажи последњи пут; придружити се; Прикажи / клонирајте фит; УСД-оптималан робук комбинација; Динамично додавање / уклањање
// @description:sv Spåra flera användare; Visa senast sett; ansluta sig till; Show/Clone Fit; USD-Optimal Robux Combo; dynamisk tillägg/ta bort
// @description:tr Birden fazla kullanıcıyı izleyin; en son görülen gösteri; katılmak; gösteri/klon uyumu; USD-Optimal Robux Combo; Dinamik Ekle/Kaldır
// @description:ckb شوێنپێی چەند بەکارهێنەرێک بگرە؛ نمایشی دوایین بینراوە نیشان بدە؛ پەیوەندیکردن؛ Show/Clone Fit; USD-Optimal Robux Combo; داینامیکی زیادکردن/لابردن
// @description:fr-CA Suivre plusieurs utilisateurs; montrer la dernière fois vue; rejoindre; show / clone ajustement; Combo robux optimal USD; Ajouter dynamique / supprimer
// @description:uk Відстежувати декількох користувачів; Шоу востаннє побачене; приєднатися; Show/Clone Fit; Оптимальний USD Robux Combo; Динамічне додавання/видалення
// @description:vi Theo dõi nhiều người dùng; cho thấy lần cuối nhìn thấy; tham gia; Show/Clone Fit; Combo Robux tối ưu USD; Thêm/loại bỏ động
// @description:ab Ахархәаҩцәа рацәа рышьҭаҵара; аҵыхәтәантәи аамҭазы иубаратәы иҟоу ашоу; ацлара; ашоу/аклон ақәшәара; USD-оптималтәи Робукс комбо; адинамикатә ацҵара/аԥыхра
// @description:ug كۆپ ئىشلەتكۈچىنى ئىز قوغلاڭ ئاخىرقىسىنى كۆرگەزمە قىلىش قوشۇلۇڭ show / clone ماس كېلىدۇ USD-Squial Robux Commbo دىن ھەرىكەتچان قوشۇش / ئۆچۈرۈش
// @description:zh-CN 跟踪多个用户；显示最后一个看；加入;显示/克隆拟合； USD最佳的Robux组合；动态添加/删除
// @description:aa Mango xoqoysima arac xaga; ellecaboh yubleh; angaliyya; mayballa/kiloon bica; USD-optimal Robux kombo; libdo le/mabla
// @description:zh-TW 跟踪多個用戶；顯示最後一個看；加入;顯示/克隆擬合； USD最佳的Robux組合；動態添加/刪除
// @description:ay walja apnaqirinakaru arknaqaña; Uñacht’ayaña qhipa uñacht’ayata; chikachasiña; Uñacht’ayaña/clone fit; USD-Optimal Roux combo ukat juk’ampinaka; Dinámico Add/Remove .
// @description:ak Track nnipa dodow a wɔde di dwuma; show a etwa to a wohu; ka bom; show/clone fit; USD-Akwantuo a Ɛyɛ Paara a Ɛyɛ Nsõ; Dynamic add/remove .
// @description:ast Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:ba Бер нисә ҡулланыусыны күҙәтергә; күрһәтеү һуңғы тапҡыр күргән; ҡатнашырға; күрһәтеү/клон тура килә; АҠШ доллары-оптималь Robux комбо; динамик өҫтәү/юйыу
// @description:as একাধিক ব্যৱহাৰকাৰী অনুসৰণ কৰক; শ্ব' শেষবাৰৰ বাবে; যোগদান কৰক; শ্ব'/ক্ল'ন ফিট; USD-অপ্টিমেল ৰবক্স কম্বো; ডাইনামিক এড/আঁতৰোৱা
// @description:af Opspoor verskeie gebruikers; vertoon laas gesien; sluit aan; wys/kloon pas; USD-optimale Robux-kombinasie; dinamiese byvoeging/verwydering
// @description:ae Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:av ГӀемерал хӀалтӀизабулезда хадуб халкквезе; шоу ахирисеб бихьана; цолъизабизе; бихьизе/клоналъул форма; USD-оптималиял Robux комбо; динамикалда тӀаде жубазе/гьоболлъи
// @description:am ብዙ ተጠቃሚዎችን ይከታተሉ, የመጨረሻውን አሳይ; ይቀላቀሉ; አጣራ / ክሎቭ ተስማሚ; የዩ.ኤስ.ዲ.ዲ. ተለዋዋጭ አክል / አስወግድ
// @description:az Çox istifadəçini izləyin; Son görünən şou; Qoşulmaq; Şou / klon uyğun; USD-Optimal Robux Combo; Dinamik əlavə et / silmək
// @description:ce Масех пайдаэцархо дӀаязбе; тӀаьххьара гина шоу; дӀакхета; гайта/клон догӀуш хилар; USD-оптимал Роб-комбо; динамикан тӀетохар/дӀадаккхар
// @description:bs Pratite više korisnika; Prikaži zadnji viđen; pridružiti se; Prikaži / Clon fit; USD-optimal robux combo; Dynamic Add / Ukloni
// @description:br Heuliañ meur a implijer; show gwelet diwezhañ; bodañ; diskouezañ/klonañ fit; USD-optimal Combo Robux; ouzhpennañ/dilemel dinamek
// @description:bh Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:bo བེད་སྤྱོད་པ་མང་པོ་རྗེས་འདེད་བྱེད། མཐའ་མར་སྟོན་པ། ཞུགས་པ; སྟོན་པ་/རིགས་མཚུངས་འཚམ་པོ་ཡོད། རོ་སྦུག་མཉམ་སྡེབ་ཨ་སྒོར་ཨ་སྒོར་ལེགས་ཤོས། འགུལ་ཤུགས་སྣོན་འཕྲིན།
// @description:be Адсочваць некалькіх карыстальнікаў; шоў апошні раз бачыўся; далучыцца; паказаць/клон; Аптымальная комба Robux USD; Дынамічны даданне/выдаленне
// @description:bi Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:bm baarakɛla caman nɔfɛtaama; jira laban ye; sɛgɛrɛ; A jira/klone fitinin; USD-optimal Robux Combo; Add/Remove dynamique .
// @description:ca Feu un seguiment de diversos usuaris; Mostra per última vegada vist; Uniu -vos; Mostrar/Clon Fit; USD-Optimal Robux Combo; Afegir/eliminar dinàmics
// @description:bn একাধিক ব্যবহারকারী ট্র্যাক; সর্বশেষ দেখা প্রদর্শন; যোগদান; শো/ক্লোন ফিট; ইউএসডি-অনুকূল রবাক্স কম্বো; গতিশীল অ্যাড/সরান
// @description:cu Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:chr Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:cv Нумай усă куракансене сăнаса тăмалла; шоу юлашки хут курнă; пӗрлештер; кăтартма/клон вырнаçтарнă; USD-оптималлă Robux комбо; динамика хушăмĕ/киле .
// @description:cr Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:dv އެތައް ޔޫޒަރުންނެއް ޓްރެކްކުރުން؛ އެންމެ ފަހުން ފެނުނު ޝޯ؛ ޖޮއިން؛ ޝޯ/ކްލޯން ފިޓް؛ ޔޫއެސްޑީ-އޮޕްޓިމަލް ރޮބޮކްސް ކޮމްބޯ؛ ޑައިނަމިކް އެޑް/ރިމޫވް
// @description:co Pista parechje utilizatori; Mostra l'ultima vista; unisce; Mostra / Clone Fit; Combo di Robux USDimal; Add / sguassà dinamica
// @description:cy Olrhain defnyddwyr lluosog; Dangos a welwyd ddiwethaf; ymuno; Sioe/CLONE FIT; Combo Robux USD-Optimal; Ychwanegu/tynnu deinamig
// @description:dz ལག་ལེན་པ་ལེ་ཤ་ཅིག་འཚོལ་ཞིབ་འབད། སྟོན་མི་འདི་ མཇུག་ལུ་མཐོང་ཡོདཔ་ཨིན། མཐུད༌ནི; སྟོན་/རིགས་མཚུངས་སྒྲིག་ཆས། USD-optilal Robux combo; ཕན་ནུས་ཅན་/རྩ་བསྐྲད་གཏང་།
// @description:ch Track meggai na taotao siha; manma’a’ñao ham gi uttimo na manera? na dania; fan show/ma'a'atan na fitme I USD-optimal na combo; dinanche addok/remos
// @description:ceb Pagsubay sa daghang mga tiggamit; Ipakita ang katapusang nakita; Pag-apil; Ipakita / clone nga angay; USD-Optimal Robux Combo; Dynamic Idugang / Kuhaa
// @description:fa چندین کاربر را ردیابی کنید. آخرین نمایش دیده شده ؛ پیوستن نمایش/کلون مناسب ؛ USD-Optimal Robux Combo ؛ اضافه کردن/حذف پویا
// @description:fj Vakalevu sara na vakayagataki ilavo; vakaraitaka na kena irairai; duavata; vakaraitaka na kena I sausau; Na Veivakalesuimai ni Veitarogivanua; kau;
// @description:eu Jarraitu erabiltzaile anitz; ikuskizuna azken ikusi; batu; Erakutsi / klonak egokituta; USD-Robux konbinazio optimoa; Gehitu / Kendu dinamikoa
// @description:ga Ilúsáideoirí a rianú; Taispeáin an ceann deireanach le feiceáil; páirt a ghlacadh; Taispeáin/Clón oiriúnach; Teaglama Robux USD-optamach; Cuir/Bain dinimiciúil leis
// @description:ee Kpɔ ezãla geɖe ƒe nyawo ɖa; Fia zi mamlɛtɔ si wokpɔ; ge ɖe eme; show/clone fit; USD-Optimal Robux Combo; Dynamic add/remove .
// @description:fo Fylg fleiri brúkarum; vísa seinast sæð; luttaka; vís/klon passa; USD-optimal Robux kombinatión; dynamisk legg til/fjerna
// @description:et Jälgida mitut kasutajat; näitus viimati nähtud; liituda; näidata/klooni sobiv; USD-Optimaalne Robux Combo; dünaamiline lisamine/eemalda
// @description:fy Folgje meardere brûkers; foar it lêst sjoen sjen; meidwaan; show / klone fit; USD-optimale robux Combo; Dynamyske tafoegje / ferwiderje
// @description:ff Reento huutortooɓe heewɓe; show cakkitiiɗo yiytaa; nastugo; hollirde/clon fit; Kombo Robux mo optal-optimal; dinamiik ɓeydude/ittude
// @description:fil Subaybayan ang maraming mga gumagamit; ipakita ang huling nakita; sumali; ipakita/clone fit; USD-Optimal Robux Combo; Dinamikong Idagdag/Alisin
// @description:gsw-berne Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:ho Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:gl Rastrexar varios usuarios; amosar por última vez visto; únete; show/clon axuste; Combo USD-Optimal Robux; Engadir/eliminar dinámico
// @description:ha Waƙa da yawancin masu amfani; nuna karshe gani; shiga; show / clone ya dace; USD-Verfal A Combu; Addara / Cire
// @description:gd Sùil a chumail air grunn luchd-cleachdaidh; Taisbeanadh a tha air fhaicinn a 'faicinn; Thig còmhla; taisbeanadh / clone iomchaidh; Combo culux optimal optimal; Cuir às / Thoir air falbh e
// @description:gv Track y cleaysh; soilshaghey lurg shen er nyn shilley; joyn; taishbynys/clone fit; Co-chosney Robx ny USD; dynamagh
// @description:gn Ojesareko heta puruhára rehe; Ohechauka ojehecha ipahaitépe; mbyaty; Ohechauka/Clon ñemohenda; USD-optimal combo robux rehegua; Dinámico Add/Emove .
// @description:hi कई उपयोगकर्ताओं को ट्रैक करें; आखिरी बार दिखाओ; जोड़ना; दिखाएँ/क्लोन फिट; यूएसडी-इष्टतम रोबक्स कॉम्बो; गतिशील जोड़ें/निकालें
// @description:hmn Taug qab cov neeg siv ntau; Qhia pom kawg; Koom nrog; qhia / clone haum; USD-optimal roblux combo; Dynamic Ntxiv / Tshem Tawm
// @description:gu બહુવિધ વપરાશકર્તાઓને ટ્ર track ક કરો; છેલ્લે જોયું બતાવો; જોડાઓ; બતાવો/ક્લોન ફિટ; યુએસડી-શ્રેષ્ઠ રોબક્સ કોમ્બો; ગતિશીલ ઉમેરો/દૂર કરો
// @description:hz Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:ie Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:ia Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:ik Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:hy Հետեւեք բազմաթիվ օգտագործողներին. Show ույց տալ վերջին տեսածը; միանալ; Show ուցադրել / Clone Fit; USD-Optimal Robux Combo; Դինամիկ ավելացնել / հեռացնել
// @description:ht Swiv plizyè itilizatè; montre dènye wè; Join; Montre/klonaj anfòm; USD-optimal Robux Combo; dinamik ajoute/retire
// @description:ig Soro ọtụtụ ndị ọrụ; Gosi nke ikpeazu; sonye; Gosi / Clone dabara; USD-himerbix Combo; Didic ịgbakwunye / Wepu
// @description:iu ᖃᐅᔨᒋᐊᖃᑦᑕᕐᓗᑎᑦ ᐊᒥᓱᓂᒃ ᐊᑐᖅᑎᓂᒃ; ᑕᑯᒃᓴᐅᑎᑦᑎᓂᖅ ᑭᖑᓪᓕᖅᐹᒥ ᑕᑯᔭᐅᔪᖅ; ᐃᓚᐅᕝᕕᒋᓗᒋᑦ; ᑕᑯᒃᓴᐅᑎᑦᑎᓂᖅ/ᓴᓇᙳᐊᒐᖅ ᓈᒻᒪᒃᑐᖅ; USD-ᐱᐅᓂᖅᐹᖅ ᕉᐳᔅ ᑲᑎᙵᔪᖅ; ᐆᒻᒪᕆᒃᑐᖅ ᐃᓚᓯᓂᖅ/ᐲᖅᓯᓗᑎᑦ
// @description:jv Lacak macem-macem pangguna; Tampilake pungkasan katon; Gabung; Tampilake / Klone Fit; Combo robox usd-optimal; Dinamik Tambah / Copot
// @description:is Fylgstu með mörgum notendum; Sýna síðast séð; taka þátt; sýna/klón passa; USD-ákjósanlegt robux combo; Dynamic Bæta við/fjarlægja
// @description:ki Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:kj Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:ks Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:kn ಬಹು ಬಳಕೆದಾರರನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ; ಕೊನೆಯದಾಗಿ ನೋಡಿದ ಪ್ರದರ್ಶನ; ಸೇರಿ; ತೋರಿಸಿ/ಕ್ಲೋನ್ ಫಿಟ್; ಯುಎಸ್ಡಿ-ಆಪ್ಟಿಮಲ್ ರೋಬಕ್ಸ್ ಕಾಂಬೊ; ಡೈನಾಮಿಕ್ ಸೇರಿಸಿ/ತೆಗೆದುಹಾಕಿ
// @description:kr Am faidatǝwu kada gone; fəletə dareye fəletə; rəptəgə; show/clune fit; USD-be-a Robbux combo-a; yira/datə/retə
// @description:kl Arlalinnik atuisunik tigusineq; show kingullermik takuneqartoq; ilanngunneq; show/klone fit; USD-optimal Robux combo; dynamisk add/remove
// @description:ku Pir bikarhêneran bişopînin; Pêşniyar dît ku dît; bihevgirêdan; Show / Clone fit; USD-Optimal Robux Combo; Dînamîk Add / rakirin
// @description:kg Landa bantu mingi yina ke sadilaka yo; songa mbala ya nsuka; kuvukana; kusonga/kufwanana; Combo ya Robux ya USD; kuyika/kukatula
// @description:km តាមដានអ្នកប្រើប្រាស់ច្រើន។ បង្ហាញការមើលឃើញចុងក្រោយ ចូលរួម; បង្ហាញ / ក្លូនសម បន្សំ Robux ដុល្លារអាមេរិក - ល្អបំផុត។ ថាមវន្តបន្ថែម / យកចេញ
// @description:kk Бірнеше пайдаланушыларды бақылаңыз; соңғы көрінісін көрсету; қосылыңыз; Show / Clone Fit; USD-оңтайлы робуx комбасы; Динамикалық қосу / алып тастау
// @description:kw Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:lif Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:lg okulondoola abakozesa abawera; Show yasembye okulabibwa; okweyunga; show/clone fit; USD-Optimal Robux Combo; Dynamic Add/Remove .
// @description:la Track plures users; ostende postremo; Join; Ostende / clone fit; Pages-meliorem robux combo; Dynamic Add / Remove
// @description:lo ຕິດຕາມຜູ້ໃຊ້ຫຼາຍຄົນ; ສະແດງໃຫ້ເຫັນໄດ້ສຸດທ້າຍ; ເຂົ້າຮ່ວມ; ສະແດງ / clone ເຫມາະ; USD-Optimal Robux ເລື່ອນ; ເພີ່ມເຕີມ Add / Remove
// @description:ln kolandela basaleli mingi; Emission oyo emonanaka na mbala ya suka; kosangana; Lakisa/Clone Fit; Combo ya Robux oyo ezali na USD-optimal; Dynamique Add/Remove .
// @description:kv Тӧдчӧдӧй уна пользовательясӧс; шоу бӧръяысь аддзылӧм; пырӧдчыны; шоу/крон лӧсялӧ; USD-оптимальнӧй Робук комбо; динамическӧй содтӧд/лэдзны
// @description:lb Verfollegen verschidde Benotzer; déi lescht gesinn hunn; matmaachen; Show / Klon fit; Usd-optimal Robux Combo; dynamesch addéieren / ewechhuelen
// @description:ky Бир нече колдонуучуга көз салуу; акыркы көрүлгөн; кошулуу; шоу / клону туура; USD-Optimal Robux Combo; Динамикалык кошуу / алып салуу
// @description:lt Sekti kelis vartotojus; Paskutinį kartą matoma; prisijungti; Rodyti/klonas tinka; USD-optimalus „Robux Combo“; dinaminis pridėjimas/pašalinimas
// @description:mo Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:mi Aroturuki i nga kaiwhakamahi maha; Whakaaturanga whakamutunga i kitea; Hono; Whakaatu / Clone pai; USD-Optimal Robux Combo; Tāpiri Dynamic / Tango
// @description:mh Lale elōn̄ rijerbal ro; kwaļo̧k āliktata kar loe; kobalok; kwaļo̧k/calone eo ekkar; Ej juon iaan wāween ko n̄an kōm̧m̧ane. joñan; eo lab
// @description:lv Izsekot vairākiem lietotājiem; izrāde pēdējoreiz redzētā; pievienoties; Izrāde/klona piemērotība; USD-optimālā Robux Combo; dinamiska pievienošana/noņemšana
// @description:mk Следете повеќе корисници; Покажи последно видено; Придружи се; Show/Clone Fit; УСД-оптимален Робукс комбо; Динамички додадете/отстрани
// @description:mn Олон хэрэглэгчийг хянах; хамгийн сүүлд харуулсан шоу; нэгдэх; Шоу / клоноор тохирох; USD-optimal Robux комбо; Динамик нэмэх / арилгах
// @description:mt Traċċar ta 'utenti multipli; Uri l-aħħar li rajt; Ingħaqad; Uri / klonu tajbin; USD-Optimal Robux Combo; Żid / neħħi dinamiku
// @description:ms Menjejaki pelbagai pengguna; tunjukkan yang terakhir dilihat; menyertai; Tunjukkan/klon sesuai; USD-Optimal Robux Combo; Tambah/Keluarkan Dinamik
// @description:ml ഒന്നിലധികം ഉപയോക്താക്കളെ ട്രാക്കുചെയ്യുക; അവസാനമായി കാണിക്കുക; ചേരുക; കാണിക്കുക / ക്ലോൺ ഫിറ്റ്; യുഎസ്ഡി-ഒപ്റ്റിമൽ റോബക്സ് കോംബോ; ഡൈനാമിക് ചേർക്കുക / നീക്കംചെയ്യുക
// @description:mg Manara-maso ireo mpampiasa marobe; Asehoy farany ny fahitana; Miaraha; Asehoy / Clone Fit; USD-optimal robux combo; Dynamic manampy / esorina
// @description:ng Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:nn Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:nd Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:na Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:nv Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:ne बहु प्रयोगकर्ताहरूलाई ट्र्याक गर्नुहोस्; अन्तिम पटक देखाइएको देखाउनुहोस्; सामेल हुनुहोस्; प्रदर्शन / क्लोन फिट; USD-ऑप्टिमाल रोबक्स कम्बो; गतिशील थप्नुहोस् / हटाउनुहोस्
// @description:oc Seguir divèrses utilizaires ; espectacle a la darrièra còp vist; rejónher; ajuste de mostrar/cloon; Combo Robux optimal-optimal de USD; apondi dinà dinamic.
// @description:nr Ukuzibaba ebusuku; Wazizizi.” hlanganyela; ukukhabula ebusuku; • 66 amandla; Hlala umcimbi .
// @description:my အသုံးပြုသူမျိုးစုံကိုခြေရာခံ; နောက်ဆုံးတွေ့မြင် ပူးပေါင်း; Show / Clone fit; USD-Optimal Robux combo; dynamic add / ဖယ်ရှားပါ
// @description:ny Tsatirani ogwiritsa ntchito angapo; chiwonetsero chatha. Lowani; Onetsani / clone yoyenera; USD-koyeneral robux combo; Zowonjezera Zowonjezera / Chotsani
// @description:rm Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:pi Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:pt Rastrear vários usuários; show visto pela última vez; juntar; mostrar/clone ajuste; Combo do USD-Otimal Robux; Adicionar/remover dinâmico
// @description:pt-PT Rastrear vários usuários; show visto pela última vez; juntar; mostrar/clone ajuste; Combo do USD-Otimal Robux; Adicionar/remover dinâmico
// @description:os Фæдæвзарæн бирæ пайдагæнæгты; шоу фæстаг хатт федта; баиу уын; шоу/клон æмбæлон; USD-оптималон Robux комбо; динамикон æфтауын/режимут .
// @description:pa ਮਲਟੀਪਲ ਉਪਭੋਗਤਾਵਾਂ ਨੂੰ ਟਰੈਕ; ਆਖਰੀ ਵਾਰ ਪ੍ਰਦਰਸ਼ਨ ਕੀਤਾ; ਸ਼ਾਮਲ ਹੋਵੋ; ਫਿੱਟ ਵੇਖੋ / ਕਲੋਨ ਕਰੋ; ਯੂਐਸਡੀ-ਅਨੁਕੂਲ ਰੋਬਕਸ ਕੰਬੋ; ਡਾਇਨਾਮਿਕ ਐਡ / ਹਟਾਓ
// @description:ps د ډیری کاروونکو تعقیب؛ وروستی لیدل شوی ښکاره لیدل؛ ګډون وکړئ؛ ښودل / کلون فټ؛ د USD-مطلوب غره کامبو؛ متحرک اضافه / لرې کول
// @description:om Fayyadamtoota hedduu hordofuu; agarsiisa yeroo dhumaaf argame; itti makamuu; Agarsiisuu/Kloonii Fiit; USD-optimal Robux combo; Daayinamikii Dabalaa/Baca'uu .
// @description:qu Achka llamk'aqkunata qatipay; Qhawachiy qhipa rikusqa; taqruy; Show/Clon Fit; USD-optimal robux combo; Dinamico Add/Remove .
// @description:or ଏକାଧିକ ବ୍ୟବହାରକାରୀଙ୍କୁ ଟ୍ରାକ୍ କରନ୍ତୁ; ଶେଷରେ ଦେଖାଯାଇଥିବା ଦେଖାନ୍ତୁ; ଯୋଗ ଦିଅନ୍ତୁ; ଶୋ / କ୍ଲୋନ୍ ଫିଟ୍; USD-ଉତ୍କୃଷ୍ଟ ରବକ୍ସ କମ୍ବୋ; ଡାଇନାମିକ୍ ଆଡ୍ / ଅପସାରଣ |
// @description:sco Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:sc Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:sh Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:sa बहुविधप्रयोक्तृणां निरीक्षणं कुर्वन्तु; अन्तिमं दृष्टं दर्शयतु; आबन्धम्; शो/क्लोन फिट्; USD-ऑप्टिमतम रॉबक्स कॉम्बो; गतिशील add/remove .
// @description:si බහු පරිශීලකයින් සොයා ගන්න; දර්ශනය අවසන් වරට දැකීම; එක්වන්න; පෙන්වන්න / ක්ලෝන සුදුසුකමක්; USD-Optallimal Rogux combo; ගතික එකතු කිරීම / ඉවත් කරන්න
// @description:sg Track azo mingi; fa na ndangba bango ni; bungbi; show/clone fit; Rodox so ayeke na lege ni pëpe; dynamique add/zi .
// @description:rn Gukurikirana abakoresha benshi; ikiganiro ca nyuma cabonetse; kuja hamwe; show/clone ibereye; USD-optimal combo combo; kwongerako/gukuraho
// @description:se Čuovvut máŋga geavaheaddji; čájáhus maŋimuš oidnosis; searvat; čájáhus/klona heiveheapmi; USD-optimála Robux kombinašuvdna; dynámalaš lasiheapmi/váldi eret
// @description:rw Kurikirana abakoresha benshi; Erekana nyuma yo kugaragara; Injira; kwerekana / clone bikwiye; USD-Optimal robutimal combo; Dynamic Ongeraho / Kuraho
// @description:sd ڪيترن ئي استعمال ڪندڙن کي ٽريڪ ڪريو آخري ڏٺو ويو؛ شامل ٿيو شو / کلون فٽ؛ USD-Optimal robx ڪمبو؛ متحرڪ اضافو / هٽايو
// @description:syr Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @description:sq Gjurmoni përdoruesit e shumtë; Shfaqja e parë e fundit; bashkohem; Shfaq/klon të përshtatshëm; USD-optimal Robux Combo; Shto/Hiq dinamike
// @description:ss Tsatsa basebentisi labanyenti; umbukiso wagcina kubonakala; joyina; show/clone kufaneleka; USD-lelifanele iRobux combo; faka/kususa
// @description:sw Fuatilia watumiaji wengi; Onyesha mara ya mwisho kuonekana; jiunge; Onyesha/Clone Fit; USD-Optimal Robux Combo; kuongeza/kuondoa
// @description:sl Slediti več uporabnikom; oddaja nazadnje videna; pridružiti; show/klonski prileganje; USD-optimalni robux Combo; Dynamic Add/Remole
// @description:sm Ala i le tele o tagata faaaoga; Faaalia i ai mulimuli e vaai; auai; Faaali / Clone talafeagai; USD-Expimil Robux Combo; dynamic faaopoopo / aveese
// @description:so La soco isticmaaleyaal badan; Muuji ugu dambeyntii la arko; ku soo biir; Muuji / isku xidhnow; USD-ugu fiicnayn Combox Combo; Dynamic Add / Ka saar
// @description:sn Tevera vashandisi vazhinji; Ratidza Kupedzisira Kuonekwa; Joinha; Ratidza / Clone Fit; USD-yakakwana robux combo; Dynamic Wedzera / Bvisa
// @description:su Lacak sababaraha pangguna; Pintonan anu kantos katingal; Miluan; Pintonan / clon pas; Kombo Roboxal Robofal; Ditambahkeun Dinamis / Cabut
// @description:st Batla basebelisi ba bangata; bonts'a ho qetela a bonoang; Join; bonts'a / Clone Fit; USD-Exmellal Robux Cobux Cobux; Matla a matla / Tlosa
// @description:tl Subaybayan ang maraming mga gumagamit; ipakita ang huling nakita; sumali; ipakita/clone fit; USD-Optimal Robux Combo; Dinamikong Idagdag/Alisin
// @description:ti ብዙሓት ተጠቀምቲ ምክትታል፤ ንመወዳእታ ግዜ ዝተራእየ ምርኢት፤ ተሓወስ፤ ምርኢት/ክሎን ፊት፤ USD-Optimal Robux ኮምቦ፤ ዳይናሚክ Add/Remove
// @description:tt Берничә кулланучыны күзәтегез; Соңгы күренешне күрсәтегез; кушыл; шоу / клон туры килүе; USD-Оптималь Робукс Комбо; Динамик өстәү / бетерү
// @description:tk Birnäçe ulanyjylary yzarlaň; soňky gezek görünýän görkezişler; goşulyň; Gabat gelýändigini görkez / klon; ABŞ-nyň optimal aýlanyşyk çopox combo; Dinamiki goş / aýyrmak
// @description:tn Latedisa badirisi ba le bantsi; bontsha la bofelo le le bonweng; lomagana; go bontsha/go tshwanelega ga clone; USD-optimal Robux combo; e e fetofetogang/tlosa
// @description:te బహుళ వినియోగదారులను ట్రాక్ చేయండి; చివరిసారిగా చూసే ప్రదర్శన; చేరండి; షో/క్లోన్ ఫిట్; USD- ఆప్టిమల్ రోబక్స్ కాంబో; డైనమిక్ జోడించు/తొలగించండి
// @description:ta பல பயனர்களைக் கண்காணிக்கவும்; கடைசியாக பார்த்த காட்டு; சேர; காட்டு/குளோன் பொருத்தம்; யு.எஸ்.டி-உகந்த ரோபக்ஸ் காம்போ; டைனமிக் சேர்/அகற்று
// @description:to Foaki ʻa e kau fakaʻaongaʻi lahi; fakahaaʻi fakamuimuitaha ʻa e sio; kau; faka'ali'ali/clone fe'unga; USD-'oku lelei 'aupito 'a e Robux combo; tanaki atu 'a e tanaki atu/to'o
// @description:tg Пайгирии корбарон; Намоиши охирин дида мешавад; ҳамроҳ шудан; Нишон додан / Clone; Доллари ИМА-оптималии комот Илова / тоза кардани
// @description:ts Landzelela vatirhisi vo tala; Show yi hetelele ku voniwa; hlanganisa; Ku kombisa/ku ringanela ka xirhangiso; USD-Optimal Combo ya Robux; Dynamic Add/Susa .
// ==/UserScript==
! function() {
    "use strict";
    class e {
        static get br() {
            return new e("br")
        }
        constructor(e, t) {
            this.element = "object" == typeof e && e && String(e.constructor && e.constructor.name).indexOf("HTML") > -1 ? e : function() {
                var n = document.createElement(e);
                if (t)
                    for (var r in t) n.setAttribute(r, t[r]);
                return n
            }()
        }
        style(e) {
            if (e)
                for (var t in e) this.element.style[t] = e[t];
            return this
        }
        append(e) {
            this.element.append(e && e.element ? e.element : e);
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                this.element.append(n && n.element ? n.element : n)
            }
            return this
        }
        appendTo(e) {
            try {
                (e && e.element ? e.element : "string" == typeof e ? document.querySelector(e) : e).append(this.element)
            } catch (e) {
                console.warn("Failed to append", e)
            }
            return this
        }
        on(e, t) {
            return this.element["on" + e] = t, this
        }
        set(e, t) {
            return this.element[e] = t, this
        }
        remove() {
            return this.element.remove(), this
        }
        get() {
            return this.element[arguments[0]]
        }
        get children() {
            return new function(e) {
                for (var t = 0; t < e.length; t++) this[t] = e[t];
                Object.defineProperty(this, "length", {
                    get: function() {
                        return e.length
                    }
                }), this.item = function(e) {
                    return null != this[e] ? this[e] : null
                }, this.namedItem = function(t) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        if (r.id === t || r.name === t) return r
                    }
                    return null
                }, Object.freeze(this)
            }(Array.prototype.slice.call(this.element.children))
        }
    }

    function t(e, t) {
        try {
            var n = "function" == typeof GM_getValue ? GM_getValue(e, "") : localStorage.getItem(e) || "";
            return n ? JSON.parse(n) : t
        } catch (e) {
            return t
        }
    }

    function n(e, t) {
        try {
            var n = JSON.stringify(t || []);
            "function" == typeof GM_setValue ? GM_setValue(e, n) : localStorage.setItem(e, n)
        } catch (e) {}
    }
    var r = [],
        o = function(e) {
            try {
                var t = "function" == typeof GM_getValue ? GM_getValue(e, "") : localStorage.getItem(e) || "";
                if (!t) return [];
                var n = JSON.parse(t);
                return Array.isArray(n) ? n : []
            } catch (e) {
                return []
            }
        }("presence_watch_users"),
        a = c(r.concat(o)),
        i = [{
            r$: 80,
            usd: .99
        }, {
            r$: 400,
            usd: 4.99
        }, {
            r$: 800,
            usd: 9.99
        }, {
            r$: 1700,
            usd: 19.99
        }, {
            r$: 4500,
            usd: 49.99
        }, {
            r$: 1e4,
            usd: 99.99
        }],
        s = new class {
            constructor(e) {
                this.title = {
                    body: e || "---",
                    color: "darkgrey",
                    size: "1rem"
                }, this.body = {
                    color: "#008f68",
                    size: "1rem"
                }
            }
#e(e) {
                var t = String(e).toUpperCase();
                return ["%c" + this.title.body + " [" + t + "] | %c", "color:" + this.title.color + ";font-weight:bold;font-size:" + this.title.size + ";", "color:" + this.body.color + ";font-weight:bold;font-size:" + this.body.size + ";text-shadow:0 0 5px rgba(0,0,0,.2);"]
            }
            log(e) {
                var t = this.#e("log");
                console.log(t[0] + e, t[1], t[2])
            }
            warn(e) {
                var t = this.#e("warn");
                console.warn(t[0] + e, t[1], t[2])
            }
            error(e) {
                var t = this.#e("error");
                console.error(t[0] + e, t[1], t[2])
            }
        }("PresenceHUD");

    function d(e) {
        var t = e && e.method ? e.method : "GET",
            n = e && e.url ? e.url : "",
            r = e && e.headers ? e.headers : {},
            o = e && e.data ? e.data : null,
            a = e && e.timeout ? e.timeout : 15e3;
        return new Promise((function(e, i) {
            GM_xmlhttpRequest({
                method: t,
                url: n,
                headers: r,
                data: o,
                timeout: a,
                onload: function(t) {
                    if (!(t.status >= 200 && t.status < 300)) return i(new Error("HTTP " + t.status + " " + (t.responseText ? t.responseText.slice(0, 160) : "")));
                    try {
                        e(JSON.parse(t.responseText || "{}"))
                    } catch (e) {
                        i(e)
                    }
                },
                onerror: function() {
                    i(new Error("Network error"))
                },
                ontimeout: function() {
                    i(new Error("Timeout"))
                }
            })
        }))
    }
    async function l(e, t) {
        var n = t ? {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                    accept: "application/json"
                },
                body: JSON.stringify(t)
            } : {
                method: "GET",
                mode: "cors",
                credentials: "include",
                headers: {
                    accept: "application/json"
                }
            },
            r = await fetch(e, n);
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json()
    }
    var u = {
        presenceUsers: function(e) {
            return d({
                url: "http://localhost:3000/presence-users?userIds=" + e.join(",")
            })
        },
        usernames: function(e) {
            return d({
                method: "POST",
                url: "https://users.roblox.com/v1/users",
                headers: {
                    "content-type": "application/json",
                    accept: "application/json"
                },
                data: JSON.stringify({
                    userIds: e.map(Number),
                    excludeBannedUsers: !1
                })
            })
        },
        me: function() {
            return l("https://users.roblox.com/v1/users/authenticated")
        },
        avatar: function(e) {
            return l("https://avatar.roblox.com/v1/users/" + e + "/avatar")
        },
        ownsAsset: function(e, t) {
            return l("https://inventory.roblox.com/v1/users/" + e + "/items/Asset/" + t + "/is-owned").then((function(e) {
                return !!e
            }))
        },
        assetDetails: function(e) {
            return d({
                url: "https://economy.roblox.com/v2/assets/" + e + "/details"
            })
        },
        assetToBundle: function(e) {
            return d({
                url: "https://catalog.roblox.com/v1/assets/" + e + "/bundles"
            }).then((function(e) {
                return e && e.data ? e.data : []
            })).catch((function() {
                return []
            }))
        },
        bundleDetails: function(e) {
            return d({
                url: "https://catalog.roblox.com/v1/bundles/" + e + "/details"
            })
        }
    };

    function c(e) {
        for (var t = {}, n = [], r = 0; r < e.length; r++) {
            var o = Number(e[r]);
            o && !t[o] && (t[o] = 1, n.push(o))
        }
        return n
    }

    function p(e, n) {
        var r = t("lastSeenInGame", {});
        r[e] = n,
            function(e, t) {
                var n = JSON.stringify(t || {});
                try {
                    "function" == typeof GM_setValue ? GM_setValue(e, n) : localStorage.setItem(e, n)
                } catch (e) {}
            }("lastSeenInGame", r)
    }

    function f(e) {
        if (!e) return "—";
        for (var t = Math.max(1, Math.floor((Date.now() - e) / 1e3)), n = [
                ["d", 86400],
                ["h", 3600],
                ["m", 60],
                ["s", 1]
            ], r = 0; r < n.length; r++) {
            var o = n[r][0],
                a = n[r][1];
            if (t >= a) return String(Math.floor(t / a)) + o + " ago"
        }
        return "just now"
    }
    async function h(e) {
        var t, n = ((t = document.createElement("div")).style.cssText = "position:fixed;top:100px;right:420px;z-index:2147483647;background:#0f1116;color:#eee;width:460px;max-height:80vh;overflow:auto;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.4);padding:12px;", t.innerHTML = '<div style="display:flex;align-items:center;gap:8px;"><div id="fp-title" style="font-weight:700;">Fit</div><div id="fp-sub" style="margin-left:auto;font-size:12px;opacity:.8;">loading…</div><button id="fp-close" style="background:#222;border:none;color:#aaa;padding:2px 8px;border-radius:6px;cursor:pointer;">×</button></div><div id="fp-preview" style="margin:8px 0;"></div><div id="fp-cost" style="margin:6px 0;font-weight:600;"></div><div id="fp-pack" style="margin:4px 0 10px;font-size:13px;opacity:.9;"></div><div id="fp-list" style="border-top:1px solid #1e1e24;"></div><div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;"><button id="fp-clone" style="background:#28a745;border:none;color:#fff;padding:8px 12px;border-radius:8px;cursor:pointer;">Clone Fit (wear owned)</button><button id="fp-buy"   style="background:#f2994a;border:none;color:#fff;padding:8px 12px;border-radius:8px;cursor:pointer;">Buy Missing (open tabs)</button></div>', document.body.appendChild(t), t.querySelector("#fp-close").onclick = function() {
                t.remove()
            }, t),
            r = n.querySelector("#fp-title"),
            o = n.querySelector("#fp-sub"),
            a = n.querySelector("#fp-list"),
            d = n.querySelector("#fp-preview"),
            l = n.querySelector("#fp-cost"),
            c = n.querySelector("#fp-pack");
        try {
            var p = await u.usernames([e]),
                f = p && p.data && p.data[0] && p.data[0].name ? p.data[0].name : e;
            r.textContent = "Fit: " + f;
            var h = null;
            try {
                h = await u.me()
            } catch (e) {}
            for (var v = await u.avatar(e), m = v && v.assets ? v.assets : [], y = [], b = 0; b < m.length; b++) {
                var g = m[b];
                g && g.id && g.name && y.push({
                    assetId: g.id,
                    name: g.name,
                    typeId: g.assetType && g.assetType.id ? g.assetType.id : null,
                    isPackageAsset: !!g.isPackageAsset
                })
            }
            d.innerHTML = '<div style="font-size:13px;opacity:.85;">Items worn: ' + y.length + "</div>";
            var x = [];
            for (b = 0; b < y.length; b++) {
                var w = y[b],
                    I = !1,
                    k = null,
                    S = null,
                    T = null,
                    M = !1,
                    A = null;
                if (h && h.id) try {
                    I = await u.ownsAsset(h.id, w.assetId)
                } catch (e) {}
                try {
                    var O = await u.assetDetails(w.assetId);
                    O && (k = null != O.PriceInRobux ? O.PriceInRobux : null, (S = null != O.ProductId ? O.ProductId : null) && (A = "https://www.roblox.com/catalog/" + w.assetId))
                } catch (e) {}
                if (null == k) try {
                    var P = await u.assetToBundle(w.assetId);
                    if (P && P.length) {
                        M = !0;
                        try {
                            var $ = await u.bundleDetails(P[0].bundleId);
                            $ && $.id && (A = "https://www.roblox.com/bundles/" + (T = {
                                id: $.id,
                                name: $.name,
                                price: $.product && null != $.product.priceInRobux ? $.product.priceInRobux : null
                            }).id + "/" + encodeURIComponent(T.name || "bundle"))
                        } catch (e) {
                            console.warn("Bundle lookup failed for", w.assetId, String(e && e.message ? e.message : e))
                        }
                    }
                } catch (e) {}
                x.push({
                    assetId: w.assetId,
                    name: w.name,
                    typeId: w.typeId,
                    isPackageAsset: w.isPackageAsset,
                    owned: I,
                    price: k,
                    productId: S,
                    bundle: T,
                    bundleOnly: M,
                    purchaseUrl: A
                })
            }
            var q = 0,
                E = [];
            for (b = 0; b < x.length; b++) {
                var R = x[b];
                R.owned || R.bundleOnly || null == R.price || E.push(R)
            }
            for (b = 0; b < E.length; b++) q += E[b].price || 0;
            var _ = {};
            for (b = 0; b < x.length; b++) !(R = x[b]).owned && R.bundleOnly && R.bundle && R.bundle.id && null != R.bundle.price && (_[R.bundle.id] || (_[R.bundle.id] = R.bundle, q += R.bundle.price));
            var C = "";
            for (b = 0; b < x.length; b++) {
                var N = (R = x[b]).owned ? '<span style="color:#7ee787;">owned</span>' : '<span style="color:#ffb3b3;">missing</span>',
                    U = null != R.price ? R.price + " R$" : R.bundleOnly ? "bundle-only" : "offsale",
                    L = !R.owned && R.purchaseUrl ? ' <a target="_blank" href="' + R.purchaseUrl + '" style="margin-left:6px;text-decoration:none;background:#f2994a;color:#fff;padding:3px 6px;border-radius:6px;">Buy</a>' : "";
                C += '<div style="padding:8px;border-bottom:1px solid #1e1e24;"><div style="font-weight:600;">' + R.name + ' <span style="opacity:.7">(#' + R.assetId + ')</span></div><div style="font-size:12px;opacity:.9;">' + N + " • " + (R.bundleOnly && R.bundle ? "via Bundle: " + R.bundle.name : "price: " + U) + L + "</div></div>"
            }
            a.innerHTML = C, l.textContent = "Missing total: " + q + " R$";
            var j = function(e) {
                if (e <= 0) return {
                    usd: 0,
                    leftover: 0,
                    packs: [],
                    totalR$: 0
                };
                for (var t = 0, n = 0; n < i.length; n++) i[n].r$ > t && (t = i[n].r$);
                var r, o, a, s, d = e + t,
                    l = new Array(d + 1);
                for (l[0] = {
                        usd: 0,
                        prev: null
                    }, n = 0; n <= d; n++)
                    if (l[n])
                        for (o = 0; o < i.length; o++)(r = n + (a = i[o]).r$) > d && (r = d), s = l[n].usd + a.usd, (!l[r] || s < l[r].usd - 1e-9) && (l[r] = {
                            usd: s,
                            prev: {
                                i: n,
                                packIndex: o
                            }
                        });
                var u = null,
                    c = -1;
                for (r = e; r <= d; r++)
                    if (l[r]) {
                        var p = {
                            j: r,
                            usd: l[r].usd,
                            leftover: r - e
                        };
                        (!u || p.usd < u.usd - 1e-9 || Math.abs(p.usd - u.usd) < 1e-9 && p.leftover < u.leftover) && (u = p, c = r)
                    }
                if (!u) return null;
                for (var f = new Map, h = c; h > 0;) {
                    var v = l[h].prev;
                    if (!v) break;
                    a = i[v.packIndex], f.set(a, (f.get(a) || 0) + 1), h = v.i
                }
                var m = [];
                return f.forEach((function(e, t) {
                    m.push({
                        r$: t.r$,
                        usd: t.usd,
                        count: e
                    })
                })), m.sort((function(e, t) {
                    return t.r$ - e.r$
                })), {
                    usd: Number(u.usd.toFixed(2)),
                    leftover: u.leftover,
                    packs: m,
                    totalR$: c
                }
            }(q);
            if (j) {
                var z = [];
                for (b = 0; b < j.packs.length; b++) z.push(j.packs[b].count + "× " + j.packs[b].r$ + "R$ ($" + j.packs[b].usd + ")");
                var G = z.join(" + ");
                c.textContent = "Buy Robux (~$" + j.usd.toFixed(2) + "): " + G + " = " + j.totalR$ + "R$ (leftover " + j.leftover + "R$)"
            } else c.textContent = "You already own everything.";
            n.querySelector("#fp-buy").onclick = function() {
                for (var e = 0; e < x.length; e++) {
                    var t = x[e];
                    !t.owned && t.purchaseUrl && window.open(t.purchaseUrl, "_blank")
                }
            }, n.querySelector("#fp-clone").onclick = function() {
                for (var e = 0; e < x.length; e++) {
                    var t = x[e];
                    t.owned && t.purchaseUrl && window.open(t.purchaseUrl, "_blank")
                }
            }, o.textContent = "ready"
        } catch (e) {
            o.textContent = "error", s.error("Fit popup failed: " + e.message)
        }
    }
    async function v(e) {
        var i = e.querySelector("#phud-status"),
            d = e.querySelector("#phud-list");
        try {
            if (i.textContent = "checking…", !a.length) return d.innerHTML = '<div style="padding:10px;opacity:.8;">No users yet. Add a userId above.</div>', i.textContent = "OK", void m();
            var l = await u.presenceUsers(a),
                g = l && l.userPresences ? l.userPresences : [],
                x = l && l.lastSeenInGame ? l.lastSeenInGame : {},
                w = await u.usernames(a),
                I = {};
            if (w && w.data)
                for (var k = 0; k < w.data.length; k++) I[w.data[k].id] = w.data[k].name;
            ! function(e, i, s, d) {
                e.innerHTML = "";
                for (var l = 0; l < i.length; l++) {
                    var u = i[l],
                        m = s[u.userId] ? s[u.userId] : u.userId,
                        y = 2 === Number(u.userPresenceType),
                        b = y ? "🎮 In Game " + (u.lastLocation ? "– " + u.lastLocation : "") : 1 === u.userPresenceType ? "🌐 Online" : "❌ Offline",
                        g = y && u.placeId && (u.gameId || u.serverId) ? "roblox://placeId=" + u.placeId + "&gameInstanceId=" + (u.gameId || u.serverId) : null,
                        x = d && d[u.userId] ? d[u.userId] : null;
                    y ? p(u.userId, Date.now()) : x && p(u.userId, x);
                    var w = (S = u.userId, t("lastSeenInGame", {})[S] || null),
                        I = w ? f(w) : "—",
                        k = document.createElement("div");
                    k.style.cssText = "padding:8px 4px;border-bottom:1px solid #1e1e24;display:flex;align-items:center;gap:8px;", k.innerHTML = '<div style="flex:1;min-width:0;"><div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + m + '</div><div style="font-size:12px;opacity:.85;">' + b + '</div><div style="font-size:12px;opacity:.65;">Last seen in game: ' + (y ? "now" : I) + '</div></div><div style="display:flex;gap:6px;align-items:center;"><button class="phud-showfit" data-user="' + u.userId + '" style="background:#5865f2;border:none;color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;">Show Fit</button>' + (g ? '<button class="phud-join" data-link="' + g + '" style="background:#28a745;border:none;color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;">Join Now</button>' : '<button disabled style="background:#3a3a45;border:none;color:#888;padding:6px 10px;border-radius:8px;">Join Now</button>') + '<button class="phud-remove" data-user="' + u.userId + '" title="Remove" style="background:#2b2f3a;border:none;color:#ff9aa2;padding:6px 10px;border-radius:8px;cursor:pointer;">🗑</button></div>', e.appendChild(k)
                }
                for (var S, T = e.querySelectorAll(".phud-join"), M = 0; M < T.length; M++) T[M].onclick = function() {
                    window.location.href = this.getAttribute("data-link")
                };
                for (var A = e.querySelectorAll(".phud-showfit"), O = 0; O < A.length; O++) A[O].onclick = function() {
                    h(Number(this.getAttribute("data-user")))
                };
                for (var P = e.querySelectorAll(".phud-remove"), $ = 0; $ < P.length; $++) P[$].onclick = function() {
                    var e = Number(this.getAttribute("data-user"));
                    n("presence_watch_users", o = o.filter((function(t) {
                        return t !== e
                    }))), a = c(r.concat(o)), v(document.getElementById("presence-hud"))
                }
            }(d, g, I, x), i.textContent = "OK"
        } catch (e) {
            i.textContent = "error", d.innerHTML = '<div style="padding:10px;color:#ff8a8a;">' + e.message + "</div>", s.error("Refresh failed: " + e.message)
        }
        y[b] ? y[b]() : s.warn(`${b} - doesn't exist yet or wasnted instea to have dom actions!`)
    }
    async function m() {
        var t = function() {
            for (var e = location.href.split("/"), t = [], n = 3; n < e.length; n++) t.push(e[n].replace(/[0-9]/g, ""));
            return t.join(":")
        }();
        if ("users::profile" === t && !document.getElementById("PresenceHUD_AddBtn")) {
            for (var i = Number(location.href.split("/")[4]) || 0, s = ["#unfriend-button", "#friend-button", 'button[data-testid="profile-action"]'], d = null, l = 0; l < s.length; l++)
                if (document.querySelector(s[l])) {
                    d = s[l];
                    break
                }
            if (d) {
                var u = null;
                try {
                    u = await
                    function(e, t) {
                        t = t || 1e4;
                        var n = document.querySelector(e);
                        return n ? Promise.resolve(n) : new Promise((function(n, r) {
                            var o = new MutationObserver((function() {
                                var t = document.querySelector(e);
                                t && (o.disconnect(), n(t))
                            }));
                            o.observe(document.documentElement, {
                                childList: !0,
                                subtree: !0
                            }), setTimeout((function() {
                                o.disconnect(), r(new Error("Timeout: " + e))
                            }), t)
                        }))
                    }(d)
                } catch (e) {
                    return
                }
                if (u) {
                    var p = new e("button", {
                            id: "PresenceHUD_AddBtn",
                            class: u.className
                        }),
                        f = a.indexOf(i) > -1;
                    p.set("textContent", f ? "Remove User" : "Add User"), u.insertAdjacentElement("beforebegin", p.element), p.on("click", (function() {
                        a.indexOf(i) > -1 ? o = o.filter((function(e) {
                            return e !== i
                        })) : i && (o = c(o.concat([i]))), n("presence_watch_users", o), a = c(r.concat(o)), p.set("textContent", a.indexOf(i) > -1 ? "Remove User" : "Add User");
                        var e = document.getElementById("presence-hud");
                        e && v(e)
                    }))
                }
            }
        }
    }
    const y = {
        "users::profile": async function() {
            return await m(), !0
        }
    };
    let b = location.href.split("/").map((e => e.replace(/[0-9]/g, ""))).slice(3).join(":");
    !async function() {
        await new Promise((function(e) {
            if (document.body) return e();
            var t = new MutationObserver((function() {
                document.body && (t.disconnect(), e())
            }));
            t.observe(document.documentElement, {
                childList: !0,
                subtree: !0
            })
        }));
        var e, t, i, s, d, l, u, p, f = ((p = document.createElement("div")).id = "presence-hud", p.style.cssText = "position:fixed;top:72px;right:20px;z-index:2147483647;background:#0e0e12;color:#eee;padding:10px 10px 8px;width:400px;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.4);font:14px/1.35 ui-sans-serif,system-ui,Segoe UI,Roboto;", p.innerHTML = '<div style="display:flex;align-items:center;gap:8px;cursor:move" id="phud-title"><div style="font-weight:700;">Presence Dashboard</div><div id="phud-status" style="margin-left:auto;font-size:12px;opacity:.8;">—</div><button id="phud-close" style="background:#222;border:none;color:#aaa;padding:2px 8px;border-radius:6px;cursor:pointer;">×</button></div><div style="margin:8px 0 6px;display:flex;gap:8px;align-items:center;"><button id="phud-refresh" style="flex:0 0 auto;background:#2b2f3a;border:none;color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;">Refresh</button><div style="font-size:12px;opacity:.7;">Polling every ' + Math.floor(15) + 's</div></div><div style="display:flex;gap:6px;margin-bottom:8px;"><input id="phud-add-input" type="text" placeholder="Add userId" style="flex:1;background:#14141b;border:1px solid #242432;color:#fff;padding:6px 8px;border-radius:8px;outline:none;" /><button id="phud-add-btn" style="background:#3b82f6;border:none;color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;">Add</button></div><div id="phud-list" style="max-height:480px;overflow:auto;border-top:1px solid #1e1e24;"></div>', document.body.appendChild(p), e = p, t = p.querySelector("#phud-title"), i = 0, s = 0, d = 0, l = 0, u = !1, t.addEventListener("mousedown", (function(t) {
            u = !0, i = t.clientX, s = t.clientY;
            var n = e.getBoundingClientRect();
            d = n.left, l = n.top, t.preventDefault()
        })), window.addEventListener("mousemove", (function(t) {
            if (u) {
                var n = t.clientX - i,
                    r = t.clientY - s;
                e.style.left = d + n + "px", e.style.top = l + r + "px", e.style.right = "auto", e.style.bottom = "auto", e.style.position = "fixed"
            }
        })), window.addEventListener("mouseup", (function() {
            u = !1
        })), p.querySelector("#phud-close").onclick = function() {
            p.remove()
        }, p.querySelector("#phud-add-btn").onclick = function() {
            var e = p.querySelector("#phud-add-input"),
                t = Number((e.value || "").trim());
            t && (n("presence_watch_users", o = c(o.concat([t]))), a = c(r.concat(o)), e.value = "", v(p))
        }, p);
        f.querySelector("#phud-refresh").onclick = function() {
            a = c(r.concat(o)), v(f)
        }, v(f), setInterval((function() {
            a = c(r.concat(o)), v(f)
        }), 15e3), window.addEventListener("keydown", (function(e) {
            if (e.ctrlKey && e.shiftKey && "f" === String(e.key).toLowerCase()) {
                var t = document.getElementById("presence-hud");
                if (!t) return;
                t.style.display = "none" === t.style.display ? "block" : "none"
            }
        }))
    }()
}();