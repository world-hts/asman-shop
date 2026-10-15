export type Language = "tk" | "ru" | "en";

export const languages: { code: Language; label: string }[] = [
  { code: "tk", label: "TK" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

export type Copy = {
  search: string;
  searchShort: string;
  categories: string;
  featured: string;
  allProducts: string;
  stock: string;
  inStock: string;
  lowStock: string;
  soldOut: string;
  viewAll: string;
  discover: string;
  call: string;
  store: string;
  home: string;
  product: string;
  price: string;
  description: string;
  back: string;
  phone: string;
  electronics: string;
  phones: string;
  accessories: string;
  audio: string;
  watches: string;
  charging: string;
  laptops: string;
  heroTitle: string;
  heroSubtitle: string;
  heroButton: string;
  footerNote: string;
  clear: string;
  mobileNavigation: string;
  noResults: string;
  noProducts: string;
  productsCount: string;
  loading: string;
  notFoundTitle: string;
  notFoundDescription: string;
  errorTitle: string;
  errorDescription: string;
  retry: string;
  homeButton: string;
};

export const copy: Record<Language, Copy> = {
  tk: {
    search: "Önüm gözle",
    searchShort: "Önüm gözle...",
    categories: "Kategoriýalar",
    featured: "Saýlanan önümler",
    allProducts: "Ähli önümler",
    stock: "Stok",
    inStock: "Stokda bar",
    lowStock: "Az galdy",
    soldOut: "Tükenendir",
    viewAll: "Ählisini gör",
    discover: "Saýla",
    call: "Jaň et",
    store: "Dükan",
    home: "Baş sahypa",
    product: "Önüm",
    price: "Baha",
    description: "Düşündiriş",
    back: "Yza",
    phone: "Telefon",
    electronics: "Elektronika",
    phones: "Telefonlar",
    accessories: "Aksessuarlar",
    audio: "Ses enjamlary",
    watches: "Akylly sagatlar",
    charging: "Zarýad",
    laptops: "Noutbuklar",
    heroTitle: "Gündelik tehnologiýa, sada saýlaw.",
    heroSubtitle: "Telefonlar, aksessuarlar we elektronika — bir ýerde.",
    heroButton: "Önümleri gör",
    footerNote: "Siziň gündelik tehnologiýa dükanyňyz.",
    clear: "Arassala",
    mobileNavigation: "Jübi nawigasiýasy",
    noResults: "Önüm tapylmady",
    noProducts: "Häzirlikçe önüm ýok",
    productsCount: "önüm",
    loading: "Ýüklenýär...",
    notFoundTitle: "Önüm tapylmady",
    notFoundDescription: "Gözleýän önümiňiz katalogda ýok ýa-da wagtlaýyn aýryldy.",
    errorTitle: "Bir näsazlyk boldy",
    errorDescription: "Sahypany täzeden açyp görüň. Problem dowam etse, dükan bilen habarlaşyň.",
    retry: "Gaýtadan synanyş",
    homeButton: "Baş sahypa",
  },
  ru: {
    search: "Найти товар",
    searchShort: "Найти товар...",
    categories: "Категории",
    featured: "Избранные товары",
    allProducts: "Все товары",
    stock: "В наличии",
    inStock: "В наличии",
    lowStock: "Мало осталось",
    soldOut: "Нет в наличии",
    viewAll: "Смотреть все",
    discover: "Выбрать",
    call: "Позвонить",
    store: "Магазин",
    home: "Главная",
    product: "Товар",
    price: "Цена",
    description: "Описание",
    back: "Назад",
    phone: "Телефон",
    electronics: "Электроника",
    phones: "Телефоны",
    accessories: "Аксессуары",
    audio: "Аудио",
    watches: "Смарт-часы",
    charging: "Зарядка",
    laptops: "Ноутбуки",
    heroTitle: "Технологии на каждый день. Просто.",
    heroSubtitle: "Телефоны, аксессуары и электроника — в одном месте.",
    heroButton: "Смотреть товары",
    footerNote: "Ваш магазин повседневных технологий.",
    clear: "Очистить",
    mobileNavigation: "Мобильная навигация",
    noResults: "Товары не найдены",
    noProducts: "Пока нет товаров",
    productsCount: "товар",
    loading: "Загрузка...",
    notFoundTitle: "Товар не найден",
    notFoundDescription: "Искомого товара нет в каталоге или он временно снят с продажи.",
    errorTitle: "Произошла ошибка",
    errorDescription: "Откройте страницу ещё раз. Если проблема сохраняется, свяжитесь с магазином.",
    retry: "Повторить",
    homeButton: "На главную",
  },
  en: {
    search: "Find a product",
    searchShort: "Find a product...",
    categories: "Categories",
    featured: "Featured products",
    allProducts: "All products",
    stock: "Stock",
    inStock: "In stock",
    lowStock: "Low stock",
    soldOut: "Sold out",
    viewAll: "View all",
    discover: "Explore",
    call: "Call",
    store: "Store",
    home: "Home",
    product: "Product",
    price: "Price",
    description: "Description",
    back: "Back",
    phone: "Phone",
    electronics: "Electronics",
    phones: "Phones",
    accessories: "Accessories",
    audio: "Audio",
    watches: "Smart watches",
    charging: "Charging",
    laptops: "Laptops",
    heroTitle: "Everyday technology, simple choices.",
    heroSubtitle: "Phones, accessories and electronics — all in one place.",
    heroButton: "Explore products",
    footerNote: "Your everyday technology store.",
    clear: "Clear",
    mobileNavigation: "Mobile navigation",
    noResults: "No products found",
    noProducts: "No products yet",
    productsCount: "products",
    loading: "Loading...",
    notFoundTitle: "Product not found",
    notFoundDescription: "The product you are looking for is not in the catalog or was temporarily removed.",
    errorTitle: "Something went wrong",
    errorDescription: "Please open the page again. If the problem continues, contact the store.",
    retry: "Try again",
    homeButton: "Home",
  },
};

export function formatPrice(value: number, currency: string, _language: Language) {
  // Keep price markup deterministic between SSR and the browser. Intl locale
  // formatting can use different ICU data/separators on the server and client,
  // which causes a hydration mismatch (for example, NBSP vs '.').
  const normalized = Number.isFinite(value) ? value : 0;
  const fixed = normalized.toFixed(2).replace(/\.?0+$/, "");
  const [integerPart, fractionPart] = fixed.split(".");
  const sign = integerPart.startsWith("-") ? "-" : "";
  const digits = sign ? integerPart.slice(1) : integerPart;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}${grouped}${fractionPart ? `,${fractionPart}` : ""} ${currency}`;
}
