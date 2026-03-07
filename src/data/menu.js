// Menu data — source: penzana_menu_story_source_2026.md (owner-provided PDF, 2026)
// Prices in EUR. Descriptions marked TODO where source has no info.

export const MENU = [
  {
    id: 'classiche',
    labelIT: 'Classiche',
    labelEN: 'Classic Pizzas',
    items: [
      {
        id: 'margherita',
        nameIT: 'Margherita',
        nameEN: 'Margherita',
        price: 7.0,
        descIT: 'Pomodoro, fior di latte',
        descEN: 'Tomato sauce, mozzarella',
      },
      {
        id: 'marinara',
        nameIT: 'Marinara',
        nameEN: 'Marinara',
        price: 5.5,
        descIT: 'Pomodoro, aglio, origano, olio',
        descEN: 'Tomato sauce, garlic, oregano, olive oil',
      },
      {
        id: 'prosciutto',
        nameIT: 'Prosciutto',
        nameEN: 'Prosciutto',
        price: 8.5,
        descIT: 'Pomodoro, fior di latte, prosciutto cotto',
        descEN: 'Tomato sauce, mozzarella, cooked ham',
      },
      {
        id: '4formaggi',
        nameIT: '4 Formaggi',
        nameEN: '4 Cheeses',
        price: 9.0,
        descIT: 'Quattro formaggi selezionati // TODO: confirm varieties',
        descEN: 'Four selected cheeses // TODO: confirm varieties',
      },
      {
        id: '4stagioni',
        nameIT: '4 Stagioni',
        nameEN: '4 Seasons',
        price: 9.0,
        descIT: 'Pomodoro, mozzarella, prosciutto, funghi, carciofi, olive // TODO: confirm toppings',
        descEN: 'Tomato, mozzarella, ham, mushrooms, artichokes, olives // TODO: confirm toppings',
      },
    ],
  },
  {
    id: 'sfiziose',
    labelIT: 'Sfiziose',
    labelEN: 'Special Pizzas',
    items: [
      {
        id: 'amatriciana',
        nameIT: 'Amatriciana',
        nameEN: 'Amatriciana',
        price: 9.5,
        descIT: 'Pomodoro, guanciale, pecorino // TODO: confirm recipe',
        descEN: 'Tomato, pork cheek, pecorino // TODO: confirm recipe',
      },
      {
        id: 'donizetti',
        nameIT: 'Donizetti',
        nameEN: 'Donizetti',
        price: 9.5,
        descIT: '// TODO: confirm toppings',
        descEN: '// TODO: confirm toppings',
      },
      {
        id: 'merel',
        nameIT: 'Merel',
        nameEN: 'Merel (house special)',
        price: 9.0,
        descIT: 'La pizza della casa // TODO: confirm toppings',
        descEN: 'House special pizza // TODO: confirm toppings',
      },
      {
        id: 'paradiso',
        nameIT: 'Paradiso',
        nameEN: 'Paradise',
        price: 9.0,
        descIT: '// TODO: confirm toppings',
        descEN: '// TODO: confirm toppings',
      },
      {
        id: 'fruttimare',
        nameIT: 'Frutti di mare',
        nameEN: 'Seafood',
        price: 12.0,
        descIT: 'Pizza con frutti di mare freschi // TODO: confirm toppings',
        descEN: 'Pizza with fresh seafood // TODO: confirm toppings',
      },
    ],
  },
  {
    id: 'giocose',
    labelIT: 'Giocose',
    labelEN: 'Fun Pizzas',
    items: [
      {
        id: 'americana',
        nameIT: 'Americana',
        nameEN: 'Americana',
        price: 8.5,
        descIT: '// TODO: confirm toppings',
        descEN: '// TODO: confirm toppings',
      },
      {
        id: 'heidi',
        nameIT: 'Heidi',
        nameEN: 'Heidi',
        price: 9.0,
        descIT: '// TODO: confirm toppings',
        descEN: '// TODO: confirm toppings',
      },
      {
        id: 'peppa',
        nameIT: 'Peppa Pig',
        nameEN: 'Peppa Pig',
        price: 9.0,
        descIT: '// TODO: confirm toppings',
        descEN: '// TODO: confirm toppings',
      },
      {
        id: 'tomjerry',
        nameIT: 'Tom e Jerry',
        nameEN: 'Tom & Jerry',
        price: 9.0,
        descIT: '// TODO: confirm toppings',
        descEN: '// TODO: confirm toppings',
      },
    ],
  },
  {
    id: 'focacce',
    labelIT: 'Focacce',
    labelEN: 'Focaccia',
    items: [
      {
        id: 'focaccia-semplice',
        nameIT: 'Semplice',
        nameEN: 'Plain',
        price: 5.0,
        descIT: 'Focaccia bianca con olio e rosmarino',
        descEN: 'White focaccia with olive oil and rosemary',
      },
      {
        id: 'focaccia-porcini',
        nameIT: 'Porcini',
        nameEN: 'Porcini mushrooms',
        price: 9.0,
        descIT: 'Focaccia con funghi porcini // TODO: confirm toppings',
        descEN: 'Focaccia with porcini mushrooms // TODO: confirm toppings',
      },
      {
        id: 'focaccia-verdure',
        nameIT: 'Verdure',
        nameEN: 'Vegetables',
        price: 9.0,
        descIT: 'Focaccia con verdure di stagione // TODO: confirm toppings',
        descEN: 'Focaccia with seasonal vegetables // TODO: confirm toppings',
      },
      {
        id: 'focaccia-salmone',
        nameIT: 'Salmone',
        nameEN: 'Salmon',
        price: 12.0,
        descIT: 'Focaccia con salmone affumicato // TODO: confirm toppings',
        descEN: 'Focaccia with smoked salmon // TODO: confirm toppings',
      },
    ],
  },
];

// Helper: flat list of all items
export const ALL_ITEMS = MENU.flatMap(cat =>
  cat.items.map(item => ({ ...item, categoryId: cat.id }))
);
