"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import type { Session, User } from "@supabase/supabase-js";
import { Icon } from "./icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Product } from "@/lib/data";
import { categoryLabel } from "@/lib/data";
import { copy, formatPrice, type Language } from "@/lib/i18n";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { categoryOptions, iconForCategory, slugify } from "@/lib/admin";
import { getProductStoragePath, isSafePublicImageUrl, normalizePhoneHref } from "@/lib/site";
import { useLanguagePreference } from "@/lib/use-language";

const emptyProduct = (): FormProduct => ({
  id: "",
  slug: "",
  name: { tk: "", ru: "", en: "" },
  description: { tk: "", ru: "", en: "" },
  category: "phones",
  price: "",
  currency: "TMT",
  stock: "0",
  image: "",
  originalImage: "",
  accent: "blue",
  icon: "phone",
  featured: false,
  active: true,
  sort_order: "0",
});

type FormProduct = {
  id: string;
  slug: string;
  name: Product["name"];
  description: Product["description"];
  category: Product["category"];
  price: string;
  currency: string;
  stock: string;
  image: string;
  originalImage: string;
  accent: Product["accent"];
  icon: Product["icon"];
  featured: boolean;
  active: boolean;
  sort_order: string;
};

type StoreForm = { name: string; phoneDisplay: string; location: string };

type AdminCopy = {
  title: string;
  catalog: string;
  products: string;
  addProduct: string;
  editProduct: string;
  save: string;
  saving: string;
  cancel: string;
  delete: string;
  deleting: string;
  signOut: string;
  email: string;
  password: string;
  signIn: string;
  signingIn: string;
  loginTitle: string;
  loginNote: string;
  setupRequired: string;
  setupNote: string;
  accessDenied: string;
  accessNote: string;
  storeSettings: string;
  storeName: string;
  location: string;
  phone: string;
  saveStore: string;
  saved: string;
  failed: string;
  productName: string;
  slug: string;
  description: string;
  category: string;
  price: string;
  currency: string;
  stock: string;
  image: string;
  chooseImage: string;
  imageUrl: string;
  active: string;
  featured: string;
  order: string;
  live: string;
  hidden: string;
  low: string;
  sold: string;
  edit: string;
  noProducts: string;
  languageTk: string;
  languageRu: string;
  languageEn: string;
  invalidImage: string;
  imageTooLarge: string;
  invalidPhone: string;
  invalidName: string;
  invalidNameRu: string;
  invalidNameEn: string;
  invalidPrice: string;
  invalidStock: string;
  invalidCurrency: string;
  invalidSlug: string;
  invalidOrder: string;
  duplicateSlug: string;
  invalidStoreName: string;
  invalidLocation: string;
  adminLabel: string;
};

