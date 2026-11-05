import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useSiteData } from "@/lib/data-service"
import type { SiteData, WatPage } from "@/lib/site-types"

export const LOCALES = [
  { id: "nl", label: "Nederlands", short: "NL" },
  { id: "en", label: "English", short: "EN" },
  { id: "fr", label: "Français", short: "FR" },
  { id: "de", label: "Deutsch", short: "DE" },
] as const

export type Locale = (typeof LOCALES)[number]["id"]

const KEY = "dc.locale"

const ui = {
  nl: {
    about: "Over mij",
    what: "Wat",
    poems: "Gedichten",
    projects: "Projecten",
    blog: "Blog",
    contact: "Contact",
    language: "Taal",
    seeProjects: "Bekijk mijn projecten",
    touch: "Get in touch",
    whatIDo: "Wat ik doe",
    threeLines: "Drie lijnen",
    oneVoice: "Drie lijnen. Eén stem.",
    chooseLine: "Journalistiek, artistiek, en waar die twee elkaar raken. Kies de lijn die bij jouw verhaal past.",
    readMore: "Lees meer",
    projectsTitle: "Blik op mijn projecten",
    all: "Alles",
    noProjects: "Nog geen gepubliceerde projecten in deze categorie.",
    article: "Artikel",
    name: "Naam",
    email: "E-mail",
    message: "Bericht",
    send: "Verstuur",
    sent: "Je e-mailprogramma opent met dit bericht.",
    noPosts: "Er staan nog geen blogs live.",
    allPosts: "Alle blogs",
    missing: "Deze pagina bestaat niet.",
    missingBody: "Het adres klopt niet, of de pagina is verplaatst. Ga terug naar de verhalen.",
    poemsHeading: "De gedichten",
    example: "Voorbeeld",
    designed: "Ontworpen door Joshua",
    security: "Beveiligingslek melden? Dat kan via:",
    notFoundLabel: "Artistiek",
  },
  en: {
    about: "About",
    what: "Work",
    poems: "Poems",
    projects: "Projects",
    blog: "Blog",
    contact: "Contact",
    language: "Language",
    seeProjects: "See my projects",
    touch: "Get in touch",
    whatIDo: "What I do",
    threeLines: "Three lines",
    oneVoice: "Three lines. One voice.",
    chooseLine: "Journalism, art, and where the two meet. Choose the line that fits your story.",
    readMore: "Read more",
    projectsTitle: "A look at my projects",
    all: "All",
    noProjects: "No published projects in this category yet.",
    article: "Article",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send",
    sent: "Your email app will open with this message.",
    noPosts: "No posts are live yet.",
    allPosts: "All posts",
    missing: "This page does not exist.",
    missingBody: "The address is wrong, or the page has moved. Go back to the stories.",
    poemsHeading: "The poems",
    example: "Example",
    designed: "Designed by Joshua",
    security: "Report a security issue via:",
    notFoundLabel: "Artistic",
  },
  fr: {
    about: "À propos",
    what: "Travail",
    poems: "Poèmes",
    projects: "Projets",
    blog: "Blog",
    contact: "Contact",
    language: "Langue",
    seeProjects: "Voir mes projets",
    touch: "Écrire",
    whatIDo: "Ce que je fais",
    threeLines: "Trois lignes",
    oneVoice: "Trois lignes. Une voix.",
    chooseLine: "Journalisme, art, et l’endroit où les deux se touchent. Choisissez la ligne qui convient à votre récit.",
    readMore: "Lire",
    projectsTitle: "Un regard sur mes projets",
    all: "Tout",
    noProjects: "Pas encore de projet publié dans cette catégorie.",
    article: "Article",
    name: "Nom",
    email: "E-mail",
    message: "Message",
    send: "Envoyer",
    sent: "Votre messagerie s’ouvre avec ce message.",
    noPosts: "Aucun article n’est encore en ligne.",
    allPosts: "Tous les articles",
    missing: "Cette page n’existe pas.",
    missingBody: "L’adresse est fausse, ou la page a été déplacée. Revenez aux récits.",
    poemsHeading: "Les poèmes",
    example: "Exemple",
    designed: "Conçu par Joshua",
    security: "Signaler une faille de sécurité :",
    notFoundLabel: "Artistique",
  },
  de: {
    about: "Über mich",
    what: "Arbeit",
    poems: "Gedichte",
    projects: "Projekte",
    blog: "Blog",
    contact: "Kontakt",
    language: "Sprache",
    seeProjects: "Meine Projekte ansehen",
    touch: "Kontakt aufnehmen",
    whatIDo: "Was ich tue",
    threeLines: "Drei Linien",
    oneVoice: "Drei Linien. Eine Stimme.",
    chooseLine: "Journalismus, Kunst, und wo beides sich trifft. Wählen Sie die Linie, die zu Ihrer Geschichte passt.",
    readMore: "Weiterlesen",
    projectsTitle: "Ein Blick auf meine Projekte",
    all: "Alle",
    noProjects: "In dieser Kategorie gibt es noch keine veröffentlichten Projekte.",
    article: "Artikel",
    name: "Name",
    email: "E-Mail",
    message: "Nachricht",
    send: "Senden",
    sent: "Ihr E-Mail-Programm öffnet sich mit dieser Nachricht.",
    noPosts: "Es sind noch keine Beiträge online.",
    allPosts: "Alle Beiträge",
    missing: "Diese Seite gibt es nicht.",
    missingBody: "Die Adresse stimmt nicht, oder die Seite wurde verschoben. Zurück zu den Geschichten.",
    poemsHeading: "Die Gedichte",
    example: "Beispiel",
    designed: "Gestaltet von Joshua",
    security: "Eine Sicherheitslücke melden? Das geht über:",
    notFoundLabel: "Künstlerisch",
  },
} as const

