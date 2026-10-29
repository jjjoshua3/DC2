import type { Project, SiteData } from "@/lib/site-types"
import { defaultPosts } from "@/lib/blog-defaults"

const projects: Project[] = [
  {
    id: "duurzaamheidskrant",
    title: "Duurzaamheidskrant",
    category: "Journalistiek",
    status: "published",
    mediaType: "image",
    mediaUrl: "/media/projects/duurzaamheidskrant.jpg",
    poster: "/media/projects/duurzaamheidskrant.jpg",
    lead: "De stad zit vol duurzame helden. PakhuisB, de stichting waar DE CONNECTORS in werkt, vond het tijd om ze in de schijnwerpers te zetten.",
    body: `<p>Om hun stem te laten klinken. Om ze te laten vertellen hoe ze dat doen, duurzaam leven of ondernemen.</p>
<p>Ze wilden jullie ook laten zien dat duurzaamheid veel meer is dan klimaat en energietransitie. Ze begrijpen maar al te goed dat door hierop te focussen veel mensen die wel willen, maar geen mogelijkheden of middelen hebben, zich buitengesloten kunnen gaan voelen. En dat je daarmee de bestaande kloof mogelijk vergroot.</p>
<blockquote>“De energietransitie is superbelangrijk, maar met zeer beperkte financiële middelen en een huurhuis ben je wel erg beperkt,” licht een deelnemer aan de energietransitie-enquête toe, die PakhuisB hield samen met BredaVandaag. “In deze mensen zitten evengoed duurzame helden.”</blockquote>
<p>Omdat ze hun kleding steevast tweedehands kopen bijvoorbeeld, of altijd de fiets pakken. Het is belangrijk dat we ook deze helden blijven horen, en gaan begrijpen waarom ze terughoudend zijn of zelfs weerstand hebben op de energietransitie.</p>
<p>De spotprent bij dit verhaal maakte Geert Rutten van Creative Flavours.</p>`,
    gallery: ["/media/projects/spotprent.jpg"],
    ctaLabel: "Lees de krant online",
    ctaUrl: "http://www.themanieuws.nl/app/publication/DBD191/7582",
  },
  {
    id: "stad-van-straks",
    title: "Stad van Straks – docu en krant",
    category: "Video / Docu",
    status: "published",
    mediaType: "video",
    mediaUrl: "https://www.youtube.com/watch?v=V26hL64r47o&t=23s",
    poster: "/media/projects/stad-van-straks.jpg",
    lead: "De omgevingswet komt eraan en die zegt kort door de bocht: de inwoner van Breda krijgt het nu echt voor het zeggen.",
    body: `<p>Dat klinkt DE CONNECTORS als muziek in de oren. We gingen samen met Stadslab en studenten van Avans Hogeschool, van oktober tot en met december 2019 op pad, met camera en bloknoot, en spraken tientallen — zeg maar gerust ruim honderd — mensen op allerlei plekken in de stad.</p>
<blockquote>Hoe wil jij de stad doorgeven aan de volgende generatie?</blockquote>
<p>Daar maakten ze een documentaire, een stuk of wat videoportretten én een krant van. Die gaan naar de wethouder, die alle ideeën meeneemt en vertaalt in zijn omgevingsvisie.</p>
<p>We gaan nog wel een tijdje door met gesprekken voeren en ideeën verzamelen, maar we vinden het ook tijd voor een feestje waarin we alle deelnemers bedanken en in de spotlights zetten.</p>`,
    gallery: [],
    ctaLabel: "",
    ctaUrl: "",
  },
  {
    id: "journalistiek",
    title: "Journalistiek",
    category: "Journalistiek",
    status: "published",
    mediaType: "image",
    mediaUrl: "/media/projects/journalistiek.jpg",
    poster: "/media/projects/journalistiek.jpg",
    lead: "Sinds 2003 schrijf ik voor dagbladen, tijdschriften en online platforms. Mijn neus gaat meestal naar die van de vooruitgang.",
    body: `<p>Mensen die nieuwe spelregels verzinnen om de status quo te doorbreken, die slimme oplossingen bedenken voor oude problemen, en die de wereld schoner, groener en gelukkiger willen maken. Hun verhalen inspireren mij en teken ik het liefst op.</p>
<blockquote>Omdat je met verhalen de wereld kunt maken en breken. Ik maak hem liever.</blockquote>
<p>Hieronder een selectie van knipsels: van de Volkskrant en Het Parool tot verhalen over Noord-Korea, de Melkweg en het Nederlandse bedrijfsleven.</p>`,
    gallery: [
      "/media/clips/bezinnen.png",
      "/media/clips/melkweg.png",
      "/media/clips/noordkorea.png",
      "/media/clips/journaliste-nk.jpg",
      "/media/clips/abn.png",
      "/media/clips/parool-midlife.jpg",
    ],
    ctaLabel: "",
    ctaUrl: "",
  },
  {
    id: "dutch-magic",
    title: "Co-auteur Boek Nederlandse topbrands",
    category: "Journalistiek",
    status: "published",
    mediaType: "image",
    mediaUrl: "/media/projects/armin.jpg",
    poster: "/media/projects/armin.jpg",
    lead: "Het boek Dutch Magic — hoe Nederlandse ondernemers markten veroveren, van VODW — bestaat uit interviews met Nederlandse topondernemers.",
    body: `<p>Stefanie werd gevraagd om zes interviews te doen. Ze sprak met Armin van Buuren, Alice Huisman van Royal Huisman (luxejachten), Lidewij Edelkoort (voorheen Design Academy), de mannen van eBuddy, Leo van Wijk (voorheen KLM) en Gerlach Cerfontaine (Schiphol).</p>
<p>Stuk voor stuk gesprekken over hoe een merk ontstaat als mensen ergens écht in geloven — en dat durven te laten zien.</p>`,
    gallery: ["/media/projects/lidewij.jpg"],
    ctaLabel: "",
    ctaUrl: "",
  },
  {
    id: "datamining",
    title: "Datajournalistieke crowdsourcer",
    category: "Project",
    status: "published",
    mediaType: "image",
    mediaUrl: "/media/projects/stoplichten.jpg",
    poster: "/media/projects/stoplichten.jpg",
    lead: "DataminingX is het journalistieke platform dat nieuws maakt met gegevens die jij over jezelf en je omgeving verstrekt.",
    body: `<p>Via de app krijg je dagelijks de mogelijkheid om mee te doen met korte surveys over actuele onderwerpen. De data zetten wij om in nieuws op BredaVandaag. Jouw stem telt weer mee.</p>
<p>Bedrijven die instappen krijgen de mogelijkheid om als frontrunner mee te doen met een mobile marktonderzoeksoplossing die op een makkelijke, aantrekkelijke en effectieve manier relevante data verzamelt. DataminingX biedt maatwerk vanuit een selectie van continu verrijkte profielen.</p>
<p><strong>Wij bieden</strong></p>
<ul>
<li>Hyperlokaal en regionaal marktonderzoek</li>
<li>Marktonderzoek dat de gewone Bredanaar bereikt</li>
<li>Een panel dat eerlijk antwoord geeft, omdat het via een betrouwbaar en onafhankelijk nieuwsmedium wordt benaderd</li>
<li>Toegang tot de community van BredaVandaag (150.000 unieke bezoekers per maand) en De Bode</li>
<li>Snelheid: advanced mobile marktonderzoek dat ‘in the moment’ data real time vertaalt naar inzichten</li>
</ul>
<p>DataminingX wordt gesteund door het Stimuleringsfonds voor de Journalistiek.</p>`,
    gallery: ["/media/projects/datamining.png"],
    ctaLabel: "",
    ctaUrl: "",
  },
  {
    id: "bak-met-energie",
    title: "Bak met Energie",
    category: "Project",
    status: "published",
    mediaType: "image",
    mediaUrl: "/media/projects/bak-met-energie.jpg",
    poster: "/media/projects/bak-met-energie.jpg",
    lead: "De grote massa wordt nauwelijks betrokken bij de energietransitie, voelt zich onvoldoende gehoord en zet soms de hakken in het zand.",
    body: `<p><strong>Client.</strong> Brabant Geeft Energie</p>
<p><strong>Doel.</strong> Ontdekken wat energie betekent in het leven van de unusual suspects — en welke plek het inneemt.</p>
<p><strong>Celebrating.</strong> Tilburgs mannendispuut, een breiclub in Vught, vrouwelijke taalcursisten, hardlopers van Breda, studenten van Hogeschool Avans en brugklassers van het vmbo.</p>
<p><strong>Service.</strong> Ontwerp en ontwikkeling van idee en concept, projectmanagement, uitvoering, communicatie, monitoring en data-analyse.</p>`,
    gallery: [],
    ctaLabel: "",
    ctaUrl: "",
  },
  {
    id: "sociaal-domein",
    title: "Het nieuwe Sociaal Domein – Interactief web magazine",
    category: "Project",
    status: "published",
    mediaType: "image",
    mediaUrl: "/media/projects/sociaal-domein.jpg",
    poster: "/media/projects/sociaal-domein.jpg",
    lead: "We brachten het beleid van de gemeente Breda over het sociaal domein tot leven, en lieten zien hoe alle betrokkenen met elkaar verbonden zijn.",
    body: `<p><strong>Client.</strong> Gemeente Breda</p>
<p><strong>Doelgroep.</strong> Mensen in Breda die met het sociaal domein te maken hebben.</p>
<p><strong>Celebrating.</strong> We interviewden stakeholders uit alle lagen en achtergronden en brachten ze samen in één online magazine. De interviews kwamen vanuit passie en vanuit het hart. Zo lieten we zien dat iedereen zowel professioneel als persoonlijk verbonden is.</p>
<p>We gebruikten foto’s, podcasts, video’s, animatie en tekst, en nodigden het publiek uit om zelf door het magazine te klikken en de verhalen te kiezen die hen raken.</p>
<p><strong>Service.</strong> Video, foto, podcast, animatie, tekst.</p>`,
    gallery: [],
    ctaLabel: "",
    ctaUrl: "",
  },
  {
    id: "groenplein",
    title: "Duurzaamheidsplatform",
    category: "Project",
    status: "published",
    mediaType: "image",
    mediaUrl: "/media/projects/groenplein.jpg",
    poster: "/media/projects/groenplein.jpg",
    lead: "Sinds oktober 2017 bouwen we een duurzaam plein waar mensen informatie en advies krijgen, en samen kunnen werken aan een CO2-neutrale stad.",
    body: `<p><strong>Client.</strong> Gemeente Breda</p>
<p><strong>Doelgroep.</strong> Mensen in Breda die een eerste, vijfde of honderdste stap willen zetten naar een duurzamere wereld.</p>
<p><strong>Celebrating.</strong> Iedereen die betrokken is — of betrokken wil raken — bij de CO2-neutrale stad Breda. We organiseren events, maken nieuws en brengen stakeholders bij elkaar.</p>
<p><strong>Service.</strong> Projectmanagement, communicatie en changemaking.</p>`,
    gallery: [],
    ctaLabel: "",
    ctaUrl: "",
  },
  {
    id: "kindertrendrede",
    title: "KinderTrendrede",
    category: "Event",
    status: "published",
    mediaType: "image",
    mediaUrl: "/media/projects/kindertrendrede.jpg",
    poster: "/media/projects/kindertrendrede.jpg",
    lead: "Kinderen tot twaalf jaar kregen de ruimte om hun stad nú en straks te beschrijven — en die visie formeel aan te bieden.",
    body: `<p><strong>Client.</strong> PakhuisB, Teach the Future en de gemeenteraad van Breda.</p>
<p><strong>Celebrating.</strong> Teach the Future ontwikkelde een lessenserie voor basisscholen, zodat kinderen hun ideale stad kunnen verbeelden. We organiseerden workshops om een ‘state of the union’ te schrijven, filmden het proces en zetten een event op waarin ze hun stuk aanboden aan inwoners, de wethouder en de pers.</p>
<p><strong>Service.</strong> Workshop, event, communicatie.</p>`,
    gallery: [],
    ctaLabel: "",
    ctaUrl: "",
  },
  {
    id: "scholieren",
    title: "50 Scholieren 1 jaar actief met lokale politiek",
    category: "Video / Docu",
    status: "published",
    mediaType: "video",
    mediaUrl: "https://www.youtube.com/watch?v=ZVtNr3Xe0Sk",
    poster: "/media/projects/scholieren.jpg",
    lead: "We volgden scholieren een jaar lang en maakten een serie van vier video’s om het programma Youth and Politics te laten leven.",
    body: `<p><strong>Client.</strong> Raadsgriffie Breda</p>
<p><strong>Doelgroep.</strong> Middelbare scholieren in Breda, en hun docenten.</p>
<p><strong>Doel.</strong> Het programma Youth and Politics onder de aandacht brengen.</p>
<p><strong>Celebrating.</strong> De leerlingen zelf. We vroegen ze videoclips van hun project te maken en gebruikten die in de serie. De productie gebeurde samen met de media-afdeling van NHTV, die videostudenten leverde.</p>
<p><strong>Service.</strong> Videoproductie.</p>`,
    gallery: [],
    ctaLabel: "",
    ctaUrl: "",
  },
  {
    id: "lokale-journalistiek",
    title: "Lokale journalistiek",
    category: "Journalistiek",
    status: "published",
    mediaType: "image",
    mediaUrl: "/media/projects/lokale-journalistiek.jpg",
    poster: "/media/projects/lokale-journalistiek.jpg",
    lead: "Samen met BredaVandaag maken we hyperlokale journalistiek sterker — met de spotlight op mensen die het verschil willen maken.",
    body: `<p><strong>Client.</strong> BredaVandaag</p>
<p><strong>Doelgroep.</strong> De lokale gemeenschap van Breda.</p>
<p><strong>Celebrating.</strong> De stad van morgen en haar inwoners. DE CONNECTORS zet mensen in het licht die niet alleen voor zichzelf iets willen, maar ook voor anderen en voor de planeet.</p>
<p><strong>Service.</strong> Interviewen en nieuwsartikelen schrijven.</p>`,
    gallery: [],
    ctaLabel: "Lees op BredaVandaag",
    ctaUrl:
      "http://www.bredavandaag.nl/nieuws/politiek/2017-03-14/thieme-klaar-om-te-regeren-als-groen-anker-de-coalitie",
  },
  {
    id: "tedx",
    title: "TEDxBreda – live mediaproductie",
    category: "Event",
    status: "published",
    mediaType: "image",
    mediaUrl: "/media/projects/tedx.jpg",
    poster: "/media/projects/tedx.jpg",
    lead: "Live reports vanuit het MEZZ-theater spraken het online publiek rechtstreeks aan en nodigden uit tot vragen en reacties.",
    body: `<p><strong>Client.</strong> TEDxBreda</p>
<p><strong>Doelgroep.</strong> Het internationale live- en onlinepubliek van TEDxBreda 2016.</p>
<p><strong>Celebrating.</strong> TEDxBreda is een community van professionals die vrijwillig werkt aan het jaarlijkse event. Met onze livestream-ervaring hielpen we het videoteam hun eigen livestreamproductie op te zetten.</p>
<p><strong>Service.</strong> Producer van het livestreamteam.</p>`,
    gallery: [],
    ctaLabel: "Bekijk de Facebook-live",
    ctaUrl: "https://www.facebook.com/TEDxBreda/videos/1247350738662729/",
  },
  {
    id: "sprank",
    title: "Sprank – magazine van Divosa",
    category: "Journalistiek",
    status: "published",
    mediaType: "image",
    mediaUrl: "/media/projects/sprank.jpg",
    poster: "/media/projects/sprank.jpg",
    lead: "Twee- en driedelige interviews waarin de mensen uit het sociaal domein zelf de hoofdrol krijgen.",
    body: `<p><strong>Client.</strong> Divosa</p>
<p><strong>Doelgroep.</strong> Beslissers in het sociaal domein.</p>
<p><strong>Doel.</strong> De doelgroep en hun hete hangijzers samenbrengen in een magazine.</p>
<p><strong>Service.</strong> Interviews en schrijven.</p>`,
    gallery: [],
    ctaLabel: "Lees het artikel (PDF)",
    ctaUrl: "https://deconnectors.com/wp-content/uploads/2017/09/sprank-012017-ik-wil-mensen-geen-hulp-bieden.pdf",
  },
  {
    id: "festival",
    title: "Festival van de Democratie",
    category: "Event",
    status: "published",
    mediaType: "image",
    mediaUrl: "/media/projects/festival.jpg",
    poster: "/media/projects/festival.jpg",
    lead: "In het stadhuis van Breda lieten we inwoners, raadsleden en wethouders democratie opnieuw ervaren.",
    body: `<p><strong>Client.</strong> Gemeente Breda</p>
<p><strong>Celebrating.</strong> Een deep-democracy specialist leidde de maandelijkse raadsvergadering met een interactieve methode. Mensen oefenden met oog voor de minderheidsstem. Jongeren speelden het spel Terra Nova en maakten spelregels voor een nieuwe gemeenschap op een onbewoond eiland. Op de graffitimuur lieten bezoekers hun dromen achter, en een spoken-word artist sloot de avond af.</p>
<p>Programma, interviews, Facebook Live en schetsen kwamen samen in een online magazine voor de stad.</p>
<p><strong>Service.</strong> Video, Facebook Live, foto, schetsen, tekst.</p>`,
    gallery: [],
    ctaLabel: "Bekijk het magazine",
    ctaUrl: "https://readymag.com/u69175195/599744/",
  },
  {
    id: "oxfam",
    title: "Oxfam & The Guardian, verbinden kán",
    category: "Video / Docu",
    status: "published",
    mediaType: "video",
    mediaUrl: "https://www.youtube.com/watch?v=tlbRSjKC-2g",
    poster: "/media/projects/oxfam.jpg",
    lead: "Een video over de financiële druk op onderzoeksjournalistiek — en over hoe sommige redacties een nieuwe verbinding vinden met hun publiek.",
    body: `<p><strong>Client.</strong> Oxfam</p>
<p><strong>Doelgroep.</strong> Internationale onderzoeksjournalisten, kranten en magazines.</p>
<p><strong>Doel.</strong> Laten zien hoe onderzoeksjournalisten en ngo’s elkaar kunnen versterken.</p>
<p><strong>Celebrating.</strong> We gingen langs bij kranten en journalisten en lieten zien hoe sommigen journalistiek verbinden aan een ander verdienmodel. De video werd vertoond tijdens een bijeenkomst in Amsterdam (november 2014).</p>
<p><strong>Service.</strong> Videostorytelling en animatie.</p>`,
    gallery: [],
    ctaLabel: "",
    ctaUrl: "",
  },
  {
    id: "opendata",
    title: "Open Data 2-daags internationaal congres",
    category: "Event",
    status: "published",
    mediaType: "video",
    mediaUrl: "https://vimeo.com/108475356",
    poster: "/media/projects/opendata.jpg",
    lead: "ODC14, op 9 en 10 oktober 2014 in De Balie in Amsterdam: is ‘open’ genoeg om de grote problemen van de wereld aan te pakken?",
    body: `<p><strong>Client.</strong> Open Development Camp, een huisproject van DE CONNECTORS en Open for Change.</p>
<p><strong>Doelgroep.</strong> Internationale voortrekkers van open data, organisaties en technologie.</p>
<p><strong>Doel.</strong> De status quo van Open verkennen en deelnemers uitnodigen de volgende stap te zetten.</p>`,
    gallery: [],
    ctaLabel: "",
    ctaUrl: "",
  },
  {
    id: "accenture",
    title: "Accenture’s Studentbattle",
    category: "Event",
    status: "published",
    mediaType: "video",
    mediaUrl: "https://youtu.be/56E0g1pXIfM",
    poster: "/media/projects/accenture.jpg",
    lead: "Twee livestream-shows waarin studenten, projecteigenaren en financiers live met elkaar verbonden werden.",
    body: `<p><strong>Client.</strong> 1%Club en Accenture</p>
<p><strong>Doelgroep.</strong> Studenten in Nederland.</p>
<p><strong>Doel.</strong> De band versterken tussen deelnemende studenten, projecteigenaren in opkomende landen en mensen die de projecten financieel steunen.</p>
<p><strong>Celebrating.</strong> We produceerden een co-creatieshow en een awardshow. Het publiek was in de zaal én online. Reacties liepen via Twitter.</p>
<p>De compilatie is gemaakt door Jaap van ’t Kruis en Joost Gulien.</p>
<p><strong>Service.</strong> Livestreamshow en storytelling.</p>`,
    gallery: [],
    ctaLabel: "",
    ctaUrl: "",
  },
  {
    id: "escience",
    title: "Netherlands eScience Centre",
    category: "Video / Docu",
    status: "published",
    mediaType: "video",
    mediaUrl: "https://youtu.be/C54Vdftj2WU",
    poster: "/media/projects/escience.jpg",
    lead: "Een high-end video over de verbinding tussen wetenschappers en de big-data-techneuten van het eScience Centre.",
    body: `<p><strong>Client.</strong> Netherlands eScience Centre</p>
<p><strong>Doelgroep.</strong> Mensen met een levendige interesse in wetenschap.</p>
<p><strong>Celebrating.</strong> We doken in één project en twee sleutelfiguren: Henk Dijkstra, klimatoloog, en Jason Maassen, big-data-specialist bij het eScience Centre.</p>
<p><strong>Service.</strong> Videostorytelling en animatie.</p>`,
    gallery: [],
    ctaLabel: "",
    ctaUrl: "",
  },
  {
    id: "afrilabs",
    title: "Online Co-Creation met 10 Afrikaanse Tech Hubs",
    category: "Project",
    status: "published",
    mediaType: "video",
    mediaUrl: "https://youtu.be/SQH43gPVl1g",
    poster: "/media/projects/afrilabs.jpg",
    lead: "Twee co-creaties — één in Berlijn tijdens re:publica en één online — waarin Afrikaanse tech-hubs elkaars uitdagingen oppakten.",
    body: `<p><strong>Client.</strong> Afrilabs</p>
<p><strong>Doelgroep.</strong> Afrikaanse tech-hubs en hun ondernemers.</p>
<p><strong>Doel.</strong> De leden van Afrilabs verbinden tot een hecht netwerk.</p>
<p><strong>Celebrating.</strong> Deelnemers werkten aan elkaars ondernemersvragen. Van het traject maakten we een compilatiefilm.</p>
<p><strong>Service.</strong> Co-creatie, livestreaming, storytelling.</p>`,
    gallery: [],
    ctaLabel: "",
    ctaUrl: "",
  },
  {
    id: "jimmys",
    title: "Jimmy’s online & interactive liveshow",
    category: "Event",
    status: "published",
    mediaType: "video",
    mediaUrl: "https://youtu.be/-1aT-vGFDlA",
    poster: "/media/projects/jimmys.jpg",
    lead: "Samen met jongeren uit Groningen produceerden we een interactieve livestream met live publiek, livemuziek en workshops rond de studio.",
    body: `<p><strong>Client.</strong> Jimmy’s Groningen</p>
<p><strong>Doelgroep.</strong> Jongeren in de provincie Groningen.</p>
<p><strong>Doel.</strong> Jongeren verbinden met Jimmy’s en met elkaar, en ze een energieboost geven.</p>
<p><strong>Celebrating.</strong> Het online publiek mocht Jimmy’s elke vraag stellen waar ze hulp bij nodig hadden.</p>
<p><strong>Service.</strong> Storytelling-workshop, videostorytelling, livestreamshow.</p>`,
    gallery: [],
    ctaLabel: "",
    ctaUrl: "",
  },
]