const adminCopy: Record<Language, AdminCopy> = {
  tk: {
    title: "Dolandyryş paneli",
    catalog: "Katalog dolandyryşy",
    products: "Önümler",
    addProduct: "Täze önüm goş",
    editProduct: "Önümi üýtget",
    save: "Ýatda sakla",
    saving: "Ýatda saklanýar...",
    cancel: "Ýatyr",
    delete: "Poz",
    deleting: "Pozulýar...",
    signOut: "Çykmak",
    email: "E-poçta",
    password: "Parol",
    signIn: "Gir",
    signingIn: "Girilýär...",
    loginTitle: "Dükanyň dolandyryş paneli",
    loginNote: "Diňe ygtyýarly dükan dolandyryjysy girip biler.",
    setupRequired: "Supabase sazlamasy gerek",
    setupNote: "Önüm dolandyryşyny ulanmak üçin .env.local içine Supabase maglumatlaryny goşuň we SQL sazlamasyny bir gezek işlediň.",
    accessDenied: "Giriş rugsady ýok",
    accessNote: "Bu hasap dolandyryjy hökmünde bellige alynmandyr.",
    storeSettings: "Dükan maglumatlary",
    storeName: "Dükan ady",
    location: "Ýerleşýän ýeri",
    phone: "Telefon",
    saveStore: "Dükany ýatda sakla",
    saved: "Ýatda saklandy",
    failed: "Amal şowsuz boldy",
    productName: "Önüm ady",
    slug: "URL ady",
    description: "Düşündiriş",
    category: "Kategoriýa",
    price: "Baha",
    currency: "Walýuta",
    stock: "Stok",
    image: "Surat",
    chooseImage: "Surat saýla",
    imageUrl: "Surat URL-si",
    active: "Görkezilýär",
    featured: "Saýlanan",
    order: "Tertip",
    live: "Görkezilýär",
    hidden: "Gizlin",
    low: "Az galdy",
    sold: "Tükenendir",
    edit: "Üýtget",
    noProducts: "Önüm ýok",
    languageTk: "Türkmençe",
    languageRu: "Rusça",
    languageEn: "Iňlisçe",
    invalidImage: "Diňe JPG, PNG, WebP ýa-da AVIF suratlaryny saýlaň.",
    imageTooLarge: "Surat 5 MB-dan uly bolmaly däl.",
    invalidPhone: "Telefon belgisi nädogry.",
    invalidName: "Harydyň türkmençe ady bolmaly.",
    invalidNameRu: "Harydyň rusça ady bolmaly.",
    invalidNameEn: "Harydyň iňlisçe ady bolmaly.",
    invalidPrice: "Baha dogry, nol ýa-da ondan uly san bolmaly.",
    invalidStock: "Stok 0 ýa-da ondan uly bitewi san bolmaly.",
    invalidCurrency: "Walýuta 3–5 baş harp bolmaly.",
    invalidSlug: "URL ady gerekli.",
    invalidOrder: "Tertip belgisi 0 ýa-da ondan uly bitewi san bolmaly.",
    duplicateSlug: "Bu URL ady eýýäm ulanylýar.",
    invalidStoreName: "Dükan ady boş bolmaly däl we 160 simwoldan geçmeli däl.",
    invalidLocation: "Ýerleşýän ýer 200 simwoldan geçmeli däl.",
    adminLabel: "Dolandyryjy",
  },
  ru: {
    title: "Панель управления",
    catalog: "Управление каталогом",
    products: "Товары",
    addProduct: "Добавить товар",
    editProduct: "Изменить товар",
    save: "Сохранить",
    saving: "Сохраняем...",
    cancel: "Отмена",
    delete: "Удалить",
    deleting: "Удаляем...",
    signOut: "Выйти",
    email: "Эл. почта",
    password: "Пароль",
    signIn: "Войти",
    signingIn: "Входим...",
    loginTitle: "Панель управления магазина",
    loginNote: "Доступ только для авторизованного администратора магазина.",
    setupRequired: "Требуется настройка Supabase",
    setupNote: "Добавьте данные Supabase в .env.local и один раз примените SQL-настройку.",
    accessDenied: "Нет доступа",
    accessNote: "Этот аккаунт не назначен администратором.",
    storeSettings: "Данные магазина",
    storeName: "Название магазина",
    location: "Местоположение",
    phone: "Телефон",
    saveStore: "Сохранить магазин",
    saved: "Сохранено",
    failed: "Операция не выполнена",
    productName: "Название товара",
    slug: "URL-адрес",
    description: "Описание",
    category: "Категория",
    price: "Цена",
    currency: "Валюта",
    stock: "Остаток",
    image: "Фото",
    chooseImage: "Выбрать фото",
    imageUrl: "URL фото",
    active: "Показывается",
    featured: "Рекомендуемый",
    order: "Порядок",
    live: "Показывается",
    hidden: "Скрыт",
    low: "Мало",
    sold: "Нет в наличии",
    edit: "Изменить",
    noProducts: "Товаров нет",
    languageTk: "Туркменский",
    languageRu: "Русский",
    languageEn: "Английский",
    invalidImage: "Выберите только JPG, PNG, WebP или AVIF.",
    imageTooLarge: "Фото не должно быть больше 5 МБ.",
    invalidPhone: "Неверный номер телефона.",
    invalidName: "У товара должно быть туркменское название.",
    invalidNameRu: "У товара должно быть русское название.",
    invalidNameEn: "У товара должно быть английское название.",
    invalidPrice: "Цена должна быть корректным числом не меньше нуля.",
    invalidStock: "Остаток должен быть целым числом не меньше нуля.",
    invalidCurrency: "Валюта должна содержать 3–5 заглавных букв.",
    invalidSlug: "Введите URL-адрес.",
    invalidOrder: "Порядок должен быть целым числом не меньше нуля.",
    duplicateSlug: "Этот URL-адрес уже используется.",
    invalidStoreName: "Название магазина не должно быть пустым и длиннее 160 символов.",
    invalidLocation: "Местоположение не должно быть длиннее 200 символов.",
    adminLabel: "Администратор",
  },
  en: {
    title: "Admin panel",
    catalog: "Catalog management",
    products: "Products",
    addProduct: "Add product",
    editProduct: "Edit product",
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    delete: "Delete",
    deleting: "Deleting...",
    signOut: "Sign out",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    signingIn: "Signing in...",
    loginTitle: "Store administration",
    loginNote: "Only an authorized store administrator can enter.",
    setupRequired: "Supabase setup required",
    setupNote: "Add Supabase values to .env.local and apply the SQL setup once.",
    accessDenied: "Access denied",
    accessNote: "This account is not registered as a store administrator.",
    storeSettings: "Store details",
    storeName: "Store name",
    location: "Location",
    phone: "Phone",
    saveStore: "Save store",
    saved: "Saved",
    failed: "Operation failed",
    productName: "Product name",
    slug: "URL slug",
    description: "Description",
    category: "Category",
    price: "Price",
    currency: "Currency",
    stock: "Stock",
    image: "Photo",
    chooseImage: "Choose photo",
    imageUrl: "Photo URL",
    active: "Visible",
    featured: "Featured",
    order: "Order",
    live: "Visible",
    hidden: "Hidden",
    low: "Low",
    sold: "Sold out",
    edit: "Edit",
    noProducts: "No products",
    languageTk: "Turkmen",
    languageRu: "Russian",
    languageEn: "English",
    invalidImage: "Choose only JPG, PNG, WebP or AVIF images.",
    imageTooLarge: "Image size must be 5 MB or less.",
    invalidPhone: "Phone number is invalid.",
    invalidName: "A Turkmen product name is required.",
    invalidNameRu: "A Russian product name is required.",
    invalidNameEn: "An English product name is required.",
    invalidPrice: "Price must be a valid non-negative number.",
    invalidStock: "Stock must be a whole number of 0 or more.",
    invalidCurrency: "Currency must contain 3–5 uppercase letters.",
    invalidSlug: "Slug is required.",
    invalidOrder: "Order must be a whole number of 0 or more.",
    duplicateSlug: "This URL slug is already in use.",
    invalidStoreName: "Store name cannot be empty or longer than 160 characters.",
    invalidLocation: "Location cannot be longer than 200 characters.",
    adminLabel: "Admin",
  },
};