type UiKey = keyof (typeof ui)["nl"]

const copyText = {
  en: {
    heroSubtitle: "We are the new digital leaders. We reorganise and transform, connect people, and give them a voice that has to be heard.",
    aboutTitle: "About me",
    aboutLead: "DE CONNECTORS are the new digital leaders. We reorganise and transform, connect people, and give them a voice that has to be heard.",
    aboutLeft: "DE CONNECTORS knows how to build trust and how to bring people into the whole. In our projects, the people are the ones who get to speak. We give them a voice, a stage and the reins, and place them in the middle of your project or organisation.",
    aboutRight: "We call it Celebrating People. Our interest and curiosity are real. We listen to what people actually have to say, and we check whether we heard them well. We use all kinds of interactive media to carry their message to your organisation and community.",
    clientsTitle: "Organisations I have worked for",
    contactTitle: "Get in touch",
    contactLead: "A coffee, a story, a first question. We prefer to start with a real conversation.",
    blogTitle: "Blog",
    blogLead: "Background, reports and notes. The same voice as the site, with time added.",
    blogButton: "To my blog",
    poemLead: "Three poems. About what we refuse to offer, about the city, and about who does not fit the mould.",
    whoRole: "Runs DE CONNECTORS. Journalist and producer",
    poem: `Ears pricked
Toward places where no one else listens
She builds bridges of understanding
Across which you can hear the voices of the city
And guided by those stories
Doors are kicked in
To make us work together
On a renewed future full of modern ideals
written by Jimmy Rockx`,
  },
  fr: {
    heroSubtitle: "Nous sommes les nouveaux leaders numériques. Nous réorganisons et transformons, nous relions les gens et leur donnons une voix qui doit être entendue.",
    aboutTitle: "À propos",
    aboutLead: "DE CONNECTORS, ce sont les nouveaux leaders numériques. Nous réorganisons et transformons, nous relions les gens et leur donnons une voix qui doit être entendue.",
    aboutLeft: "DE CONNECTORS sait créer la confiance et relier les gens à l’ensemble. Dans nos projets, ce sont les personnes qui prennent la parole. Nous leur donnons une voix, une scène et les rênes, et nous les plaçons au cœur de votre projet ou de votre organisation.",
    aboutRight: "Nous appelons cela Celebrating People. Notre intérêt et notre curiosité sont sincères. Nous écoutons ce que les gens ont vraiment à dire, et nous vérifions si nous les avons bien entendus. Nous utilisons toutes sortes de médias interactifs pour porter leur message vers votre organisation et votre communauté.",
    clientsTitle: "Organisations pour lesquelles j’ai travaillé",
    contactTitle: "Écrire",
    contactLead: "Un café, une histoire, une première question. Nous aimons commencer par une vraie conversation.",
    blogTitle: "Blog",
    blogLead: "Arrière-plans, récits et notes. La même voix que le site, avec le temps en plus.",
    blogButton: "Vers mon blog",
    poemLead: "Trois poèmes. Sur ce que l’on n’offre pas, sur la ville, et sur celles et ceux qui n’entrent dans aucun cadre.",
    whoRole: "Dirige DE CONNECTORS. Journaliste et productrice",
    poem: `L’oreille aux aguets
Vers les endroits où personne d’autre n’écoute
Elle bâtit des ponts de compréhension
D’où l’on entend les voix de la ville
Et, guidés par ces récits
On enfonce des portes
Pour imposer de travailler ensemble
À un avenir renouvelé, plein d’idéaux modernes
écrit par Jimmy Rockx`,
  },
  de: {
    heroSubtitle: "Wir sind die neuen digitalen Führungskräfte. Wir ordnen neu und verwandeln, verbinden Menschen und geben ihnen eine Stimme, die gehört werden muss.",
    aboutTitle: "Über mich",
    aboutLead: "DE CONNECTORS sind die neuen digitalen Führungskräfte. Wir ordnen neu und verwandeln, verbinden Menschen und geben ihnen eine Stimme, die gehört werden muss.",
    aboutLeft: "DE CONNECTORS weiß, wie man Vertrauen aufbaut und Menschen mit dem Ganzen verbindet. In unseren Projekten kommen die Menschen selbst zu Wort. Wir geben ihnen eine Stimme, eine Bühne und die Zügel, und stellen sie in die Mitte Ihres Projekts oder Ihrer Organisation.",
    aboutRight: "Wir nennen es Celebrating People. Unser Interesse und unsere Neugier sind echt. Wir hören, was Menschen wirklich zu sagen haben, und prüfen, ob wir sie richtig verstanden haben. Mit interaktiven Medien tragen wir ihre Botschaft in Ihre Organisation und Community.",
    clientsTitle: "Organisationen, für die ich gearbeitet habe",
    contactTitle: "Kontakt aufnehmen",
    contactLead: "Ein Kaffee, eine Geschichte, eine erste Frage. Am liebsten beginnen wir mit einem echten Gespräch.",
    blogTitle: "Blog",
    blogLead: "Hintergründe, Berichte und Notizen. Dieselbe Stimme wie auf der Website, nur mit der Zeit dazu.",
    blogButton: "Zu meinem Blog",
    poemLead: "Drei Gedichte. Über das, was wir nicht opfern, über die Stadt, und über Menschen, die in keine Form passen.",
    whoRole: "Leitet DE CONNECTORS. Journalistin und Produzentin",
    poem: `Mit gespitzten Ohren
Dorthin, wo sonst niemand hinhört
Baut sie Brücken des Verstehens
Über die man die Stimmen der Stadt hört
Und an der Hand dieser Geschichten
Werden Türen eingetreten
Um Zusammenarbeit zu erzwingen
An einer erneuerten Zukunft voll moderner Ideale
geschrieben von Jimmy Rockx`,
  },
} as const

