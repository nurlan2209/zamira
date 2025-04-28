import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const products = [
  // Худи
  {
    id: 1,
    name: "Shadow Ember",
    price: "$190",
    img: "https://i.pinimg.com/736x/9d/4f/94/9d4f94d406f3bb64676b9cdea594839d.jpg",
    category: "Hoodies",
  },
  {
    id: 2,
    name: "Frost Pulse",
    price: "$49",
    img: "https://i.pinimg.com/736x/66/bc/11/66bc1140083fd5a840e66c4634e02270.jpg",
    category: "Hoodies",
  },
  {
    id: 3,
    name: "Dusty Drift",
    price: "$15",
    img: "https://i.pinimg.com/736x/7d/61/ce/7d61ce015fcba86fd1e0349c9482ae90.jpg",
    category: "Hoodies",
  },
  {
    id: 4,
    name: "Urban Howl",
    price: "$29",
    img: "https://i.pinimg.com/736x/c6/17/d7/c617d7b69a716d664277a894721bd26a.jpg",
    category: "Hoodies",
  },
  {
    id: 5,
    name: "Obsidian Realm",
    price: "$210",
    img: "https://i.pinimg.com/736x/1c/a9/a1/1ca9a165699baecc4aad3e73ef02c5e0.jpg",
    category: "Hoodies",
  },
  {
    id: 6,
    name: "Nightfall Bloom",
    price: "$79",
    img: "https://i.pinimg.com/736x/67/b2/2e/67b22e72e56503c7b2f1ff5d55ab991f.jpg",
    category: "Hoodies",
  },
  {
    id: 7,
    name: "Ashen Dusk",
    price: "$39",
    img: "https://i.pinimg.com/736x/1d/5b/0c/1d5b0c966dce33c8b47688f50ee630c3.jpg",
    category: "Hoodies",
  },

  // Штаны
  {
    id: 10,
    name: "Carbon Veil",
    price: "$190",
    img: "https://i.pinimg.com/736x/79/29/0f/79290fe785787fbc80dfc172cec8a747.jpg",
    category: "Bottom",
  },
  {
    id: 11,
    name: "Slate Runner",
    price: "$49",
    img: "https://media.glamour.com/photos/6776e5136e848c303bcc37b5/3:4/w_640,c_limit/We%20the%20Free%20Good%20Luck%20Mid-Rise%20Barrel%20Jeans.png",
    category: "Bottom",
  },
  {
    id: 12,
    name: "Ghost Thread",
    price: "$15",
    img: "https://i.pinimg.com/736x/58/9f/8e/589f8e0a1432a247422f514eb0dfd93e.jpg",
    category: "Bottom",
  },
  {
    id: 13,
    name: "Void Stretch",
    price: "$29",
    img: "https://i.pinimg.com/736x/c5/8d/be/c58dbebfdcf76d2a947fafcbcac9225f.jpg",
    category: "Bottom",
  },
  {
    id: 14,
    name: "Titan Flow",
    price: "$210",
    img: "https://i.pinimg.com/736x/8f/7b/21/8f7b21ec68fd415f211e54abd71721a8.jpg",
    category: "Bottom",
  },
  {
    id: 15,
    name: "Noir Drift",
    price: "$79",
    img: "https://i.pinimg.com/736x/68/f0/3c/68f03c6383ea1635cc7d4837ac71f244.jpg",
    category: "Bottom",
  },
  {
    id: 16,
    name: "Stone Mirage",
    price: "$59",
    img: "https://i.pinimg.com/736x/66/f9/ae/66f9ae77a3893d1ef28c763807f441ee.jpg",
    category: "Bottom",
  },
  {
    id: 17,
    name: "Chrome Dust",
    price: "$39",
    img: "https://media.glamour.com/photos/67d06ca0d4ac068e7882e760/3:4/w_640,c_limit/H&M%20Ava%20Ultra-High-Rise%20Wide-Leg%20Jeans%20.png",
    category: "Bottom",
  },

  // Обувь
  {
    id: 18,
    name: "Storm Lace",
    price: "$190",
    img: "https://i.pinimg.com/736x/e9/77/fd/e977fdc73a66a8ac752dffc1660fa586.jpg",
    category: "Shoes",
  },
  {
    id: 19,
    name: "Cloudstep Delta",
    price: "$49",
    img: "https://i.pinimg.com/736x/45/a3/91/45a3910b1a0304bccf3ed15d936f1178.jpg",
    category: "Shoes",
  },
  {
    id: 20,
    name: "Crater Kicks",
    price: "$15",
    img: "https://i.pinimg.com/736x/de/62/42/de62421c479571fb84afce84491fc63c.jpg",
    category: "Shoes",
  },
  {
    id: 21,
    name: "Neo Tread",
    price: "$29",
    img: "https://i.pinimg.com/736x/f1/ca/39/f1ca39f98e39977d75a625bc0bd5ac2a.jpg",
    category: "Shoes",
  },
  {
    id: 22,
    name: "Eclipse Boost",
    price: "$210",
    img: "https://i.pinimg.com/736x/63/c1/cd/63c1cd5aeadc9f55fb63f8e8b19e20af.jpg",
    category: "Shoes",
  },
  {
    id: 23,
    name: "Phantom Edge",
    price: "$79",
    img: "https://i.pinimg.com/736x/15/e0/d1/15e0d175ee987c498bff46026c9af8e3.jpg",
    category: "Shoes",
  },
  {
    id: 24,
    name: "Iron Fade",
    price: "$59",
    img: "https://i.pinimg.com/736x/51/cd/63/51cd6374b8ba3d18488d6626b68c53bf.jpg",
    category: "Shoes",
  },
  {
    id: 25,
    name: "Midnight Flex",
    price: "$39",
    img: "https://i.pinimg.com/736x/af/c6/5f/afc65f0aa11a3a4db33056440c9055f6.jpg",
    category: "Shoes",
  },

  // Рюкзаки
  {
    id: 26,
    name: "Gravity Haul",
    price: "$190",
    img: "https://i.pinimg.com/736x/29/4c/ae/294caeb86113a5f2ce3709de419f2642.jpg",
    category: "Bags",
  },
  {
    id: 27,
    name: "Nomad Zip",
    price: "$49",
    img: "https://i.pinimg.com/736x/46/47/16/464716e0f70ca9013b90d2ff16941767.jpg",
    category: "Bags",
  },
  {
    id: 28,
    name: "Core Loop",
    price: "$15",
    img: "https://i.pinimg.com/736x/d0/71/02/d07102e94386f771505ee198c0af328a.jpg",
    category: "Bags",
  },
  {
    id: 29,
    name: "Trail Hatch",
    price: "$29",
    img: "https://i.pinimg.com/736x/1f/6d/1b/1f6d1bd06fb97a6a8e62d9ffe2006a4d.jpg",
    category: "Bags",
  },
  {
    id: 30,
    name: "Echo Vault",
    price: "$210",
    img: "https://i.pinimg.com/736x/e5/6e/5e/e56e5e4b6dd746dc86822e3ffe722b10.jpg",
    category: "Bags",
  },
  {
    id: 31,
    name: "Mono Drift",
    price: "$79",
    img: "https://i.pinimg.com/736x/db/7c/b8/db7cb8ab461c3fd41734ac875001f36b.jpg",
    category: "Bags",
  },
  {
    id: 32,
    name: "Shadow Loop",
    price: "$59",
    img: "https://i.pinimg.com/736x/de/1d/e9/de1de92aa64ed7b8ce4d6d305b51067c.jpg",
    category: "Bags",
  },
  {
    id: 33,
    name: "Cinder Pack",
    price: "$39",
    img: "https://i.pinimg.com/736x/bc/eb/68/bceb68890546e83d2f01b42016d7ce68.jpg",
    category: "Bags",
  },

  // Аксессуары
  {
    id: 34,
    name: "Lunar Pin",
    price: "$19",
    img: "https://i.pinimg.com/736x/aa/36/aa/aa36aa178cd579eaa7a07e89d43cee5c.jpg",
    category: "Accessories",
  },
  {
    id: 35,
    name: "Mist Chain",
    price: "$25",
    img: "https://i.pinimg.com/736x/8d/98/6c/8d986cbaf0e70b56c8c840cc9d5ac398.jpg",
    category: "Accessories",
  },
  {
    id: 36,
    name: "Nova Clip",
    price: "$30",
    img: "https://i.pinimg.com/736x/4c/53/29/4c5329cacb560f94bbaa31fe4aa99f34.jpg",
    category: "Accessories",
  },
  {
    id: 37,
    name: "Drip Knot",
    price: "$22",
    img: "https://i.pinimg.com/736x/25/49/77/254977c3b027887b68a74c8d958cf111.jpg",
    category: "Accessories",
  },
  {
    id: 38,
    name: "Echo Ring",
    price: "$18",
    img: "https://i.pinimg.com/736x/62/94/f2/6294f22934bb1af8318e5ff3663388e1.jpg",
    category: "Accessories",
  },
  {
    id: 39,
    name: "Frost Band",
    price: "$20",
    img: "https://i.pinimg.com/736x/e0/57/eb/e057ebb86362f87ad1034efda5838a05.jpg",
    category: "Accessories",
  },
  {
    id: 40,
    name: "Velvet Loop",
    price: "$17",
    img: "https://i.pinimg.com/736x/b9/8e/e1/b98ee1bfe66045a9238d8feeba305f37.jpg",
    category: "Accessories",
  },
  {
    id: 41,
    name: "Ash Pendant",
    price: "$24",
    img: "https://i.pinimg.com/736x/5f/b9/77/5fb9771549b00562ef5feff314957840.jpg",
    category: "Accessories",
  },
  {
    id: 42,
    name: "Grav Charm",
    price: "$28",
    img: "https://i.pinimg.com/736x/47/23/42/472342815fe898b0372cba22a996699d.jpg",
    category: "Accessories",
  },
  {
    id: 43,
    name: "Quartz Halo",
    price: "$32",
    img: "https://i.pinimg.com/736x/4d/c3/70/4dc3702bae622f4bfea9398ebd72fd8e.jpg",
    category: "Accessories",
  },

  // Украшения
  {
    id: 44,
    name: "Iris Link",
    price: "$99",
    img: "https://i.pinimg.com/736x/49/df/d6/49dfd647994e9498fa1d437a92642f88.jpg",
    category: "Jewelry",
  },
  {
    id: 45,
    name: "Celestine Crown",
    price: "$120",
    img: "https://i.pinimg.com/736x/3a/98/9a/3a989aabd38e387de638bc533c733c11.jpg",
    category: "Jewelry",
  },
  {
    id: 46,
    name: "Lucid Stone",
    price: "$85",
    img: "https://i.pinimg.com/736x/7d/60/d7/7d60d726f72d6706c2b4760b17d86abb.jpg",
    category: "Jewelry",
  },
  {
    id: 47,
    name: "Obsidian Veil",
    price: "$110",
    img: "https://i.pinimg.com/736x/0c/02/5e/0c025ee232eefe810b8c92342854b0ff.jpg",
    category: "Jewelry",
  },
  {
    id: 48,
    name: "Myth Glow",
    price: "$140",
    img: "https://i.pinimg.com/736x/bd/2f/3e/bd2f3e3c9efb5cd2093c1fbfb14ee521.jpg",
    category: "Jewelry",
  },
  {
    id: 49,
    name: "Solstice Band",
    price: "$160",
    img: "https://i.pinimg.com/736x/82/c7/b0/82c7b0e69c44eff66efa2190ab7ad4bd.jpg",
    category: "Jewelry",
  },
  {
    id: 50,
    name: "Stellar Bloom",
    price: "$99",
    img: "https://i.pinimg.com/736x/4c/6a/3a/4c6a3aaafd272e4ee0dae4a44883314c.jpg",
    category: "Jewelry",
  },

  {
    id: 51,
    name: "Amber Crest",
    price: "$105",
    img: "https://i.pinimg.com/736x/d8/64/a4/d864a4b3087d9a08eb7ec0dd9b368ee2.jpg",
    category: "Tops",
  },
  {
    id: 52,
    name: "Nova Drape",
    price: "$130",
    img: "https://i.pinimg.com/736x/48/0e/72/480e7225ef3f6d8c22708b81a7b44644.jpg",
    category: "Tops",
  },
  {
    id: 53,
    name: "Velvet Syntax",
    price: "$115",
    img: "https://i.pinimg.com/736x/6d/31/51/6d315192a83db4b45a77966ec1b6331e.jpg",
    category: "Tops",
  },
  {
    id: 54,
    name: "Moonlite Fold",
    price: "$99",
    img: "https://i.pinimg.com/736x/a8/7b/ea/a87bea3b7e5418659db28a46b36277a9.jpg",
    category: "Tops",
  },
  {
    id: 55,
    name: "Azure Thread",
    price: "$125",
    img: "https://cdna.lystit.com/photos/baltini/080d7cb1/diesel-Brown-Tank-Top.jpeg",
    category: "Tops",
  },
  {
    id: 56,
    name: "Drift Echo",
    price: "$135",
    img: "https://cdna.lystit.com/200/250/tr/photos/baltini/2bc02403/diesel-Black-M-vera-ls-Off-the-shoulder-Top-In-Ribbed-Knit.jpeg",
    category: "Tops",
  },
  {
    id: 57,
    name: "Shadow Stitch",
    price: "$150",
    img: "https://cdna.lystit.com/200/250/tr/photos/cettire/5f1b3a97/diesel-White-M-Valary-Logo-Plaque-Cropped-Ribbed-Top.jpeg",
    category: "Tops",
  },
  {
    id: 58,
    name: "Frostline Curve",
    price: "$145",
    img: "https://i.pinimg.com/736x/e6/31/3f/e6313fca66519788206c6de28e72fddb.jpg",
    category: "Tops",
  },

  {
    id: 59,
    name: "Urban Mirage",
    price: "$95",
    img: "https://i.pinimg.com/736x/f3/2b/02/f32b02389d0b77c8a6d7236b8f88ada0.jpg",
    category: "More",
  },
  {
    id: 60,
    name: "Nomad Echo",
    price: "$85",
    img: "https://i.pinimg.com/736x/25/54/de/2554deb8074089ce127b4619b6e445f3.jpg",
    category: "More",
  },
  {
    id: 61,
    name: "Sable Drift",
    price: "$75",
    img: "https://i.pinimg.com/736x/99/5c/b8/995cb81ddbbb0b4f6abd5c58d41fbc89.jpg",
    category: "More",
  },
  {
    id: 62,
    name: "Twilight Edge",
    price: "$110",
    img: "https://i.pinimg.com/736x/ac/16/84/ac1684d45d93cda8f3567cc14140ecf0.jpg",
    category: "More",
  },
  {
    id: 63,
    name: "Fogbound Thread",
    price: "$88",
    img: "https://i.pinimg.com/736x/c3/64/fc/c364fc2f3c0c7c2c1fd417f82caa7cc1.jpg",
    category: "More",
  },
  {
    id: 64,
    name: "Nomura Flow",
    price: "$115",
    img: "https://i.pinimg.com/736x/a8/b8/66/a8b866369182725b4718f115fb03f047.jpg",
    category: "More",
  },
  {
    id: 65,
    name: "Halo Frequency",
    price: "$99",
    img: "https://media.glamour.com/photos/67f5857b976f932a0a6382ee/3:4/w_640,c_limit/Layer_6-005.jpg",
    category: "More",
  },
  {
    id: 66,
    name: "Wraith Stitch",
    price: "$105",
    img: "https://cdna.lystit.com/300/375/tr/photos/cettire/c5f51fe9/diesel-Grey-G-Khlow-N1-Logo-Embroidered-Zipped-Jacket.jpeg",
    category: "More",
  },
];