function productToForm(product: Product): FormProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    category: product.category,
    price: String(product.price),
    currency: product.currency,
    stock: String(product.stock),
    image: product.image ?? "",
    originalImage: product.image ?? "",
    accent: product.accent,
    icon: product.icon,
    featured: Boolean(product.featured),
    active: true,
    sort_order: "0",
  };
}

function productFromRow(row: Record<string, unknown>): Product & { active: boolean; sort_order: number } {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: {
      tk: String((row.name as Record<string, unknown> | null)?.tk ?? row.slug),
      ru: String((row.name as Record<string, unknown> | null)?.ru ?? row.slug),
      en: String((row.name as Record<string, unknown> | null)?.en ?? row.slug),
    },
    description: {
      tk: String((row.description as Record<string, unknown> | null)?.tk ?? ""),
      ru: String((row.description as Record<string, unknown> | null)?.ru ?? ""),
      en: String((row.description as Record<string, unknown> | null)?.en ?? ""),
    },
    category: String(row.category) as Product["category"],
    price: Number(row.price ?? 0),
    currency: String(row.currency ?? "TMT"),
    stock: Number(row.stock ?? 0),
    image: typeof row.image === "string" ? row.image : undefined,
    accent: String(row.accent ?? "blue") as Product["accent"],
    icon: String(row.icon ?? "phone") as Product["icon"],
    featured: Boolean(row.featured),
    active: Boolean(row.active),
    sort_order: Number(row.sort_order ?? 0),
  };
}

