import type { Localized } from '../services';

/**
 * Local copy per town.
 *
 * Written around what actually differs between these places operationally —
 * how a truck gets in, whether functions happen on open land or in a hall, how
 * far the crew travels — plus the one or two things each town is genuinely
 * known for. Nothing here claims work Shree Shakti has done: venue names and
 * event history are the client's to add at /admin/areas, and that is where the
 * remaining length comes from. See docs/content-review.md.
 */
export type AreaSeed = {
  slug: string;
  promise: Localized;
  paragraphs: { en: string[]; gu: string[] };
  notes: { en: string[]; gu: string[] };
};

export const areaSeeds: AreaSeed[] = [
  {
    slug: 'surendranagar',
    promise: {
      en: 'Our own town. Same-day site visits, and a godown you can walk into.',
      gu: 'અમારું પોતાનું શહેર. એ જ દિવસે સાઇટ વિઝિટ, અને ગોડાઉન જ્યાં તમે જાતે આવી શકો.',
    },
    paragraphs: {
      en: [
        'Surendranagar is where our godown is, which changes what we can promise here. A site visit is usually the same day you call, the trucks are minutes from the ground rather than an hour, and if something has to be swapped mid-function it comes from stock rather than from a supplier who has closed for the evening.',
        'Functions here run across a wide range: society halls and community grounds in town, farm land on the outskirts for the larger weddings and samuh lagans, and school and government grounds for public programmes. Each needs a different approach to access, power and flooring, and we would rather see yours than assume.',
      ],
      gu: [
        'સુરેન્દ્રનગરમાં જ અમારું ગોડાઉન છે, અને એનાથી અહીં અમે શું વચન આપી શકીએ એ બદલાય છે. ફોન કરો એ જ દિવસે સાઇટ વિઝિટ થાય, ગાડી મેદાનથી કલાક નહીં પણ મિનિટોના અંતરે હોય, અને પ્રસંગ વચ્ચે કંઈ બદલવું પડે તો એ સ્ટોકમાંથી આવે — સાંજે બંધ થઈ ગયેલા સપ્લાયર પાસેથી નહીં.',
        'અહીંના પ્રસંગો ઘણી જાતના હોય છે: શહેરમાં સોસાયટીના હોલ અને સામુદાયિક મેદાન, મોટાં લગ્ન અને સમૂહ લગ્ન માટે બહારની વાડીઓ, અને જાહેર કાર્યક્રમો માટે શાળા તથા સરકારી મેદાન. દરેકમાં પ્રવેશ, પાવર અને ફ્લોરિંગની જરૂરિયાત અલગ હોય — એટલે અમે ધારી લેવાને બદલે તમારી જગ્યા જોવાનું પસંદ કરીએ છીએ.',
      ],
    },
    notes: {
      en: [
        'Same-day site visit in most cases',
        'Trucks minutes from the ground, not hours',
        'Replacements come from stock during the function',
      ],
      gu: [
        'મોટા ભાગે એ જ દિવસે સાઇટ વિઝિટ',
        'ગાડી મેદાનથી કલાક નહીં, મિનિટોના અંતરે',
        'પ્રસંગ દરમિયાન બદલી સ્ટોકમાંથી જ',
      ],
    },
  },
  {
    slug: 'wadhwan',
    promise: {
      en: 'The next town along — close enough that a morning problem is fixed by lunch.',
      gu: 'બાજુનું જ શહેર — સવારની સમસ્યા બપોર સુધીમાં ઉકેલાઈ જાય એટલું નજીક.',
    },
    paragraphs: {
      en: [
        'Wadhwan sits alongside Surendranagar, so for us it is effectively the same working day: the same crew, the same trucks, no overnight stay and no travel loading on the quote. That matters most on multi-day weddings, where the ground has to be reset between the haldi, the sangeet and the vidhi.',
        'The older parts of town have narrower approaches than the newer colonies, which decides more than people expect — a 30 m hanger is only useful if the frame can reach the ground it is going on. We check the entrance and the turning circle at the site visit, not on the morning of the setup.',
      ],
      gu: [
        'વઢવાણ સુરેન્દ્રનગરની બાજુમાં જ છે, એટલે અમારા માટે એ એ જ કામકાજનો દિવસ છે: એ જ ટીમ, એ જ ગાડી, રાત રોકાવાનું નહીં અને ક્વોટમાં મુસાફરીનો ભાર નહીં. ઘણા દિવસનાં લગ્નમાં આ સૌથી વધુ કામ લાગે છે, જ્યાં હળદી, સંગીત અને વિધિ વચ્ચે મેદાન ફરી ગોઠવવું પડે.',
        'શહેરના જૂના ભાગમાં નવી સોસાયટીઓ કરતાં રસ્તા સાંકડા છે, અને એ લોકો ધારે એના કરતાં વધુ અસર કરે છે — 30 મીટરનું હેંગર ત્યારે જ કામનું છે જ્યારે એની ફ્રેમ મેદાન સુધી પહોંચી શકે. પ્રવેશ અને ગાડી ફેરવવાની જગ્યા અમે સેટઅપની સવારે નહીં, સાઇટ વિઝિટમાં જ તપાસી લઈએ છીએ.',
      ],
    },
    notes: {
      en: [
        'No overnight travel loading on the quote',
        'Narrow approaches checked before booking',
        'Same crew as Surendranagar',
      ],
      gu: [
        'ક્વોટમાં રાત રોકાવાનો ખર્ચ નહીં',
        'બુકિંગ પહેલાં સાંકડા રસ્તાની તપાસ',
        'સુરેન્દ્રનગર જેવી જ ટીમ',
      ],
    },
  },
  {
    slug: 'limbdi',
    promise: {
      en: 'Highway-side ground and interior villages, both reachable in a morning.',
      gu: 'હાઇવે પરનાં મેદાન અને અંદરનાં ગામ — બંને સવારમાં પહોંચી શકાય એટલાં.',
    },
    paragraphs: {
      en: [
        'Limbdi sits on the main road, which makes the town itself straightforward to reach with a loaded truck. The villages around it are a different matter: the last two kilometres decide whether a 30 m hanger is possible or whether a pandal is the sensible answer, and that is a question best settled at the site visit rather than on the phone.',
        'Weddings and samuh lagans here often use open farm land rather than a hall, which means flooring, power and cover all have to be planned rather than assumed. Tell us whether there is a working connection near the ground; if not, the generator sizing changes and so does the cabling run.',
      ],
      gu: [
        'લીંબડી મુખ્ય રસ્તા પર છે, એટલે ભરેલી ગાડી સાથે શહેરમાં પહોંચવું સહેલું છે. આસપાસનાં ગામની વાત જુદી છે: છેલ્લા બે કિલોમીટર નક્કી કરે છે કે 30 મીટરનું હેંગર શક્ય છે કે પંડાલ વધુ સમજદારીભર્યો જવાબ છે — અને એ સવાલ ફોન પર નહીં, સાઇટ વિઝિટમાં ઉકેલવો સારો.',
        'અહીં લગ્ન અને સમૂહ લગ્ન ઘણી વાર હોલને બદલે ખુલ્લી વાડીમાં થાય છે, એટલે ફ્લોરિંગ, પાવર અને કવર — ત્રણેયનું આયોજન કરવું પડે, ધારી ન લેવાય. મેદાનની નજીક ચાલુ કનેક્શન છે કે નહીં એ જણાવો; ન હોય તો જનરેટરની ક્ષમતા અને કેબલની લંબાઈ બંને બદલાય છે.',
      ],
    },
    notes: {
      en: [
        'Town easy for loaded trucks; villages need a check',
        'Open farm land needs flooring and power planned',
        'Generator sizing depends on the nearest connection',
      ],
      gu: [
        'શહેરમાં ભરેલી ગાડી સહેલાઈથી; ગામમાં તપાસ જરૂરી',
        'ખુલ્લી વાડીમાં ફ્લોરિંગ અને પાવરનું આયોજન',
        'નજીકના કનેક્શન પ્રમાણે જનરેટરની ક્ષમતા',
      ],
    },
  },
  {
    slug: 'dhrangadhra',
    promise: {
      en: 'Large open grounds, and the wind that comes with them.',
      gu: 'મોટાં ખુલ્લાં મેદાન — અને એની સાથે આવતો પવન.',
    },
    paragraphs: {
      en: [
        'Dhrangadhra has the open ground that large functions want, and open ground is exactly where anchoring stops being a formality. Our hangers are wind-rated and we set the anchors to the soil we find rather than to a standard, which is worth saying because a structure that is fine in a courtyard is not automatically fine on an exposed field.',
        'Community and samaj functions here often run to several thousand guests, where the seating layout and the catering flow matter more than the decoration. We plan those together — a beautiful setup with one queue for a thousand people is still a badly run evening.',
      ],
      gu: [
        'ધ્રાંગધ્રામાં મોટા પ્રસંગોને જોઈએ એવાં ખુલ્લાં મેદાન છે — અને ખુલ્લા મેદાનમાં જ એન્કરિંગ ઔપચારિકતા મટી જાય છે. અમારાં હેંગર પવન સહન કરે એવાં છે અને એન્કર અમે ધોરણ પ્રમાણે નહીં, જે જમીન મળે એ પ્રમાણે નાખીએ છીએ — કારણ કે ચોકમાં બરાબર રહેતું સ્ટ્રક્ચર ખુલ્લા ખેતરમાં આપોઆપ બરાબર નથી હોતું.',
        'અહીંના સામાજિક અને સમાજના પ્રસંગો ઘણી વાર હજારો મહેમાનો સુધી પહોંચે છે, જ્યાં સજાવટ કરતાં બેઠકની ગોઠવણ અને જમણનો પ્રવાહ વધુ મહત્ત્વનાં હોય. અમે એ બંનેનું આયોજન સાથે કરીએ છીએ — હજાર માણસ માટે એક જ લાઇન હોય તો સુંદર સેટઅપ પણ ખરાબ સાંજ જ બને છે.',
      ],
    },
    notes: {
      en: [
        'Anchoring set to the soil, not to a standard',
        'Wind-rated structures for exposed ground',
        'Seating and catering flow planned together',
      ],
      gu: [
        'ધોરણ નહીં, જમીન પ્રમાણે એન્કરિંગ',
        'ખુલ્લા મેદાન માટે પવન સહન કરતાં સ્ટ્રક્ચર',
        'બેઠક અને જમણનો પ્રવાહ સાથે ગોઠવાય',
      ],
    },
  },
  {
    slug: 'chotila',
    promise: {
      en: 'Pilgrim crowds and roadside grounds — setups that have to handle people arriving all day.',
      gu: 'યાત્રાળુઓની ભીડ અને રસ્તા પરનાં મેદાન — આખો દિવસ આવતા લોકોને સંભાળે એવું સેટઅપ.',
    },
    paragraphs: {
      en: [
        'Chotila brings a steady flow of visitors to the Chamunda Mata temple, and functions here often run alongside that rather than in a quiet corner. Programmes that draw a crowd through the day — annakut, satsang, community meals — need a layout that copes with people arriving continuously rather than all at once, and a sound system that stays intelligible over movement.',
        'Ground near the main road is easy to load into but noisy; ground further in is quieter but the approach needs checking. We walk both before quoting, because the right answer depends on whether your programme is one session or all day.',
      ],
      gu: [
        'ચોટીલામાં ચામુંડા માતાના મંદિરે સતત દર્શનાર્થીઓ આવતા રહે છે, અને અહીંના પ્રસંગો ઘણી વાર શાંત ખૂણામાં નહીં પણ એની સાથે જ ચાલે છે. આખો દિવસ ભીડ ખેંચતા કાર્યક્રમો — અન્નકૂટ, સત્સંગ, સમૂહ ભોજન — માટે એવી ગોઠવણ જોઈએ જે એકસાથે નહીં પણ સતત આવતા લોકોને સંભાળે, અને એવો સાઉન્ડ જે અવરજવર વચ્ચે પણ સ્પષ્ટ રહે.',
        'મુખ્ય રસ્તા પાસેના મેદાનમાં સામાન ઉતારવો સહેલો પણ અવાજ વધુ; અંદરનું મેદાન શાંત પણ ત્યાં પહોંચવાનો રસ્તો તપાસવો પડે. ભાવ આપતાં પહેલાં અમે બંને જોઈ લઈએ છીએ — સાચો જવાબ તમારો કાર્યક્રમ એક સત્રનો છે કે આખા દિવસનો, એના પર આધારિત છે.',
      ],
    },
    notes: {
      en: [
        'Layouts for continuous arrivals, not one seating',
        'Speech kept intelligible over movement',
        'Roadside and interior grounds both walked',
      ],
      gu: [
        'એક જ બેઠક નહીં, સતત આવતા લોકો માટે ગોઠવણ',
        'અવરજવર વચ્ચે પણ સ્પષ્ટ વાણી',
        'રસ્તા પરનું અને અંદરનું — બંને મેદાન જોવાય',
      ],
    },
  },
  {
    slug: 'sayla',
    promise: {
      en: 'Satsang and samaj functions where the back row matters as much as the front.',
      gu: 'સત્સંગ અને સમાજના પ્રસંગો — જ્યાં આગળની હરોળ જેટલી જ પાછળની હરોળ પણ મહત્ત્વની.',
    },
    paragraphs: {
      en: [
        'Sayla sees a lot of satsang and samaj gatherings, and those have a particular demand: hundreds of people seated for a long stretch, listening rather than moving. That puts the weight on shade, on seating that is comfortable for two hours, and on speech that stays clear at the back without being harsh at the front.',
        'We size the cover for the whole seated area rather than the stage end, and place delay towers when the length asks for them. If your programme runs across several days, tell us the daily timings as well as the total — how the ground is used between sessions changes the layout.',
      ],
      gu: [
        'સાયલામાં સત્સંગ અને સમાજના મેળાવડા ઘણા થાય છે, અને એની જરૂરિયાત ખાસ હોય છે: સેંકડો લોકો લાંબા સમય સુધી બેસીને સાંભળે, ફર્યા વગર. એટલે ભાર છાંયડા પર, બે કલાક આરામથી બેસાય એવી બેઠક પર, અને એવી વાણી પર જે પાછળ સ્પષ્ટ સંભળાય અને આગળ કઠે નહીં.',
        'અમે કવર સ્ટેજના છેડા પૂરતું નહીં, આખા બેઠક વિસ્તાર માટે ગોઠવીએ છીએ, અને લંબાઈ માંગે ત્યાં ડિલે ટાવર મૂકીએ છીએ. તમારો કાર્યક્રમ ઘણા દિવસ ચાલવાનો હોય તો કુલ સાથે રોજનો સમય પણ જણાવો — બે સત્ર વચ્ચે મેદાન કેવી રીતે વપરાય એ પ્રમાણે ગોઠવણ બદલાય છે.',
      ],
    },
    notes: {
      en: [
        'Shade over the whole seated area',
        'Delay towers when the length needs them',
        'Layout reset between daily sessions',
      ],
      gu: [
        'આખા બેઠક વિસ્તાર પર છાંયડો',
        'લંબાઈ માંગે ત્યાં ડિલે ટાવર',
        'રોજનાં સત્ર વચ્ચે ફેરગોઠવણ',
      ],
    },
  },
  {
    slug: 'thangadh',
    promise: {
      en: 'A working town — setups that fit around the working day.',
      gu: 'કામ કરતું શહેર — કામકાજના દિવસની આસપાસ ગોઠવાતું સેટઅપ.',
    },
    paragraphs: {
      en: [
        'Thangadh is a manufacturing town, and that shows in how functions run here: they fit around shifts, they often start later in the evening, and the ground is frequently shared with something else during the day. Our setup schedule works backwards from when the ground is actually free rather than from when it would be convenient for us.',
        'Factory and institutional functions — annual days, prize distributions, openings — usually have a fixed programme that the setup has to accommodate rather than the other way round. Send the running order with the enquiry and we will plan the build around it.',
      ],
      gu: [
        'થાનગઢ ઉદ્યોગનું શહેર છે, અને એ અહીંના પ્રસંગોમાં દેખાય છે: એ શિફ્ટની આસપાસ ગોઠવાય છે, ઘણી વાર સાંજે મોડા શરૂ થાય છે, અને દિવસ દરમિયાન મેદાન બીજા કામમાં પણ વપરાતું હોય છે. અમારું સેટઅપનું સમયપત્રક અમને ક્યારે ફાવે એના પરથી નહીં, મેદાન ખરેખર ક્યારે ખાલી થાય એના પરથી પાછળ ગણાય છે.',
        'ફેક્ટરી અને સંસ્થાના કાર્યક્રમો — વાર્ષિકોત્સવ, ઇનામ વિતરણ, ઉદ્ઘાટન — માં કાર્યક્રમ નક્કી હોય અને સેટઅપે એની આસપાસ ગોઠવાવું પડે, ઊલટું નહીં. પૂછપરછ સાથે કાર્યક્રમનો ક્રમ મોકલો, અમે એની આસપાસ બાંધકામ ગોઠવીશું.',
      ],
    },
    notes: {
      en: [
        'Build scheduled around when the ground is free',
        'Later evening starts planned for',
        'Fixed programmes accommodated, not overridden',
      ],
      gu: [
        'મેદાન ખાલી થાય એ પ્રમાણે બાંધકામનું સમયપત્રક',
        'સાંજે મોડી શરૂઆતનું આયોજન',
        'નક્કી કાર્યક્રમ પ્રમાણે ગોઠવણ',
      ],
    },
  },
  {
    slug: 'lakhtar',
    promise: {
      en: 'Village functions where the approach road decides the structure.',
      gu: 'ગામના પ્રસંગો — જ્યાં આવવાનો રસ્તો સ્ટ્રક્ચર નક્કી કરે છે.',
    },
    paragraphs: {
      en: [
        'Most of what we do around Lakhtar is on village ground, and there the decision that matters is made before any drawing: can a loaded truck get to the spot, and can it turn once it is there. A hanger that cannot be delivered is not an option however good it would look, so we settle access first and design second.',
        'Where the approach is tight, a traditional pandal often does the job at lower cost and in less time. We will say so rather than sell you the larger structure, and we will show you what each looks like on your ground before you decide.',
      ],
      gu: [
        'લખતરની આસપાસનું અમારું મોટા ભાગનું કામ ગામના મેદાનમાં હોય છે, અને ત્યાં મહત્ત્વનો નિર્ણય કોઈ નકશા પહેલાં જ લેવાય છે: ભરેલી ગાડી જગ્યા સુધી પહોંચી શકશે, અને પહોંચ્યા પછી ફરી શકશે? જે હેંગર પહોંચાડી જ ન શકાય એ ગમે તેટલું સુંદર હોય તોય વિકલ્પ નથી — એટલે અમે પહેલાં રસ્તો નક્કી કરીએ, પછી ડિઝાઇન.',
        'રસ્તો સાંકડો હોય ત્યાં પરંપરાગત પંડાલ ઘણી વાર ઓછા ખર્ચે અને ઓછા સમયમાં કામ કરી આપે છે. અમે મોટું સ્ટ્રક્ચર વેચવાને બદલે એ કહી દઈશું, અને નક્કી કરતાં પહેલાં તમારા મેદાનમાં બંને કેવાં લાગશે એ બતાવીશું.',
      ],
    },
    notes: {
      en: [
        'Truck access settled before the design',
        'Pandal recommended where a hanger will not fit',
        'Both options shown on your own ground',
      ],
      gu: [
        'ડિઝાઇન પહેલાં ગાડીનો રસ્તો નક્કી',
        'હેંગર ન સમાય ત્યાં પંડાલની ભલામણ',
        'તમારા મેદાનમાં બંને વિકલ્પ બતાવાય',
      ],
    },
  },
  {
    slug: 'muli',
    promise: {
      en: 'Temple and community programmes, set up without disturbing the routine.',
      gu: 'મંદિર અને સમાજના કાર્યક્રમો — રોજિંદા ક્રમને ખલેલ પહોંચાડ્યા વગર.',
    },
    paragraphs: {
      en: [
        'A good deal of our work around Muli is for temple trusts and community bodies, where the ground is already in daily use and the setup has to go up without stopping it. That means staging the build so the walkways stay open, keeping cabling off the paths people actually use, and finishing the noisy work before the evening.',
        'These programmes usually run to a fixed sequence, and the sound has to serve speech far more than music. We set the system for intelligibility first and add the rest around it.',
      ],
      gu: [
        'મૂળીની આસપાસનું અમારું ઘણું કામ મંદિર ટ્રસ્ટ અને સમાજની સંસ્થાઓ માટે હોય છે, જ્યાં મેદાન રોજ વપરાતું હોય અને એ બંધ કર્યા વગર સેટઅપ ઊભું કરવાનું હોય. એટલે બાંધકામ એ રીતે તબક્કાવાર થાય કે ચાલવાના રસ્તા ખુલ્લા રહે, કેબલ લોકો ખરેખર જ્યાં ચાલે છે ત્યાંથી દૂર રહે, અને અવાજવાળું કામ સાંજ પહેલાં પતી જાય.',
        'આ કાર્યક્રમો સામાન્ય રીતે નક્કી ક્રમમાં ચાલે છે, અને સાઉન્ડે સંગીત કરતાં વાણીની સેવા વધુ કરવાની હોય છે. અમે પહેલાં સ્પષ્ટતા માટે સિસ્ટમ ગોઠવીએ છીએ, બાકીનું એની આસપાસ ઉમેરીએ છીએ.',
      ],
    },
    notes: {
      en: [
        'Build staged so daily use continues',
        'Cabling kept off the paths in use',
        'Sound set for speech first',
      ],
      gu: [
        'રોજિંદો ઉપયોગ ચાલુ રહે એ રીતે તબક્કાવાર બાંધકામ',
        'વપરાતા રસ્તાથી દૂર કેબલિંગ',
        'પહેલાં વાણી માટે સાઉન્ડ',
      ],
    },
  },
  {
    slug: 'halvad',
    promise: {
      en: 'Further out, so the planning has to be tighter.',
      gu: 'થોડું દૂર — એટલે આયોજન વધુ ચોક્કસ.',
    },
    paragraphs: {
      en: [
        'Halvad is far enough from our base that a forgotten item is a real problem rather than a short drive, so we load against a written list and count it twice. The crew stays on site for the duration instead of travelling back and forth, which is factored into the quote rather than added afterwards.',
        'Open ground and strong afternoon sun are the two constants here. Cover and cooling are worth budgeting for from the start rather than treating as extras — mist fans along the sides usually do more for comfort per rupee than trying to cool the whole volume.',
      ],
      gu: [
        'હળવદ અમારા બેઝથી એટલું દૂર છે કે ભુલાયેલી કોઈ વસ્તુ થોડી ડ્રાઇવ નહીં પણ ખરી સમસ્યા બને. એટલે અમે લખેલી યાદી સામે લોડ કરીએ છીએ અને બે વાર ગણીએ છીએ. ટીમ આવ-જા કરવાને બદલે આખા સમય માટે સાઇટ પર રહે છે, અને એ ખર્ચ પછીથી ઉમેરાતો નથી, ક્વોટમાં જ ગણાયેલો હોય છે.',
        'ખુલ્લું મેદાન અને બપોરનો આકરો તડકો — અહીં આ બે વાત કાયમની છે. કવર અને કૂલિંગને વધારાનું ગણવાને બદલે શરૂઆતથી બજેટમાં રાખવાં સારાં — આખી જગ્યા ઠંડી કરવા કરતાં બાજુમાં મિસ્ટ ફેન મૂકવાથી ખર્ચ પ્રમાણે વધુ રાહત મળે છે.',
      ],
    },
    notes: {
      en: [
        'Loaded against a written list, counted twice',
        'Crew stays on site for the duration',
        'Cover and cooling budgeted from the start',
      ],
      gu: [
        'લખેલી યાદી સામે લોડિંગ, બે વાર ગણતરી',
        'ટીમ આખા સમય માટે સાઇટ પર',
        'શરૂઆતથી બજેટમાં કવર અને કૂલિંગ',
      ],
    },
  },
  {
    slug: 'patdi',
    promise: {
      en: 'Edge-of-the-Rann ground, where dust and wind are part of the plan.',
      gu: 'રણની કિનારીનું મેદાન — જ્યાં ધૂળ અને પવન આયોજનનો ભાગ છે.',
    },
    paragraphs: {
      en: [
        'Patdi sits towards the Little Rann, and the ground reflects it: flat, open and dusty, with wind that picks up in the afternoon. Flooring stops being a luxury there — carpet or ply over bare ground is the difference between a clean function and guests carrying dust to their tables.',
        'Structures need proper anchoring and side walls are worth having even when the forecast looks settled. We plan for the wind rather than hoping, because taking a cover down mid-function is not something anyone wants to watch.',
      ],
      gu: [
        'પાટડી નાના રણ તરફ છે, અને મેદાનમાં એ દેખાય છે: સપાટ, ખુલ્લું અને ધૂળિયું, અને બપોરે ઊપડતો પવન. ત્યાં ફ્લોરિંગ મોજશોખ મટી જાય છે — ખુલ્લી જમીન પર કાર્પેટ કે પ્લાય હોવું એ સ્વચ્છ પ્રસંગ અને ટેબલ સુધી ધૂળ લઈ જતા મહેમાનો વચ્ચેનો ફરક છે.',
        'સ્ટ્રક્ચરને બરાબર એન્કરિંગ જોઈએ, અને હવામાન શાંત લાગતું હોય તોય બાજુની દીવાલો રાખવી સારી. અમે આશા રાખવાને બદલે પવનનું આયોજન કરીએ છીએ — પ્રસંગ વચ્ચે કવર ઉતારવું પડે એ કોઈને જોવું ગમતું નથી.',
      ],
    },
    notes: {
      en: [
        'Flooring treated as essential, not an extra',
        'Side walls for wind even on a settled forecast',
        'Anchoring set for loose, flat ground',
      ],
      gu: [
        'ફ્લોરિંગ વધારાનું નહીં, જરૂરી',
        'હવામાન શાંત હોય તોય પવન માટે બાજુની દીવાલો',
        'પોચી, સપાટ જમીન પ્રમાણે એન્કરિંગ',
      ],
    },
  },
  {
    slug: 'chuda',
    promise: {
      en: 'Smaller functions, done properly rather than scaled down.',
      gu: 'નાના પ્રસંગો — ઘટાડીને નહીં, બરાબર કરેલા.',
    },
    paragraphs: {
      en: [
        'A lot of what happens around Chuda is at the smaller end: a vidhi for fifty, a besnu, a havan, a family satsang. Those get the same site visit and the same written quote as a five-thousand-guest samuh lagan, because the thing that goes wrong at a small function is exactly the thing that goes wrong at a large one — it just costs less to fix.',
        'Where a full hanger would be more than the occasion needs, we say so. A pandal, decent seating, a clean mandap and sound that carries is often the whole job, and quoting it honestly is how we would rather earn the next one.',
      ],
      gu: [
        'ચૂડાની આસપાસનું ઘણું કામ નાના પ્રસંગોનું હોય છે: પચાસ માણસની વિધિ, બેસણું, હવન, પરિવારનો સત્સંગ. એમને પણ પાંચ હજાર મહેમાનોના સમૂહ લગ્ન જેવી જ સાઇટ વિઝિટ અને એવો જ લેખિત ક્વોટ મળે છે — કારણ કે નાના પ્રસંગમાં જે બગડે છે એ જ મોટામાં પણ બગડે છે, ફક્ત સુધારવાનો ખર્ચ ઓછો હોય છે.',
        'જ્યાં આખું હેંગર પ્રસંગની જરૂરિયાત કરતાં વધારે હોય, અમે એ કહી દઈએ છીએ. પંડાલ, સારી બેઠક, સ્વચ્છ મંડપ અને પહોંચતો અવાજ — ઘણી વાર આટલું જ આખું કામ હોય છે, અને એનો પ્રામાણિક ભાવ આપીને જ અમે આગલું કામ મેળવવાનું પસંદ કરીએ છીએ.',
      ],
    },
    notes: {
      en: [
        'Same site visit and written quote at any size',
        'Told plainly when a hanger is more than you need',
        'Small functions crewed, not left to run themselves',
      ],
      gu: [
        'કોઈપણ માપે એ જ સાઇટ વિઝિટ અને લેખિત ક્વોટ',
        'હેંગર જરૂર કરતાં વધારે હોય તો સ્પષ્ટ કહેવાય',
        'નાના પ્રસંગોમાં પણ ટીમ હાજર',
      ],
    },
  },
];
