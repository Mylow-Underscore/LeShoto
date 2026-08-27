export const COLORS = {
  black: "#0A0A0F",
  deepInk: "#12121A",
  panel: "#1A1A26",
  accent: "#FF66C4",
  gold: "#F0C040",
  white: "#F5F0FF",
  muted: "#8B88A8",
  border: "#2A2A40",
};

export const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Concept", href: "#concept" },
  { label: "Boissons", href: "#menu" },
  { label: "Univers", href: "#univers" },
  { label: "Infos", href: "#infos" },
];

export const MENU_ITEMS = [
  { cat: "Boissons Chaudes", items: [
    { name: "Espresso", price: "1,70€", desc: "Ristretto, court ou allongé" },
    { name: "Café allongé", price: "2,00€", desc: "Extraction douce, saveur équilibrée" },
    { name: "Café Double", price: "2,20€", desc: "Double shot d'espresso intense" },
    { name: "Latté", price: "4,00€", desc: "Espresso & lait chaud velouté" },
    { name: "Cappuccino", price: "3,80€", desc: "Espresso, lait & mousse crémeuse" },
    { name: "Thé, Infusion", price: "3,00€", desc: "Sélection de thés et infusions au choix" },
    { name: "Chocolat", price: "4,00€", desc: "Chocolat chaud riche & gourmand" },
    { name: "Supplément Lait ou Chantilly", price: "+0,50€", desc: "Ajout de chantilly sur vos boissons" },
  ]},
  { cat: "Boissons Froides", items: [
    { name: "Soda", price: "1,50€", desc: "Classique & rafraîchissant" },
    { name: "Bouteille d'Eau", price: "1,00€", desc: "Eau minérale fraîche" },
    { name: "Eau Pétillante", price: "1,80€", desc: "Eau gazeuse légère & pétillante" },
    { name: "Matcha", price: "4,00€", desc: "Boisson à base de poudre de matcha" },
    { name: "Ramune", price: "4,00€", desc: "Boisson pétillante japonaise" },
    { name: "Petit Slushi(Granité)", price: "2,50€", desc: "Granité rafraîchissant" },
    { name: "Moyen Slushi(Granité)", price: "3,50€", desc: "Granité rafraîchissant" },
    { name: "Grand Slushi(Granité)", price: "4,00€", desc: "Granité rafraîchissant" },
  ]},
  { cat: "Snacks", items: [
    { name: "Pocky", price: "3,80€", desc: "Bâtonnets chocolatés japonais, croquants et partagés" },
    { name: "Mochi", price: "4,00€", desc: "Douceur moelleuse au cœur fondant, saveurs variées" },
    { name: "Mini KitKat", price: "1,00€", desc: "Petit plaisir croustillant, parfait avec un café" },
    { name: "Barres Chocolat", price: "1,50€", desc: "Assortiment de tablettes gourmandes, intense et onctueux" },
  ]},
];

export const UNIVERS_PANELS_DATA = [
  { num: "01", title: "Bibliothèque", sub: "Manga", text: "2000+ volumes. Shonen, shojo, seinen, josei. Chaque genre a son étagère. Tu lis, on recharge.", bg: "linear-gradient(160deg, #12030a 0%, #310a25 100%)", accent: "#a14f7e" },
  { num: "02", title: "Espace", sub: "Café", text: "Tables, canapés, chaises cosy. Étagères remplies de lecture. L'endroit idéal pour une longue session.", bg: "linear-gradient(160deg, #0a0a1a 0%, #0d102a 100%)", accent: "#5B8EFF" },
  { num: "03", title: "Events", sub: "& Collabs", text: "Un anime à l'honneur chaque mois. Déco, boisson signature, cosplay. Le Shoto vit au rythme des saisons.", bg: "linear-gradient(160deg, #2a0a2a 0%, #7c1d72 100%)", accent: "#C58CFF" },
];

export const POINTS_BON = 1000;
export const VALEUR_BON = 10;