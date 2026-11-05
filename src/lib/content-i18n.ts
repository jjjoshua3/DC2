import type { LangCode, TextPack } from "@/lib/site-types"

type Pack = Partial<Record<LangCode, TextPack>>

const p = (en: TextPack | null, fr: TextPack, de: TextPack): Pack => {
  const pack: Pack = { fr, de }
  if (en) pack.en = en
  return pack
}

export const projectPacks: Record<string, Pack> = {
  duurzaamheidskrant: p(
    {
      title: "Sustainability paper",
      lead: "The city is full of sustainable heroes. PakhuisB, the foundation where DE CONNECTORS works, decided it was time to put them in the spotlight.",
      body: `<p>So their voices could be heard. So they could tell how they do it: living or working in a sustainable way.</p>
<p>They also wanted to show that sustainability is much more than climate and the energy transition. They know very well that focusing only on that can make people who want to take part, but lack the means, feel left out. And that this can widen the gap that already exists.</p>
<blockquote>“The energy transition is hugely important, but with very little money and a rented house you are severely limited,” says a participant in the energy-transition survey that PakhuisB ran with BredaVandaag. “These people are sustainable heroes too.”</blockquote>
<p>Because they always buy their clothes second-hand, for example, or always take the bike. It matters that we keep hearing these heroes, and start to understand why they hold back, or even resist the energy transition.</p>
<p>The cartoon with this story was made by Geert Rutten of Creative Flavours.</p>`,
      ctaLabel: "Read the paper online",
    },
    {
      title: "Journal de la durabilité",
      lead: "La ville est pleine de héros durables. PakhuisB, la fondation où travaille DE CONNECTORS, a trouvé qu’il était temps de les mettre en lumière.",
      body: `<p>Pour que leur voix porte. Pour qu’ils racontent comment ils vivent ou entreprennent de façon durable.</p>
<p>Ils voulaient aussi montrer que la durabilité est bien plus que le climat et la transition énergétique. Ils savent très bien qu’en se concentrant seulement là-dessus, beaucoup de gens qui voudraient participer, mais n’en ont pas les moyens, peuvent se sentir exclus. Et que cela peut creuser l’écart qui existe déjà.</p>
<blockquote>« La transition énergétique est très importante, mais avec très peu d’argent et une maison en location, on est vraiment limité », explique un participant à l’enquête menée par PakhuisB avec BredaVandaag. « Ces personnes sont elles aussi des héros durables. »</blockquote>
<p>Parce qu’elles achètent toujours leurs vêtements d’occasion, par exemple, ou prennent toujours le vélo. Il importe de continuer à entendre ces héros, et de comprendre pourquoi ils hésitent, ou même résistent à la transition énergétique.</p>
<p>Le dessin de cette histoire est de Geert Rutten, de Creative Flavours.</p>`,
      ctaLabel: "Lire le journal en ligne",
    },
    {
      title: "Nachhaltigkeitszeitung",
      lead: "Die Stadt ist voller nachhaltiger Heldinnen und Helden. PakhuisB, die Stiftung, in der DE CONNECTORS arbeitet, fand: es ist Zeit, sie ins Rampenlicht zu stellen.",
      body: `<p>Damit ihre Stimme klingt. Damit sie erzählen, wie sie nachhaltig leben oder wirtschaften.</p>
<p>Sie wollten auch zeigen, dass Nachhaltigkeit viel mehr ist als Klima und Energiewende. Sie wissen genau, dass ein enger Fokus Menschen, die mitmachen wollen, aber keine Mittel haben, ausschließen kann. Und dass dadurch die bestehende Kluft größer werden kann.</p>
<blockquote>„Die Energiewende ist enorm wichtig, aber mit sehr wenig Geld und einem Mietshaus ist man stark eingeschränkt“, sagt eine Teilnehmerin der Umfrage, die PakhuisB mit BredaVandaag gemacht hat. „Auch in diesen Menschen stecken nachhaltige Heldinnen und Helden.“</blockquote>
<p>Weil sie zum Beispiel ihre Kleidung immer secondhand kaufen oder immer das Fahrrad nehmen. Es ist wichtig, dass wir diese Stimmen weiter hören und verstehen, warum sie zögern oder sich sogar gegen die Energiewende stellen.</p>
<p>Die Karikatur zu dieser Geschichte stammt von Geert Rutten von Creative Flavours.</p>`,
      ctaLabel: "Die Zeitung online lesen",
    },
  ),
  "stad-van-straks": p(
    {
      title: "City of Tomorrow — documentary and paper",
      lead: "The Environment Act is coming, and in short it says this: the people of Breda really get a say now.",
      body: `<p>To DE CONNECTORS that sounds like music. Together with Stadslab and students of Avans University of Applied Sciences, from October through December 2019, we went out with a camera and a notebook and spoke with dozens — well over a hundred — people all over the city.</p>
<blockquote>How do you want to pass the city on to the next generation?</blockquote>
<p>From that they made a documentary, a handful of video portraits and a paper. These go to the alderman, who takes the ideas with him and translates them into his environmental vision.</p>
<p>We will keep talking and collecting ideas for a while, but we also think it is time for a party, to thank everyone who took part and put them in the spotlight.</p>`,
    },
    {
      title: "La ville de demain — documentaire et journal",
      lead: "La loi sur l’environnement arrive, et en bref elle dit ceci : les habitants de Breda ont vraiment leur mot à dire.",
      body: `<p>Pour DE CONNECTORS, cela sonne comme de la musique. Avec Stadslab et des étudiants de la haute école Avans, d’octobre à décembre 2019, nous sommes partis avec une caméra et un carnet, et nous avons parlé à des dizaines — plus de cent — personnes dans toute la ville.</p>
<blockquote>Comment veux-tu transmettre la ville à la génération suivante ?</blockquote>
<p>Ils en ont fait un documentaire, quelques portraits filmés et un journal. Tout cela va à l’échevin, qui emporte les idées et les traduit dans sa vision de l’environnement.</p>
<p>Nous continuerons encore un moment à parler et à recueillir des idées, mais nous trouvons aussi qu’il est temps de faire la fête, pour remercier les participants et les mettre en lumière.</p>`,
    },
    {
      title: "Stadt von morgen — Doku und Zeitung",
      lead: "Das Umgebungsgesetz kommt, und kurz gesagt heißt es: die Einwohnerinnen und Einwohner von Breda bekommen wirklich das Wort.",
      body: `<p>Für DE CONNECTORS klingt das wie Musik. Zusammen mit Stadslab und Studierenden der Hochschule Avans sind wir von Oktober bis Dezember 2019 mit Kamera und Notizblock losgezogen und haben mit Dutzenden — gut über hundert — Menschen an allen möglichen Orten in der Stadt gesprochen.</p>
<blockquote>Wie willst du die Stadt an die nächste Generation weitergeben?</blockquote>
<p>Daraus wurden ein Dokumentarfilm, einige Videoporträts und eine Zeitung. Die gehen an den Beigeordneten, der die Ideen mitnimmt und in seine Umgebungsvision übersetzt.</p>
<p>Wir sprechen noch eine Weile weiter und sammeln Ideen, aber wir finden auch: Zeit für ein Fest, um alle zu danken und ins Licht zu stellen.</p>`,
    },
  ),
  journalistiek: p(
    {
      title: "Journalism",
      lead: "Since 2003 I have written for newspapers, magazines and online platforms. My nose usually points toward progress.",
      body: `<p>People who invent new rules to break the status quo, who find smart answers to old problems, and who want to make the world cleaner, greener and happier. Their stories inspire me, and those are the ones I most like to write down.</p>
<blockquote>Because with stories you can make the world, and break it. I would rather make it.</blockquote>
<p>Below, a selection of clippings: from de Volkskrant and Het Parool to stories about North Korea, the Melkweg and Dutch business.</p>`,
    },
    {
      title: "Journalisme",
      lead: "Depuis 2003 j’écris pour des quotidiens, des magazines et des plateformes en ligne. Mon nez va le plus souvent vers le progrès.",
      body: `<p>Des gens qui inventent de nouvelles règles pour bousculer le statu quo, qui trouvent des solutions malines à de vieux problèmes, et qui veulent un monde plus propre, plus vert et plus heureux. Leurs récits m’inspirent, et ce sont ceux que j’aime le mieux noter.</p>
<blockquote>Parce qu’avec des histoires on peut faire le monde, et le défaire. Je préfère le faire.</blockquote>
<p>Ci-dessous une sélection de coupures : de de Volkskrant et Het Parool à des récits sur la Corée du Nord, le Melkweg et le monde des entreprises néerlandaises.</p>`,
    },
    {
      title: "Journalismus",
      lead: "Seit 2003 schreibe ich für Tageszeitungen, Magazine und Online-Plattformen. Meine Nase geht meistens in Richtung Fortschritt.",
      body: `<p>Menschen, die neue Spielregeln erfinden, um den Status quo zu brechen, die kluge Lösungen für alte Probleme finden und die Welt sauberer, grüner und glücklicher machen wollen. Ihre Geschichten inspirieren mich, und die schreibe ich am liebsten auf.</p>
<blockquote>Weil man mit Geschichten die Welt machen und zerbrechen kann. Ich mache sie lieber.</blockquote>
<p>Unten eine Auswahl von Ausschnitten: von de Volkskrant und Het Parool bis zu Geschichten über Nordkorea, den Melkweg und die niederländische Wirtschaft.</p>`,
    },
  ),
  "dutch-magic": p(
    {
      title: "Co-author, book on Dutch top brands",
      lead: "The book Dutch Magic — how Dutch entrepreneurs conquer markets, from VODW — is built from interviews with leading Dutch entrepreneurs.",
      body: `<p>Stefanie was asked to do six interviews. She spoke with Armin van Buuren, Alice Huisman of Royal Huisman (luxury yachts), Lidewij Edelkoort (formerly Design Academy), the men of eBuddy, Leo van Wijk (formerly KLM) and Gerlach Cerfontaine (Schiphol).</p>
<p>Each conversation was about how a brand appears when people truly believe in something — and dare to show it.</p>`,
    },
    {
      title: "Coautrice du livre sur les grandes marques néerlandaises",
      lead: "Le livre Dutch Magic — comment des entrepreneurs néerlandais conquièrent des marchés, chez VODW — est fait d’entretiens avec des entrepreneurs de premier plan.",
      body: `<p>On a demandé à Stefanie six entretiens. Elle a parlé avec Armin van Buuren, Alice Huisman de Royal Huisman (yachts de luxe), Lidewij Edelkoort (autrefois Design Academy), les hommes d’eBuddy, Leo van Wijk (autrefois KLM) et Gerlach Cerfontaine (Schiphol).</p>
<p>Autant de conversations sur la naissance d’une marque quand des gens croient vraiment à quelque chose — et osent le montrer.</p>`,
    },
    {
      title: "Co-Autorin, Buch über niederländische Topmarken",
      lead: "Das Buch Dutch Magic — wie niederländische Unternehmer Märkte erobern, von VODW — besteht aus Interviews mit führenden Unternehmern.",
      body: `<p>Stefanie wurde gebeten, sechs Interviews zu führen. Sie sprach mit Armin van Buuren, Alice Huisman von Royal Huisman (Luxusyachten), Lidewij Edelkoort (früher Design Academy), den Männern von eBuddy, Leo van Wijk (früher KLM) und Gerlach Cerfontaine (Schiphol).</p>
<p>Jedes Gespräch ging darum, wie eine Marke entsteht, wenn Menschen wirklich an etwas glauben — und das auch zeigen.</p>`,
    },
  ),
  datamining: p(
    {
      title: "Data-journalism crowdsourcer",
      lead: "DataminingX is the journalistic platform that makes news from data you share about yourself and your surroundings.",
      body: `<p>Through the app you can take part every day in short surveys on current topics. We turn that data into news on BredaVandaag. Your voice counts again.</p>
<p>Companies that join can take part as frontrunners in a mobile market-research tool that collects relevant data in an easy, attractive and effective way. DataminingX offers work made to measure, from a selection of profiles that keep growing richer.</p>
<p><strong>What we offer</strong></p>
<ul>
<li>Hyperlocal and regional market research</li>
<li>Market research that reaches ordinary people in Breda</li>
<li>A panel that answers honestly, because it is approached through a trusted, independent news medium</li>
<li>Access to the community of BredaVandaag (150,000 unique visitors a month) and De Bode</li>
<li>Speed: advanced mobile research that turns ‘in the moment’ data into insight in real time</li>
</ul>
<p>DataminingX is supported by the Dutch Journalism Fund.</p>`,
    },
    {
      title: "Crowdsourcing de datajournalisme",
      lead: "DataminingX est la plateforme journalistique qui fait des nouvelles avec les données que vous donnez sur vous-même et votre entourage.",
      body: `<p>Via l’appli, vous pouvez chaque jour participer à de courtes enquêtes sur des sujets d’actualité. Nous transformons ces données en nouvelles sur BredaVandaag. Votre voix compte à nouveau.</p>
<p>Les entreprises qui rejoignent le projet peuvent, en pionnières, utiliser un outil mobile de recherche qui recueille des données utiles de façon simple, attrayante et efficace. DataminingX propose du sur-mesure à partir de profils qui s’enrichissent en continu.</p>
<p><strong>Nous proposons</strong></p>
<ul>
<li>Une étude de marché hyperlocale et régionale</li>
<li>Une étude qui atteint les habitants ordinaires de Breda</li>
<li>Un panel qui répond honnêtement, parce qu’il est contacté par un média d’information fiable et indépendant</li>
<li>L’accès à la communauté de BredaVandaag (150 000 visiteurs uniques par mois) et à De Bode</li>
<li>La vitesse : une recherche mobile avancée qui traduit en temps réel des données « sur le moment » en enseignements</li>
</ul>
<p>DataminingX est soutenu par le Fonds de stimulation du journalisme.</p>`,
    },
    {
      title: "Crowdsourcing für den Datenjournalismus",
      lead: "DataminingX ist die journalistische Plattform, die Nachrichten macht aus Daten, die Sie über sich und Ihre Umgebung teilen.",
      body: `<p>Über die App können Sie täglich an kurzen Umfragen zu aktuellen Themen teilnehmen. Aus den Daten machen wir Nachrichten auf BredaVandaag. Ihre Stimme zählt wieder mit.</p>
<p>Unternehmen, die einsteigen, können als Vorreiter ein mobiles Marktforschungswerkzeug nutzen, das relevante Daten einfach, ansprechend und wirksam sammelt. DataminingX bietet Maßarbeit aus einer Auswahl ständig angereicherter Profile.</p>
<p><strong>Wir bieten</strong></p>
<ul>
<li>Hyperlokale und regionale Marktforschung</li>
<li>Marktforschung, die die gewöhnlichen Menschen in Breda erreicht</li>
<li>Ein Panel, das ehrlich antwortet, weil es über ein vertrauenswürdiges, unabhängiges Nachrichtenmedium angesprochen wird</li>
<li>Zugang zur Community von BredaVandaag (150.000 einzelne Besucher im Monat) und De Bode</li>
<li>Tempo: fortgeschrittene mobile Forschung, die Daten „im Moment“ in Echtzeit zu Erkenntnissen macht</li>
</ul>
<p>DataminingX wird vom Stimuleringsfonds voor de Journalistiek unterstützt.</p>`,
    },
  ),
  "bak-met-energie": p(
    {
      title: "A bin of energy",
      lead: "The wider public is barely involved in the energy transition, does not feel heard, and sometimes digs in its heels.",
      body: `<p><strong>Client.</strong> Brabant Geeft Energie</p>
<p><strong>Aim.</strong> To find out what energy means in the lives of the unusual suspects — and what place it takes.</p>
<p><strong>Celebrating.</strong> A men’s fraternity in Tilburg, a knitting club in Vught, women in a language class, runners in Breda, students of Avans and first-year vocational pupils.</p>
<p><strong>Service.</strong> Design and development of the idea and concept, project management, delivery, communication, monitoring and data analysis.</p>`,
    },
    {
      title: "Un bac d’énergie",
      lead: "Le grand public est à peine associé à la transition énergétique, ne se sent pas assez entendu et plante parfois les talons.",
      body: `<p><strong>Client.</strong> Brabant Geeft Energie</p>
<p><strong>But.</strong> Découvrir ce que l’énergie signifie dans la vie des gens qu’on n’interroge d’habitude pas — et quelle place elle y prend.</p>
<p><strong>Celebrating.</strong> Une confrérie masculine de Tilburg, un club de tricot à Vught, des femmes en cours de langue, des coureurs de Breda, des étudiants d’Avans et des élèves de première année de l’enseignement professionnel.</p>
<p><strong>Service.</strong> Conception de l’idée et du concept, gestion de projet, réalisation, communication, suivi et analyse des données.</p>`,
    },
    {
      title: "Eine Kiste Energie",
      lead: "Die breite Masse wird kaum an der Energiewende beteiligt, fühlt sich zu wenig gehört und stemmt manchmal die Hacken in den Boden.",
      body: `<p><strong>Auftraggeber.</strong> Brabant Geeft Energie</p>
<p><strong>Ziel.</strong> Herausfinden, was Energie im Leben der ungewöhnlichen Verdächtigen bedeutet — und welchen Platz sie einnimmt.</p>
<p><strong>Celebrating.</strong> Eine Männerverbindung in Tilburg, ein Strickclub in Vught, Frauen im Sprachkurs, Läuferinnen und Läufer aus Breda, Studierende der Avans und Schülerinnen und Schüler der ersten Berufsschulklasse.</p>
<p><strong>Leistung.</strong> Entwurf und Entwicklung von Idee und Konzept, Projektleitung, Umsetzung, Kommunikation, Monitoring und Datenanalyse.</p>`,
    },
  ),
  "sociaal-domein": p(
    {
      title: "The new social domain — interactive web magazine",
      lead: "We brought the municipality of Breda’s social-domain policy to life, and showed how everyone involved is connected.",
      body: `<p><strong>Client.</strong> Municipality of Breda</p>
<p><strong>Audience.</strong> People in Breda who deal with the social domain.</p>
<p><strong>Celebrating.</strong> We interviewed people from every layer and background and brought them together in one online magazine. The interviews came from passion and from the heart. That is how we showed that everyone is connected, both professionally and personally.</p>
<p>We used photos, podcasts, videos, animation and text, and invited the public to click through the magazine and choose the stories that move them.</p>
<p><strong>Service.</strong> Video, photo, podcast, animation, text.</p>`,
    },
    {
      title: "Le nouveau domaine social — magazine web interactif",
      lead: "Nous avons donné vie à la politique de la commune de Breda sur le domaine social, et montré comment toutes les personnes concernées sont liées.",
      body: `<p><strong>Client.</strong> Commune de Breda</p>
<p><strong>Public.</strong> Les habitants de Breda qui ont affaire au domaine social.</p>
<p><strong>Celebrating.</strong> Nous avons interviewé des personnes de toutes les couches et de tous les horizons, et nous les avons réunies dans un magazine en ligne. Les entretiens venaient de la passion et du cœur. Ainsi nous avons montré que chacun est lié, professionnellement et personnellement.</p>
<p>Nous avons utilisé photos, podcasts, vidéos, animation et texte, et invité le public à parcourir le magazine et à choisir les récits qui le touchent.</p>
<p><strong>Service.</strong> Vidéo, photo, podcast, animation, texte.</p>`,
    },
    {
      title: "Das neue soziale Feld — interaktives Webmagazin",
      lead: "Wir haben die Politik der Gemeinde Breda zum sozialen Bereich zum Leben gebracht und gezeigt, wie alle Beteiligten miteinander verbunden sind.",
      body: `<p><strong>Auftraggeber.</strong> Gemeinde Breda</p>
<p><strong>Zielgruppe.</strong> Menschen in Breda, die mit dem sozialen Bereich zu tun haben.</p>
<p><strong>Celebrating.</strong> Wir haben Menschen aus allen Schichten und Hintergründen interviewt und in einem Online-Magazin zusammengebracht. Die Gespräche kamen aus Leidenschaft und aus dem Herzen. So wurde sichtbar, dass jede und jeder beruflich und persönlich verbunden ist.</p>
<p>Wir nutzten Fotos, Podcasts, Videos, Animation und Text und luden das Publikum ein, selbst durch das Magazin zu klicken und die Geschichten zu wählen, die es berühren.</p>
<p><strong>Leistung.</strong> Video, Foto, Podcast, Animation, Text.</p>`,
    },
  ),
  groenplein: p(
    {
      title: "Sustainability platform",
      lead: "Since October 2017 we have been building a green square where people get information and advice, and can work together on a carbon-neutral city.",
      body: `<p><strong>Client.</strong> Municipality of Breda</p>
<p><strong>Audience.</strong> People in Breda who want to take a first, fifth or hundredth step toward a more sustainable world.</p>
<p><strong>Celebrating.</strong> Everyone who is involved — or wants to be — in carbon-neutral Breda. We organise events, make news and bring stakeholders together.</p>
<p><strong>Service.</strong> Project management, communication and changemaking.</p>`,
    },
    {
      title: "Plateforme de durabilité",
      lead: "Depuis octobre 2017 nous construisons une place durable où les gens trouvent information et conseil, et peuvent travailler ensemble à une ville neutre en CO2.",
      body: `<p><strong>Client.</strong> Commune de Breda</p>
<p><strong>Public.</strong> Les habitants de Breda qui veulent faire un premier, un cinquième ou un centième pas vers un monde plus durable.</p>
<p><strong>Celebrating.</strong> Toutes les personnes impliquées — ou qui veulent l’être — dans la ville de Breda neutre en CO2. Nous organisons des événements, faisons des nouvelles et réunissons les parties prenantes.</p>
<p><strong>Service.</strong> Gestion de projet, communication et conduite du changement.</p>`,
    },
    {
      title: "Nachhaltigkeitsplattform",
      lead: "Seit Oktober 2017 bauen wir einen nachhaltigen Platz, an dem Menschen Information und Rat bekommen und gemeinsam an einer CO2-neutralen Stadt arbeiten können.",
      body: `<p><strong>Auftraggeber.</strong> Gemeinde Breda</p>
<p><strong>Zielgruppe.</strong> Menschen in Breda, die einen ersten, fünften oder hundertsten Schritt zu einer nachhaltigeren Welt machen wollen.</p>
<p><strong>Celebrating.</strong> Alle, die am CO2-neutralen Breda beteiligt sind — oder es werden wollen. Wir organisieren Veranstaltungen, machen Nachrichten und bringen Beteiligte zusammen.</p>
<p><strong>Leistung.</strong> Projektleitung, Kommunikation und Veränderung.</p>`,
    },
  ),
  kindertrendrede: p(
    {
      title: "Children’s trend speech",
      lead: "Children up to twelve were given room to describe their city now and later — and to offer that vision formally.",
      body: `<p><strong>Client.</strong> PakhuisB, Teach the Future and the municipal council of Breda.</p>
<p><strong>Celebrating.</strong> Teach the Future developed a series of lessons for primary schools, so children can imagine their ideal city. We organised workshops to write a ‘state of the union’, filmed the process and set up an event where they offered their piece to residents, the alderman and the press.</p>
<p><strong>Service.</strong> Workshop, event, communication.</p>`,
    },
    {
      title: "Discours des tendances des enfants",
      lead: "Des enfants jusqu’à douze ans ont eu la place de décrire leur ville maintenant et plus tard — et de présenter cette vision officiellement.",
      body: `<p><strong>Client.</strong> PakhuisB, Teach the Future et le conseil municipal de Breda.</p>
<p><strong>Celebrating.</strong> Teach the Future a conçu une série de leçons pour les écoles primaires, afin que les enfants imaginent leur ville idéale. Nous avons organisé des ateliers pour écrire un « état de l’union », filmé le processus et monté un événement où ils ont offert leur texte aux habitants, à l’échevin et à la presse.</p>
<p><strong>Service.</strong> Atelier, événement, communication.</p>`,
    },
    {
      title: "Kinder-Trendrede",
      lead: "Kinder bis zwölf bekamen Raum, ihre Stadt von jetzt und von morgen zu beschreiben — und diese Vision förmlich zu überreichen.",
      body: `<p><strong>Auftraggeber.</strong> PakhuisB, Teach the Future und der Gemeinderat von Breda.</p>
<p><strong>Celebrating.</strong> Teach the Future entwickelte eine Unterrichtsreihe für Grundschulen, damit Kinder ihre ideale Stadt entwerfen können. Wir organisierten Werkstätten für eine „State of the Union“, filmten den Prozess und richteten ein Event ein, bei dem sie ihren Text Einwohnern, dem Beigeordneten und der Presse übergaben.</p>
<p><strong>Leistung.</strong> Workshop, Event, Kommunikation.</p>`,
    },
  ),
  scholieren: p(
    {
      title: "50 pupils, one year active in local politics",
      lead: "We followed pupils for a year and made a series of four videos to bring the programme Youth and Politics to life.",
      body: `<p><strong>Client.</strong> Council registry of Breda</p>
<p><strong>Audience.</strong> Secondary-school pupils in Breda, and their teachers.</p>
<p><strong>Aim.</strong> To draw attention to the programme Youth and Politics.</p>
<p><strong>Celebrating.</strong> The pupils themselves. We asked them to make video clips of their project and used those in the series. The production was made with the media department of NHTV, which provided video students.</p>
<p><strong>Service.</strong> Video production.</p>`,
    },
    {
      title: "50 lycéens, un an actifs dans la politique locale",
      lead: "Nous avons suivi des élèves pendant un an et réalisé une série de quatre vidéos pour donner vie au programme Youth and Politics.",
      body: `<p><strong>Client.</strong> Greffe du conseil de Breda</p>
<p><strong>Public.</strong> Élèves du secondaire à Breda, et leurs enseignants.</p>
<p><strong>But.</strong> Faire connaître le programme Youth and Politics.</p>
<p><strong>Celebrating.</strong> Les élèves eux-mêmes. Nous leur avons demandé des clips de leur projet et nous les avons utilisés dans la série. La production s’est faite avec le département média de la NHTV, qui a fourni des étudiants en vidéo.</p>
<p><strong>Service.</strong> Production vidéo.</p>`,
    },
    {
      title: "50 Schüler, ein Jahr aktiv in der Lokalpolitik",
      lead: "Wir haben Schülerinnen und Schüler ein Jahr lang begleitet und eine Serie von vier Videos gemacht, damit das Programm Youth and Politics lebendig wird.",
      body: `<p><strong>Auftraggeber.</strong> Ratsregistratur Breda</p>
<p><strong>Zielgruppe.</strong> Schülerinnen und Schüler der weiterführenden Schulen in Breda und ihre Lehrkräfte.</p>
<p><strong>Ziel.</strong> Das Programm Youth and Politics bekannt machen.</p>
<p><strong>Celebrating.</strong> Die Jugendlichen selbst. Wir baten sie, Videoclips ihres Projekts zu machen, und nutzten die in der Serie. Die Produktion entstand mit der Medienabteilung der NHTV, die Videostudierende stellte.</p>
<p><strong>Leistung.</strong> Videoproduktion.</p>`,
    },
  ),
  "lokale-journalistiek": p(
    {
      title: "Local journalism",
      lead: "Together with BredaVandaag we make hyperlocal journalism stronger — with the spotlight on people who want to make a difference.",
      body: `<p><strong>Client.</strong> BredaVandaag</p>
<p><strong>Audience.</strong> The local community of Breda.</p>
<p><strong>Celebrating.</strong> The city of tomorrow and its people. DE CONNECTORS puts the light on people who want something not only for themselves, but also for others and for the planet.</p>
<p><strong>Service.</strong> Interviewing and writing news articles.</p>`,
      ctaLabel: "Read on BredaVandaag",
    },
    {
      title: "Journalisme local",
      lead: "Avec BredaVandaag nous renforçons le journalisme hyperlocal — avec la lumière sur les gens qui veulent faire la différence.",
      body: `<p><strong>Client.</strong> BredaVandaag</p>
<p><strong>Public.</strong> La communauté locale de Breda.</p>
<p><strong>Celebrating.</strong> La ville de demain et ses habitants. DE CONNECTORS met en lumière des gens qui veulent quelque chose non seulement pour eux, mais aussi pour les autres et pour la planète.</p>
<p><strong>Service.</strong> Interviews et articles d’actualité.</p>`,
      ctaLabel: "Lire sur BredaVandaag",
    },
    {
      title: "Lokaler Journalismus",
      lead: "Zusammen mit BredaVandaag machen wir den hyperlokalen Journalismus stärker — mit dem Licht auf Menschen, die etwas verändern wollen.",
      body: `<p><strong>Auftraggeber.</strong> BredaVandaag</p>
<p><strong>Zielgruppe.</strong> Die lokale Gemeinschaft von Breda.</p>
<p><strong>Celebrating.</strong> Die Stadt von morgen und ihre Einwohner. DE CONNECTORS stellt Menschen ins Licht, die nicht nur für sich etwas wollen, sondern auch für andere und für den Planeten.</p>
<p><strong>Leistung.</strong> Interviews und Nachrichtenartikel.</p>`,
      ctaLabel: "Lesen auf BredaVandaag",
    },
  ),
  tedx: p(
    {
      title: "TEDxBreda — live media production",
      lead: "Live reports from the MEZZ theatre spoke directly to the online audience and invited questions and reactions.",
      body: `<p><strong>Client.</strong> TEDxBreda</p>
<p><strong>Audience.</strong> The international live and online audience of TEDxBreda 2016.</p>
<p><strong>Celebrating.</strong> TEDxBreda is a community of professionals who work as volunteers on the yearly event. With our livestream experience we helped the video team set up their own livestream production.</p>
<p><strong>Service.</strong> Producer of the livestream team.</p>`,
      ctaLabel: "Watch the Facebook live",
    },
    {
      title: "TEDxBreda — production média en direct",
      lead: "Des reportages en direct depuis le théâtre MEZZ parlaient au public en ligne et invitaient aux questions et aux réactions.",
      body: `<p><strong>Client.</strong> TEDxBreda</p>
<p><strong>Public.</strong> Le public international, en salle et en ligne, de TEDxBreda 2016.</p>
<p><strong>Celebrating.</strong> TEDxBreda est une communauté de professionnels qui travaillent bénévolement à l’événement annuel. Avec notre expérience du livestream, nous avons aidé l’équipe vidéo à monter sa propre production.</p>
<p><strong>Service.</strong> Production de l’équipe livestream.</p>`,
      ctaLabel: "Voir le Facebook live",
    },
    {
      title: "TEDxBreda — Live-Mediaproduktion",
      lead: "Live-Berichte aus dem MEZZ-Theater sprachen das Online-Publikum direkt an und luden zu Fragen und Reaktionen ein.",
      body: `<p><strong>Auftraggeber.</strong> TEDxBreda</p>
<p><strong>Zielgruppe.</strong> Das internationale Live- und Onlinepublikum von TEDxBreda 2016.</p>
<p><strong>Celebrating.</strong> TEDxBreda ist eine Community von Fachleuten, die ehrenamtlich am jährlichen Event arbeiten. Mit unserer Livestream-Erfahrung halfen wir dem Videoteam, die eigene Produktion aufzubauen.</p>
<p><strong>Leistung.</strong> Producer des Livestream-Teams.</p>`,
      ctaLabel: "Den Facebook-Live ansehen",
    },
  ),
  sprank: p(
    {
      title: "Sprank — magazine of Divosa",
      lead: "Interviews in two or three parts, in which the people of the social domain take the lead themselves.",
      body: `<p><strong>Client.</strong> Divosa</p>
<p><strong>Audience.</strong> Decision-makers in the social domain.</p>
<p><strong>Aim.</strong> To bring the audience and their burning issues together in a magazine.</p>
<p><strong>Service.</strong> Interviews and writing.</p>`,
      ctaLabel: "Read the article (PDF)",
    },
    {
      title: "Sprank — magazine de Divosa",
      lead: "Des entretiens en deux ou trois volets, où les gens du domaine social tiennent eux-mêmes le premier rôle.",
      body: `<p><strong>Client.</strong> Divosa</p>
<p><strong>Public.</strong> Les décideurs du domaine social.</p>
<p><strong>But.</strong> Réunir le public et ses sujets brûlants dans un magazine.</p>
<p><strong>Service.</strong> Interviews et écriture.</p>`,
      ctaLabel: "Lire l’article (PDF)",
    },
    {
      title: "Sprank — Magazin von Divosa",
      lead: "Interviews in zwei oder drei Teilen, in denen die Menschen aus dem sozialen Bereich selbst die Hauptrolle haben.",
      body: `<p><strong>Auftraggeber.</strong> Divosa</p>
<p><strong>Zielgruppe.</strong> Entscheider im sozialen Bereich.</p>
<p><strong>Ziel.</strong> Die Zielgruppe und ihre heißen Eisen in einem Magazin zusammenbringen.</p>
<p><strong>Leistung.</strong> Interviews und Schreiben.</p>`,
      ctaLabel: "Den Artikel lesen (PDF)",
    },
  ),
  festival: p(
    {
      title: "Festival of Democracy",
      lead: "In Breda’s city hall we let residents, councillors and aldermen experience democracy again.",
      body: `<p><strong>Client.</strong> Municipality of Breda</p>
<p><strong>Celebrating.</strong> A deep-democracy specialist led the monthly council meeting with an interactive method. People practised paying attention to the minority voice. Young people played the game Terra Nova and made rules for a new community on an uninhabited island. On the graffiti wall visitors left their dreams, and a spoken-word artist closed the evening.</p>
<p>The programme, interviews, Facebook Live and sketches came together in an online magazine for the city.</p>
<p><strong>Service.</strong> Video, Facebook Live, photo, sketches, text.</p>`,
      ctaLabel: "View the magazine",
    },
    {
      title: "Festival de la démocratie",
      lead: "Dans l’hôtel de ville de Breda, nous avons fait revivre la démocratie aux habitants, aux conseillers et aux échevins.",
      body: `<p><strong>Client.</strong> Commune de Breda</p>
<p><strong>Celebrating.</strong> Une spécialiste de la démocratie profonde a mené la réunion mensuelle du conseil avec une méthode interactive. Les gens se sont exercés à entendre la voix minoritaire. Des jeunes ont joué à Terra Nova et ont écrit les règles d’une nouvelle communauté sur une île inhabitée. Sur le mur de graffiti, les visiteurs ont laissé leurs rêves, et une artiste de spoken word a clos la soirée.</p>
<p>Programme, interviews, Facebook Live et esquisses se sont retrouvés dans un magazine en ligne pour la ville.</p>
<p><strong>Service.</strong> Vidéo, Facebook Live, photo, esquisses, texte.</p>`,
      ctaLabel: "Voir le magazine",
    },
    {
      title: "Festival der Demokratie",
      lead: "Im Rathaus von Breda haben wir Einwohner, Ratsmitglieder und Beigeordnete Demokratie neu erleben lassen.",
      body: `<p><strong>Auftraggeber.</strong> Gemeinde Breda</p>
<p><strong>Celebrating.</strong> Eine Fachfrau für tiefe Demokratie leitete die monatliche Ratssitzung mit einer interaktiven Methode. Die Menschen übten, die Minderheitenstimme zu hören. Jugendliche spielten Terra Nova und machten Regeln für eine neue Gemeinschaft auf einer unbewohnten Insel. An der Graffitiwand ließen Besucher ihre Träume zurück, und eine Spoken-Word-Künstlerin schloss den Abend.</p>
<p>Programm, Interviews, Facebook Live und Skizzen kamen in einem Online-Magazin für die Stadt zusammen.</p>
<p><strong>Leistung.</strong> Video, Facebook Live, Foto, Skizzen, Text.</p>`,
      ctaLabel: "Das Magazin ansehen",
    },
  ),
  oxfam: p(
    {
      title: "Oxfam & The Guardian, connection is possible",
      lead: "A video about the financial pressure on investigative journalism — and about how some newsrooms find a new connection with their audience.",
      body: `<p><strong>Client.</strong> Oxfam</p>
<p><strong>Audience.</strong> International investigative journalists, newspapers and magazines.</p>
<p><strong>Aim.</strong> To show how investigative journalists and NGOs can strengthen each other.</p>
<p><strong>Celebrating.</strong> We visited newspapers and journalists and showed how some of them tie journalism to another way of earning. The video was screened at a meeting in Amsterdam (November 2014).</p>
<p><strong>Service.</strong> Video storytelling and animation.</p>`,
    },
    {
      title: "Oxfam & The Guardian, le lien est possible",
      lead: "Une vidéo sur la pression financière qui pèse sur le journalisme d’investigation — et sur la façon dont certaines rédactions retrouvent un lien avec leur public.",
      body: `<p><strong>Client.</strong> Oxfam</p>
<p><strong>Public.</strong> Journalistes d’investigation, journaux et magazines internationaux.</p>
<p><strong>But.</strong> Montrer comment journalistes d’investigation et ONG peuvent se renforcer.</p>
<p><strong>Celebrating.</strong> Nous sommes allés voir des journaux et des journalistes, et nous avons montré comment certains relient le journalisme à un autre modèle de revenu. La vidéo a été projetée lors d’une rencontre à Amsterdam (novembre 2014).</p>
<p><strong>Service.</strong> Récit vidéo et animation.</p>`,
    },
    {
      title: "Oxfam & The Guardian, Verbindung ist möglich",
      lead: "Ein Video über den finanziellen Druck auf den Investigativjournalismus — und darüber, wie manche Redaktionen eine neue Verbindung zu ihrem Publikum finden.",
      body: `<p><strong>Auftraggeber.</strong> Oxfam</p>
<p><strong>Zielgruppe.</strong> Internationale Investigativjournalisten, Zeitungen und Magazine.</p>
<p><strong>Ziel.</strong> Zeigen, wie Investigativjournalisten und NGOs einander stärken können.</p>
<p><strong>Celebrating.</strong> Wir besuchten Zeitungen und Journalisten und zeigten, wie manche den Journalismus an ein anderes Einnahmemodell binden. Das Video lief bei einem Treffen in Amsterdam (November 2014).</p>
<p><strong>Leistung.</strong> Video-Storytelling und Animation.</p>`,
    },
  ),
  opendata: p(
    {
      title: "Open Data, a two-day international congress",
      lead: "ODC14, on 9 and 10 October 2014 at De Balie in Amsterdam: is ‘open’ enough to take on the big problems of the world?",
      body: `<p><strong>Client.</strong> Open Development Camp, a house project of DE CONNECTORS and Open for Change.</p>
<p><strong>Audience.</strong> International frontrunners in open data, organisations and technology.</p>
<p><strong>Aim.</strong> To explore the status quo of Open and invite participants to take the next step.</p>`,
    },
    {
      title: "Open Data, congrès international de deux jours",
      lead: "ODC14, les 9 et 10 octobre 2014 à De Balie à Amsterdam : « open » suffit-il pour s’attaquer aux grands problèmes du monde ?",
      body: `<p><strong>Client.</strong> Open Development Camp, un projet maison de DE CONNECTORS et d’Open for Change.</p>
<p><strong>Public.</strong> Pionniers internationaux des données ouvertes, des organisations et de la technologie.</p>
<p><strong>But.</strong> Explorer le statu quo d’Open et inviter les participants à faire le pas suivant.</p>`,
    },
    {
      title: "Open Data, zweitägiger internationaler Kongress",
      lead: "ODC14, am 9. und 10. Oktober 2014 in De Balie in Amsterdam: reicht „open“, um die großen Probleme der Welt anzugehen?",
      body: `<p><strong>Auftraggeber.</strong> Open Development Camp, ein Hausprojekt von DE CONNECTORS und Open for Change.</p>
<p><strong>Zielgruppe.</strong> Internationale Vorreiter von Open Data, Organisationen und Technologie.</p>
<p><strong>Ziel.</strong> Den Status quo von Open erkunden und die Teilnehmenden zum nächsten Schritt einladen.</p>`,
    },
  ),
  accenture: p(
    {
      title: "Accenture’s Student Battle",
      lead: "Two livestream shows in which students, project owners and funders were connected live.",
      body: `<p><strong>Client.</strong> 1%Club and Accenture</p>
<p><strong>Audience.</strong> Students in the Netherlands.</p>
<p><strong>Aim.</strong> To strengthen the bond between participating students, project owners in emerging countries and the people who fund the projects.</p>
<p><strong>Celebrating.</strong> We produced a co-creation show and an award show. The audience was in the room and online. Reactions ran through Twitter.</p>
<p>The compilation was made by Jaap van ’t Kruis and Joost Gulien.</p>
<p><strong>Service.</strong> Livestream show and storytelling.</p>`,
    },
    {
      title: "Student Battle d’Accenture",
      lead: "Deux émissions en livestream où étudiants, porteurs de projets et financeurs étaient reliés en direct.",
      body: `<p><strong>Client.</strong> 1%Club et Accenture</p>
<p><strong>Public.</strong> Étudiants aux Pays-Bas.</p>
<p><strong>But.</strong> Renforcer le lien entre les étudiants participants, les porteurs de projets dans les pays émergents et les personnes qui financent les projets.</p>
<p><strong>Celebrating.</strong> Nous avons produit un show de co-création et un show de remise de prix. Le public était dans la salle et en ligne. Les réactions passaient par Twitter.</p>
<p>La compilation est de Jaap van ’t Kruis et Joost Gulien.</p>
<p><strong>Service.</strong> Émission en livestream et storytelling.</p>`,
    },
    {
      title: "Accentures Student Battle",
      lead: "Zwei Livestream-Shows, in denen Studierende, Projektinhaber und Geldgeber live miteinander verbunden wurden.",
      body: `<p><strong>Auftraggeber.</strong> 1%Club und Accenture</p>
<p><strong>Zielgruppe.</strong> Studierende in den Niederlanden.</p>
<p><strong>Ziel.</strong> Die Verbindung stärken zwischen teilnehmenden Studierenden, Projektinhabern in aufstrebenden Ländern und den Menschen, die die Projekte finanzieren.</p>
<p><strong>Celebrating.</strong> Wir produzierten eine Co-Creation-Show und eine Awardshow. Das Publikum war im Saal und online. Reaktionen liefen über Twitter.</p>
<p>Die Zusammenstellung stammt von Jaap van ’t Kruis und Joost Gulien.</p>
<p><strong>Leistung.</strong> Livestream-Show und Storytelling.</p>`,
    },
  ),
  escience: p(
    {
      title: "Netherlands eScience Centre",
      lead: "A high-end video about the connection between scientists and the big-data specialists of the eScience Centre.",
      body: `<p><strong>Client.</strong> Netherlands eScience Centre</p>
<p><strong>Audience.</strong> People with a lively interest in science.</p>
<p><strong>Celebrating.</strong> We went into one project and two key figures: Henk Dijkstra, climatologist, and Jason Maassen, big-data specialist at the eScience Centre.</p>
<p><strong>Service.</strong> Video storytelling and animation.</p>`,
    },
    {
      title: "Netherlands eScience Centre",
      lead: "Une vidéo soignée sur le lien entre les scientifiques et les spécialistes du big data de l’eScience Centre.",
      body: `<p><strong>Client.</strong> Netherlands eScience Centre</p>
<p><strong>Public.</strong> Des gens qui s’intéressent vraiment à la science.</p>
<p><strong>Celebrating.</strong> Nous sommes entrés dans un projet et deux figures clés : Henk Dijkstra, climatologue, et Jason Maassen, spécialiste du big data à l’eScience Centre.</p>
<p><strong>Service.</strong> Récit vidéo et animation.</p>`,
    },
    {
      title: "Netherlands eScience Centre",
      lead: "Ein hochwertiges Video über die Verbindung zwischen Wissenschaftlerinnen und Wissenschaftlern und den Big-Data-Fachleuten des eScience Centre.",
      body: `<p><strong>Auftraggeber.</strong> Netherlands eScience Centre</p>
<p><strong>Zielgruppe.</strong> Menschen mit einem lebendigen Interesse an Wissenschaft.</p>
<p><strong>Celebrating.</strong> Wir tauchten in ein Projekt und zwei Schlüsselfiguren: Henk Dijkstra, Klimatologe, und Jason Maassen, Big-Data-Spezialist am eScience Centre.</p>
<p><strong>Leistung.</strong> Video-Storytelling und Animation.</p>`,
    },
  ),
  afrilabs: p(
    {
      title: "Online co-creation with 10 African tech hubs",
      lead: "Two co-creations — one in Berlin during re:publica and one online — in which African tech hubs took up each other’s challenges.",
      body: `<p><strong>Client.</strong> Afrilabs</p>
<p><strong>Audience.</strong> African tech hubs and their entrepreneurs.</p>
<p><strong>Aim.</strong> To connect the members of Afrilabs into a close network.</p>
<p><strong>Celebrating.</strong> Participants worked on each other’s business questions. From the process we made a compilation film.</p>
<p><strong>Service.</strong> Co-creation, livestreaming, storytelling.</p>`,
    },
    {
      title: "Co-création en ligne avec 10 tech hubs africains",
      lead: "Deux co-créations — une à Berlin pendant re:publica et une en ligne — où des tech hubs africains ont repris les défis les uns des autres.",
      body: `<p><strong>Client.</strong> Afrilabs</p>
<p><strong>Public.</strong> Tech hubs africains et leurs entrepreneurs.</p>
<p><strong>But.</strong> Relier les membres d’Afrilabs en un réseau serré.</p>
<p><strong>Celebrating.</strong> Les participants ont travaillé sur les questions d’entreprise des autres. Du parcours nous avons fait un film de compilation.</p>
<p><strong>Service.</strong> Co-création, livestream, storytelling.</p>`,
    },
    {
      title: "Online-Co-Creation mit 10 afrikanischen Tech-Hubs",
      lead: "Zwei Co-Creations — eine in Berlin während der re:publica und eine online — in denen afrikanische Tech-Hubs die Herausforderungen der anderen aufnahmen.",
      body: `<p><strong>Auftraggeber.</strong> Afrilabs</p>
<p><strong>Zielgruppe.</strong> Afrikanische Tech-Hubs und ihre Unternehmerinnen und Unternehmer.</p>
<p><strong>Ziel.</strong> Die Mitglieder von Afrilabs zu einem engen Netz verbinden.</p>
<p><strong>Celebrating.</strong> Die Teilnehmenden arbeiteten an den Unternehmerfragen der anderen. Aus dem Verlauf machten wir einen Zusammenschnitt.</p>
<p><strong>Leistung.</strong> Co-Creation, Livestreaming, Storytelling.</p>`,
    },
  ),
  jimmys: p(
    {
      title: "Jimmy’s online and interactive live show",
      lead: "Together with young people from Groningen we produced an interactive livestream with a live audience, live music and workshops around the studio.",
      body: `<p><strong>Client.</strong> Jimmy’s Groningen</p>
<p><strong>Audience.</strong> Young people in the province of Groningen.</p>
<p><strong>Aim.</strong> To connect young people with Jimmy’s and with each other, and give them a boost of energy.</p>
<p><strong>Celebrating.</strong> The online audience could ask Jimmy’s any question they needed help with.</p>
<p><strong>Service.</strong> Storytelling workshop, video storytelling, livestream show.</p>`,
    },
    {
      title: "Jimmy’s, émission live en ligne et interactive",
      lead: "Avec des jeunes de Groningue nous avons produit un livestream interactif, avec public sur place, musique live et ateliers autour du studio.",
      body: `<p><strong>Client.</strong> Jimmy’s Groningen</p>
<p><strong>Public.</strong> Les jeunes de la province de Groningue.</p>
<p><strong>But.</strong> Relier les jeunes à Jimmy’s et entre eux, et leur donner un coup d’énergie.</p>
<p><strong>Celebrating.</strong> Le public en ligne pouvait poser à Jimmy’s toute question pour laquelle il avait besoin d’aide.</p>
<p><strong>Service.</strong> Atelier de storytelling, récit vidéo, émission en livestream.</p>`,
    },
    {
      title: "Jimmy’s Online- und interaktive Liveshow",
      lead: "Zusammen mit jungen Menschen aus Groningen produzierten wir einen interaktiven Livestream mit Live-Publikum, Livemusik und Workshops rund um das Studio.",
      body: `<p><strong>Auftraggeber.</strong> Jimmy’s Groningen</p>
<p><strong>Zielgruppe.</strong> Junge Menschen in der Provinz Groningen.</p>
<p><strong>Ziel.</strong> Junge Menschen mit Jimmy’s und miteinander verbinden und ihnen einen Energieschub geben.</p>
<p><strong>Celebrating.</strong> Das Online-Publikum durfte Jimmy’s jede Frage stellen, bei der es Hilfe brauchte.</p>
<p><strong>Leistung.</strong> Storytelling-Workshop, Video-Storytelling, Livestream-Show.</p>`,
    },
  ),
}