const watText: Record<Exclude<Locale, "nl">, Record<string, Partial<WatPage> & { poems?: { id: string; title: string; body: string }[] }>> = {
  en: {
    journalistiek: {
      title: "Journalism",
      lead: "Where everyone looks right, I look left.",
      body: "That is often where I find progress, and people who change things for the better. I make journalistic work in which people speak for themselves, with a voice that is truly heard.",
      offerTitle: "What I can do for you",
      offerText: "A report, a series, or a conversation that stays. From the first idea to the story that carries the organisation and the people.",
    },
    artistiek: {
      title: "Artistic",
      lead: "Form, a stage, and an audience that takes part.",
      body: "For me, artistic work is about making something together. Live, on screen, or in a room where people meet and leave something behind.",
      offerTitle: "What I can do for you",
      offerText: "An evening, a series of images, or a form that carries the story. I shape it around what you need.",
      poemPageTitle: "Poems",
    },
    "artistiek-journalistiek": {
      title: "Artistic journalism",
      lead: "The factual story, in a form that stays with you.",
      body: "This is where journalism and art meet. The same care for what is true, in a form that moves people and takes them along.",
      offerTitle: "What I can do for you",
      offerText: "A production in which the story is right and the form does something. A paper, a film, a live evening, or a mix.",
    },
  },
  fr: {
    journalistiek: {
      title: "Journalisme",
      lead: "Là où tout le monde regarde à droite, je regarde à gauche.",
      body: "C’est souvent là que je trouve le progrès, et des gens qui font bouger les choses. Je fais des productions journalistiques où les personnes parlent elles-mêmes, avec une voix vraiment entendue.",
      offerTitle: "Ce que je peux faire pour vous",
      offerText: "Un reportage, une série ou une conversation qui reste. De la première idée au récit qui porte l’organisation et les gens.",
    },
    artistiek: {
      title: "Artistique",
      lead: "Une forme, une scène, et un public qui participe.",
      body: "Pour moi, le travail artistique consiste à faire ensemble. En direct, à l’image, ou dans un lieu où les gens se rencontrent et laissent quelque chose.",
      offerTitle: "Ce que je peux faire pour vous",
      offerText: "Une soirée, une série d’images, ou une forme qui porte le récit. Je l’accorde à ce dont vous avez besoin.",
      poemPageTitle: "Poèmes",
    },
    "artistiek-journalistiek": {
      title: "Journalisme artistique",
      lead: "Le récit des faits, dans une forme qui reste.",
      body: "Ici, journalisme et art se rejoignent. Le même soin pour ce qui est vrai, dans une forme qui touche et emmène.",
      offerTitle: "Ce que je peux faire pour vous",
      offerText: "Une production où le récit est juste et la forme agit. Journal, film, soirée, ou un mélange.",
    },
  },
  de: {
    journalistiek: {
      title: "Journalismus",
      lead: "Wo alle nach rechts schauen, schaue ich nach links.",
      body: "Dort finde ich oft den Fortschritt und Menschen, die etwas zum Besseren verändern. Ich mache journalistische Arbeiten, in denen die Menschen selbst sprechen, mit einer Stimme, die wirklich gehört wird.",
      offerTitle: "Was ich für Sie tun kann",
      offerText: "Eine Reportage, eine Serie oder ein Gespräch, das bleibt. Von der ersten Idee bis zur Geschichte, die Organisation und Menschen trägt.",
    },
    artistiek: {
      title: "Künstlerisch",
      lead: "Form, Bühne und ein Publikum, das mitmacht.",
      body: "Künstlerische Arbeit heißt für mich: gemeinsam machen. Live, im Bild oder in einem Raum, wo Menschen sich begegnen und etwas zurücklassen.",
      offerTitle: "Was ich für Sie tun kann",
      offerText: "Ein Abend, eine Bildreihe oder eine Form, die die Geschichte trägt. Ich richte sie nach dem, was Sie brauchen.",
      poemPageTitle: "Gedichte",
    },
    "artistiek-journalistiek": {
      title: "Künstlerischer Journalismus",
      lead: "Die Faktengeschichte, in einer Form, die bleibt.",
      body: "Hier treffen Journalismus und Kunst aufeinander. Dieselbe Sorgfalt für das, was stimmt, in einer Form, die Menschen berührt und mitnimmt.",
      offerTitle: "Was ich für Sie tun kann",
      offerText: "Eine Produktion, in der die Geschichte stimmt und die Form etwas tut. Zeitung, Film, Live, oder eine Mischung.",
    },
  },
}

