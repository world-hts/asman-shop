insert into public.store_settings (id, name, phone_display, phone_href, location)
values (1, 'Asman Shop', '+993 XX XX XX XX', 'tel:+99300000000', 'Türkmenistan')
on conflict (id) do update set
  name = excluded.name,
  phone_display = excluded.phone_display,
  phone_href = excluded.phone_href,
  location = excluded.location,
  updated_at = now();

insert into public.products
  (id, slug, name, description, category, price, currency, stock, image, accent, icon, featured, active, sort_order)
values
('phone-01','nova-x-pro',
 '{"tk":"Nova X Pro","ru":"Nova X Pro","en":"Nova X Pro"}',
 '{"tk":"Ýokary tizlikli ekranly, gündelik ulanyş üçin döwrebap smartfon.","ru":"Современный смартфон с быстрым экраном для повседневных задач.","en":"A modern smartphone with a fast display for everyday use."}',
 'phones',5200,'TMT',12,'/products/nova-x-pro.svg','blue','phone',true,true,10),
('phone-02','galaxy-lite',
 '{"tk":"Galaxy Lite","ru":"Galaxy Lite","en":"Galaxy Lite"}',
 '{"tk":"Ýeňil göwrüm, düşnükli kamera we uzak wagtlyk batareýa.","ru":"Лёгкий корпус, понятная камера и аккумулятор на весь день.","en":"Lightweight design, a clear camera and all-day battery life."}',
 'phones',2800,'TMT',8,'/products/galaxy-lite.svg','ice','phone',true,true,20),
('audio-01','airbeat-pro',
 '{"tk":"AirBeat Pro","ru":"AirBeat Pro","en":"AirBeat Pro"}',
 '{"tk":"Arassa ses, rahat gulak gurluşy we simsiz baglanyşyk.","ru":"Чистый звук, удобная посадка и беспроводное подключение.","en":"Clean sound, a comfortable fit and wireless connectivity."}',
 'audio',650,'TMT',5,'/products/airbeat-pro.svg','navy','headphones',true,true,30),
('accessory-01','shield-case-pro',
 '{"tk":"Shield Case Pro","ru":"Shield Case Pro","en":"Shield Case Pro"}',
 '{"tk":"Telefonyňyzy gündelik urgy-sürtülmeden goramak üçin inçe gap.","ru":"Тонкий чехол для повседневной защиты смартфона.","en":"A slim case for everyday smartphone protection."}',
 'accessories',220,'TMT',18,'/products/shield-case-pro.svg','sky','case',true,true,40),
('watch-01','pulse-watch',
 '{"tk":"Pulse Watch","ru":"Pulse Watch","en":"Pulse Watch"}',
 '{"tk":"Gündelik bildirişler we amatly smartfunksiýalar bilen akylly sagat.","ru":"Умные часы с уведомлениями и удобными функциями на каждый день.","en":"A smart watch with notifications and useful everyday features."}',
 'watches',1200,'TMT',3,'/products/pulse-watch.svg','silver','watch',false,true,50),
('charging-01','fast-charge-45',
 '{"tk":"Fast Charge 45W","ru":"Fast Charge 45W","en":"Fast Charge 45W"}',
 '{"tk":"Gysga wagtda güýç bermek üçin 45W zarýad enjamy.","ru":"Зарядное устройство 45W для быстрой зарядки.","en":"A 45W charger built for fast everyday charging."}',
 'charging',390,'TMT',9,'/products/fast-charge-45.svg','mint','charger',false,true,60),
('laptop-01','airbook-14',
 '{"tk":"AirBook 14","ru":"AirBook 14","en":"AirBook 14"}',
 '{"tk":"Inçe, ýeňil we iş üçin amatly 14 dýuým noutbuk.","ru":"Тонкий лёгкий ноутбук 14 дюймов для работы.","en":"A slim, lightweight 14-inch laptop for work and study."}',
 'laptops',12900,'TMT',2,'/products/airbook-14.svg','ice','laptop',false,true,70)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  price = excluded.price,
  currency = excluded.currency,
  stock = excluded.stock,
  image = excluded.image,
  accent = excluded.accent,
  icon = excluded.icon,
  featured = excluded.featured,
  active = excluded.active,
  sort_order = excluded.sort_order,
  updated_at = now();