export const defaultSite: SiteData = {
  projects,
  posts: defaultPosts,
  copy: {
    heroTitle: "DE CONNECTORS",
    heroTagline: "Celebrating People",
    heroSubtitle:
      "Wij zijn de nieuwe digital leaders. We reorganiseren en transformeren, verbinden mensen en geven ze een stem die gehoord moet worden.",
    aboutTitle: "Over De Connectors",
    aboutLead:
      "DE CONNECTORS zijn de nieuwe digital leaders. We reorganiseren en transformeren, verbinden mensen en geven ze een stem die gehoord moet worden.",
    aboutLeft:
      "DE CONNECTORS snapt hoe je vertrouwen opbouwt bij mensen en ze verbindt en betrekt bij het geheel. In onze projecten zijn het de mensen die het voor het zeggen krijgen. We geven ze een stem, een podium en teugels en plaatsen ze midden in jouw project of organisatie.",
    aboutRight:
      "We noemen het Celebrating People. Onze interesse en nieuwsgierigheid zijn oprecht. We luisteren naar wat mensen werkelijk te zeggen hebben en checken of we ze goed hebben gehoord. We gebruiken allerlei vormen van interactieve media om hun waardevolle boodschap aan jouw organisatie en de community over te brengen.",
    stylesTitle: "Onze stijl",
    styles: [
      {
        title: "Hart Verbinding",
        text: "We duiken naar het hart van je organisatie en we beginnen bij onze eerste koffie. Hartsverbindingen zijn het meest oprecht en diepgaand, en de enige manier om een echte, no-nonsense verbinding te maken met jouw community.",
      },
      {
        title: "Professional Excellence",
        text: "We werken samen met uitblinkers in hun vak. We zijn stuk voor stuk toegewijd aan onze projecten. We zijn open en transparant, betrouwbare en optimistische teamspelers.",
      },
      {
        title: "We houden van Happy People",
        text: "We begrijpen hoe we mensen vieren. Samen met jou zorgen we ervoor dat wat we doen in de harten en hoofden blijft van je community. En als die erop terugkijkt, doet ze dat met een vette glimlach.",
      },
    ],
    servicesTitle: "Wat kunnen we voor je doen?",
    services: [
      {
        title: "Communications & Content",
        text: "Strategie and content productie. We praten open en direct met je community, activeren haar en geven haar een stem en teugels.",
      },
      {
        title: "Blockchain organisatie & ecosystemen",
        text: "Ontwikkeling en uitvoering van kleine en grote verandertrajecten die gebruikmaken van blockchain technologie en iedereen in een ecosysteem de waardevolle rol geeft die bij hem past.",
      },
      {
        title: "Co-Creations",
        text: "Online en offline. We brengen mensen met allerlei achtergronden en kwaliteiten bij elkaar in een ontspannen, creatieve sfeer, waardoor een collectieve intelligentie ontstaat die nieuwe inzichten en oplossingen bieden voor jouw probleem.",
      },
      {
        title: "Live events",
        text: "Open en interactieve events die we opnemen of live uitzenden. Debatten, congressen en award shows.",
      },
      {
        title: "Journalistieke producties",
        text: "Waar iedereen naar rechts kijkt, kijken wij naar links. Daar vinden we vaak vooruitgang en positieve veranderaars.",
      },
      {
        title: "Corporate Stories",
        text: "Bedrijfsverhalen die blijven plakken, omdat we de ziel van de organisatie raken. Door vanaf het begin je stakeholders te betrekken en een actieve rol te geven, worden de stories in alle lagen van de organisatie gedragen.",
      },
    ],
    bannerText: "We love celebrating people",
    whoTitle: "Ik ben De Connectors",
    whoBody:
      "Ik ben Stefanie Vermeulen. Ik ben een CONNECTOR in hart en ziel. Ik hou ervan om mensen te laten samenwerken en een stem te geven die werkelijk wordt gehoord. We willen namelijk allemaal verbinden en gezien en gehoord worden. Maar dan echt.",
    whoName: "Stefanie Vermeulen",
    whoRole: "Runs DE CONNECTORS. Journalist & producer",
    whoPhoto: "/media/people/stefanie.jpg",
    quote: "Change your strategy. Engage your audience",
    clientsTitle: "Organisaties voor wie we werkten",
    contactTitle: "Get in touch",
    contactLead:
      "Een koffie, een verhaal, een eerste vraag. We beginnen het liefst met een echt gesprek.",
    email: "stefanie@deconnectors.com",
    blogTitle: "Blog",
    blogLead:
      "Achtergronden, verslagen en notities. Dezelfde stem als op de site, alleen met de tijd erbij.",
    blogButton: "Naar de blogs",
  },
  design: {
    accent: "#E11D48",
    headingFont: "jakarta",
    socials: {
      youtube: "https://www.youtube.com/user/deconnectors",
      vimeo: "https://vimeo.com/deconnectors",
      x: "https://twitter.com/deconnectors",
      flickr: "https://www.flickr.com/deconnectors",
      linkedin: "https://www.linkedin.com/in/stefanie-vermeulen-89424111",
    },
    clients: [
      { id: "buza", name: "Ministerie van Buitenlandse Zaken", image: "/media/logos/buza.png" },
      { id: "nrc", name: "NRC", image: "/media/logos/nrc.jpeg" },
      { id: "parool", name: "Het Parool", image: "/media/logos/parool.png" },
      { id: "vk", name: "de Volkskrant", image: "/media/logos/volkskrant.png" },
      { id: "svdj", name: "Stimuleringsfonds voor de Journalistiek", image: "/media/logos/svdj.jpeg" },
      { id: "brabant", name: "Provincie Noord-Brabant", image: "/media/logos/brabant.png" },
      { id: "breda", name: "Gemeente Breda", image: "" },
      { id: "tedx", name: "TEDxBreda", image: "/media/logos/tedx.png" },
      { id: "oxfam", name: "Oxfam Novib", image: "/media/logos/oxfam.png" },
      { id: "accenture", name: "Accenture", image: "/media/logos/accenture.png" },
      { id: "rodehoed", name: "Rode Hoed", image: "/media/logos/rodehoed.png" },
      { id: "onepercent", name: "1%Club", image: "/media/logos/onepercent.png" },
    ],
  },
}