const poems = {
  en: [
    { id: "offer", title: "Offering", body: `Not my wealth\nNot my profit\nNot my mortgage\nNot my villa in the gravel\nNot my second car\nNot my screens and high tech\nNot my 130 kilometres an hour\nNot my own parking space\nNot my village\nNot my view\nNot my back garden\nNot my camera surveillance\nNot my bonus\nNot my days off\nNot my Christmas hamper\nNot my secondary benefits\nNot my yearly sabbatical\nNot my retreat in a safari tent\nNot my holiday from Schiphol\nNot my city trip at the weekend` },
    { id: "stad-van-ons", title: "City of Ours", body: `Your daybreak\nGeese shear along my roof\nGravel crunches under my heel\nA cyclist emerges from the mist\nGirls chatter under their helmets\nOff to school and work and sport\nWe go\nYou and I\nAnd\nYou and you\nInside the northern and southern ring roads\nThey take us into the capillaries\nWhere meetings happen by themselves\nBreda, the city\nOf me\nAnd you\nAnd you\nOf us\nAll of us` },
    { id: "passen-in-het-vak", title: "Fitting the mould", body: `Tight straight lines\nSeparate aims and groups\nThey do want to meet\nYet are built to avoid it\nKeep looking straight ahead\nOur feet fall into step\nThrough bumps and holes\nFilled with rules and\nForms that smooth the chaos\nThe established order sits tight\nIt rummages and stumbles inside the mould\nWhere uniforms and nets catch you\nTake you by the collar\nAnd whisper the rules once more, softly\nThe hard hand we save for the stranger\nWho fits in no mould at all` },
  ],
  fr: [
    { id: "offer", title: "Offrande", body: `Pas ma fortune\nPas mon profit\nPas mon hypothèque\nPas ma villa dans le gravier\nPas ma seconde voiture\nPas mes écrans ni ma high-tech\nPas mes 130 km à l’heure\nPas ma place de parking\nPas mon village\nPas ma vue\nPas mon jardin\nPas ma vidéosurveillance\nPas ma prime\nPas mes jours de congé\nPas mon colis de Noël\nPas mes avantages secondaires\nPas mon sabbatique annuelle\nPas ma retraite sous tente safari\nPas mes vacances au départ de Schiphol\nPas mon city-trip du week-end` },
    { id: "stad-van-ons", title: "La ville à nous", body: `Ton point du jour\nDes oies rasent mon toit\nLe gravier crisse sous mon talon\nUn cycliste sort de la brume\nDes filles bavardent sous leur casque\nVers l’école, le travail, le sport\nNous allons\nToi et moi\nEt\nToi et toi\nDans les rocades du nord et du sud\nElles nous mènent dans les capillaires\nOù les rencontres se font toutes seules\nBreda, la ville\nDe moi\nEt de toi\nEt de toi\nDe nous\nTous` },
    { id: "passen-in-het-vak", title: "Rentrer dans le cadre", body: `Des lignes droites et serrées\nSéparent les buts et les groupes\nOn voudrait bien se rencontrer\nMais tout est fait pour l’éviter\nContinuer à regarder droit devant\nNos pieds marchent au pas\nPar bosses et par creux\nComblés de règles et\nDe formulaires qui lissent le chaos\nL’ordre établi est bien assis\nIl farfouille et trébuche dans le cadre\nOù uniformes et filets vous prennent\nVous attrapent au col\nEt vous ressoufflent les règles, tout bas\nLa main dure, on la garde pour l’étranger\nQui n’entre dans aucun cadre` },
  ],
  de: [
    { id: "offer", title: "Opfer", body: `Nicht mein Vermögen\nNicht mein Gewinn\nNicht meine Hypothek\nNicht meine Villa im Kies\nNicht mein zweites Auto\nNicht meine Bildschirme und Hightech\nNicht meine 130 km/h\nNicht mein eigener Parkplatz\nNicht mein Dorf\nNicht meine Aussicht\nNicht mein Garten\nNicht meine Videoüberwachung\nNicht mein Bonus\nNicht meine freien Tage\nNicht mein Weihnachtspaket\nNicht meine Zusatzleistungen\nNicht mein jährliches Sabbatical\nNicht mein Retreat im Safarizelt\nNicht mein Urlaub ab Schiphol\nNicht mein Städtetrip am Wochenende` },
    { id: "stad-van-ons", title: "Stadt von uns", body: `Dein Morgenlicht\nGänse streichen an meinem Dach vorbei\nDer Kies knirscht unter meiner Ferse\nAus dem Nebel taucht ein Radfahrer auf\nMädchen schwatzen unter ihren Helmen\nAuf dem Weg zu Schule, Arbeit und Sport\nGehen wir\nDu und ich\nUnd\nDu und du\nInnerhalb der nördlichen und südlichen Ringstraßen\nSie bringen uns in die Kapillaren\nWo Begegnungen von selbst geschehen\nBreda, die Stadt\nVon mir\nUnd dir\nUnd dir\nVon uns\nAllen` },
    { id: "passen-in-het-vak", title: "In die Form passen", body: `Straffe gerade Linien\nTrennen Ziele und Gruppen\nMan will sich schon begegnen\nDoch alles ist gebaut, um auszuweichen\nWeiter geradeaus schauen\nUnsere Füße gehen im Gleichschritt\nDurch Buckel und Löcher\nGefüllt mit Regeln und\nFormularen, die das Chaos glätten\nDie bestehende Ordnung sitzt fest\nSie kramt und stolpert in der Form\nWo Uniformen und Netze dich fangen\nDich am Kragen packen\nUnd dir die Regeln noch einmal zuflüstern, leise\nDie harte Hand heben wir uns für den Fremden auf\nDer in keine Form passt` },
  ],
}

