import * as Icons from "phosphor-react-native";

export const transactionType = [
  { label: "Renda", value: "income" },
  { label: "Despesa", value: "expense" },
];

export const ICON_CATALOG = {
  "Essenciais & Casa": [
    { name: "House", comp: Icons.HouseIcon, displayName: "Casa" },
    { name: "Lightbulb", comp: Icons.LightbulbIcon, displayName: "Luz" },
    { name: "Drop", comp: Icons.DropIcon, displayName: "Água" },
    { name: "WifiHigh", comp: Icons.WifiHighIcon, displayName: "Internet" },
    { name: "ShieldCheck", comp: Icons.ShieldCheckIcon, displayName: "Seguro" },
    { name: "Hammer", comp: Icons.Hammer, displayName: "Reparos" },
  ],
  Alimentação: [
    { name: "ForkKnife", comp: Icons.ForkKnife, displayName: "Restaurante" },
    { name: "ShoppingCart", comp: Icons.ShoppingCart, displayName: "Mercado" },
    { name: "Coffee", comp: Icons.Coffee, displayName: "Café" },
    { name: "Pizza", comp: Icons.Pizza, displayName: "Lanche" },
    { name: "BeerBottle", comp: Icons.BeerBottle, displayName: "Bebidas" },
    { name: "Hamburger", comp: Icons.Hamburger, displayName: "Fast Food" },
  ],
  Transporte: [
    { name: "Car", comp: Icons.Car, displayName: "Carro" },
    { name: "Bus", comp: Icons.Bus, displayName: "Autocarro" },
    { name: "GasPump", comp: Icons.GasPump, displayName: "Combustível" },
    { name: "Taxi", comp: Icons.Taxi, displayName: "Táxi/Uber" },
    { name: "Bicycle", comp: Icons.Bicycle, displayName: "Bicicleta" },
    { name: "Airplane", comp: Icons.Airplane, displayName: "Viagem" },
  ],
  "Saúde & Bem-estar": [
    { name: "Heartbeat", comp: Icons.Heartbeat, displayName: "Saúde" },
    { name: "FirstAid", comp: Icons.FirstAid, displayName: "Emergência" },
    { name: "Pill", comp: Icons.Pill, displayName: "Farmácia" },
    { name: "Barbell", comp: Icons.Barbell, displayName: "Ginásio" },
    { name: "Tooth", comp: Icons.Tooth, displayName: "Dentista" },
  ],
  "Lazer & Compras": [
    {
      name: "GameController",
      comp: Icons.GameController,
      displayName: "Jogos",
    },
    { name: "MusicNotes", comp: Icons.MusicNotes, displayName: "Música" },
    { name: "Ticket", comp: Icons.Ticket, displayName: "Cinema" },
    { name: "Tshirt", comp: Icons.TShirtIcon, displayName: "Roupas" },
    { name: "Gift", comp: Icons.Gift, displayName: "Presente" },
    { name: "Camera", comp: Icons.Camera, displayName: "Lazer" },
  ],
  "Educação & Trabalho": [
    { name: "Book", comp: Icons.Book, displayName: "Educação" },
    { name: "GraduationCap", comp: Icons.GraduationCap, displayName: "Cursos" },
    { name: "Briefcase", comp: Icons.Briefcase, displayName: "Trabalho" },
    { name: "Laptop", comp: Icons.Laptop, displayName: "Tecnologia" },
    { name: "TrendUp", comp: Icons.TrendUp, displayName: "Investimento" },
  ],
  "Família & Pets": [
    { name: "Users", comp: Icons.Users, displayName: "Família" },
    { name: "Baby", comp: Icons.Baby, displayName: "Bebé" },
    { name: "PawPrint", comp: Icons.PawPrint, displayName: "Animais" },
  ],
};

export const INCOME_CATALOG = {
  "Rendas Principais": [
    { name: "Wallet", comp: Icons.Wallet, displayName: "Salário" },
    { name: "Briefcase", comp: Icons.Briefcase, displayName: "Trabalho Extra" },
    { name: "ChartLineUp", comp: Icons.ChartLineUp, displayName: "Bónus" },
    { name: "HandCoins", comp: Icons.HandCoins, displayName: "Comissão" },
  ],
  "Investimentos & Ganhos": [
    { name: "TrendUp", comp: Icons.TrendUp, displayName: "Investimentos" },
    { name: "Bank", comp: Icons.Bank, displayName: "Dividendos" },
    { name: "Coins", comp: Icons.Coins, displayName: "Juros" },
    { name: "PiggyBank", comp: Icons.PiggyBank, displayName: "Poupança" },
  ],
  "Outras Fontes": [
    { name: "Gift", comp: Icons.Gift, displayName: "Presente" },
    { name: "Storefront", comp: Icons.Storefront, displayName: "Vendas" },
    { name: "Money", comp: Icons.Money, displayName: "Reembolso" },
    {
      name: "ArrowsLeftRight",
      comp: Icons.ArrowsLeftRight,
      displayName: "Transferência",
    },
    { name: "Star", comp: Icons.Star, displayName: "Prémio" },
  ],
};

const CATEGORY_COLORS: { [key: string]: string } = {
  Alimentação: "#FF9500", // Laranja
  Transporte: "#007AFF", // Azul
  Saúde: "#FF3B30", // Vermelho
  Lazer: "#AF52DE", // Roxo
  Educação: "#5856D6", // Índigo
  Casa: "#34C759", // Verde
  Salário: "#34C759", // Verde (Renda)
  Investimento: "#00C7BE", // Turquesa
  Outros: "#8E8E93", // Cinza
};

export const getRandomColor = (category: string) => {
  return CATEGORY_COLORS[category] || "#575757"; // Cor padrão caso não exista no mapa
};

// Define o tipo de um item de ícone individual
type IconItem = {
  name: string;
  comp: Icons.Icon;
  displayName: string;
};

export const findCategoryInCatalog = (
  name: string,
  type: "income" | "expense",
) => {
  const catalog = type === "income" ? INCOME_CATALOG : ICON_CATALOG;

  // Transformamos o objeto de categorias num array plano de itens
  const allItems = Object.values(catalog).flat();

  // PROCURA PELO displayName (que é o que você salva no DB)
  const found = allItems.find((item) => item.displayName === name);

  if (found) {
    return found;
  }

  // Fallback caso não encontre (Ícone de interrogação ou Tag)
  return {
    name: "Question",
    comp: type === "income" ? Icons.TrendUp : Icons.Tag,
    displayName: "Outros",
  };
};
