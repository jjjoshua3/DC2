import type { Locale } from "@/lib/i18n"

function norm(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

type Phrase = { dutch: string; en: string; fr: string; de: string }

const phrases: Phrase[] = [
  {
    dutch: "Journalistieke en artistieke projecten die mensen verbinden. Stefanie Vermeulen is freelance journalist, producer en maker.",
    en: "Journalistic and artistic projects that connect people. Stefanie Vermeulen is a freelance journalist, producer and maker.",
    fr: "Des projets journalistiques et artistiques qui relient les gens. Stefanie Vermeulen est journaliste freelance, productrice et créatrice.",
    de: "Journalistische und künstlerische Projekte, die Menschen verbinden. Stefanie Vermeulen ist freie Journalistin, Produzentin und Gestalterin.",
  },
  {
    dutch: "DE CONNECTORS is het bureau van Stefanie Vermeulen. Eén maker, met de mensen in het midden.",
    en: "DE CONNECTORS is the practice of Stefanie Vermeulen. One maker, with people at the centre.",
    fr: "DE CONNECTORS est le bureau de Stefanie Vermeulen. Une seule créatrice, avec les gens au centre.",
    de: "DE CONNECTORS ist das Büro von Stefanie Vermeulen. Eine Gestalterin, mit den Menschen im Mittelpunkt.",
  },
  {
    dutch: "Ik ben Stefanie Vermeulen. Ik ben een CONNECTOR in hart en ziel. Ik hou ervan om mensen te laten samenwerken en een stem te geven die werkelijk wordt gehoord. Sinds 2003 ben ik onafankelijk journalist, stadmaker en kwartiermaker. Ik heb talloze projecten opgezet in binnen- en buitenland waarbij ik mensen bij elkaar bracht en samenwerkingen optuigde. Mijn artikelen voor dagbladen, sites en magazines gaan vaak over mensen die strijden voor een eerlijke, kansrijke wereld.",
    en: "I am Stefanie Vermeulen. I am a CONNECTOR at heart. I love bringing people together and giving them a voice that is truly heard. Since 2003 I have been an independent journalist, city maker and pathfinder. I have set up countless projects in the Netherlands and abroad, bringing people together and building collaborations. My articles for newspapers, websites and magazines often follow people who fight for a fairer world with real chances.",
    fr: "Je suis Stefanie Vermeulen. Je suis une CONNECTOR dans l’âme. J’aime faire collaborer les gens et leur donner une voix qui est vraiment entendue. Depuis 2003, je suis journaliste indépendante, faiseuse de ville et éclaireuse. J’ai monté de nombreux projets aux Pays-Bas et à l’étranger, où je rassemblais des gens et construisais des collaborations. Mes articles pour les quotidiens, les sites et les magazines parlent souvent de personnes qui se battent pour un monde plus juste et plus ouvert.",
    de: "Ich bin Stefanie Vermeulen. Ich bin eine CONNECTOR mit Herz und Seele. Ich liebe es, Menschen zusammenzubringen und ihnen eine Stimme zu geben, die wirklich gehört wird. Seit 2003 bin ich unabhängige Journalistin, Stadtmacherin und Wegbereiterin. Ich habe zahllose Projekte im In- und Ausland aufgebaut, Menschen zusammengebracht und Kooperationen auf die Beine gestellt. Meine Artikel für Tageszeitungen, Websites und Magazine handeln oft von Menschen, die für eine gerechte Welt mit echten Chancen kämpfen.",
  },
  {
    dutch: "In mijn woon- en werkplaats Breda ben ik sinds 2016 als verbindende stadmaker actief en geef ik inwoners een podium en een stem. Ik luister naar wat mensen werkelijk te zeggen hebben, zet ze met hun verhaal in de schijnwerpers en breng ze met hun boodschap aan tafel waar beleid wordt gemaakt. Ik gebruik allerlei vormen van artistieke journalistiek om bubbels te doorbreken en leef-en systeemwereld dichter bij elkaar te brengen.",
    en: "In Breda, where I live and work, I have been an active connecting city maker since 2016. I give residents a stage and a voice. I listen to what people really have to say, put them and their story in the spotlight, and bring their message to the table where policy is made. I use all kinds of artistic journalism to break bubbles and bring lived experience and the world of systems closer together.",
    fr: "À Breda, où je vis et travaille, je suis depuis 2016 une faiseuse de ville qui relie. Je donne aux habitants une scène et une voix. J’écoute ce que les gens ont vraiment à dire, je les mets, avec leur histoire, sous les projecteurs, et je porte leur message à la table où se fait la politique. J’utilise toutes sortes de journalisme artistique pour briser les bulles et rapprocher le monde vécu du monde des systèmes.",
    de: "In Breda, wo ich wohne und arbeite, bin ich seit 2016 als verbindende Stadtmacherin aktiv. Ich gebe Bewohnerinnen und Bewohnern eine Bühne und eine Stimme. Ich höre, was Menschen wirklich zu sagen haben, stelle sie mit ihrer Geschichte ins Licht und bringe ihre Botschaft an den Tisch, an dem Politik gemacht wird. Mit Formen des künstlerischen Journalismus durchbreche ich Blasen und bringe Lebenswelt und Systemwelt näher zusammen.",
  },
  {
    dutch: "Waar iedereen naar rechts kijkt, kijk ik naar links. Mijn journalistieke neus gaat uit naar de vooruitgang waar we allemaal beter van worden, mens én planeet.",
    en: "Where everyone looks right, I look left. My journalistic nose follows the progress that makes life better for all of us, people and planet.",
    fr: "Là où tout le monde regarde à droite, je regarde à gauche. Mon flair de journaliste cherche le progrès dont nous profitons tous, humains et planète.",
    de: "Wo alle nach rechts schauen, schaue ich nach links. Meine journalistische Nase sucht den Fortschritt, von dem wir alle besser werden, Mensch und Planet.",
  },
  {
    dutch: "Vaak zijn jongeren de hoofdpersonen in mijn artikelen. De nieuwe generatie is druk bezig met opgroeien en zichzelf te worden. Ze wil meedoen en ziet ook waar het beter moet. Sommigen durven zich uit te spreken, of de verandering te zijn. Tegelijkertijd zijn de verwachtingen hoog en meedoen lukt lang niet iedereen. Jongeren verdienen een podium, een stem die we werkelijk horen.",
    en: "Young people are often the main characters in my articles. The new generation is busy growing up and becoming itself. It wants to take part, and it sees where things should be better. Some dare to speak out, or to be the change. At the same time the expectations are high, and not everyone manages to join in. Young people deserve a stage, a voice we truly hear.",
    fr: "Les jeunes sont souvent les personnages principaux de mes articles. La nouvelle génération est occupée à grandir et à devenir elle-même. Elle veut participer, et elle voit aussi où cela doit aller mieux. Certains osent prendre la parole, ou être le changement. En même temps, les attentes sont hautes, et tout le monde n’arrive pas à prendre part. Les jeunes méritent une scène, une voix que nous entendons vraiment.",
    de: "Junge Menschen sind oft die Hauptpersonen in meinen Artikeln. Die neue Generation ist damit beschäftigt, aufzuwachsen und sie selbst zu werden. Sie will mitmachen und sieht auch, wo es besser werden muss. Manche trauen sich, sich zu äußern oder selbst die Veränderung zu sein. Gleichzeitig sind die Erwartungen hoch, und mitmachen gelingt längst nicht jedem. Junge Menschen verdienen eine Bühne, eine Stimme, die wir wirklich hören.",
  },
  {
    dutch: "Een reportage, een reeks of een interview. Van het eerste idee tot het verhaal.",
    en: "A report, a series or an interview. From the first idea to the story.",
    fr: "Un reportage, une série ou un entretien. De la première idée au récit.",
    de: "Eine Reportage, eine Serie oder ein Interview. Von der ersten Idee bis zur Geschichte.",
  },
  {
    dutch: "Mensen en plekken, en de vraag die niemand hardop stelde.",
    en: "People and places, and the question nobody asked out loud.",
    fr: "Des gens et des lieux, et la question que personne n’a posée à voix haute.",
    de: "Menschen und Orte, und die Frage, die niemand laut gestellt hat.",
  },
  {
    dutch: "Een gesprek dat de kern raakt, niet de praatjes eromheen.",
    en: "A conversation that reaches the core, not the talk around it.",
    fr: "Une conversation qui touche le cœur, pas les bavardages autour.",
    de: "Ein Gespräch, das den Kern trifft, nicht das Gerede drumherum.",
  },
  {
    dutch: "Meerdere verhalen die samen een groter beeld geven.",
    en: "Several stories that together give a larger picture.",
    fr: "Plusieurs récits qui, ensemble, donnent une image plus large.",
    de: "Mehrere Geschichten, die zusammen ein größeres Bild ergeben.",
  },
  {
    dutch: "Dagelijks verwonder ik me over hoe wij ons handhaven in de huidige maatschappij.",
    en: "Every day I wonder how we hold our own in today’s society.",
    fr: "Chaque jour je m’étonne de la façon dont nous tenons bon dans la société actuelle.",
    de: "Jeden Tag staune ich darüber, wie wir uns in der heutigen Gesellschaft behaupten.",
  },
  {
    dutch: "Dagelijks verwonder ik me over hoe wij ons handhaven in de huidige maatschappij. Over hoe we ons geluk najagen in prestige, succes en geld. Mijn verwondering en mijn persoonlijke zoektocht naar nieuwe paden, - weg van hebzucht, afgunst en hoogmoed - druk ik uit in mijn gedichten en stories. De zinnen stromen het fijnst in mijn eigen huis. My Ship.",
    en: "Every day I wonder how we hold our own in today’s society. How we chase happiness in prestige, success and money. I put that wonder, and my own search for new paths — away from greed, envy and pride — into my poems and stories. The lines flow best in my own house. My Ship.",
    fr: "Chaque jour je m’étonne de la façon dont nous tenons bon dans la société actuelle. De la façon dont nous poursuivons le bonheur dans le prestige, le succès et l’argent. Cet étonnement, et ma propre recherche de nouveaux chemins — loin de l’avidité, de l’envie et de l’orgueil — je l’exprime dans mes poèmes et mes stories. Les phrases coulent le mieux dans ma propre maison. My Ship.",
    de: "Jeden Tag staune ich darüber, wie wir uns in der heutigen Gesellschaft behaupten. Darüber, wie wir das Glück in Prestige, Erfolg und Geld jagen. Dieses Staunen und meine eigene Suche nach neuen Wegen — weg von Gier, Neid und Hochmut — bringe ich in meinen Gedichten und Stories zum Ausdruck. Die Sätze fließen am besten in meinem eigenen Haus. My Ship.",
  },
  {
    dutch: "Stories & Gedichten",
    en: "Stories & poems",
    fr: "Stories et poèmes",
    de: "Stories und Gedichte",
  },
  {
    dutch: "We leven in bubbels en drijven steeds verder uit elkaar.",
    en: "We live in bubbles and drift further and further apart.",
    fr: "Nous vivons dans des bulles et nous éloignons de plus en plus les uns des autres.",
    de: "Wir leben in Blasen und treiben immer weiter auseinander.",
  },
  {
    dutch: "We leven in bubbels en drijven steeds verder uit elkaar. We praten over, niet mét elkaar. Luisteren naar elkaars verschillen wordt almaar moeilijker. Met artistieke journalistiek bied ik daar een antwoord op. De events, performances en media produkties die ik ontwikkel creëren een ruimte voor verhalen met uiteenlopende en tegenovergestelde perspectieven. Ze brengen mensen uit verschillende bubbels bij elkaar; mensen die elkaar doorgaans niet spreken, ontmoeten, zien en horen elkaar.",
    en: "We live in bubbles and drift further and further apart. We talk about each other, not with each other. Listening to one another’s differences gets harder all the time. With artistic journalism I offer an answer. The events, performances and media productions I develop create a space for stories with differing and opposing perspectives. They bring people from different bubbles together; people who usually do not speak meet, see and hear each other.",
    fr: "Nous vivons dans des bulles et nous éloignons de plus en plus les uns des autres. Nous parlons les uns des autres, pas les uns avec les autres. Écouter nos différences devient toujours plus difficile. Avec le journalisme artistique, j’y apporte une réponse. Les événements, performances et productions médias que je développe créent un espace pour des récits aux perspectives différentes, parfois opposées. Ils rassemblent des gens de bulles différentes ; des gens qui d’ordinaire ne se parlent pas se rencontrent, se voient et s’entendent.",
    de: "Wir leben in Blasen und treiben immer weiter auseinander. Wir reden übereinander, nicht miteinander. Einander in den Unterschieden zuzuhören wird immer schwieriger. Mit künstlerischem Journalismus gebe ich darauf eine Antwort. Die Events, Performances und Medienproduktionen, die ich entwickle, schaffen Raum für Geschichten mit unterschiedlichen und gegensätzlichen Perspektiven. Sie bringen Menschen aus verschiedenen Blasen zusammen; Menschen, die sonst nicht miteinander sprechen, begegnen, sehen und hören einander.",
  },
  {
    dutch: "'Stefanie is een scherpe vragensteller en kritische luisteraar'",
    en: "“Stefanie is a sharp questioner and a critical listener”",
    fr: "« Stefanie est une questionneuse précise et une auditrice critique »",
    de: "„Stefanie ist eine scharfe Fragestellerin und eine kritische Zuhörerin“",
  },
  {
    dutch: "In 2023 werd ik benoemd tot Smaakmaker van Breda. Ieder jaar reikt Gemeente Breda deze benoeming uit aan Bredanaas die kleur en smaak toevoegen aan de stad.",
    en: "In 2023 I was named Smaakmaker of Breda. Each year the municipality of Breda gives this title to people from Breda who add colour and flavour to the city.",
    fr: "En 2023, j’ai été nommée Smaakmaker de Breda. Chaque année, la commune de Breda décerne ce titre à des Bredanais qui apportent couleur et goût à la ville.",
    de: "2023 wurde ich zur Smaakmaker von Breda ernannt. Jedes Jahr vergibt die Gemeinde Breda diesen Titel an Menschen aus Breda, die der Stadt Farbe und Geschmack geben.",
  },
  {
    dutch: "Opdrachtgevers en Organisaties met wie ik werkte",
    en: "Clients and organisations I have worked with",
    fr: "Clients et organisations avec lesquels j’ai travaillé",
    de: "Auftraggeber und Organisationen, mit denen ich gearbeitet habe",
  },
  {
    dutch: "Connect met mij",
    en: "Connect with me",
    fr: "Écrivez-moi",
    de: "Verbinde dich mit mir",
  },
  {
    dutch: "Wat kan ik voor je betekenen? Bel, app of mail mij.",
    en: "How can I help? Call, message or email me.",
    fr: "Que puis-je faire pour vous ? Appelez-moi, envoyez-moi un message ou un e-mail.",
    de: "Was kann ich für dich tun? Ruf an, schreib oder mail mir.",
  },
].map((item) => ({ ...item, dutch: norm(item.dutch) }))

const byDutch = new Map(phrases.map((item) => [item.dutch, item]))

export function phraseTranslation(dutch: string, locale: Locale) {
  if (locale === "nl") return ""
  const hit = byDutch.get(norm(dutch))
  return hit?.[locale] ?? ""
}