export default function HomePage({ openModal: handleOpenModal }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().startsWith(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col items-center w-full">
      {/* Навигационное меню + Профиль */}
      <header className="fixed-header">
        <nav>
          <ul className="flex gap-4 flex-wrap">
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryChange("Jewelry");
                }}>
                Jewelry
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryChange("Bags");
                }}>
                Bags
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryChange("Tops");
                }}>
                Tops
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryChange("All");
                }}>
                All
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryChange("Hoodies");
                }}>
                Hoodies
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryChange("Bottom");
                }}>
                Bottom
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryChange("Accessories");
                }}>
                Accessories
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryChange("More");
                }}>
                More
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Хиро-секция */}
      <div
        className="w-full h-[600px] bg-cover bg-center"
        style={{ backgroundImage: "url(/images/hero-shoe.jpg)" }}></div>

      {/* Гифка с фильтром */}
      <div
        className="w-full"
        style={{
          backgroundImage:
            "url(https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_6634a63bd8a8ec2d7c13861d_6634a650dc267258c0ce6f9f/scale_1200)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "700px",
          filter: "grayscale(100%) contrast(1.2)",
        }}></div>

      {/* О нас */}
      <section className="w-full max-w-5xl px-4 py-16 bg-gray-100">
        <h2 className="text-4xl font-bold mb-6 text-left">О нас</h2>

        {/* Контейнер с flexbox для текста */}
        <div className="flex flex-wrap gap-12">
          {/* Левая колонка с текстом */}
          <div className="w-full md:w-1/2 text-left">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Добро пожаловать в <strong>MØRK STORE</strong>, место, где стиль и
              личность соединяются в идеальной гармонии. Мы создаем одежду,
              которая подходит тем, кто ценит независимость, самовыражение и
              истинную свободу. Мы понимаем, что мода — это не просто тренды,
              это способ выразить себя, выделиться и быть в центре внимания.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Вдохновленные уличной культурой и современными трендами, мы
              стараемся создавать коллекции, которые не только актуальны, но и
              подчеркивают индивидуальность каждого нашего клиента. Каждое
              изделие в нашем магазине создано с вниманием к деталям, начиная от
              выбора ткани и заканчивая дизайном. Наши коллекции рассказывают о
              характере, уверенности и уникальном стиле.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              В <strong>MØRK STORE</strong> мы не просто продаем одежду. Мы
              предлагаем тебе возможность быть частью уникальной истории, где
              стиль не имеет границ, а каждый элемент твоего образа — это
              выражение твоей внутренней силы. Мы гордимся тем, что наша
              продукция производится с уважением к окружающей среде, а также с
              соблюдением высоких этических стандартов.
            </p>
          </div>

          {/* Правая колонка с дополнительным текстом */}
          <div className="w-full md:w-1/2 text-left">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Мы стремимся быть не просто магазином, а настоящим движением,
              объединяющим людей с похожими ценностями и стремлением к новым
              ощущениям. В нашем магазине каждый найдет что-то, что станет его
              "второй кожей" — будь то стильная куртка, классная футболка или
              аксессуары, которые добавят индивидуальности.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Мы убеждены, что мода должна быть доступной, удобной и в то же
              время вдохновляющей. С нами ты можешь быть уверен, что твой выбор
              всегда будет актуальным, а ты сам — всегда в центре внимания.
              Присоединяйся к <strong>MØRK STORE</strong>, и открой для себя
              новый мир, где стиль встречается с качеством и инновациями.
            </p>
          </div>
        </div>

        {/* Изображение */}
        <div className="mt-8 text-center">
          <img
            src="https://i.gifer.com/origin/ff/ffd0dbcdb2cc7b8218e4a0250bb871f0.gif"
            alt="MØRK STORE Image"
            className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Новинки */}
      <section className="w-full max-w-full px-4 py-12">
        <h2 className="text-center text-4xl font-bold mb-6">New Arrivals</h2>

        <div className="flex justify-center mb-10">
          <input
            type="text"
            className="search-input px-4 py-2 border rounded-md"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Поиск..."
          />
        </div>

        {/* Сетка товаров */}
        <div className="product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product-card border p-4 rounded-lg shadow-md hover:shadow-lg transition text-center">
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-auto mb-4 rounded cursor-pointer hover:opacity-80 transition"
                />
              </Link>
              <div className="product-info">
                <p className="font-semibold text-lg">{product.name}</p>
                <p className="text-gray-600">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="w-full bg-black text-white px-8 py-12">
        <div className="footer-container">
          <div className="footer-section">
            <h2>MØRK STORE</h2>
            <p>
              Уличный стиль. Холодный взгляд. Характер в каждой детали. Разные
              бренды мира, люди выбирают нас. Будем рады каждому новым и
              стареньким клиентам.
            </p>
          </div>

          <div className="footer-section">
            <h2>Контакты</h2>
            <p>info@morkstore.com</p>
            <p>+7 (777) 777-77-77</p>
            <p>г.Астана, ул. Стильная, 69</p>
          </div>

          <div className="footer-section">
            <h2>Мы в соцсетях</h2>
            <p>Instagram: @morkstore</p>
            <p>Telegram: @morkstore</p>
            <p>VK: @morkstore</p>
          </div>
        </div>

        <div className="footer-bottom">
          &copy; 2025 MØRK STORE. Все права защищены.
        </div>
      </footer>
    </div>
  );
}
