// Menu data — source: Menu_2026.pdf (owner-provided, 2026)
// Prices in EUR. Structured as 3 top-level sections with subcategories.

export const COPERTO = 2.00;

// Section quotes from the PDF
export const SECTION_QUOTES = {
  pizzeria: { text: 'Se si fa in quattro per renderti felice, e una pizza', author: 'Anonimo' },
  cucina: { text: 'Uno non puo pensare bene, amare bene, dormire bene, se non ha mangiato bene', author: 'Virginia Woolf' },
  banco: { text: "C'e piu filosofia in una bottiglia di vino, che in tutti i libri del mondo!", author: 'E. Hemingway' },
};

export const MENU = {
  pizzeria: {
    id: 'pizzeria',
    labelIT: 'La Pizzeria',
    labelEN: 'The Pizzeria',
    categories: [
      {
        id: 'classiche',
        labelIT: 'Le Classiche',
        labelEN: 'Classic Pizzas',
        subtitleIT: 'I gusti piu classici, centenari, italiani.',
        subtitleEN: 'The most classic, timeless, Italian flavours.',
        items: [
          { id: '4formaggi', nameIT: '4 Formaggi', nameEN: '4 Cheeses', price: 9.0, descIT: 'Pelati, mozzarella, Gorgonzola, brie, grana e taleggio', descEN: 'Tomato, mozzarella, Gorgonzola, brie, grana & taleggio' },
          { id: '4stagioni', nameIT: '4 Stagioni', nameEN: '4 Seasons', price: 9.0, descIT: 'Pelati, mozzarella, prosciutto cotto, carciofi, funghi e olive', descEN: 'Tomato, mozzarella, cooked ham, artichokes, mushrooms & olives' },
          { id: 'caprese', nameIT: 'Caprese', nameEN: 'Caprese', price: 8.5, descIT: 'Pelati, mozzarella, pomodorini, origano e basilico', descEN: 'Tomato, mozzarella, cherry tomatoes, oregano & basil' },
          { id: 'capricciosa', nameIT: 'Capricciosa', nameEN: 'Capricciosa', price: 9.0, descIT: 'Pelati, mozzarella, prosciutto cotto, carciofi e funghi', descEN: 'Tomato, mozzarella, cooked ham, artichokes & mushrooms' },
          { id: 'diavola', nameIT: 'Diavola', nameEN: 'Diavola', price: 8.5, descIT: 'Pelati, mozzarella, salamino, peperoncino e acciughe', descEN: 'Tomato, mozzarella, spicy salami, chilli & anchovies' },
          { id: 'margherita', nameIT: 'Margherita', nameEN: 'Margherita', price: 7.0, descIT: 'Pelati e mozzarella', descEN: 'Tomato & mozzarella' },
          { id: 'marinara', nameIT: 'Marinara', nameEN: 'Marinara', price: 5.5, descIT: 'Pelati, olio, aglio e basilico', descEN: 'Tomato, olive oil, garlic & basil' },
          { id: 'napoli', nameIT: 'Napoli', nameEN: 'Napoli', price: 8.0, descIT: 'Pelati, mozzarella, acciughe, capperi, origano e basilico', descEN: 'Tomato, mozzarella, anchovies, capers, oregano & basil' },
          { id: 'prosciutto', nameIT: 'Prosciutto', nameEN: 'Prosciutto', price: 8.5, descIT: 'Pelati, mozzarella, prosciutto cotto', descEN: 'Tomato, mozzarella, cooked ham' },
          { id: 'romana', nameIT: 'Romana', nameEN: 'Romana', price: 8.5, descIT: 'Pelati, mozzarella, olive e origano', descEN: 'Tomato, mozzarella, olives & oregano' },
          { id: 'verdure', nameIT: 'Verdure', nameEN: 'Vegetables', price: 9.0, descIT: 'Pelati, mozzarella, melanzane, zucchine, pomodori, peperoni', descEN: 'Tomato, mozzarella, aubergine, courgette, tomatoes, peppers' },
        ],
      },
      {
        id: 'sfiziose',
        labelIT: 'Le Sfiziose',
        labelEN: 'Special Pizzas',
        subtitleIT: 'I gusti complessi, ricercati, per palati raffinati.',
        subtitleEN: 'Complex, refined flavours for discerning palates.',
        items: [
          { id: 'amatriciana', nameIT: 'Amatriciana', nameEN: 'Amatriciana', price: 9.5, descIT: 'Pelati, mozzarella, cipolle, grana e pancetta', descEN: 'Tomato, mozzarella, onions, grana & pancetta' },
          { id: 'asparagi-uovo', nameIT: 'Asparagi e Uovo', nameEN: 'Asparagus & Egg', price: 9.5, descIT: 'Pelati, mozzarella, asparagi e uovo', descEN: 'Tomato, mozzarella, asparagus & egg' },
          { id: 'donizetti', nameIT: 'Donizetti', nameEN: 'Donizetti', price: 9.5, descIT: 'Pelati, mozzarella, taleggio, polenta e pancetta', descEN: 'Tomato, mozzarella, taleggio, polenta & pancetta' },
          { id: 'fantasy', nameIT: 'Fantasy', nameEN: 'Fantasy', price: 9.5, descIT: "Pelati, mozzarella e l'ispirazione del pizzaiolo", descEN: "Tomato, mozzarella & the pizza maker's inspiration" },
          { id: 'fruttimare', nameIT: 'Frutti di Mare', nameEN: 'Seafood', price: 12.0, descIT: 'Pelati, mozzarella e frutti di mare misti', descEN: 'Tomato, mozzarella & mixed seafood' },
          { id: 'messicana', nameIT: 'Messicana', nameEN: 'Mexican', price: 9.0, descIT: 'Pelati, mozzarella, fagioli e pancetta', descEN: 'Tomato, mozzarella, beans & pancetta' },
          { id: 'merel', nameIT: 'Merel', nameEN: 'Merel (house special)', price: 9.0, descIT: 'Pelati, mozzarella, salame, tonno e carciofi', descEN: 'Tomato, mozzarella, salami, tuna & artichokes' },
          { id: 'paradiso', nameIT: 'Paradiso', nameEN: 'Paradise', price: 9.0, descIT: 'Mozzarella, mele e Gorgonzola', descEN: 'Mozzarella, apple & Gorgonzola' },
        ],
      },
      {
        id: 'giocose',
        labelIT: 'Le Giocose',
        labelEN: 'Fun Pizzas',
        subtitleIT: 'I gusti scherzosi, giovanili ma per tutte le eta.',
        subtitleEN: 'Playful flavours, youthful but for all ages.',
        items: [
          { id: 'americana', nameIT: 'Americana', nameEN: 'Americana', price: 8.5, descIT: 'Pelati, mozzarella, patatine e wurstel', descEN: 'Tomato, mozzarella, fries & frankfurter' },
          { id: 'biancaneve', nameIT: 'Biancaneve 7 Nani', nameEN: 'Snow White', price: 10.0, descIT: 'Mozzarella, prosciutto cotto, panna e porcini', descEN: 'Mozzarella, cooked ham, cream & porcini' },
          { id: 'braciodiferro', nameIT: 'Braccio di Ferro', nameEN: 'Popeye', price: 8.5, descIT: 'Pelati, mozzarella, spinaci e grana', descEN: 'Tomato, mozzarella, spinach & grana' },
          { id: 'cappuccettorosso', nameIT: 'Cappuccetto Rosso', nameEN: 'Little Red Riding Hood', price: 8.5, descIT: 'Pelati, mozzarella, pomodorini e prosciutto cotto', descEN: 'Tomato, mozzarella, cherry tomatoes & cooked ham' },
          { id: 'heidi', nameIT: 'Heidi', nameEN: 'Heidi', price: 9.0, descIT: 'Pelati, mozzarella, polenta, formagella nostrana e cotechino', descEN: 'Tomato, mozzarella, polenta, local formagella & cotechino' },
          { id: 'patatine', nameIT: 'Patatine', nameEN: 'Fries Pizza', price: 8.0, descIT: 'Pelati, mozzarella e patatine', descEN: 'Tomato, mozzarella & fries' },
          { id: 'peppa', nameIT: 'Peppa Pig', nameEN: 'Peppa Pig', price: 9.0, descIT: 'Pelati, mozzarella, salame, wurstel e prosciutto', descEN: 'Tomato, mozzarella, salami, frankfurter & ham' },
          { id: 'tomjerry', nameIT: 'Tom e Jerry', nameEN: 'Tom & Jerry', price: 9.0, descIT: 'Pelati, mozzarella, salsiccia e taleggio', descEN: 'Tomato, mozzarella, sausage & taleggio' },
        ],
      },
      {
        id: 'focacce',
        labelIT: 'Le Focacce',
        labelEN: 'Focaccia',
        subtitleIT: "I gusti in cui l'impasto e predominante e risalta singoli sapori.",
        subtitleEN: 'Where the dough takes centre stage and highlights individual flavours.',
        items: [
          { id: 'focaccia-porcini', nameIT: 'Focaccia ai Porcini', nameEN: 'Porcini Focaccia', price: 9.0, descIT: 'Olio extravergine, grana, origano e porcini', descEN: 'Extra virgin olive oil, grana, oregano & porcini' },
          { id: 'focaccia-semplice', nameIT: 'Focaccia Semplice', nameEN: 'Plain Focaccia', price: 5.0, descIT: 'Olio extravergine, grana e origano', descEN: 'Extra virgin olive oil, grana & oregano' },
          { id: 'focaccia-salmone', nameIT: 'Focaccia con Salmone', nameEN: 'Salmon Focaccia', price: 12.0, descIT: 'Olio extravergine, grana, origano e salmone', descEN: 'Extra virgin olive oil, grana, oregano & salmon' },
          { id: 'focaccia-verdure', nameIT: 'Focaccia alle Verdure', nameEN: 'Vegetable Focaccia', price: 9.0, descIT: 'Olio extravergine, grana, origano e verdure miste', descEN: 'Extra virgin olive oil, grana, oregano & mixed vegetables' },
        ],
      },
    ],
  },
  cucina: {
    id: 'cucina',
    labelIT: 'La Cucina',
    labelEN: 'The Kitchen',
    categories: [
      {
        id: 'antipasti',
        labelIT: 'Gli Antipasti',
        labelEN: 'Starters',
        subtitleIT: '',
        subtitleEN: '',
        items: [
          { id: 'antipasto-mare', nameIT: 'Antipasto di mare su letto di pure', nameEN: 'Seafood starter on mashed potato', price: 15.0, descIT: '', descEN: '' },
          { id: 'bresaola', nameIT: 'Bresaola con rucola e grana a scaglie', nameEN: 'Bresaola with rocket & grana shavings', price: 10.0, descIT: '', descEN: '' },
          { id: 'gamberetti', nameIT: 'Gamberetti in salsa rosa', nameEN: 'Prawns in cocktail sauce', price: 10.0, descIT: '', descEN: '' },
          { id: 'tagliere-formaggi', nameIT: 'Tagliere misto di formaggi', nameEN: 'Mixed cheese board', price: 8.0, descIT: '', descEN: '' },
          { id: 'tagliere-affettati', nameIT: 'Tagliere misto di affettati', nameEN: 'Mixed charcuterie board', price: 10.0, descIT: '', descEN: '' },
        ],
      },
      {
        id: 'primi',
        labelIT: 'I Primi',
        labelEN: 'First Courses',
        subtitleIT: 'Dai casoncelli alle foiade, tutto fatto in casa nel nostro laboratorio della farina.',
        subtitleEN: 'From casoncelli to foiade, everything is homemade in our flour workshop.',
        items: [
          { id: 'casoncelli', nameIT: 'Casoncelli caserecci con pancetta', nameEN: 'Homemade casoncelli with pancetta', price: 12.0, descIT: '', descEN: '' },
          { id: 'foiade', nameIT: 'Foiade panna e porcini', nameEN: 'Foiade with cream & porcini', price: 10.0, descIT: '', descEN: '' },
          { id: 'gnocchi', nameIT: 'Gnocchi di patate ai quattro formaggi', nameEN: 'Potato gnocchi with four cheeses', price: 10.0, descIT: '', descEN: '' },
          { id: 'spaghetti-ragu', nameIT: 'Spaghetti al ragu', nameEN: 'Spaghetti with ragu', price: 9.0, descIT: '', descEN: '' },
          { id: 'risotto-pescatora', nameIT: 'Risotto alla pescatora', nameEN: 'Seafood risotto', price: 14.0, descIT: '', descEN: '' },
          { id: 'risotto-porcini', nameIT: 'Risotto ai funghi porcini', nameEN: 'Porcini mushroom risotto', price: 12.0, descIT: '', descEN: '' },
        ],
      },
      {
        id: 'secondi',
        labelIT: 'I Secondi',
        labelEN: 'Main Courses',
        subtitleIT: 'Carne pregiata e pesce fresco, cotti su brace di faggio.',
        subtitleEN: 'Premium meat and fresh fish, cooked on beechwood embers.',
        items: [
          { id: 'strinu', nameIT: 'Strinu bergamasco con polenta e formagella', nameEN: 'Bergamo strinu with polenta & formagella', price: 15.0, descIT: '', descEN: '' },
          { id: 'branzino', nameIT: 'Filetto di branzino alla griglia', nameEN: 'Grilled sea bass fillet', price: 16.0, descIT: '', descEN: '' },
          { id: 'frittura-mista', nameIT: 'Frittura mista di pesce e verdurine', nameEN: 'Mixed fried fish & vegetables', price: 18.0, descIT: '', descEN: '' },
          { id: 'grigliata', nameIT: 'Grigliata mista di carne con polenta', nameEN: 'Mixed meat grill with polenta', price: 19.0, descIT: '', descEN: '' },
          { id: 'tagliata', nameIT: 'Tagliata con rucola, grana e crema balsamica', nameEN: 'Sliced steak with rocket, grana & balsamic', price: 19.0, descIT: '', descEN: '' },
          { id: 'polenta-porcini', nameIT: 'Polenta con porcini e zola', nameEN: 'Polenta with porcini & gorgonzola', price: 10.0, descIT: '', descEN: '' },
        ],
      },
      {
        id: 'contorni',
        labelIT: 'I Contorni',
        labelEN: 'Sides',
        subtitleIT: '',
        subtitleEN: '',
        items: [
          { id: 'patatine-fritte', nameIT: 'Patatine fritte', nameEN: 'French fries', price: 5.0, descIT: '', descEN: '' },
          { id: 'formagella-brace', nameIT: 'Formagella alla brace con polenta', nameEN: 'Grilled formagella with polenta', price: 7.0, descIT: '', descEN: '' },
          { id: 'pomodorini-gratinati', nameIT: 'Pomodorini gratinati al forno', nameEN: 'Oven-baked gratinated tomatoes', price: 4.5, descIT: '', descEN: '' },
          { id: 'insalata-mista', nameIT: 'Insalata mista con noci', nameEN: 'Mixed salad with walnuts', price: 5.0, descIT: '', descEN: '' },
          { id: 'verdure-grigliate', nameIT: 'Verdure miste grigliate', nameEN: 'Mixed grilled vegetables', price: 5.0, descIT: '', descEN: '' },
        ],
      },
      {
        id: 'dolci',
        labelIT: 'I Dolci',
        labelEN: 'Desserts',
        subtitleIT: 'I nostri dolci, perche il mangiar abbia anche un lieto fine.',
        subtitleEN: 'Our desserts, because every meal deserves a happy ending.',
        items: [
          { id: 'coppa-gelato', nameIT: 'Coppa di gelato mista', nameEN: 'Mixed ice cream cup', price: 5.0, descIT: '', descEN: '' },
          { id: 'torta-giorno', nameIT: 'Fetta di torta casereccia del giorno', nameEN: 'Slice of homemade cake of the day', price: 6.0, descIT: '', descEN: '' },
          { id: 'fragole-vino', nameIT: 'Fragole fresche in vino rosso e zucchero', nameEN: 'Fresh strawberries in red wine & sugar', price: 6.0, descIT: '', descEN: '' },
          { id: 'gelato-frutti', nameIT: 'Gelato in mare di frutti di bosco caldi', nameEN: 'Ice cream in warm wild berry sauce', price: 6.0, descIT: '', descEN: '' },
          { id: 'meringata', nameIT: 'Meringata al forno e Grand Marnier', nameEN: 'Baked meringue with Grand Marnier', price: 6.5, descIT: '', descEN: '' },
          { id: 'pizza-nutella', nameIT: 'Pizza con Nutella', nameEN: 'Nutella pizza', price: 6.5, descIT: '', descEN: '' },
          { id: 'sorbetto', nameIT: 'Sorbetto al limone', nameEN: 'Lemon sorbet', price: 5.0, descIT: '', descEN: '' },
          { id: 'tartufo', nameIT: 'Tartufo affogato whisky', nameEN: 'Whisky-drowned tartufo', price: 6.5, descIT: '', descEN: '' },
          { id: 'tiramisu', nameIT: 'Tiramisu casereccio', nameEN: 'Homemade tiramisu', price: 6.0, descIT: '', descEN: '' },
        ],
      },
    ],
  },
  banco: {
    id: 'banco',
    labelIT: 'Il Banco',
    labelEN: 'The Bar',
    categories: [
      {
        id: 'bibite',
        labelIT: 'Le Bibite',
        labelEN: 'Drinks',
        subtitleIT: '',
        subtitleEN: '',
        items: [
          { id: 'acqua', nameIT: 'Acqua oligominerale', nameEN: 'Mineral water', price: 1.5, sizes: [{ labelIT: '0,5 L', labelEN: '0.5L', price: 1.5 }, { labelIT: '1 L', labelEN: '1L', price: 3.0 }], descIT: '', descEN: '' },
          { id: 'bibita-lattina', nameIT: 'Bibita in lattina', nameEN: 'Canned drink', price: 3.0, descIT: 'Aranciata, Coca-Cola, Sprite, te', descEN: 'Orangeade, Coca-Cola, Sprite, tea' },
          { id: 'birra-bionda', nameIT: 'Birra bionda alla spina', nameEN: 'Draught lager', price: 3.5, sizes: [{ labelIT: 'Piccola 0,3L', labelEN: 'Small 0.3L', price: 3.5 }, { labelIT: 'Media 0,5L', labelEN: 'Medium 0.5L', price: 5.5 }], descIT: '', descEN: '' },
          { id: 'birra-panache', nameIT: 'Birra panache', nameEN: 'Shandy', price: 3.0, sizes: [{ labelIT: 'Piccola 0,3L', labelEN: 'Small 0.3L', price: 3.0 }, { labelIT: 'Media 0,5L', labelEN: 'Medium 0.5L', price: 5.0 }], descIT: '', descEN: '' },
          { id: 'birra-rossa', nameIT: 'Birra rossa alla spina', nameEN: 'Draught red ale', price: 4.0, sizes: [{ labelIT: 'Piccola 0,3L', labelEN: 'Small 0.3L', price: 4.0 }, { labelIT: 'Media 0,5L', labelEN: 'Medium 0.5L', price: 6.0 }], descIT: '', descEN: '' },
        ],
      },
      {
        id: 'caffetteria',
        labelIT: 'La Caffetteria',
        labelEN: 'Coffee & Spirits',
        subtitleIT: '',
        subtitleEN: '',
        items: [
          { id: 'amaro', nameIT: 'Amaro', nameEN: 'Amaro', price: 4.0, descIT: '', descEN: '', noCustomize: true },
          { id: 'caffe', nameIT: 'Caffe', nameEN: 'Coffee', price: 1.4, sizes: [{ labelIT: 'Espresso', labelEN: 'Espresso', price: 1.4 }, { labelIT: 'Macchiato / Orzo', labelEN: 'Macchiato / Barley', price: 1.6 }], descIT: 'Liscio, macchiato, decaffeinato, orzo', descEN: 'Espresso, macchiato, decaf, barley' },
          { id: 'caffe-corretto', nameIT: 'Caffe corretto', nameEN: 'Corrected coffee', price: 2.0, descIT: '', descEN: '', noCustomize: true },
          { id: 'grappe', nameIT: 'Grappe', nameEN: 'Grappa', price: 4.0, sizes: [{ labelIT: 'Morbida', labelEN: 'Smooth', price: 4.0 }, { labelIT: 'Barricata', labelEN: 'Barrel-aged', price: 4.5 }], descIT: '', descEN: '', noCustomize: true },
        ],
      },
      {
        id: 'vini-rossi',
        labelIT: 'Vini Rossi',
        labelEN: 'Red Wines',
        subtitleIT: '',
        subtitleEN: '',
        items: [
          { id: 'merlot-spina', nameIT: 'Merlot alla spina', nameEN: 'Draught Merlot', price: 3.5, sizes: [{ labelIT: 'Bicchiere', labelEN: 'Glass', price: 3.5 }, { labelIT: '1/2 Litro', labelEN: '1/2 Litre', price: 7.0 }, { labelIT: 'Litro', labelEN: 'Litre', price: 12.0 }], descIT: '', descEN: '', noCustomize: true },
          { id: 'chianti-gallonero', nameIT: 'Chianti Classico Gallonero', nameEN: 'Chianti Classico Gallonero', price: 22.0, descIT: '', descEN: '', noCustomize: true },
          { id: 'chianti-arizzi', nameIT: 'Chianti Arizzi Wine', nameEN: 'Chianti Arizzi Wine', price: 22.0, descIT: '', descEN: '', noCustomize: true },
          { id: 'rosso-montalcino', nameIT: 'Rosso di Montalcino Banfi', nameEN: 'Rosso di Montalcino Banfi', price: 30.0, descIT: '', descEN: '', noCustomize: true },
          { id: 'morellino', nameIT: 'Morellino Pradella', nameEN: 'Morellino Pradella', price: 20.0, descIT: '', descEN: '', noCustomize: true },
          { id: 'santa-cristina', nameIT: 'Santa Cristina 1/2 litro', nameEN: 'Santa Cristina 1/2 litre', price: 12.0, descIT: '', descEN: '', noCustomize: true },
          { id: 'valcalepio', nameIT: 'Valcalepio Caffi', nameEN: 'Valcalepio Caffi', price: 20.0, descIT: '', descEN: '', noCustomize: true },
        ],
      },
      {
        id: 'vini-bianchi',
        labelIT: 'Vini Bianchi',
        labelEN: 'White Wines',
        subtitleIT: '',
        subtitleEN: '',
        items: [
          { id: 'verduzzo-spina', nameIT: 'Verduzzo alla spina', nameEN: 'Draught Verduzzo', price: 3.5, sizes: [{ labelIT: 'Bicchiere', labelEN: 'Glass', price: 3.5 }, { labelIT: '1/2 Litro', labelEN: '1/2 Litre', price: 7.0 }, { labelIT: 'Litro', labelEN: 'Litre', price: 12.0 }], descIT: '', descEN: '', noCustomize: true },
          { id: 'pinot-grigio', nameIT: 'Pinot Grigio Santa Margherita', nameEN: 'Pinot Grigio Santa Margherita', price: 22.0, descIT: '', descEN: '', noCustomize: true },
          { id: 'muller-thurgau', nameIT: 'Muller Thurgau', nameEN: 'Muller Thurgau', price: 22.0, descIT: '', descEN: '', noCustomize: true },
          { id: 'verdicchio', nameIT: 'Verdicchio Fazi Battaglia', nameEN: 'Verdicchio Fazi Battaglia', price: 22.0, descIT: '', descEN: '', noCustomize: true },
          { id: 'lugana', nameIT: 'Lugana', nameEN: 'Lugana', price: 22.0, descIT: '', descEN: '', noCustomize: true },
          { id: 'ferrari-brut', nameIT: 'Ferrari Spumante Brut', nameEN: 'Ferrari Spumante Brut', price: 30.0, descIT: '', descEN: '', noCustomize: true },
        ],
      },
    ],
  },
};

// Helper: flat list of all items across all sections
export const ALL_ITEMS = Object.values(MENU).flatMap(section =>
  section.categories.flatMap(cat =>
    cat.items.map(item => ({ ...item, sectionId: section.id, categoryId: cat.id }))
  )
);

// Helper: all sections as array
export const SECTIONS = Object.values(MENU);