export function AdminShell() {
  const supabase = getSupabaseBrowser();
  const [language, changeLanguage] = useLanguagePreference();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<(Product & { active: boolean; sort_order: number })[]>([]);
  const [editing, setEditing] = useState<FormProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [notice, setNotice] = useState("");
  const [storeForm, setStoreForm] = useState<StoreForm>({ name: "Asman Shop", phoneDisplay: "+993 XX XX XX XX", location: "Türkmenistan" });
  const [storeSaving, setStoreSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const t = copy[language];
  const a = adminCopy[language];

  useEffect(() => {
    document.documentElement.lang = language === "tk" ? "tk" : language;
  }, [language]);

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;
    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (sessionError) setError(sessionError.message);
      setLoading(false);
    }).catch((sessionError: unknown) => {
      if (!mounted) return;
      setError(sessionError instanceof Error ? sessionError.message : a.failed);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (!nextSession) {
        setAdmin(false);
        setProducts([]);
        setEditing(null);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [a.failed, supabase]);

  useEffect(() => {
    if (!supabase || !user) return;

    let mounted = true;
    void (async () => {
      try {
        const { data, error: adminError } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();
        if (!mounted) return;
        if (adminError) {
          setAdmin(false);
          setError(adminError.message);
          return;
        }
        setAdmin(Boolean(data));
      } catch (adminError) {
        if (!mounted) return;
        setAdmin(false);
        setError(adminError instanceof Error ? adminError.message : a.failed);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [a.failed, supabase, user]);

  const refreshData = useCallback(async () => {
    if (!supabase || !admin) return;
    setError("");
    const [productResult, storeResult] = await Promise.all([
      supabase.from("products").select("id, slug, name, description, category, price, currency, stock, image, accent, icon, featured, active, sort_order").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
      supabase.from("store_settings").select("name, phone_display, location").eq("id", 1).maybeSingle(),
    ]);
    if (productResult.error) setError(productResult.error.message);
    setProducts((productResult.data ?? []).map((row) => productFromRow(row as Record<string, unknown>)));
    if (storeResult.data) {
      setStoreForm({
        name: storeResult.data.name ?? "",
        phoneDisplay: storeResult.data.phone_display ?? "",
        location: storeResult.data.location ?? "",
      });
    }
  }, [admin, supabase]);

  // This effect intentionally starts a remote-data synchronization after admin access is established.
  useEffect(() => {
    if (admin) {
      // Supabase synchronization updates React state asynchronously after the request resolves.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void refreshData();
    }
  }, [admin, refreshData]);

  const signIn = async (formData: FormData) => {
    if (!supabase) return;
    setLoginLoading(true);
    setError("");
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError(signInError.message);
    setLoginLoading(false);
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAdmin(false);
  };

  const openNew = () => {
    setEditing(emptyProduct());
    setImageFile(null);
    setImagePreview("");
    setNotice("");
    setError("");
  };

  const openEdit = (product: Product & { active: boolean; sort_order: number }) => {
    setEditing({ ...productToForm(product), active: product.active, sort_order: String(product.sort_order) });
    setImageFile(null);
    setImagePreview(product.image ?? "");
    setNotice("");
    setError("");
  };

  const onCategoryChange = (category: Product["category"]) => {
    setEditing((current) => current ? ({ ...current, category, icon: iconForCategory[category] }) : current);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
    if (!allowedTypes.has(file.type)) {
      setError(a.invalidImage);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(a.imageTooLarge);
      return;
    }
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setError("");
  };

  useEffect(() => () => {
    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const saveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || !editing) return;
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const slug = slugify(editing.slug || editing.name.tk || editing.name.en);
      if (!slug) throw new Error(a.invalidSlug);
      const numericPrice = Number(editing.price);
      const numericStock = Number(editing.stock);
      const sortOrder = Number(editing.sort_order);
      if (!editing.name.tk.trim()) throw new Error(a.invalidName);
      if (!editing.name.ru.trim()) throw new Error(a.invalidNameRu);
      if (!editing.name.en.trim()) throw new Error(a.invalidNameEn);
      if (!Number.isFinite(numericPrice) || numericPrice < 0) throw new Error(a.invalidPrice);
      if (!Number.isFinite(numericStock) || numericStock < 0 || !Number.isInteger(numericStock)) throw new Error(a.invalidStock);
      if (!Number.isFinite(sortOrder) || sortOrder < 0 || !Number.isInteger(sortOrder)) throw new Error(a.invalidOrder);
      if (!/^[A-Z]{3,5}$/.test(editing.currency.trim())) throw new Error(a.invalidCurrency);
      if (editing.image && !isSafePublicImageUrl(editing.image)) throw new Error(a.invalidImage);

      let imageUrl = editing.image || null;
      let newStoragePath: string | null = null;
      const oldStoragePath = getProductStoragePath(editing.originalImage);
      if (imageFile) {
        const safeExtension = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as Record<string, string>)[imageFile.type] || "jpg";
        const path = `products/${crypto.randomUUID()}.${safeExtension}`;
        const { error: uploadError } = await supabase.storage.from("product-images").upload(path, imageFile, { upsert: false, contentType: imageFile.type, cacheControl: "31536000" });
        if (uploadError) throw uploadError;
        newStoragePath = path;
        imageUrl = supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
      }

      const payload = {
        ...(editing.id ? { id: editing.id } : { id: crypto.randomUUID() }),
        slug,
        name: editing.name,
        description: editing.description,
        category: editing.category,
        price: numericPrice,
        currency: editing.currency.trim() || "TMT",
        stock: numericStock,
        image: imageUrl,
        accent: editing.accent,
        icon: editing.icon,
        featured: editing.featured,
        active: editing.active,
        sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
      };

      const { error: saveError } = await supabase.from("products").upsert(payload, { onConflict: "id" });
      if (saveError) {
        if (newStoragePath) void supabase.storage.from("product-images").remove([newStoragePath]);
        throw saveError;
      }
      const finalStoragePath = getProductStoragePath(imageUrl);
      if (oldStoragePath && oldStoragePath !== finalStoragePath) {
        const { error: cleanupError } = await supabase.storage.from("product-images").remove([oldStoragePath]);
        if (cleanupError) console.error("Old product image cleanup failed.", cleanupError);
      }
      setNotice(a.saved);
      setEditing(null);
      setImageFile(null);
      setImagePreview("");
      await refreshData();
    } catch (saveError) {
      const errorWithCode = saveError && typeof saveError === "object" ? saveError as { code?: string; message?: string } : null;
      if (errorWithCode?.code === "23505" && errorWithCode.message?.toLowerCase().includes("slug")) {
        setError(a.duplicateSlug);
      } else {
        setError(saveError instanceof Error ? saveError.message : a.failed);
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (product: Product & { active: boolean; sort_order: number }) => {
    if (!supabase) return;
    if (!window.confirm(`${product.name[language] || product.name.tk} — ${a.delete}?`)) return;
    setDeletingId(product.id);
    setError("");
    const { error: deleteError } = await supabase.from("products").delete().eq("id", product.id);
    if (deleteError) setError(deleteError.message);
    else {
      const storagePath = getProductStoragePath(product.image);
      if (storagePath) {
        const { error: cleanupError } = await supabase.storage.from("product-images").remove([storagePath]);
        if (cleanupError) console.error("Deleted product image cleanup failed.", cleanupError);
      }
      setNotice(a.saved);
    }
    setDeletingId("");
    await refreshData();
  };

  const toggleProduct = async (product: Product & { active: boolean; sort_order: number }, field: "active" | "featured") => {
    if (!supabase) return;
    setError("");
    const { error: updateError } = await supabase.from("products").update({ [field]: !product[field] }).eq("id", product.id);
    if (updateError) setError(updateError.message);
    else await refreshData();
  };

  const saveStore = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    setStoreSaving(true);
    setError("");
    const normalizedPhone = normalizePhoneHref(storeForm.phoneDisplay);
    const storeName = storeForm.name.trim();
    const location = storeForm.location.trim();
    const phoneDisplay = storeForm.phoneDisplay.trim();
    if (!storeName || storeName.length > 160) {
      setError(a.invalidStoreName);
      setStoreSaving(false);
      return;
    }
    if (!location || location.length > 200) {
      setError(a.invalidLocation);
      setStoreSaving(false);
      return;
    }
    if (phoneDisplay.length > 60 || !normalizedPhone) {
      setError(a.invalidPhone);
      setStoreSaving(false);
      return;
    }
    const { error: storeError } = await supabase.from("store_settings").upsert({
      id: 1,
      name: storeName,
      phone_display: phoneDisplay,
      phone_href: normalizedPhone,
      location,
    }, { onConflict: "id" });
    if (storeError) setError(storeError.message);
    else setNotice(a.saved);
    setStoreSaving(false);
  };

  const languageLabels = useMemo(() => ({ tk: a.languageTk, ru: a.languageRu, en: a.languageEn }), [a]);

  if (!supabase) {
    return <AdminFrame language={language} onLanguageChange={changeLanguage} title={a.title} adminLabel={a.adminLabel}>
      <div className="admin-card admin-message">
        <span className="admin-message-icon"><Icon name="store" size={24} /></span>
        <h1>{a.setupRequired}</h1>
        <p>{a.setupNote}</p>
        <Link href="/" className="admin-secondary">{t.home}</Link>
      </div>
    </AdminFrame>;
  }

  if (loading) return <AdminFrame language={language} onLanguageChange={changeLanguage} title={a.title} adminLabel={a.adminLabel}><div className="admin-loading">{a.saving}</div></AdminFrame>;

  if (!session || !user) {
    return <AdminFrame language={language} onLanguageChange={changeLanguage} title={a.title} adminLabel={a.adminLabel}>
      <div className="admin-auth-wrap">
        <form className="admin-card admin-auth" onSubmit={(event) => { event.preventDefault(); void signIn(new FormData(event.currentTarget)); }}>
          <span className="admin-message-icon"><Icon name="lock" size={23} /></span>
          <h1>{a.loginTitle}</h1>
          <p>{a.loginNote}</p>
          <label>{a.email}<input name="email" type="email" autoComplete="email" required /></label>
          <label>{a.password}<input name="password" type="password" autoComplete="current-password" required /></label>
          {error && <div className="admin-error" role="alert">{error}</div>}
          <button className="admin-primary" disabled={loginLoading} type="submit">{loginLoading ? a.signingIn : a.signIn}</button>
        </form>
      </div>
    </AdminFrame>;
  }

  if (!admin) {
    return <AdminFrame language={language} onLanguageChange={changeLanguage} title={a.title} adminLabel={a.adminLabel}>
      <div className="admin-card admin-message">
        <span className="admin-message-icon"><Icon name="lock" size={24} /></span>
        <h1>{a.accessDenied}</h1>
        <p>{a.accessNote}</p>
        {error && <div className="admin-error" role="alert">{error}</div>}
        <button className="admin-secondary" onClick={() => void signOut()}>{a.signOut}</button>
      </div>
    </AdminFrame>;
  }

  return (
    <AdminFrame language={language} onLanguageChange={changeLanguage} title={a.title} adminLabel={a.adminLabel} brandName={storeForm.name.trim() || "ASMAN SHOP"}>
      <div className="admin-layout">
        <header className="admin-page-head">
          <div>
            <span className="section-kicker">ADMIN · {user.email}</span>
            <h1>{a.catalog}</h1>
          </div>
          <div className="admin-head-actions">
            <Link href="/" className="admin-secondary">{t.home}</Link>
            <button className="admin-secondary" onClick={() => void signOut()}>{a.signOut}</button>
          </div>
        </header>

        {error && <div className="admin-error" role="alert">{error}</div>}
        {notice && <div className="admin-success" role="status">{notice}</div>}

        <form className="admin-card admin-store-card" onSubmit={saveStore}>
          <div className="admin-card-head"><div><span className="section-kicker">01</span><h2>{a.storeSettings}</h2></div></div>
          <div className="admin-form-grid three">
            <label>{a.storeName}<input maxLength={160} value={storeForm.name} onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })} required /></label>
            <label>{a.phone}<input maxLength={60} type="tel" autoComplete="tel" value={storeForm.phoneDisplay} onChange={(e) => setStoreForm({ ...storeForm, phoneDisplay: e.target.value })} required /></label>
            <label>{a.location}<input maxLength={200} value={storeForm.location} onChange={(e) => setStoreForm({ ...storeForm, location: e.target.value })} required /></label>
          </div>
          <button className="admin-primary compact" type="submit" disabled={storeSaving}>{storeSaving ? a.saving : a.saveStore}</button>
        </form>

        <section className="admin-card">
          <div className="admin-card-head">
            <div><span className="section-kicker">02</span><h2>{a.products} <em>{products.length}</em></h2></div>
            <button className="admin-primary" onClick={openNew}><span aria-hidden="true">＋</span> {a.addProduct}</button>
          </div>

          {editing && (
            <form className="admin-editor" onSubmit={saveProduct}>
              <div className="admin-editor-head">
                <div><span className="section-kicker">{editing.id ? "EDIT" : "NEW"}</span><h3>{editing.id ? a.editProduct : a.addProduct}</h3></div>
                <button type="button" className="admin-secondary" onClick={() => setEditing(null)}>{a.cancel}</button>
              </div>

              <div className="admin-product-editor">
                <div className="admin-preview" style={imagePreview ? { backgroundImage: `url("${imagePreview.replaceAll('"', '\\"')}")` } : undefined}>
                  {!imagePreview && <span>{a.image}</span>}
                </div>
                <div className="admin-editor-fields">
                  <div className="admin-form-grid three">
                    <label>{a.productName} · {languageLabels.tk}<input value={editing.name.tk} onChange={(e) => setEditing({ ...editing, name: { ...editing.name, tk: e.target.value }, slug: editing.slug || slugify(e.target.value) })} required /></label>
                    <label>{a.productName} · {languageLabels.ru}<input value={editing.name.ru} onChange={(e) => setEditing({ ...editing, name: { ...editing.name, ru: e.target.value } })} required /></label>
                    <label>{a.productName} · {languageLabels.en}<input value={editing.name.en} onChange={(e) => setEditing({ ...editing, name: { ...editing.name, en: e.target.value } })} required /></label>
                  </div>
                  <div className="admin-form-grid three">
                    <label>{a.slug}<input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} required /></label>
                    <label>{a.category}<select value={editing.category} onChange={(e) => onCategoryChange(e.target.value as Product["category"])}>{categoryOptions.map((category) => <option key={category} value={category}>{categoryLabel(category, t)}</option>)}</select></label>
                    <label>{a.currency}<input value={editing.currency} onChange={(e) => setEditing({ ...editing, currency: e.target.value.toUpperCase() })} maxLength={5} required /></label>
                  </div>
                  <div className="admin-form-grid three">
                    <label>{a.price}<input value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} inputMode="decimal" min="0" step="0.01" type="number" required /></label>
                    <label>{a.stock}<input value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: e.target.value })} inputMode="numeric" min="0" step="1" type="number" required /></label>
                    <label>{a.order}<input value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })} inputMode="numeric" min="0" step="1" type="number" /></label>
                  </div>
                  <div className="admin-form-grid three">
                    <label>{a.description} · {languageLabels.tk}<textarea value={editing.description.tk} onChange={(e) => setEditing({ ...editing, description: { ...editing.description, tk: e.target.value } })} rows={3} /></label>
                    <label>{a.description} · {languageLabels.ru}<textarea value={editing.description.ru} onChange={(e) => setEditing({ ...editing, description: { ...editing.description, ru: e.target.value } })} rows={3} /></label>
                    <label>{a.description} · {languageLabels.en}<textarea value={editing.description.en} onChange={(e) => setEditing({ ...editing, description: { ...editing.description, en: e.target.value } })} rows={3} /></label>
                  </div>
                  <div className="admin-form-grid two">
                    <label>{a.imageUrl}<input value={editing.image} onChange={(e) => { const next = e.target.value.trim(); setEditing({ ...editing, image: next }); setImageFile(null); if (!next || isSafePublicImageUrl(next)) { setImagePreview(next); setError(""); } else { setImagePreview(""); setError(a.invalidImage); } }} placeholder="https://..." /></label>
                    <label>{a.image}<button type="button" className="admin-upload" onClick={() => fileInput.current?.click()}>{imageFile ? imageFile.name : a.chooseImage}</button><input ref={fileInput} hidden type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => handleFile(e.target.files?.[0])} /></label>
                  </div>
                  <div className="admin-checks">
                    <label className="check"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> {a.active}</label>
                    <label className="check"><input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> {a.featured}</label>
                  </div>
                </div>
              </div>
              <div className="admin-editor-actions"><button className="admin-primary" disabled={saving} type="submit">{saving ? a.saving : a.save}</button><button type="button" className="admin-secondary" onClick={() => setEditing(null)}>{a.cancel}</button></div>
            </form>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>{a.products}</th><th>{a.price}</th><th>{a.stock}</th><th>{a.active}</th><th>{a.featured}</th><th /></tr></thead>
              <tbody>
                {products.map((product) => {
                  const stockLabel = product.stock === 0 ? a.sold : product.stock <= 3 ? a.low : `${product.stock}`;
                  return <tr key={product.id}>
                    <td><div className="admin-product-cell"><div className="admin-thumb" style={product.image ? { backgroundImage: `url("${product.image.replaceAll('"', '\\"')}")` } : undefined}>{!product.image && "✦"}</div><div><strong>{product.name[language] || product.name.tk}</strong><small>{categoryLabel(product.category, t)} · {product.slug}</small></div></div></td>
                    <td><strong>{formatPrice(product.price, product.currency, language)}</strong></td>
                    <td><span className={`admin-stock ${product.stock === 0 ? "sold" : product.stock <= 3 ? "low" : ""}`}>{stockLabel}</span></td>
                    <td><button className={`status-toggle ${product.active ? "on" : ""}`} type="button" onClick={() => void toggleProduct(product, "active")}>{product.active ? a.live : a.hidden}</button></td>
                    <td><button className={`status-toggle ${product.featured ? "on" : ""}`} type="button" onClick={() => void toggleProduct(product, "featured")}>{product.featured ? "★" : "—"}</button></td>
                    <td><div className="admin-row-actions"><button className="admin-secondary tiny" onClick={() => openEdit(product)}>{a.edit}</button><button className="admin-danger" disabled={deletingId === product.id} onClick={() => void deleteProduct(product)}>{deletingId === product.id ? "…" : a.delete}</button></div></td>
                  </tr>;
                })}
                {!products.length && <tr><td colSpan={6} className="admin-empty">{a.noProducts}</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminFrame>
  );
}

function AdminFrame({ language, onLanguageChange, title, adminLabel, brandName = "ASMAN SHOP", children }: { language: Language; onLanguageChange: (language: Language) => void; title: string; adminLabel: string; brandName?: string; children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <Link href="/" className="brand"><span className="brand-mark"><Icon name="store" size={18} /></span><span>{brandName}</span></Link>
        <div className="top-actions"><LanguageSwitcher language={language} onChange={onLanguageChange} ariaLabel={language === "tk" ? "Dil" : language === "ru" ? "Язык" : "Language"} /><span className="admin-top-title">{title}</span></div>
      </header>
      <main className="admin-main">{children}</main>
      <footer className="footer"><div><span className="brand-mark"><Icon name="store" size={15} /></span><strong>{brandName}</strong></div><span>{adminLabel}</span></footer>
    </div>
  );
}
