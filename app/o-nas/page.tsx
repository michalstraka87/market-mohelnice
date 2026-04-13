import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'O nás — Market Mohelnice',
  description: 'Místní market Mohelnice a okolí. Prodávej, daruj a vyměňuj s lidmi z okolí — bez poplatků, bez prostředníků.',
}

const HODNOTY = [
  {
    icon: '🤝',
    title: 'Slušnost na prvním místě',
    text: 'Zdravíme, děkujeme, omlouváme se. Chováme se k sobě tak, jak chceme, aby se druzí chovali k nám. Žádné urážky, nátlak ani podvody.',
  },
  {
    icon: '🏘️',
    title: 'Místní komunita',
    text: 'Jsme sousedé. Setkáme se na náměstí, v obchodě nebo u autobusu. Proto záleží na tom, jak se k sobě chováme i online.',
  },
  {
    icon: '🎁',
    title: 'Sdílení má smysl',
    text: 'Věc, která leží nevyužitá ve sklepě, může udělat radost sousedovi. Darování a symbolické ceny jsou u nás stejně vítané jako prodej.',
  },
  {
    icon: '🔒',
    title: 'Bezpečné předání',
    text: 'Doporučujeme setkání na veřejných místech — náměstí, autobusové nádraží, místní obchod. Nikdy neposílej peníze předem.',
  },
  {
    icon: '🌱',
    title: 'Méně odpadu',
    text: 'Každá věc, která najde nového majitele, je věc, která neskončila na smetišti. Pomáháme prodloužit život věcem a šetřit přírodu.',
  },
  {
    icon: '💬',
    title: 'Otevřená komunikace',
    text: 'Reaguj na zprávy. Pokud zájem odpadl, dej vědět. Druhá strana čeká a zaslouží si vědět, jak to je. Spolehlivost buduje důvěru.',
  },
]

const PRAVIDLA = [
  { nadpis: 'Poctivost při popisu', text: 'Uveď pravdivý a přesný popis věci včetně reálného stavu. Všechny skryté vady nebo nedostatky popiš předem.' },
  { nadpis: 'Dodržování domluv', text: 'Domluvenou schůzku dodržuj. Pokud nemůžeš přijít, zruš ji včas.' },
  { nadpis: 'Dohodnutá cena platí', text: 'Cenu výrazně nesrážej až při předání věci. Cena, na které se domluvíte, platí.' },
  { nadpis: 'Ochrana soukromí', text: 'Nezveřejňuj osobní kontakty třetích osob (telefon, e-mail, sociální sítě apod.).' },
  { nadpis: 'Zákaz podnikání', text: 'Platformu nepoužívej k podnikatelskému prodeji nového zboží (jako firma nebo prodejce na živnost).' },
  { nadpis: 'Respekt k rozhodnutí prodávajícího', text: 'Pokud si prodávající vybere jiného zájemce, respektuj to.' },
  { nadpis: 'Hodnocení uživatelů', text: 'Hodnocení ostatních uživatelů je důležitou součástí komunity. Uživatel s hodnocením 2 hvězdy a méně bude automaticky zablokován.' },
]

export default function ONasPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* Hero */}
      <div className="text-center mb-14">
        <p className="text-5xl mb-4">🏘️</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Market Mohelnice
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
          Místní market Mohelnice a okolí. Místo, kde si sousedé pomáhají,
          věci mají druhý život a slušnost je samozřejmostí.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 rounded-full text-white font-medium text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#E84040' }}
        >
          Procházet inzeráty
        </Link>
      </div>

      {/* Příběh */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Proč jsme vznikli?</h2>
        <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
          <p>
            Mohelnice je malé město, kde se lidé znají. Přesto každý rok skončí v kontejnerech
            tisíce věcí, které by mohly sloužit dál. Kolo, co stojí ve sklepě. Dětské oblečení,
            ze kterého vyrostly děti. Knihy, které nikdo nečte.
          </p>
          <p>
            Vznikl proto jednoduchý místní market — bez poplatků, bez složité registrace,
            bez anonymních cizinců z druhého konce republiky. Jen sousedé, kteří si navzájem
            pomáhají a se kterými se příští týden potkáš na náměstí.
          </p>
          <p>
            Největší hodnotou tohoto místa nejsou věci. Je to důvěra.
          </p>
        </div>
      </div>

      {/* Hodnoty */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">Naše hodnoty</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {HODNOTY.map(h => (
          <div
            key={h.title}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
          >
            <p className="text-3xl mb-3">{h.icon}</p>
            <h3 className="font-semibold text-gray-900 mb-2">{h.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{h.text}</p>
          </div>
        ))}
      </div>

      {/* Pravidla */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-8 mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Základní pravidla</h2>
        <ul className="space-y-3">
          {PRAVIDLA.map((p, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                style={{ backgroundColor: '#E84040' }}>
                {i + 1}
              </span>
              <div>
                <span className="font-semibold text-gray-900">{p.nadpis}: </span>
                {p.text}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Jak to funguje */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Jak to funguje?</h2>
        <div className="space-y-5">
          {[
            { krok: '1', nadpis: 'Zaregistruj se', text: 'Stačí e-mail a jméno. Žádné poplatky, žádné skryté podmínky.' },
            { krok: '2', nadpis: 'Přidej inzerát', text: 'Vyfotografuj věc, napiš popis a zvol cenu — nebo ji dej zadarmo.' },
            { krok: '3', nadpis: 'Domluvte se', text: 'Zájemce tě kontaktuje přímo. Domluvíte místo a čas předání.' },
            { krok: '4', nadpis: 'Předejte si věc', text: 'Sejděte se osobně, věc si prohlédněte a předejte. Jednoduše.' },
          ].map(({ krok, nadpis, text }) => (
            <div key={krok} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ backgroundColor: '#E84040' }}>
                {krok}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{nadpis}</p>
                <p className="text-sm text-gray-500 mt-0.5">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-8 border-t border-gray-100">
        <p className="text-gray-500 text-sm mb-4">Zapoj se do komunity. Je to zdarma a vždycky bude.</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link
            href="/registrace"
            className="px-6 py-2.5 rounded-full text-white font-medium text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#E84040' }}
          >
            Zaregistrovat se
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Procházet inzeráty
          </Link>
        </div>
      </div>

    </div>
  )
}