export const postPacks: Record<string, Pack> = {
  "tikkie-nairobi": p(
    {
      title: "Tikkie Nairobi",
      lead: "Do you still remember the blog I wrote years ago on Frankwatching? It was called Africa drives a Ferrari, and in it I said that technical and economic change, especially in East Africa, was moving fast.",
      body: `<p>Do you still remember <strong><a href="https://www.frankwatching.com/archive/2010/03/12/nairobi-2-0-afrika-rijdt-ferrari/">this blog</a></strong> I wrote years ago on Frankwatching? It was called <strong><a href="https://www.frankwatching.com/archive/2010/03/12/nairobi-2-0-afrika-rijdt-ferrari/">Africa drives a Ferrari</a></strong>, and in it I said that technical and economic change, especially in East Africa, was moving fast.</p>
<p>In 2010 I walked through the slums of Nairobi and paid for the first time with a system like Tikkie, made possible by <strong><a href="https://www.safaricom.co.ke/">Safaricom</a></strong>, a mobile-phone giant. They invented it because so few Kenyans had a bank account: banks were far too expensive and unreliable. They saw that earlier than we did. A bank account was only for the elite. Everyone else walked around with small and large bags of cash, and was an easy target for robbers.</p>
<p>By opening a payment account on your phone, next to your mobile account, with the same provider, millions of Kenyans could suddenly text money to each other. From ordering a pizza by phone to taking out insurance, since 2010 in Kenya it can all be done by text message.</p>
<p><a href="https://www.youtube.com/watch?v=3PNdzluxZs8">Watch the video</a></p>`,
    },
    {
      title: "Tikkie Nairobi",
      lead: "Vous souvenez-vous de ce blog que j’ai écrit il y a des années sur Frankwatching ? Il s’appelait L’Afrique roule en Ferrari, et j’y racontais que les évolutions techniques et économiques, surtout en Afrique de l’Est, allaient vite.",
      body: `<p>Vous souvenez-vous de <strong><a href="https://www.frankwatching.com/archive/2010/03/12/nairobi-2-0-afrika-rijdt-ferrari/">ce blog</a></strong> que j’ai écrit il y a des années sur Frankwatching ? Il s’appelait <strong><a href="https://www.frankwatching.com/archive/2010/03/12/nairobi-2-0-afrika-rijdt-ferrari/">L’Afrique roule en Ferrari</a></strong>, et j’y racontais que les évolutions techniques et économiques, surtout en Afrique de l’Est, allaient vite.</p>
<p>En 2010 je marchais dans les bidonvilles de Nairobi et j’ai payé pour la première fois avec un système proche de Tikkie, rendu possible par <strong><a href="https://www.safaricom.co.ke/">Safaricom</a></strong>, un géant du téléphone mobile. Ils l’ont inventé parce que trop peu de Kenyans avaient un compte en banque : les banques étaient bien trop chères et peu fiables. Ils l’ont vu plus tôt que nous. Un compte était réservé à l’élite. Les autres se promenaient avec des sacs d’argent, petite ou grosse proie pour les voleurs.</p>
<p>En ouvrant un compte de paiement sur le téléphone, à côté du compte mobile, chez le même opérateur, des millions de Kenyans ont pu soudain s’envoyer de l’argent par texto. Commander une pizza ou souscrire une assurance : depuis 2010, au Kenya, tout cela passe par SMS.</p>
<p><a href="https://www.youtube.com/watch?v=3PNdzluxZs8">Voir la vidéo</a></p>`,
    },
    {
      title: "Tikkie Nairobi",
      lead: "Erinnert ihr euch noch an den Blog, den ich vor Jahren auf Frankwatching schrieb? Er hieß Afrika fährt Ferrari, und darin erzählte ich, dass die technische und wirtschaftliche Entwicklung vor allem in Ostafrika schnell ging.",
      body: `<p>Erinnert ihr euch noch an <strong><a href="https://www.frankwatching.com/archive/2010/03/12/nairobi-2-0-afrika-rijdt-ferrari/">diesen Blog</a></strong>, den ich vor Jahren auf Frankwatching schrieb? Er hieß <strong><a href="https://www.frankwatching.com/archive/2010/03/12/nairobi-2-0-afrika-rijdt-ferrari/">Afrika fährt Ferrari</a></strong>, und darin erzählte ich, dass die technische und wirtschaftliche Entwicklung vor allem in Ostafrika schnell ging.</p>
<p>2010 lief ich durch die Slums von Nairobi und bezahlte zum ersten Mal mit einem System wie Tikkie, möglich gemacht von <strong><a href="https://www.safaricom.co.ke/">Safaricom</a></strong>, einem Mobilfunkriesen. Sie erfanden es, weil so wenige Kenianer ein Bankkonto hatten: Banken waren viel zu teuer und unzuverlässig. Das sahen sie früher als wir. Ein Konto war der Elite vorbehalten. Der Rest lief mit kleinen und großen Geldsäcken herum und war leichte Beute.</p>
<p>Wer neben dem Mobilfunkkonto ein Zahlungskonto auf demselben Telefon eröffnete, konnte plötzlich Millionen von Kenianern Geld per SMS schicken. Von der Pizza bis zur Versicherung: seit 2010 geht das in Kenia per Textnachricht.</p>
<p><a href="https://www.youtube.com/watch?v=3PNdzluxZs8">Video ansehen</a></p>`,
    },
  ),
  "terugblik-naar-het-festival-van-de-democratie": p(
    {
      title: "Looking back at the Festival of Democracy",
      lead: "“The literal meaning of democracy is: the people rule. But that may be the problem: the people do not exist.” With those words Gertjan Endedijk opened the Festival of Democracy on 15 September.",
      body: `<p>“The literal meaning of democracy is: the people rule. But that may be the problem: the people do not exist.” With those words Gertjan Endedijk opened the Festival of Democracy on 15 September. Endedijk, director of Stichting de Nieuwe Veste, opened the festival with a spoken blog. “We are a country of groups, a collection of minorities. Once held together by sorting everything into pillars, now searching hard for new structures and ties. The moment people in a democracy feel shut out, an alarm should go off.”</p>
<p>This year the Festival of Democracy was organised in Breda for the first time, by PakhuisB, and celebrated in order to get democracy moving again.</p>
<p>There were speakers, acts, workshops, rolling kitchens and music. For the occasion the council committee meeting moved to the wedding hall, where councillors, aldermen and people from Breda used the deep-democracy method to discuss BredaBegroot.</p>
<p>Curious about the festival? Visit the online magazine where we posted all the videos, photos and articles.</p>
<p>https://readymag.com/u69175195/599744/7/</p>`,
    },
    {
      title: "Retour sur le Festival de la démocratie",
      lead: "« Le sens littéral de la démocratie est : le peuple règne. Mais c’est peut-être là le problème : le peuple n’existe pas. » C’est avec ces mots que Gertjan Endedijk a ouvert le Festival de la démocratie le 15 septembre.",
      body: `<p>« Le sens littéral de la démocratie est : le peuple règne. Mais c’est peut-être là le problème : le peuple n’existe pas. » C’est avec ces mots que Gertjan Endedijk a ouvert le festival le 15 septembre. Endedijk, directeur de la fondation De Nieuwe Veste, a ouvert avec un blog parlé. « Nous sommes un pays de groupes, un ensemble de minorités. Autrefois tenus ensemble en rangeant tout en piliers, aujourd’hui en quête de nouvelles structures. Dès que des gens se sentent exclus dans une démocratie, une alarme devrait sonner. »</p>
<p>Cette année, le Festival de la démocratie a été organisé pour la première fois à Breda, par PakhuisB, pour remettre la démocratie en mouvement.</p>
<p>Il y avait des orateurs, des actes, des ateliers, des cuisines roulantes et de la musique. La réunion de commission du conseil a été déplacée, pour l’occasion, dans la salle des mariages, où conseillers, échevins et habitants ont traité BredaBegroot avec la méthode de la démocratie profonde.</p>
<p>Curieux du festival ? Visitez le magazine en ligne où nous avons publié toutes les vidéos, photos et articles.</p>
<p>https://readymag.com/u69175195/599744/7/</p>`,
    },
    {
      title: "Rückblick auf das Festival der Demokratie",
      lead: "„Die wörtliche Bedeutung von Demokratie ist: das Volk herrscht. Aber genau da liegt vielleicht das Problem: das Volk gibt es nicht.“ Mit diesen Worten eröffnete Gertjan Endedijk am 15. September das Festival der Demokratie.",
      body: `<p>„Die wörtliche Bedeutung von Demokratie ist: das Volk herrscht. Aber genau da liegt vielleicht das Problem: das Volk gibt es nicht.“ Mit diesen Worten eröffnete Gertjan Endedijk am 15. September das Festival. Endedijk, Direktor der Stiftung De Nieuwe Veste, öffnete mit einem gesprochenen Blog. „Wir sind ein Land der Gruppen, eine Sammlung von Minderheiten. Früher zusammengehalten, indem alles in Säulen sortiert wurde, heute auf der Suche nach neuen Strukturen. Sobald sich Menschen in einer Demokratie ausgeschlossen fühlen, sollte eine Alarmglocke läuten.“</p>
<p>Das Festival der Demokratie wurde in diesem Jahr zum ersten Mal in Breda organisiert, von PakhuisB, um die Demokratie wieder in Bewegung zu bringen.</p>
<p>Es gab Redner, Acts, Workshops, rollende Küchen und Musik. Die Ausschusssitzung des Rates zog für den Anlass in den Trausaal, wo Ratsmitglieder, Beigeordnete und Menschen aus Breda BredaBegroot mit der Methode der tiefen Demokratie behandelten.</p>
<p>Neugierig auf das Festival? Besuchen Sie das Online-Magazin, in dem wir alle Videos, Fotos und Artikel gesammelt haben.</p>
<p>https://readymag.com/u69175195/599744/7/</p>`,
    },
  ),
  "fietsen-langs-organisatievernieuwers-in-stadsexpeditie-breda": p(
    {
      title: "Cycling past organisation pioneers on the Breda city expedition",
      lead: "Pakhuis de Zwijger started it: city expeditions. Cycling past smart, new, bottom-up initiatives in Amsterdam. Different routes, different themes. Great fun. By now the city expedition is a national phenomenon, and on 22 April it is Breda’s turn.",
      body: `<p>Pakhuis de Zwijger started it: city expeditions. Cycling past smart, new, bottom-up initiatives in Amsterdam. Different routes cover different themes. Great fun. By now the city expedition is a national phenomenon, and on 22 April it is Breda’s turn. During this expedition the city makers of Breda invite you to look at their city in different ways, along four routes. Their stories are about the city that is, but above all about the city that could be. Thanks to bottom-up initiatives, that old Burgundian city gets a new character. Just begin: that is the motto. There will be four routes with the same start and finish. PakhuisB organises Route 3, on the theme ‘Organising differently’.</p>
<p>Route 3 — ‘Organising differently’</p>
<p>On this route we visit initiatives that use new, smart ways of organising and so find answers to existing problems. We start at Fameus, where we hear how people with lived experience can help clients recover. Then we stop at the flexible workplace Hub88, where creative entrepreneurs meet and work together. After lunch we cycle on to De Nieuwe Winkel, winner of the Business Community Award. There the link is made between craft, creativity and commerce. Creative entrepreneurs can rent a corner, a shelf or another part of the shop. Then we cycle via Blind Walls Gallery, which puts ugly walls and shabby streets in another light, to the Breda Museum, where we join a TEDxBreda salon. In Breda, PakhuisB also organises the Tegenlicht meet-ups. How is it that these international and national events are discussed locally more and more often?</p>
<p><a href="https://youtu.be/vqpkJJ8S1js">Watch the video</a></p>`,
    },
    {
      title: "À vélo le long des rénovateurs, expédition urbaine à Breda",
      lead: "Pakhuis de Zwijger a commencé : les expéditions urbaines. Pédaler le long d’initiatives malines, nouvelles et venues d’en bas, à Amsterdam. Des routes différentes, des thèmes différents. Très agréable. L’expédition est devenue un phénomène national, et le 22 avril c’est au tour de Breda.",
      body: `<p>Pakhuis de Zwijger a commencé : les expéditions urbaines. Pédaler le long d’initiatives malines, nouvelles et venues d’en bas, à Amsterdam. Des routes différentes traitent des thèmes différents. Très agréable. L’expédition est devenue un phénomène national, et le 22 avril c’est au tour de Breda. Pendant cette expédition, les faiseurs de ville de Breda vous invitent à regarder leur ville de plusieurs façons, sur quatre routes. Leurs récits parlent de la ville qui est, mais surtout de la ville qui pourrait être. Grâce aux initiatives venues d’en bas, cette vieille ville bourguignonne prend un nouveau caractère. Commencer, tout simplement : voilà la devise. Il y aura quatre routes avec le même départ et la même arrivée. PakhuisB organise la route 3, sur le thème « Organiser autrement ».</p>
<p>Route 3 — « Organiser autrement »</p>
<p>Sur cette route nous visitons des initiatives qui utilisent de nouvelles façons de s’organiser et trouvent ainsi une solution à des problèmes existants. Nous commençons à Fameus, où nous entendons comment des personnes d’expérience peuvent aider au rétablissement des clients. Ensuite Hub88, un lieu de travail flexible où des entrepreneurs créatifs se retrouvent. Après le déjeuner nous pédalons vers De Nieuwe Winkel, lauréat du Business Community Award. Là, le lien se fait entre artisanat, créativité et commerce. Puis, via Blind Walls Gallery, qui éclaire autrement des murs laids et des rues défraîchies, jusqu’au musée de Breda, où nous vivons un salon TEDxBreda. À Breda, PakhuisB organise aussi les meet-ups Tegenlicht. Comment se fait-il que ces événements internationaux et nationaux soient de plus en plus discutés localement ?</p>
<p><a href="https://youtu.be/vqpkJJ8S1js">Voir la vidéo</a></p>`,
    },
    {
      title: "Mit dem Rad an Organisationserneuerern vorbei, Stadtexpedition Breda",
      lead: "Pakhuis de Zwijger hat damit angefangen: Stadtexpeditionen. Radeln an klugen, neuen Initiativen von unten vorbei, in Amsterdam. Verschiedene Routen, verschiedene Themen. Sehr schön. Inzwischen ist die Expedition ein landesweites Phänomen, und am 22. April ist Breda an der Reihe.",
      body: `<p>Pakhuis de Zwijger hat damit angefangen: Stadtexpeditionen. Radeln an klugen, neuen Initiativen von unten vorbei, in Amsterdam. Verschiedene Routen behandeln verschiedene Themen. Sehr schön. Inzwischen ist die Expedition ein landesweites Phänomen, und am 22. April ist Breda an der Reihe. Die Stadtmacher von Breda laden ein, ihre Stadt auf vier Routen unterschiedlich anzusehen. Ihre Geschichten handeln von der Stadt, die ist, vor allem aber von der Stadt, die sein könnte. Durch Initiativen von unten bekommt die alte burgundische Stadt einen neuen Charakter. Einfach anfangen, das ist das Motto. Es gibt vier Routen mit demselben Start und Ziel. PakhuisB organisiert Route 3 zum Thema „Anders organisieren“.</p>
<p>Route 3 — „Anders organisieren“</p>
<p>Auf dieser Route besuchen wir Initiativen, die neue, kluge Arten des Organisierens nutzen und so Lösungen für bestehende Probleme finden. Wir starten bei Fameus und hören, wie Erfahrene bei der Genesung von Klienten helfen können. Danach der flexible Arbeitsort Hub88, wo kreative Unternehmer zusammenkommen. Nach dem Mittagessen radeln wir zur Nieuwe Winkel, Gewinner des Business Community Award. Dort wird die Verbindung zwischen Handwerk, Kreativität und Handel gelegt. Danach über die Blind Walls Gallery, die hässliche Mauern und schäbige Straßen in ein anderes Licht setzt, zum Museum von Breda, wo wir einen TEDxBreda-Salon erleben. In Breda organisiert PakhuisB auch die Tegenlicht-Treffen. Wie kommt es, dass diese internationalen und nationalen Events immer öfter lokal besprochen werden?</p>
<p><a href="https://youtu.be/vqpkJJ8S1js">Video ansehen</a></p>`,
    },
  ),
  "handel-als-wapen": p(
    {
      title: "Trade as a weapon against North Korea",
      lead: "In 2008 I travelled as a journalist with the Dutch trade mission to Pyongyang. With my good friend and director Jaap van ’t Kruis I made the report you find below.",
      body: `<p>In 2008 I travelled as a journalist with the Dutch trade mission to Pyongyang. With my good friend and director Jaap van ’t Kruis I made the report you find below.</p>
<p>In North Korea, various software companies were working on animations for Walt Disney. Software was also said to be developed for Samsung. In public there was plenty of muscle-flexing, but behind the scenes Americans and South Koreans were working with North Koreans. That contrast fascinated me. Could trade with North Korea open further the door that then stood ajar? And how did North Koreans benefit? Who did, and who did not? I wanted to find out, and see it myself.</p>
<p>We stayed a week in the capital. A week in which we saw that some North Koreans had room to move. They had been to China, or Italy. For study or for business. They had tasted other cultures. We had fairly relaxed conversations when we smoked a cigarette outside their office, or over dinner, which always took place in our hotel. But the times we broke from the programme and explored the city ourselves, we saw another Pyongyang. One in which men read their books under street lamps in empty streets. One where people in a night park dispersed as soon as we came near, where the station doors were slammed in our faces, and where we were not welcome in a bar. Spontaneous contact with us was too dangerous when everyone was watching.</p>
<p>“Can the world still do something about Kim?” asked NRC that day. A good question. That North Korea is now threatened with far-reaching sanctions is understandable. What else can you do? I myself believe in the power of trade. The trade mission showed that clearly. Those who did business with the country had built a network of North Koreans who could move more freely than the rest.</p>
<p><a href="https://vimeo.com/141786130">Watch the video</a></p>`,
    },
    {
      title: "Le commerce comme arme contre la Corée du Nord",
      lead: "En 2008 je suis partie comme journaliste avec la mission commerciale néerlandaise à Pyongyang. Avec mon ami et réalisateur Jaap van ’t Kruis, j’ai fait le reportage que vous trouvez ci-dessous.",
      body: `<p>En 2008 je suis partie comme journaliste avec la mission commerciale néerlandaise à Pyongyang. Avec mon ami et réalisateur Jaap van ’t Kruis, j’ai fait le reportage ci-dessous.</p>
<p>En Corée du Nord, plusieurs entreprises de logiciel travaillaient à des animations pour Walt Disney. Des programmes auraient aussi été développés pour Samsung. En façade, beaucoup de démonstration de force, mais en coulisse Américains et Sud-Coréens travaillaient donc avec des Nord-Coréens. Ce contraste me fascinait. Le commerce pouvait-il ouvrir plus largement la porte qui était alors entrebâillée ? Et qui, parmi les Nord-Coréens, en profitait ? Je voulais le vérifier de mes yeux.</p>
<p>Nous sommes restés une semaine dans la capitale. Une semaine où nous avons vu que certains avaient une marge de mouvement. Ils étaient allés en Chine, ou en Italie. Pour les études ou les affaires. Nous avions des conversations assez détendues en fumant une cigarette devant leur bureau, ou au dîner, toujours à notre hôtel. Mais les fois où nous quittions le programme et explorions la ville seuls, nous voyions un autre Pyongyang. Des hommes lisaient leur livre sous les lampadaires de rues vides. Dans un parc de nuit, les gens se dispersaient dès que nous approchions, les portes de la gare se fermaient devant nous, et un débit de boissons ne nous voulait pas. Un contact spontané était trop dangereux quand tout le monde regardait.</p>
<p>« Le monde peut-il encore faire quelque chose contre Kim ? » titrait le NRC ce jour-là. Bonne question. Que la Corée du Nord soit menacée de sanctions sévères se comprend. Que faire d’autre ? Moi, je crois à la force du commerce. La mission l’a montré clairement. Ceux qui faisaient des affaires avec le pays avaient créé un réseau de Nord-Coréens plus libres de leurs mouvements que les autres.</p>
<p><a href="https://vimeo.com/141786130">Voir la vidéo</a></p>`,
    },
    {
      title: "Handel als Waffe gegen Nordkorea",
      lead: "2008 reiste ich als Journalistin mit der niederländischen Handelsmission nach Pjöngjang. Mit meinem Freund und Regisseur Jaap van ’t Kruis machte ich die Reportage, die Sie unten finden.",
      body: `<p>2008 reiste ich als Journalistin mit der niederländischen Handelsmission nach Pjöngjang. Mit meinem Freund und Regisseur Jaap van ’t Kruis machte ich die Reportage unten.</p>
<p>In Nordkorea arbeiteten Softwarefirmen an Animationen für Walt Disney. Auch für Samsung sollen Programme entwickelt worden sein. Nach außen viel Muskelspiel, hinter den Kulissen aber arbeiteten Amerikaner und Südkoreaner mit Nordkoreanern. Dieser Gegensatz faszinierte mich. Konnte der Handel die Tür, die damals einen Spalt offen stand, weiter öffnen? Und wer in Nordkorea profitierte davon? Das wollte ich selbst sehen.</p>
<p>Wir blieben eine Woche in der Hauptstadt. Eine Woche, in der wir sahen, dass manche Nordkoreaner Bewegungsraum hatten. Sie waren in China gewesen, oder in Italien. Zum Studium oder für Geschäfte. Wir führten ziemlich entspannte Gespräche, wenn wir vor ihrem Büro eine Zigarette rauchten oder beim Essen, das immer in unserem Hotel stattfand. Aber wenn wir aus dem Programm ausbrachen und die Stadt allein erkundeten, sahen wir ein anderes Pjöngjang. Männer lasen unter Laternen in leeren Straßen ihr Buch. In einem nächtlichen Park gingen Menschen auseinander, sobald wir näher kamen, die Türen des Bahnhofs wurden vor unserer Nase zugeschlagen, und in einer Kneipe waren wir nicht willkommen. Spontaner Kontakt war zu gefährlich, wenn alle zusahen.</p>
<p>„Kann die Welt noch etwas gegen Kim tun?“ fragte die NRC an dem Tag. Gute Frage. Dass Nordkorea nun mit weitreichenden Sanktionen bedroht wird, ist verständlich. Was sonst? Ich selbst glaube an die Kraft des Handels. Die Mission hat das klar gezeigt. Wer mit dem Land Geschäfte machte, hatte ein Netz von Nordkoreanern aufgebaut, die sich freier bewegen konnten als der Rest.</p>
<p><a href="https://vimeo.com/141786130">Video ansehen</a></p>`,
    },
  ),
  "circulair-ondernemen-made-easy": p(
    {
      title: "Circular business, made easy",
      lead: "Circular business can be very simple. And it can start with some coffee grounds. Look at Leo Schaap, who grows his Bredaas geZwam oyster mushrooms on coffee waste.",
      body: `<p>Circular business can be very simple. And it can start with some grounds. Look at <a href="https://www.facebook.com/leo.schaap.5?fref=mentions">Leo Schaap</a>, who grows his Bredaas geZwam oyster mushrooms on coffee waste. Every week he picks it up at <a href="https://www.facebook.com/yirgabreda/?fref=mentions">Yirga</a>, <a href="https://www.facebook.com/DoppioBreda/?fref=mentions">Doppio Espresso Breda</a> and <a href="https://www.facebook.com/koffiebijteun/?fref=mentions">Koffie bij Teun</a> <strong>(step 1)</strong>. The mix of grounds, seeds and sawdust goes into bags covered with wet cloths <strong>(step 2)</strong> and voilà, after four weeks the mushrooms pop out.</p>
<p>You can buy the oyster mushrooms at <a href="https://www.facebook.com/stekbreda/?fref=mentions">STEK</a>, and he also makes wonderfully good bitterballen from them <strong>(step 3)</strong>. For <a href="https://groenpleinbreda.com/">GroenPleinBreda</a> I made this film. Useful if you want to start working in a circular way yourself.</p>
<p><a href="https://www.youtube.com/watch?v=lBfdFLT1ocs">Watch the video</a></p>`,
    },
    {
      title: "Entreprendre circulaire, simplement",
      lead: "Entreprendre de façon circulaire peut être très simple. Et commencer avec un peu de marc de café. Regardez Leo Schaap, qui cultive ses pleurotes Bredaas geZwam sur du marc.",
      body: `<p>Entreprendre de façon circulaire peut être très simple. Et commencer avec un peu de marc. Regardez <a href="https://www.facebook.com/leo.schaap.5?fref=mentions">Leo Schaap</a>, qui cultive ses pleurotes Bredaas geZwam sur du marc de café. Chaque semaine il le récupère chez <a href="https://www.facebook.com/yirgabreda/?fref=mentions">Yirga</a>, <a href="https://www.facebook.com/DoppioBreda/?fref=mentions">Doppio Espresso Breda</a> et <a href="https://www.facebook.com/koffiebijteun/?fref=mentions">Koffie bij Teun</a> <strong>(étape 1)</strong>. Le mélange de marc, de graines et de sciure va dans des sacs couverts de linges mouillés <strong>(étape 2)</strong> et voilà, au bout de quatre semaines les champignons sortent.</p>
<p>Vous pouvez acheter les pleurotes à <a href="https://www.facebook.com/stekbreda/?fref=mentions">STEK</a>, et il en fait aussi d’excellentes boulettes <strong>(étape 3)</strong>. Pour <a href="https://groenpleinbreda.com/">GroenPleinBreda</a> j’en ai fait ce film. Utile si vous voulez vous y mettre vous-même.</p>
<p><a href="https://www.youtube.com/watch?v=lBfdFLT1ocs">Voir la vidéo</a></p>`,
    },
    {
      title: "Zirkulär wirtschaften, ganz einfach",
      lead: "Zirkulär zu wirtschaften kann sehr einfach sein. Und mit ein wenig Kaffeesatz beginnen. Sehen Sie Leo Schaap, der seine Austernpilze Bredaas geZwam auf Kaffeesatz züchtet.",
      body: `<p>Zirkulär zu wirtschaften kann sehr einfach sein. Und mit ein wenig Satz beginnen. Sehen Sie <a href="https://www.facebook.com/leo.schaap.5?fref=mentions">Leo Schaap</a>, der seine Austernpilze Bredaas geZwam auf Kaffeesatz züchtet. Jede Woche holt er ihn bei <a href="https://www.facebook.com/yirgabreda/?fref=mentions">Yirga</a>, <a href="https://www.facebook.com/DoppioBreda/?fref=mentions">Doppio Espresso Breda</a> und <a href="https://www.facebook.com/koffiebijteun/?fref=mentions">Koffie bij Teun</a> ab <strong>(Schritt 1)</strong>. Die Mischung aus Satz, Saat und Sägemehl kommt in Säcke unter feuchten Tüchern <strong>(Schritt 2)</strong>, und siehe da: nach vier Wochen sprießen die Pilze.</p>
<p>Die Austernpilze gibt es bei <a href="https://www.facebook.com/stekbreda/?fref=mentions">STEK</a>, und er macht auch hervorragende Bitterballen daraus <strong>(Schritt 3)</strong>. Für <a href="https://groenpleinbreda.com/">GroenPleinBreda</a> habe ich diesen Film gemacht. Nützlich, wenn Sie selbst zirkulär anfangen wollen.</p>
<p><a href="https://www.youtube.com/watch?v=lBfdFLT1ocs">Video ansehen</a></p>`,
    },
  ),
  "serendipity-is-key": p(
    null,
    {
      title: "La sérendipité est la clé",
      lead: "Parler avec Felix Lepoutre, c’est jeter un œil dans l’avenir. Il faisait partie de l’équipe fondatrice de Seats2Meet, quand l’espace de coworking de 2500 mètres carrés a ouvert à Utrecht en 2007.",
      body: `<p>Parler avec Felix Lepoutre, c’est jeter un œil dans l’avenir. Il faisait partie de l’équipe fondatrice de Seats2Meet, quand cet espace de 2500 mètres carrés a ouvert ses portes à Utrecht en 2007 et que la plupart des premiers visiteurs s’y promenaient avec un point d’interrogation au-dessus de la tête. On peut travailler ici toute la journée, et profiter d’un déjeuner sain et gratuit ? Et tout ce que vous demandez en retour, c’est un esprit ouvert ? Aujourd’hui Lepoutre dirige Meetberlage, un Seats2meet à Amsterdam. La sérendipité est la clé du succès, dit-il. « Il s’agit de rencontrer de nouvelles personnes et d’avoir des rencontres inattendues et pertinentes. »</p>
<p>La façon dont nous nous organisons depuis l’industrialisation ne fonctionne plus. Nous n’avons plus besoin du travail d’usine traditionnel, la technologie a changé le terrain, et l’accès au savoir change tout. Cela ne se passe pas seulement dans les usines : les structures changent dans l’éducation, le transport, les soins. Beaucoup d’organisations se demandent : quel est notre rôle ?</p>
<p>Si elles veulent un rôle actif dans le nouveau jeu, elles doivent créer de la valeur autrement qu’en fabriquant des produits et en les vendant avec la meilleure marge. Elles doivent se relier aux gens et créer de la valeur avec eux. Pour qu’une idée réussisse, il faut maintenant un large écosystème. Plus le réseau est malin, mieux c’est. Quand beaucoup de gens échangent savoir et expertise autour d’une idée, il y a beaucoup de rencontres pertinentes. L’idée gagne un maillage de personnes qui en partagent la propriété.</p>
<p>Il nous faut un nouveau modèle de propriété partagée, différent des écosystèmes comme Uber et Airbnb, encore bâtis sur des structures de financement traditionnelles. Ce qui émerge, ce sont des organisations collectives décentralisées, comme Assembly et Quirky, qui réalisent des produits avec beaucoup de gens. Les produits sont faits avec des parties prenantes, pas des actionnaires.</p>
<p>La plupart des initiatives travaillent avec des jetons. On émet par exemple 100 000 jetons pour réaliser une idée, on définit les tâches et on répartit les jetons selon le travail ou la compétence. Les jetons correspondent à la propriété. Si j’ai gagné 10 000 jetons sur 100 000, j’ai 10 pour cent de la propriété et des bénéfices. Cette propriété doit rester dynamique.</p>`,
    },
    {
      title: "Serendipität ist der Schlüssel",
      lead: "Mit Felix Lepoutre zu sprechen ist wie ein Blick in die Zukunft. Er gehörte zum Gründungsteam von Seats2Meet, als der 2500 Quadratmeter große Coworking-Raum 2007 in Utrecht die Türen öffnete.",
      body: `<p>Mit Felix Lepoutre zu sprechen ist wie ein Blick in die Zukunft. Er gehörte zum Gründungsteam von Seats2Meet, als dieser Raum 2007 in Utrecht öffnete und die meisten ersten Besucher mit einem Fragezeichen über dem Kopf herumliefen. Wir können hier den ganzen Tag arbeiten und ein gesundes Mittagessen umsonst bekommen? Und alles, was ihr wollt, ist ein offener Geist? Heute leitet Lepoutre Meetberlage, ein Seats2meet in Amsterdam. Serendipität ist der Schlüssel, sagt er. „Es geht darum, neue Menschen zu treffen und relevante unerwartete Begegnungen zu haben.“</p>
<p>Die Art, wie wir uns seit der Industrialisierung organisieren, funktioniert nicht mehr. Traditionelle Fabrikarbeit brauchen wir nicht mehr, kluge Technik hat das Feld verändert, und der Zugang zu Wissen verändert alles. Nicht nur in Fabriken: Strukturen ändern sich in Bildung, Verkehr, Gesundheit. Viele Organisationen fragen sich: Was ist unsere Rolle?</p>
<p>Wenn sie im neuen Spiel mitspielen wollen, müssen sie Wert anders schaffen als nur durch Produkte und Margen. Sie müssen sich mit Menschen verbinden und Wert mit ihnen schaffen. Für eine erfolgreiche Idee braucht es heute ein großes Ökosystem. Je klüger das Netz, desto besser. Wenn viele kluge Menschen Wissen um eine Idee tauschen, entstehen relevante Begegnungen. Die Idee bekommt ein Geflecht von Menschen mit geteiltem Eigentum.</p>
<p>Wir brauchen ein neues Modell geteilten Eigentums, anders als die Ökosysteme von Uber und Airbnb, die noch auf alten Finanzstrukturen stehen. Was entsteht, sind dezentrale kollektive Organisationen wie Assembly und Quirky, die Produkte mit vielen Menschen machen. Mit Stakeholdern, nicht mit Aktionären.</p>
<p>Die meisten Initiativen arbeiten mit Münzen. Man gibt zum Beispiel 100.000 Münzen aus, um eine Idee zu verwirklichen, definiert die Aufgaben und verteilt die Münzen nach Arbeit oder Können. Die Münzen entsprechen Eigentum. Habe ich 10.000 von 100.000 verdient, besitze ich 10 Prozent und erhalte 10 Prozent des Gewinns. Dieses Eigentum muss dynamisch bleiben.</p>`,
    },
  ),
  "we-have-all-the-solutions": p(
    null,
    {
      title: "Nous avons toutes les solutions",
      lead: "Avant même que le financement participatif ne porte ce nom, Bart Lacroix le faisait déjà avec son 1%CLUB. Fondée en 2008, la plateforme invite les gens du monde entier à donner 1 pour cent de leur temps, de leur savoir et de leur argent.",
      body: `<p>Avant même que cela ne s’appelle crowdfunding, <a href="https://twitter.com/bartlacroix">Bart Lacroix</a> le faisait déjà avec son <a href="https://www.onepercentclub.com/nl/">1%CLUB</a>. Fondée en 2008, la plateforme, partenaire de Bee Collective, invite les gens du monde entier à consacrer 1 pour cent de leur temps, de leur expertise et de leur argent à de relativement petits projets utiles. Sept ans plus tard, le crowdfunding s’est établi comme une ressource qui lance de nouvelles entreprises. « Nous avons toutes les solutions entre les mains. »</p>
<p>Les wicked problems — migration, pénurie alimentaire, réchauffement — ne sont-ils pas trop grands ? En théorie, avec toutes les entreprises, villes, programmeurs, écrivains, scientifiques, ONG et créatifs, nous avons toutes les solutions. Le défi est de nous organiser pour les relier. Nous parlons des mêmes problèmes, mais chacun dans son propre secteur. Ces conversations entre mondes n’ont pas encore lieu, non par choix, mais à cause de la façon dont la société est organisée.</p>
<p>D’abord accepter que nous partageons les mêmes défis. Nous ne pouvons pas détourner le regard. René Gude, le penseur du pays, parlait d’une vision du monde encourageante. Les nouvelles donnent le sentiment que tout s’effondre. Mais si l’on regarde les données de plus près, il y a moins de guerres, nous sommes moins violents, et nous développons sans cesse une technique plus maligne. Nous avons les solutions en main. Beaucoup de gens attendent le moment où ils pourront vraiment faire quelque chose. Ils ne savent pas encore quoi.</p>
<p>Beaucoup de pionniers tiennent une partie de la solution, mais n’ont pas la capacité de passer à l’échelle. Ils forment une foule qui agit à petite échelle. Les grandes institutions doivent regarder au-delà de leurs murs et travailler avec cette foule, pour que tous se sentent propriétaires des idées existantes et les emmènent plus loin.</p>`,
    },
    {
      title: "Wir haben alle Lösungen",
      lead: "Bevor Crowdfunding so hieß, machte Bart Lacroix es schon mit seinem 1%CLUB. 2008 gegründet, lädt die Plattform Menschen auf der ganzen Welt ein, 1 Prozent ihrer Zeit, ihres Wissens und ihres Geldes zu geben.",
      body: `<p>Bevor es Crowdfunding hieß, tat <a href="https://twitter.com/bartlacroix">Bart Lacroix</a> es schon mit seinem <a href="https://www.onepercentclub.com/nl/">1%CLUB</a>. 2008 gegründet, lädt die Plattform, Partner von Bee Collective, Menschen ein, 1 Prozent ihrer Zeit, Expertise und ihres Geldes für vergleichsweise kleine gute Projekte zu geben. Sieben Jahre später hat sich Crowdfunding als Mittel etabliert, das neue Unternehmen anschiebt. „Wir haben alle Lösungen in der Hand.“</p>
<p>Sind die großen Probleme — Migration, Nahrungsmangel, Erwärmung — nicht zu groß? In der Theorie haben wir, zusammen mit Unternehmen, Städten, Programmierern, Schreibenden, Wissenschaft und NGOs, alle Lösungen. Die Aufgabe ist, uns so zu organisieren, dass wir sie verknüpfen. Wir reden über dieselben Probleme, aber jeder in seinem eigenen Sektor. Diese Gespräche zwischen Welten finden noch nicht statt, nicht aus Wahl, sondern weil die Gesellschaft so gebaut ist.</p>
<p>Zuerst anerkennen, dass wir dieselben Herausforderungen teilen. René Gude, der Denker des Landes, sprach von einem ermutigenden Weltbild. Die Nachrichten lassen einen glauben, alles zerfalle. Wer genauer hinsieht, sieht weniger Kriege, weniger Gewalt und immer klügere Technik. Wir haben die Lösungen in der Hand. Viele Menschen warten auf den Moment, in dem sie wirklich etwas tun können. Sie wissen nur noch nicht was.</p>
<p>Viele Pioniere halten einen Teil der Lösung, haben aber nicht die Kraft, sie größer zu machen. Sie sind eine Menge, die klein arbeitet. Die großen Institutionen müssen über ihre Wände hinaussehen und mit dieser Menge arbeiten, damit alle Eigentum an den vorhandenen Ideen fühlen und sie weitertragen.</p>`,
    },
  ),
  "pakhuisb-en-de-toekomst-van-ons-onderwijs": p(
    {
      title: "PakhuisB and the future of our education",
      lead: "In this series on the future of education, PakhuisB looks for answers by putting local initiatives and people in the spotlight who are writing new rules for education in and around Breda.",
      body: `<p>In this series on the future of our education, <a href="https://www.pakhuisb.nl">PakhuisB</a> (an initiative of, among others, Stefanie Vermeulen of DE CONNECTORS) looks for answers by putting local initiatives and people in the spotlight who are making new rules for education in and around Breda.</p>
<p><strong>The smart university</strong></p>
<p>How do we shape education so that it fits a world that changes at great speed? How do you develop talent? What should students actually learn in this digital world? Economics and business, or rather citizenship and happiness? And how should teachers teach happiness? Are the trendy MOOCs the answer to the new rules we are dealing with?</p>
<p>We start with a mash-up of the Tegenlicht meet-up in Breda on The Smart University, held on 22 March at Brandpunt Breda.</p>
<p><strong>1. Erica Bol — initiator of Teach the Future Europe</strong></p>
<p>“A lot of people have a future shock,” says Erica Bol. Change goes much faster than before. Today’s education is not built for that; it still comes from the industrial revolution. What we learn now is about finding solutions for something that went wrong. If you teach children about the world of tomorrow, you teach them to create ideals. Teachers should give pupils the skills to deal with the speed of change: by experimenting, being creative, with gaming, avatars, hologram meetings, writing and playing scenarios. “The education of the future will be based much more on networks and will have a social character.”</p>
<p><a href="https://www.youtube.com/watch?v=DFNB3IRc3Co">Watch the video</a></p>
<p><strong>2. Willem van Valkenburg — TU Delft Extension School</strong></p>
<p>The TU Delft Extension School was founded to improve the quality of both campus and online education. Willem van Valkenburg has organised all MOOCs, OpenCourseWare, online and blended courses of TU Delft since 2013. “We started from an ideal. We want to share knowledge and give students an extra challenge.” The new open online education is social. Students learn by sharing knowledge, asking questions and starting discussions. TU Delft works with six other universities so that credits for an extra MOOC are recognised there too. “You have to keep learning all your life.”</p>
<p><strong>3. Niels de Beer — Avans University of Applied Sciences</strong></p>
<p>“Create unexpected connections with your students,” says Niels de Beer. As far as he is concerned, seventy percent of education may be filled by the working field. “Students should get out of those beautiful academic buildings. Let them experiment, experience it themselves, bump their heads and look around the corner.”</p>
<p><a href="https://www.youtube.com/watch?v=_eGQD0RXcW4">Watch the video</a></p>
<p><strong>4. Eva-Lisa Janssen — Ucademy</strong></p>
<p>While studying at Avans, Eva-Lisa Janssen and four fellow students asked themselves: what are we actually learning? And is it enough for the new world? The answer was no. Inspired by the Amsterdam Bildung Academy they started Ucademy, an independent academy inside Avans, with three lines: freedom and society, creation and inspiration, and identity and leadership. Lessons are given by people from the field, and because the founders do not believe in tight business models or hierarchy, it is set up as organically as possible.</p>
<p><a href="https://www.youtube.com/watch?v=3CeMQuMb5FM">Watch the video</a></p>`,
    },
    {
      title: "PakhuisB et l’avenir de notre enseignement",
      lead: "Dans cette série sur l’avenir de l’enseignement, PakhuisB cherche des réponses en mettant en lumière des initiatives locales et des gens qui, à Breda et autour, écrivent de nouvelles règles pour l’école.",
      body: `<p>Dans cette série, <a href="https://www.pakhuisb.nl">PakhuisB</a> (une initiative entre autres de Stefanie Vermeulen de DE CONNECTORS) cherche des réponses en mettant en lumière des initiatives locales et des gens qui inventent de nouvelles règles pour l’enseignement à Breda et alentour.</p>
<p><strong>L’université maligne</strong></p>
<p>Comment organiser l’enseignement pour qu’il suive un monde qui change très vite ? Comment développe-t-on les talents ? Que doivent vraiment apprendre les étudiants dans ce monde numérique ? L’économie, ou plutôt la citoyenneté et le bonheur ? Les MOOC à la mode sont-ils la réponse ?</p>
<p>Nous commençons par un mash-up de la rencontre Tegenlicht à Breda sur l’université maligne, le 22 mars à Brandpunt Breda.</p>
<p><strong>1. Erica Bol — Teach the Future Europe</strong></p>
<p>« Beaucoup de gens ont un choc du futur », dit Erica Bol. Les changements vont beaucoup plus vite qu’avant. L’enseignement d’aujourd’hui n’est pas fait pour cela ; il date encore de la révolution industrielle. Ce que nous apprenons maintenant, ce sont des solutions pour quelque chose qui a mal tourné. Si l’on apprend aux enfants le monde de demain, on leur apprend à créer des idéaux. Les enseignants doivent donner des compétences pour suivre la vitesse du changement : expérimenter, être créatif, avec le jeu, les avatars, les hologrammes, les scénarios. « L’enseignement de l’avenir sera beaucoup plus fondé sur les réseaux et aura un caractère social. »</p>
<p><a href="https://www.youtube.com/watch?v=DFNB3IRc3Co">Voir la vidéo</a></p>
<p><strong>2. Willem van Valkenburg — TU Delft Extension School</strong></p>
<p>L’Extension School de la TU Delft a été créée pour améliorer la qualité de l’enseignement sur le campus et en ligne. « Nous avons commencé par idéalisme. Nous voulons partager le savoir et donner aux étudiants un défi de plus. » Le nouvel enseignement ouvert est social. La TU Delft travaille avec six autres universités pour que les crédits d’un MOOC supplémentaire y soient reconnus. « Il faut apprendre toute sa vie. »</p>
<p><strong>3. Niels de Beer — Avans</strong></p>
<p>« Créez des liens inattendus avec vos étudiants », dit Niels de Beer. Soixante-dix pour cent de l’enseignement peuvent, selon lui, être remplis par le monde du travail. « Les étudiants doivent sortir de ces beaux bâtiments. Laissez-les expérimenter, vivre, se cogner et regarder au coin de la rue. »</p>
<p><a href="https://www.youtube.com/watch?v=_eGQD0RXcW4">Voir la vidéo</a></p>
<p><strong>4. Eva-Lisa Janssen — Ucademy</strong></p>
<p>Pendant leurs études à Avans, Eva-Lisa Janssen et quatre camarades se sont demandé : qu’apprenons-nous vraiment ? Et est-ce assez pour le monde nouveau ? La réponse était non. Inspirés par la Bildung Academie d’Amsterdam, ils ont créé Ucademy, une académie indépendante dans Avans, avec trois lignes : liberté et société, création et inspiration, identité et leadership.</p>
<p><a href="https://www.youtube.com/watch?v=3CeMQuMb5FM">Voir la vidéo</a></p>`,
    },
    {
      title: "PakhuisB und die Zukunft unserer Bildung",
      lead: "In dieser Reihe über die Zukunft der Bildung sucht PakhuisB Antworten, indem lokale Initiativen und Menschen ins Licht kommen, die in und um Breda neue Regeln für die Bildung schreiben.",
      body: `<p>In dieser Reihe sucht <a href="https://www.pakhuisb.nl">PakhuisB</a> (eine Initiative unter anderem von Stefanie Vermeulen von DE CONNECTORS) Antworten, indem lokale Initiativen und Menschen ins Licht kommen, die in und um Breda neue Regeln für die Bildung machen.</p>
<p><strong>Die kluge Universität</strong></p>
<p>Wie richten wir Bildung ein, damit sie zu einer Welt passt, die sich rasend schnell verändert? Wie entwickelt man Talente? Was müssen Studierende in dieser digitalen Welt überhaupt lernen? Wirtschaft oder lieber Bürgersinn und Glück? Sind die trendigen MOOCs die Antwort?</p>
<p>Wir beginnen mit einem Mash-up des Tegenlicht-Treffens in Breda über die kluge Universität, am 22. März in Brandpunt Breda.</p>
<p><strong>1. Erica Bol — Teach the Future Europe</strong></p>
<p>„Viele Menschen haben einen Zukunftsschock“, sagt Erica Bol. Veränderung geht viel schneller als früher. Die Bildung von heute ist darauf nicht eingerichtet; sie stammt noch aus der industriellen Revolution. Was wir jetzt lernen, sind Lösungen für etwas, das schiefging. Wer Kindern die Welt von morgen beibringt, lehrt sie, Ideale zu schaffen. Lehrkräfte sollen Fähigkeiten mitgeben, mit dem Tempo der Veränderung umzugehen: experimentieren, kreativ sein, mit Spielen, Avataren, Hologrammen, Szenarien. „Die Bildung der Zukunft wird viel stärker auf Netzen beruhen und einen sozialen Charakter haben.“</p>
<p><a href="https://www.youtube.com/watch?v=DFNB3IRc3Co">Video ansehen</a></p>
<p><strong>2. Willem van Valkenburg — TU Delft Extension School</strong></p>
<p>Die Extension School der TU Delft wurde gegründet, um die Qualität von Campus- und Online-Bildung zu verbessern. „Wir haben aus einem Ideal begonnen. Wir wollen Wissen teilen und Studierenden eine Extra-Herausforderung geben.“ Die neue offene Online-Bildung ist sozial. Die TU Delft arbeitet mit sechs anderen Universitäten, damit Leistungspunkte für einen zusätzlichen MOOC auch dort gelten. „Man muss sein Leben lang lernen.“</p>
<p><strong>3. Niels de Beer — Avans</strong></p>
<p>„Schaffen Sie unerwartete Verbindungen mit Ihren Studierenden“, sagt Niels de Beer. Siebzig Prozent der Bildung dürfen für ihn vom Arbeitsfeld gefüllt werden. „Studierende müssen aus diesen schönen Gebäuden heraus. Lasst sie experimentieren, selbst erfahren, sich stoßen und um die Ecke schauen.“</p>
<p><a href="https://www.youtube.com/watch?v=_eGQD0RXcW4">Video ansehen</a></p>
<p><strong>4. Eva-Lisa Janssen — Ucademy</strong></p>
<p>Während des Studiums an der Avans fragten sich Eva-Lisa Janssen und vier Mitstudierende: Was lernen wir eigentlich? Und reicht das für die neue Welt? Die Antwort war nein. Inspiriert von der Amsterdamer Bildung Academie gründeten sie Ucademy, eine unabhängige Akademie in der Avans, mit drei Linien: Freiheit und Gesellschaft, Schöpfung und Inspiration, Identität und Führung.</p>
<p><a href="https://www.youtube.com/watch?v=3CeMQuMb5FM">Video ansehen</a></p>`,
    },
  ),
  "bee-collective-presenting-rianne-van-asperen": p(
    null,
    {
      title: "Bee Collective — voici Rianne van Asperen",
      lead: "Nous sommes très heureux de vous présenter Bee Collective, Swarm Solutions, la dernière initiative de DE CONNECTORS. Rejoignez-nous et faites partie d’une organisation d’un nouveau genre, à propriété partagée.",
      body: `<p>Nous sommes très heureux de vous présenter Bee Collective, Swarm Solutions, la dernière initiative de DE CONNECTORS. Rejoignez-nous et faites partie d’une organisation d’un genre nouveau, à propriété partagée. En bref : certains des plus grands problèmes de la Terre demandent un essaim, pas une pyramide. Rianne van Asperen aide à donner forme à cette façon de travailler ensemble, où la propriété et la responsabilité ne restent pas au sommet.</p>`,
    },
    {
      title: "Bee Collective — Rianne van Asperen",
      lead: "Wir freuen uns sehr, Bee Collective vorzustellen, Swarm Solutions, die jüngste Initiative von DE CONNECTORS. Machen Sie mit und werden Sie Teil einer neuen Art von Organisation mit geteiltem Eigentum.",
      body: `<p>Wir freuen uns sehr, Bee Collective vorzustellen, Swarm Solutions, die jüngste Initiative von DE CONNECTORS. Machen Sie mit und werden Sie Teil einer Organisation neuer Art, mit geteiltem Eigentum. Kurz: einige der größten Probleme der Erde brauchen einen Schwarm, keine Pyramide. Rianne van Asperen hilft, diese Art des Zusammenarbeitens zu formen, in der Eigentum und Verantwortung nicht an der Spitze bleiben.</p>`,
    },
  ),
  "zeg-leider-begin-met-leven": p(
    {
      title: "Tell me, leader, start living",
      lead: "“I cannot stand that we use our brains to abuse power, or worse, to smash each other’s heads in. Let us be a bit kinder to each other. No, that is not naive. It is naive to think that you can keep going like this.”",
      body: `<p>“I cannot stand that we use our brains to abuse power, or worse, to smash each other’s heads in. Let us be a bit kinder to each other. No, that is not naive. It is naive to think you can keep going like this.”</p>
<p>The piece is a call to leaders to stop managing life from a distance and to start living it. Power that is only used to hold position does not make a community. A leader who begins with their own life — how they listen, how they share, how they show up — changes more than a leader who only talks about change.</p>
<p>DE CONNECTORS places that call next to the work in the city: people get a voice, a stage and the reins. Not as a slogan, but as a way of working.</p>`,
    },
    {
      title: "Dis, chef, commence par vivre",
      lead: "« Je ne supporte pas que nous utilisions notre cerveau pour abuser du pouvoir, ou pire, pour nous défoncer le crâne. Soyons un peu plus gentils les uns avec les autres. Non, ce n’est pas naïf. Naïf, c’est de croire qu’on peut continuer ainsi. »",
      body: `<p>« Je ne supporte pas que nous utilisions notre cerveau pour abuser du pouvoir, ou pire, pour nous défoncer le crâne. Soyons un peu plus gentils. Non, ce n’est pas naïf. Naïf, c’est de croire qu’on peut continuer ainsi. »</p>
<p>Le texte appelle les dirigeants à cesser de gérer la vie à distance et à commencer à la vivre. Un pouvoir qui ne sert qu’à garder la place ne fait pas une communauté. Un dirigeant qui commence par sa propre vie — comment il écoute, comment il partage, comment il est présent — change plus qu’un dirigeant qui ne parle que du changement.</p>
<p>DE CONNECTORS place cet appel à côté du travail dans la ville : les gens reçoivent une voix, une scène et les rênes. Pas comme un slogan, mais comme une façon de travailler.</p>`,
    },
    {
      title: "Sag, Führungskraft, fang an zu leben",
      lead: "„Ich halte es nicht aus, dass wir unser Gehirn benutzen, um Macht zu missbrauchen oder, schlimmer, einander den Schädel einzuschlagen. Lasst uns etwas freundlicher zueinander sein. Nein, das ist nicht naiv. Naiv ist zu glauben, dass man so weitermachen kann.“",
      body: `<p>„Ich halte es nicht aus, dass wir unser Gehirn benutzen, um Macht zu missbrauchen oder, schlimmer, einander den Schädel einzuschlagen. Lasst uns freundlicher sein. Nein, das ist nicht naiv. Naiv ist zu glauben, man könne so weitermachen.“</p>
<p>Der Text ruft Führende auf, das Leben nicht mehr aus der Distanz zu verwalten, sondern es zu leben. Macht, die nur die Position hält, macht keine Gemeinschaft. Wer bei dem eigenen Leben anfängt — wie man zuhört, wie man teilt, wie man da ist — verändert mehr als jemand, der nur über Veränderung spricht.</p>
<p>DE CONNECTORS stellt diesen Ruf neben die Arbeit in der Stadt: Menschen bekommen eine Stimme, eine Bühne und die Zügel. Nicht als Slogan, sondern als Arbeitsweise.</p>`,
    },
  ),
  "bouw-een-app-voor-nao": p(
    {
      title: "Build an app for Nao",
      lead: "His white plastic arms hinge gracefully along his body. Slowly and smoothly he bends his legs to the piano music coming from his ears. Then he stretches his right leg as far as he can. Meet Nao.",
      body: `<p>His white plastic arms hinge gracefully along his body. Slowly and smoothly he bends his legs to the piano music coming from his ears. Then he stretches his right leg as far as he can. Meet Nao, the robot who makes an abstract future suddenly stand in the room.</p>
<p>The invitation is simple: build an app for him. Not as a gadget, but as a way for students, makers and the city to try what technology can do when people stay in the lead. Nao dances, listens and answers. The question is what we want him to do for us — and what we would rather keep doing ourselves.</p>`,
    },
    {
      title: "Construisez une appli pour Nao",
      lead: "Ses bras de plastique blanc s’articulent avec grâce le long de son corps. Lentement, fluidement, il plie les jambes sur la musique de piano qui sort de ses oreilles. Puis il tend la jambe droite aussi loin qu’il peut. Voici Nao.",
      body: `<p>Ses bras de plastique blanc s’articulent avec grâce le long de son corps. Lentement, il plie les jambes sur la musique de piano qui sort de ses oreilles. Puis il tend la jambe droite aussi loin qu’il peut. Voici Nao, le robot qui fait soudain tenir un avenir abstrait dans la pièce.</p>
<p>L’invitation est simple : construisez une appli pour lui. Pas comme un gadget, mais comme une façon pour étudiants, makers et la ville d’essayer ce que la technique peut faire quand les gens restent aux commandes. Nao danse, écoute et répond. La question est ce que nous voulons qu’il fasse pour nous — et ce que nous préférons continuer à faire nous-mêmes.</p>`,
    },
    {
      title: "Bau eine App für Nao",
      lead: "Seine weißen Plastikarme schwenken anmutig am Körper entlang. Langsam und fließend beugt er die Beine zur Klaviermusik aus seinen Ohren. Dann streckt er das rechte Bein so weit er kann. Das ist Nao.",
      body: `<p>Seine weißen Plastikarme schwenken anmutig am Körper entlang. Langsam beugt er die Beine zur Klaviermusik aus seinen Ohren. Dann streckt er das rechte Bein so weit er kann. Das ist Nao, der Roboter, der eine abstrakte Zukunft plötzlich in den Raum stellt.</p>
<p>Die Einladung ist einfach: baut eine App für ihn. Nicht als Gadget, sondern als Weg für Studierende, Macher und die Stadt, auszuprobieren, was Technik kann, wenn Menschen die Führung behalten. Nao tanzt, hört und antwortet. Die Frage ist, was er für uns tun soll — und was wir lieber selbst weiter tun.</p>`,
    },
  ),
  "livestreaming-social-branding-steroids": p(
    {
      title: "Livestreaming is interaction, interaction, interaction",
      lead: "Livestreaming is great. I think so. An example. I am a journalist by origin, and in journalism a livestream could be a huge bonus in a live blog. Picture the protest march in Paris a few weeks ago.",
      body: `<p>Livestreaming is great. I think so. An example. I started as a journalist, and in journalism a livestream could be a huge bonus inside a live blog. Picture the protest march in Paris a few weeks back. A camera in the crowd does more than a paragraph written afterwards. People can ask, correct and join while it is happening.</p>
<p>That is the point. A livestream is not a broadcast with a comments box underneath. It is interaction, interaction, interaction. The people on the other side are not an audience you talk at. They are in the room, even if the room is a screen. If you only send, you miss the thing that makes it live.</p>
<p>For a brand, or a newsroom, or a city event, that changes the job. You prepare questions, you leave space, and you let the unexpected in. The value is not the polished picture. The value is the conversation that could not have been scripted.</p>`,
    },
    {
      title: "Le livestream, c’est l’interaction, l’interaction, l’interaction",
      lead: "Le livestream, c’est fort. Je trouve. Un exemple. Je suis journaliste à l’origine, et dans le journalisme un livestream pourrait être un énorme plus dans un liveblog. Imaginez la marche de protestation à Paris, il y a quelques semaines.",
      body: `<p>Le livestream, c’est fort. Un exemple. Je viens du journalisme, et là un direct pourrait être un énorme plus dans un liveblog. Imaginez la marche à Paris. Une caméra dans la foule fait plus qu’un paragraphe écrit après. Les gens peuvent demander, corriger et rejoindre pendant que ça se passe.</p>
<p>C’est là le point. Un livestream n’est pas une émission avec une boîte de commentaires en dessous. C’est l’interaction, l’interaction, l’interaction. Les gens de l’autre côté ne sont pas un public à qui l’on parle. Ils sont dans la pièce, même si la pièce est un écran. Si vous ne faites qu’envoyer, vous manquez ce qui rend la chose vivante.</p>
<p>Pour une marque, une rédaction ou un événement de ville, cela change le travail. On prépare des questions, on laisse de la place, et on laisse entrer l’imprévu. La valeur n’est pas l’image lisse. La valeur est la conversation qu’on n’aurait pas pu écrire d’avance.</p>`,
    },
    {
      title: "Livestreaming ist Interaktion, Interaktion, Interaktion",
      lead: "Livestreaming ist stark. Finde ich. Ein Beispiel. Von Haus aus bin ich Journalistin, und im Journalismus könnte ein Livestream ein riesiger Gewinn in einem Liveblog sein. Stellen Sie sich den Protestmarsch in Paris vor, vor ein paar Wochen.",
      body: `<p>Livestreaming ist stark. Ein Beispiel. Ich komme aus dem Journalismus, und dort könnte ein Livestream ein riesiger Gewinn in einem Liveblog sein. Stellen Sie sich den Marsch in Paris vor. Eine Kamera in der Menge tut mehr als ein Absatz hinterher. Menschen können fragen, korrigieren und mitmachen, während es geschieht.</p>
<p>Darum geht es. Ein Livestream ist keine Sendung mit einem Kommentarfeld darunter. Es ist Interaktion, Interaktion, Interaktion. Die Menschen auf der anderen Seite sind kein Publikum, das man bequatscht. Sie sind im Raum, auch wenn der Raum ein Bildschirm ist. Wer nur sendet, verpasst das, was es lebendig macht.</p>
<p>Für eine Marke, eine Redaktion oder ein Stadtevent ändert das die Arbeit. Man bereitet Fragen vor, lässt Raum und lässt das Unerwartete herein. Der Wert ist nicht das glatte Bild. Der Wert ist das Gespräch, das man nicht hätte schreiben können.</p>`,
    },
  ),
  "power-youth": p(
    null,
    {
      title: "Le pouvoir aux jeunes",
      lead: "Quand on est jeune, qu’on vit dans le nord des Pays-Bas et qu’on a une question, vraiment n’importe laquelle, on veut aller chez Jimmy’s. C’est gai, parce que là, au bureau, d’autres jeunes vous aident à trouver une réponse.",
      body: `<p>Quand on est jeune, dans le nord des Pays-Bas, et qu’on a une question, vraiment n’importe laquelle, on veut aller chez Jimmy’s. C’est gai, parce que là, au bureau, d’autres jeunes aident à trouver une réponse. Pas un guichet. Des pairs.</p>
<p>Power to the youth, ici, n’est pas un slogan au-dessus d’une porte. C’est la façon dont le lieu est fait : les jeunes tiennent le micro, posent les questions, et reçoivent de l’espace pour y répondre eux-mêmes. DE CONNECTORS a travaillé avec eux sur une émission où ce pouvoir se voit.</p>`,
    },
    {
      title: "Macht an die Jugend",
      lead: "Wenn man jung ist, im Norden der Niederlande lebt und eine Frage hat, wirklich irgendeine, will man zu Jimmy’s. Es ist schön, denn dort im Büro finden sich andere junge Menschen, die helfen, eine Antwort zu finden.",
      body: `<p>Wenn man jung ist, im Norden der Niederlande, und eine Frage hat, wirklich irgendeine, will man zu Jimmy’s. Es ist schön, denn dort im Büro helfen andere junge Menschen, eine Antwort zu finden. Kein Schalter. Gleichaltrige.</p>
<p>Power to the youth ist hier kein Spruch über der Tür. Es ist die Art, wie der Ort gemacht ist: die Jugendlichen halten das Mikrofon, stellen die Fragen und bekommen Raum, selbst zu antworten. DE CONNECTORS hat mit ihnen an einer Sendung gearbeitet, in der diese Macht sichtbar wird.</p>`,
    },
  ),
  "merry-xmas-everyone": p(
    null,
    {
      title: "Joyeux Noël à toutes et à tous",
      lead: "Quelle première année ! Merci à vous qui avez cru en nous et avec qui, pour qui et à côté de qui nous avons travaillé. Un grand merci à Sanne, Xam, Petra, Jules, Jochem, Erik, Jaap, Marco, Joost, Wendy, Maike, Tristan, Josje.",
      body: `<p>Quelle première année ! Merci à vous qui avez cru en nous et avec qui, pour qui et à côté de qui nous avons travaillé. Un grand merci à Sanne, Xam, Petra, Jules, Jochem, Erik, Jaap, Marco, Joost, Wendy, Maike, Tristan, Josje et à toutes les personnes dont le nom n’est pas sur cette ligne mais qui étaient dans la pièce.</p>
<p>Joyeux Noël. À l’année qui vient, et aux histoires que nous n’avons pas encore racontées.</p>`,
    },
    {
      title: "Frohe Weihnachten an alle",
      lead: "Was für ein erstes Jahr! Danke an alle, die an uns geglaubt haben und mit denen, für die und neben denen wir gearbeitet haben. Ein großer Dank an Sanne, Xam, Petra, Jules, Jochem, Erik, Jaap, Marco, Joost, Wendy, Maike, Tristan, Josje.",
      body: `<p>Was für ein erstes Jahr! Danke an alle, die an uns geglaubt haben und mit denen, für die und neben denen wir gearbeitet haben. Ein großer Dank an Sanne, Xam, Petra, Jules, Jochem, Erik, Jaap, Marco, Joost, Wendy, Maike, Tristan, Josje und an alle, deren Name nicht in dieser Zeile steht, die aber im Raum waren.</p>
<p>Frohe Weihnachten. Auf das kommende Jahr und auf die Geschichten, die wir noch nicht erzählt haben.</p>`,
    },
  ),
  "odc14-open-just-right-kickoff-rolf-kleef": p(
    null,
    {
      title: "#ODC14 : ouvert, juste, juste ? Un départ avec Rolf Kleef",
      lead: "Pour lancer notre campagne d’information, notre reporter Petra Kroon avait rendez-vous avec Rolf Kleef. Ce qui devait être un entretien informatif sur l’Open Development Camp est devenu une belle conversation.",
      body: `<p>Pour lancer la campagne, Petra Kroon a rencontré Rolf Kleef. Ce qui devait être un entretien d’information sur l’Open Development Camp est devenu une conversation sur ce que « open » veut vraiment dire. Ouvert, juste, et juste assez ? Ou ouvert comme un mot qu’on colle sur une porte qui reste fermée ?</p>
<p>Kleef parle de la pratique : qui est dans la pièce, qui décide, et si les données ouvertes servent les gens qui en ont besoin ou seulement ceux qui savent déjà les lire. L’ODC14, les 9 et 10 octobre 2014 à De Balie à Amsterdam, part de cette question. Est-ce que « open » suffit pour les grands problèmes du monde ?</p>`,
    },
    {
      title: "#ODC14: offen, gerecht, richtig? Ein Auftakt mit Rolf Kleef",
      lead: "Zum Start unserer Informationskampagne hatte Reporterin Petra Kroon einen Termin mit Rolf Kleef. Was ein informatives Gespräch über das Open Development Camp werden sollte, wurde ein großes Gespräch.",
      body: `<p>Zum Start der Kampagne traf Petra Kroon Rolf Kleef. Was ein Informationsgespräch über das Open Development Camp werden sollte, wurde ein Gespräch darüber, was „open“ wirklich heißt. Offen, gerecht und gerade richtig? Oder offen als Wort auf einer Tür, die zu bleibt?</p>
<p>Kleef spricht über die Praxis: wer im Raum ist, wer entscheidet, und ob offene Daten den Menschen dienen, die sie brauchen, oder nur denen, die sie schon lesen können. ODC14, am 9. und 10. Oktober 2014 in De Balie in Amsterdam, geht von dieser Frage aus. Reicht „open“ für die großen Probleme der Welt?</p>`,
    },
  ),
  "wij-zoeken-een-producer-en-redacteur-voor-odc14": p(
    {
      title: "We are looking for a producer and an editor for ODC14",
      lead: "For the organisation of the yearly Open Development Camp, with its own online live talk show, we are looking for a producer and an editor. ODC14 takes place on 9 and 10 October.",
      body: `<p>For the organisation of the yearly Open Development Camp, with its own online live talk show, we are looking for a producer and an editor. ODC14 takes place on 9 and 10 October at De Balie in Amsterdam.</p>
<p>We are looking for people who can hold a live programme together: plan guests, keep the story sharp, and make sure the people in the room and the people online are part of the same conversation. Experience with journalism, events or livestreaming helps. What matters more is that you like open questions and can work in a small, fast team.</p>
<p>Write to us if this is you.</p>`,
    },
    {
      title: "Nous cherchons un producteur et un rédacteur pour ODC14",
      lead: "Pour l’organisation de l’Open Development Camp annuel, avec sa propre émission en direct en ligne, nous cherchons un producteur et un rédacteur. ODC14 a lieu les 9 et 10 octobre.",
      body: `<p>Pour l’organisation de l’Open Development Camp annuel, avec sa propre émission en direct, nous cherchons un producteur et un rédacteur. ODC14 a lieu les 9 et 10 octobre à De Balie, à Amsterdam.</p>
<p>Nous cherchons des gens qui peuvent tenir un programme en direct : invités, récit net, et le public dans la salle et en ligne dans la même conversation. Une expérience du journalisme, des événements ou du livestream aide. Plus important : aimer les questions ouvertes et savoir travailler dans une petite équipe rapide.</p>
<p>Écrivez-nous si c’est vous.</p>`,
    },
    {
      title: "Wir suchen einen Producer und einen Redakteur für ODC14",
      lead: "Für die Organisation des jährlichen Open Development Camp, mit eigenem Online-Live-Talk, suchen wir einen Producer und einen Redakteur. ODC14 findet am 9. und 10. Oktober statt.",
      body: `<p>Für die Organisation des jährlichen Open Development Camp, mit eigenem Online-Live-Talk, suchen wir einen Producer und einen Redakteur. ODC14 findet am 9. und 10. Oktober in De Balie in Amsterdam statt.</p>
<p>Wir suchen Menschen, die ein Live-Programm zusammenhalten: Gäste planen, die Geschichte scharf halten und dafür sorgen, dass die Menschen im Saal und online dasselbe Gespräch führen. Erfahrung mit Journalismus, Events oder Livestream hilft. Wichtiger ist, dass Sie offene Fragen mögen und in einem kleinen, schnellen Team arbeiten können.</p>
<p>Schreiben Sie uns, wenn das Sie sind.</p>`,
    },
  ),
  "running-wild-republica": p(
    null,
    {
      title: "Courir vers le sauvage à re:publica",
      lead: "Des coques de téléphone qui vous sortent du radar, un public en larmes, le groupe polonais Bokka, drôle et étrange, et David Hasselhoff : tout cela se trouvait à Republica, la plus grande conférence européenne des médias sociaux.",
      body: `<p>Des coques de téléphone qui vous sortent du radar, un public en larmes, le groupe polonais Bokka et David Hasselhoff : tout cela se trouvait à re:publica, à Berlin, la plus grande conférence européenne des médias sociaux.</p>
<p>Running into the Wild était moins une scène qu’une traversée. Entre les stands et les talks, la question restait la même : que fait la technique à notre attention, à notre vie privée, et au plaisir d’être ensemble sans être mesuré ? DE CONNECTORS y était pour écouter, relier et ramener les histoires qui ne tiennent pas dans un slogan.</p>`,
    },
    {
      title: "Ins Wilde laufen auf der re:publica",
      lead: "Handyhuellen, die einen vom Radar nehmen, ein Publikum in Tränen, die lustige und schräge polnische Band Bokka und David Hasselhoff: alles zu finden auf der Republica, Europas größter Social-Media-Konferenz.",
      body: `<p>Hüllen, die vom Radar nehmen, ein Publikum in Tränen, die polnische Band Bokka und David Hasselhoff: alles auf der re:publica in Berlin, Europas größter Konferenz zu sozialen Medien.</p>
<p>Running into the Wild war weniger eine Bühne als ein Weg hindurch. Zwischen Ständen und Vorträgen blieb die Frage dieselbe: Was tut Technik mit unserer Aufmerksamkeit, unserer Privatsphäre und der Freude, zusammen zu sein, ohne vermessen zu werden? DE CONNECTORS war dort, um zuzuhören, zu verbinden und die Geschichten mitzunehmen, die nicht in einen Slogan passen.</p>`,
    },
  ),
  "fotografie-daar-zit-meer": p(
    {
      title: "Photography, there is more in it",
      lead: "You are better off placing and spreading ten good photos with a story and a context than throwing fifty loose photos onto Picasa. It still happens far too often that clients hire Xam just to cover an event.",
      body: `<p>You are better off placing ten good photos, with a story and a context, than throwing fifty loose photos onto Picasa. It still happens far too often that clients hire Xam only to cover an event: arrive, shoot, deliver a folder.</p>
<p>There is more in photography than that. A picture starts to work when you know why it was made, who is in it, and what the person looking should understand. Context is not a caption you add at the end. It is the reason the photo exists. Ten images with that care travel further than a pile that nobody can tell apart.</p>`,
    },
    {
      title: "La photographie, il y a plus dedans",
      lead: "Mieux vaut placer et diffuser dix belles photos avec une histoire et un contexte que jeter cinquante photos isolées sur Picasa. Il arrive encore bien trop souvent qu’on engage Xam seulement pour couvrir un événement.",
      body: `<p>Mieux vaut dix belles photos, avec une histoire et un contexte, que cinquante photos lâches sur Picasa. Il arrive encore trop souvent qu’on engage Xam seulement pour couvrir un événement : arriver, shooter, livrer un dossier.</p>
<p>Il y a plus dans la photographie. Une image commence à travailler quand on sait pourquoi elle a été faite, qui est dedans, et ce que la personne qui regarde doit comprendre. Le contexte n’est pas une légende ajoutée à la fin. C’est la raison pour laquelle la photo existe. Dix images avec ce soin voyagent plus loin qu’une pile que personne ne distingue.</p>`,
    },
    {
      title: "Fotografie, da steckt mehr drin",
      lead: "Besser zehn schöne Fotos mit einer Geschichte und einem Kontext verbreiten als fünfzig lose Fotos auf Picasa werfen. Es passiert Xam noch viel zu oft, dass Auftraggeber ihn nur engagieren, um ein Event abzudecken.",
      body: `<p>Besser zehn gute Fotos, mit Geschichte und Kontext, als fünfzig lose Bilder auf Picasa. Es passiert noch viel zu oft, dass Auftraggeber Xam nur buchen, um ein Event abzudecken: kommen, knipsen, einen Ordner liefern.</p>
<p>In der Fotografie steckt mehr. Ein Bild fängt an zu arbeiten, wenn man weiß, warum es gemacht wurde, wer darauf ist und was die Betrachtenden verstehen sollen. Kontext ist keine Bildunterschrift am Ende. Er ist der Grund, warum das Foto existiert. Zehn Bilder mit dieser Sorgfalt kommen weiter als ein Stapel, den niemand auseinanderhalten kann.</p>`,
    },
  ),
  "live-en-open-journalism": p(
    {
      title: "Live and open journalism",
      lead: "If you do not yet know the film of the three little pigs from The Guardian, that English frontrunner in the newspaper industry, watch the great film below first.",
      body: `<p>If you do not yet know The Guardian’s film of the three little pigs — that English frontrunner of the newspaper world — watch it first. It shows what happens when a newsroom opens the story while it is still being made.</p>
<p>Live and open journalism is not a finished piece with a comment section. It is reporting that lets people in: sources, readers, people who were there. The Guardian film makes the case in a few minutes. The work at DE CONNECTORS comes from the same belief. A story gets better when more than one person is allowed to hold it.</p>`,
    },
    {
      title: "Journalisme en direct et ouvert",
      lead: "Si vous ne connaissez pas encore le film des trois petits cochons du Guardian, ce pionnier anglais de la presse, regardez d’abord le beau film ci-dessous.",
      body: `<p>Si vous ne connaissez pas encore le film des trois petits cochons du Guardian, regardez-le d’abord. Il montre ce qui se passe quand une rédaction ouvre le récit pendant qu’il se fait encore.</p>
<p>Le journalisme en direct et ouvert n’est pas un article fini avec un espace de commentaires. C’est un reportage qui laisse entrer les gens : sources, lecteurs, personnes qui étaient là. Le film du Guardian le dit en quelques minutes. Le travail de DE CONNECTORS vient de la même conviction. Un récit devient meilleur quand plus d’une personne a le droit de le tenir.</p>`,
    },
    {
      title: "Live und offener Journalismus",
      lead: "Wenn Sie den Film der drei kleinen Schweinchen vom Guardian noch nicht kennen, diesem englischen Vorreiter der Tageszeitungen, sehen Sie zuerst den starken Film unten.",
      body: `<p>Wenn Sie den Film der drei kleinen Schweinchen vom Guardian noch nicht kennen, sehen Sie ihn zuerst. Er zeigt, was geschieht, wenn eine Redaktion die Geschichte öffnet, während sie noch entsteht.</p>
<p>Live und offener Journalismus ist kein fertiges Stück mit einem Kommentarfeld. Es ist Berichterstattung, die Menschen hineinlässt: Quellen, Leserinnen und Leser, Menschen, die dabei waren. Der Guardian-Film sagt das in wenigen Minuten. Die Arbeit von DE CONNECTORS kommt aus derselben Überzeugung. Eine Geschichte wird besser, wenn mehr als eine Person sie halten darf.</p>`,
    },
  ),
}