function isLocale(value: string | null): value is Locale {
  return value === "nl" || value === "en" || value === "fr" || value === "de"
}

const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void }>({
  locale: "nl",
  setLocale: () => {},
})

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("nl")
  useEffect(() => {
    const saved = window.localStorage.getItem(KEY)
    if (isLocale(saved)) setLocaleState(saved)
  }, [])
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  const value = useMemo(
    () => ({
      locale,
      setLocale: (next: Locale) => {
        setLocaleState(next)
        window.localStorage.setItem(KEY, next)
      },
    }),
    [locale],
  )
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useI18n() {
  const { locale, setLocale } = useContext(LocaleContext)
  function t(key: UiKey) {
    return ui[locale][key]
  }
  return { locale, setLocale, t }
}

function localize(source: SiteData, locale: Exclude<Locale, "nl">): SiteData {
  const text = copyText[locale]
  const pages = watText[locale]
  return {
    ...source,
    copy: {
      ...source.copy,
      ...text,
      whoRole: text.whoRole,
      people: source.copy.people.map((person, index) => (index === 0 ? { ...person, role: text.whoRole } : person)),
    },
    wat: source.wat.map((page) => {
      const next = pages[page.slug]
      if (!next) return page
      const translatedPoems = page.slug === "artistiek" ? poems[locale] : page.poems
      return {
        ...page,
        ...next,
        poemLead: page.slug === "artistiek" ? text.poemLead : page.poemLead,
        poems: translatedPoems?.length ? translatedPoems : page.poems,
      }
    }),
  }
}

export function useLocaleSite() {
  const { data: source, ready } = useSiteData()
  const { locale } = useI18n()
  const data = useMemo(() => (locale === "nl" ? source : localize(source, locale)), [source, locale])
  return { data, source, ready, locale }
}
