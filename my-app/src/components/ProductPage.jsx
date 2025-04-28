import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // Используем правильный импорт
import "../ProductePage.css";

const products = [
  {
    id: 1,
    name: "Shadow Ember",
    price: "$190",
    img: "https://i.pinimg.com/736x/9d/4f/94/9d4f94d406f3bb64676b9cdea594839d.jpg",
    category: "Hoodies",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviews: [
      { user: "Айгуль", review: "Очень красивый худи, комфортный и стильный!" },
      { user: "Руслан", review: "Ткань приятная, но немного маломерит." },
    ],
  },
  {
    id: 2,
    name: "Frost Pulse",
    price: "$49",
    img: "https://i.pinimg.com/736x/66/bc/11/66bc1140083fd5a840e66c4634e02270.jpg",
    category: "Hoodies",
    sizes: ["S", "M", "L"],
    rating: 4.0,
    reviews: [
      {
        user: "Мадина",
        review: "Очень приятная ткань, но в районе талии немного широковато.",
      },
      {
        user: "Данияр",
        review: "Хороший худи, но материал мог бы быть плотнее.",
      },
    ],
  },
  {
    id: 3,
    name: "Dusty Drift",
    price: "$15",
    img: "https://i.pinimg.com/736x/7d/61/ce/7d61ce015fcba86fd1e0349c9482ae90.jpg",
    category: "Hoodies",
    sizes: ["S", "M", "L"],
    rating: 3.8,
    reviews: [
      { user: "Аман", review: "Немного прозрачный, но в целом удобный." },
      { user: "Айжан", review: "Цена низкая, но качество не идеальное." },
    ],
  },
  {
    id: 4,
    name: "Urban Howl",
    price: "$29",
    img: "https://i.pinimg.com/736x/c6/17/d7/c617d7b69a716d664277a894721bd26a.jpg",
    category: "Hoodies",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.2,
    reviews: [
      {
        user: "Нурлан",
        review: "Отличный худи за свою цену. Комфортный и яркий.",
      },
      { user: "Жанна", review: "Очень нравится, идеально подходит для осени." },
    ],
  },
  {
    id: 5,
    name: "Obsidian Realm",
    price: "$210",
    img: "https://i.pinimg.com/736x/1c/a9/a1/1ca9a165699baecc4aad3e73ef02c5e0.jpg",
    category: "Hoodies",
    sizes: ["M", "L", "XL"],
    rating: 4.8,
    reviews: [
      {
        user: "Камила",
        review: "Прекрасный худи, супер стильный и очень теплый!",
      },
      {
        user: "Бекжан",
        review: "Рекомендую всем, кто любит яркие цвета и качество.",
      },
    ],
  },
  {
    id: 6,
    name: "Nightfall Bloom",
    price: "$79",
    img: "https://i.pinimg.com/736x/67/b2/2e/67b22e72e56503c7b2f1ff5d55ab991f.jpg",
    category: "Hoodies",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.3,
    reviews: [
      {
        user: "Диана",
        review: "Милый и удобный худи, но хотелось бы больше размера.",
      },
      { user: "Ержан", review: "Хороший продукт, но немного дороговато." },
    ],
  },
  {
    id: 7,
    name: "Ashen Dusk",
    price: "$39",
    img: "https://i.pinimg.com/736x/1d/5b/0c/1d5b0c966dce33c8b47688f50ee630c3.jpg",
    category: "Hoodies",
    sizes: ["M", "L"],
    rating: 4.7,
    reviews: [
      {
        user: "Амина",
        review: "Очень нравится, удобный и яркий, подходит под многие вещи.",
      },
      {
        user: "Сергей",
        review: "Хорошая покупка для весны, очень комфортный.",
      },
    ],
  },
  {
    id: 10,
    name: "Carbon Veil",
    price: "$190",
    img: "https://i.pinimg.com/736x/79/29/0f/79290fe785787fbc80dfc172cec8a747.jpg",
    category: "Bottom",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviews: [
      { user: "Айгуль", review: "Удобные штаны, хороший материал!" },
      { user: "Руслан", review: "Хорошо сидят на фигуре." },
    ],
  },
  {
    id: 11,
    name: "Slate Runner",
    price: "$49",
    img: "https://media.glamour.com/photos/6776e5136e848c303bcc37b5/3:4/w_640,c_limit/We%20the%20Free%20Good%20Luck%20Mid-Rise%20Barrel%20Jeans.png",
    category: "Bottom",
    sizes: ["S", "M", "L"],
    rating: 4.0,
    reviews: [
      { user: "Мадина", review: "Очень комфортные штаны." },
      { user: "Данияр", review: "Не совсем по размеру, но в целом неплохо." },
    ],
  },
  {
    id: 12,
    name: "Ghost Thread",
    price: "$15",
    img: "https://i.pinimg.com/736x/58/9f/8e/589f8e0a1432a247422f514eb0dfd93e.jpg",
    category: "Bottom",
    sizes: ["S", "M", "L"],
    rating: 3.8,
    reviews: [
      { user: "Аман", review: "Хорошие штаны, но материал слишком тонкий." },
      { user: "Айжан", review: "Цена низкая, но качество так себе." },
    ],
  },
  {
    id: 13,
    name: "Void Stretch",
    price: "$29",
    img: "https://i.pinimg.com/736x/c5/8d/be/c58dbebfdcf76d2a947fafcbcac9225f.jpg",
    category: "Bottom",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.2,
    reviews: [
      { user: "Нурлан", review: "За такую цену отлично!" },
      {
        user: "Жанна",
        review: "Очень понравились, но хотелось бы побольше размера.",
      },
    ],
  },
  {
    id: 14,
    name: "Titan Flow",
    price: "$210",
    img: "https://i.pinimg.com/736x/8f/7b/21/8f7b21ec68fd415f211e54abd71721a8.jpg",
    category: "Bottom",
    sizes: ["M", "L", "XL"],
    rating: 4.8,
    reviews: [
      { user: "Камила", review: "Прекрасное качество, но дороговато." },
      {
        user: "Бекжан",
        review: "Советую, они действительно стоят этих денег.",
      },
    ],
  },
  {
    id: 15,
    name: "Noir Drift",
    price: "$79",
    img: "https://i.pinimg.com/736x/68/f0/3c/68f03c6383ea1635cc7d4837ac71f244.jpg",
    category: "Bottom",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.4,
    reviews: [
      { user: "Диана", review: "Очень удобные штаны, но немного большеваты." },
      { user: "Ержан", review: "Качество отличное, цена высокая." },
    ],
  },
  {
    id: 16,
    name: "Stone Mirage",
    price: "$59",
    img: "https://i.pinimg.com/736x/66/f9/ae/66f9ae77a3893d1ef28c763807f441ee.jpg",
    category: "Bottom",
    sizes: ["S", "M", "L"],
    rating: 4.1,
    reviews: [
      { user: "Айгуль", review: "Очень стильные и удобные штаны." },
      {
        user: "Руслан",
        review: "Размер немного не совпадает, но в целом норм.",
      },
    ],
  },
  {
    id: 17,
    name: "hrome Dust",
    price: "$39",
    img: "https://media.glamour.com/photos/67d06ca0d4ac068e7882e760/3:4/w_640,c_limit/H&M%20Ava%20Ultra-High-Rise%20Wide-Leg%20Jeans%20.png",
    category: "Bottom",
    sizes: ["S", "M", "L"],
    rating: 4.3,
    reviews: [
      {
        user: "Амина",
        review: "Штаны хорошего качества, но немного жестковатые.",
      },
      { user: "Сергей", review: "Очень удобные и подходят под разные стили." },
    ],
  },
  {
    id: 18,
    name: "Storm Lace",
    price: "$190",
    img: "https://i.pinimg.com/736x/e9/77/fd/e977fdc73a66a8ac752dffc1660fa586.jpg",
    category: "Shoes",
    sizes: ["38", "39", "40", "41", "42"],
    rating: 4.5,
    reviews: [
      { user: "Айгуль", review: "Отличная обувь, очень комфортная!" },
      { user: "Руслан", review: "Немного мала, но в целом хорошая." },
    ],
  },
  {
    id: 19,
    name: "Cloudstep Delta",
    price: "$49",
    img: "https://i.pinimg.com/736x/45/a3/91/45a3910b1a0304bccf3ed15d936f1178.jpg",
    category: "Shoes",
    sizes: ["38", "39", "40"],
    rating: 4.0,
    reviews: [
      { user: "Мадина", review: "Очень удобные, но немного жестковатые." },
      { user: "Данияр", review: "Цена соответствует качеству." },
    ],
  },
  {
    id: 20,
    name: "Crater Kicks",
    price: "$15",
    img: "https://i.pinimg.com/736x/de/62/42/de62421c479571fb84afce84491fc63c.jpg",
    category: "Shoes",
    sizes: ["37", "38", "39"],
    rating: 3.8,
    reviews: [
      {
        user: "Аман",
        review: "Очень дешево, но качество оставляет желать лучшего.",
      },
      {
        user: "Айжан",
        review: "Обувь недорогая, но довольно удобная для коротких прогулок.",
      },
    ],
  },
  {
    id: 21,
    name: "Neo Tread",
    price: "$29",
    img: "https://i.pinimg.com/736x/f1/ca/39/f1ca39f98e39977d75a625bc0bd5ac2a.jpg",
    category: "Shoes",
    sizes: ["39", "40", "41", "42"],
    rating: 4.2,
    reviews: [
      { user: "Нурлан", review: "Удобные и по цене хорошие." },
      {
        user: "Жанна",
        review: "Очень красивые, но маленькая размерная сетка.",
      },
    ],
  },
  {
    id: 22,
    name: "Eclipse Boost",
    price: "$210",
    img: "https://i.pinimg.com/736x/63/c1/cd/63c1cd5aeadc9f55fb63f8e8b19e20af.jpg",
    category: "Shoes",
    sizes: ["40", "41", "42", "43"],
    rating: 4.8,
    reviews: [
      { user: "Камила", review: "Шикарное качество и стильный дизайн!" },
      { user: "Бекжан", review: "Рекомендую за хорошую цену и качество." },
    ],
  },
  {
    id: 23,
    name: "hantom Edge",
    price: "$79",
    img: "https://i.pinimg.com/736x/15/e0/d1/15e0d175ee987c498bff46026c9af8e3.jpg",
    category: "Shoes",
    sizes: ["39", "40", "41"],
    rating: 4.4,
    reviews: [
      { user: "Диана", review: "Очень удобные и стильные." },
      { user: "Ержан", review: "Цена высокая, но качество оправдывает." },
    ],
  },
  {
    id: 24,
    name: "Iron Fade",
    price: "$59",
    img: "https://i.pinimg.com/736x/51/cd/63/51cd6374b8ba3d18488d6626b68c53bf.jpg",
    category: "Shoes",
    sizes: ["38", "39", "40", "41"],
    rating: 4.1,
    reviews: [
      { user: "Айгуль", review: "Очень легкие и комфортные." },
      {
        user: "Руслан",
        review: "Не очень долго носят, но за эту цену отлично.",
      },
    ],
  },
  {
    id: 25,
    name: "Midnight Flex",
    price: "$39",
    img: "https://i.pinimg.com/736x/af/c6/5f/afc65f0aa11a3a4db33056440c9055f6.jpg",
    category: "Shoes",
    sizes: ["37", "38", "39", "40"],
    rating: 4.3,
    reviews: [
      { user: "Амина", review: "Очень стильные и удобные обувь." },
      { user: "Сергей", review: "Отличные для прогулок, очень комфортные." },
    ],
  },
  {
    id: 26,
    name: "Gravity Haul",
    price: "$190",
    img: "https://i.pinimg.com/736x/29/4c/ae/294caeb86113a5f2ce3709de419f2642.jpg",
    category: "Bags",
    rating: 4.5,
    sizes: ["M", "L", "XL"],
    reviews: [
      { user: "Айжан", review: "Очень стильный рюкзак, хорошее качество." },
      { user: "Нурлан", review: "Великолепный рюкзак, удобно носить." },
    ],
  },
  {
    id: 27,
    name: "Nomad Zip",
    price: "$49",
    img: "https://i.pinimg.com/736x/46/47/16/464716e0f70ca9013b90d2ff16941767.jpg",
    category: "Bags",
    rating: 4.0,
    sizes: ["S", "M", "L"],
    reviews: [
      { user: "Динара", review: "Удобный, но немного жесткий." },
      { user: "Ержан", review: "Отличный рюкзак за такую цену!" },
    ],
  },
  {
    id: 28,
    name: "Core Loop",
    price: "$15",
    img: "https://i.pinimg.com/736x/d0/71/02/d07102e94386f771505ee198c0af328a.jpg",
    category: "Bags",
    rating: 3.8,
    sizes: ["M", "L"],
    reviews: [
      { user: "Аман", review: "Не очень долговечный, но за цену сойдет." },
      {
        user: "Асия",
        review: "Дешевый, но подходит для кратковременных прогулок.",
      },
    ],
  },
  {
    id: 29,
    name: "Trail Hatch",
    price: "$29",
    img: "https://i.pinimg.com/736x/1f/6d/1b/1f6d1bd06fb97a6a8e62d9ffe2006a4d.jpg",
    category: "Bags",
    rating: 4.3,
    sizes: ["S", "M"],
    reviews: [
      { user: "Мадина", review: "Простой, но удобный рюкзак." },
      { user: "Нурсултан", review: "Отлично для ежедневного использования." },
    ],
  },
  {
    id: 30,
    name: "Echo Vault",
    price: "$210",
    img: "https://i.pinimg.com/736x/e5/6e/5e/e56e5e4b6dd746dc86822e3ffe722b10.jpg",
    category: "Bags",
    rating: 4.7,
    sizes: ["L", "XL"],
    reviews: [
      {
        user: "Серик",
        review: "Превосходное качество, рюкзак стоит своих денег.",
      },
      { user: "Жанна", review: "Очень удобный и стильный." },
    ],
  },
  {
    id: 31,
    name: "РMono Drift",
    price: "$79",
    img: "https://i.pinimg.com/736x/db/7c/b8/db7cb8ab461c3fd41734ac875001f36b.jpg",
    category: "Bags",
    rating: 4.2,
    sizes: ["M", "L"],
    reviews: [
      { user: "Камила", review: "Рюкзак большой, много места для всего." },
      { user: "Бекжан", review: "Очень удобный и практичный рюкзак." },
    ],
  },
  {
    id: 32,
    name: "Shadow Loop",
    price: "$59",
    img: "https://i.pinimg.com/736x/de/1d/e9/de1de92aa64ed7b8ce4d6d305b51067c.jpg",
    category: "Bags",
    rating: 4.4,
    sizes: ["S", "M"],
    reviews: [
      { user: "Амина", review: "Хороший рюкзак, удобный для города." },
      { user: "Нуржигит", review: "Отличный рюкзак для ежедневных дел." },
    ],
  },
  {
    id: 33,
    name: "inder Pack",
    price: "$39",
    img: "https://i.pinimg.com/736x/bc/eb/68/bceb68890546e83d2f01b42016d7ce68.jpg",
    category: "Bags",
    rating: 4.0,
    sizes: ["M", "L"],
    reviews: [
      { user: "Алмагуль", review: "Недорогой и удобный рюкзак для школы." },
      { user: "Сергей", review: "Неплохой рюкзак, но не очень вместительный." },
    ],
  },
  {
    id: 34,
    name: "Lunar Pin",
    price: "$19",
    img: "https://i.pinimg.com/736x/aa/36/aa/aa36aa178cd579eaa7a07e89d43cee5c.jpg",
    category: "Accessories",
    sizes: ["S", "M", "L"],
    rating: 4.5,
    reviews: [
      {
        user: "Айша",
        review: "Очень удобный аксессуар, стильный и качественный.",
      },
      { user: "Мухаммед", review: "Прекрасный товар, я доволен!" },
    ],
  },
  {
    id: 35,
    name: "Mist Chain",
    price: "$25",
    img: "https://i.pinimg.com/736x/8d/98/6c/8d986cbaf0e70b56c8c840cc9d5ac398.jpg",
    category: "Accessories",
    sizes: ["M", "L"],
    rating: 4.3,
    reviews: [
      {
        user: "Нургуль",
        review: "Очень хороший аксессуар, отличный выбор для подарка.",
      },
      { user: "Саян", review: "Немного дороговато, но стоит своих денег." },
    ],
  },
  {
    id: 36,
    name: "Nova Clip",
    price: "$30",
    img: "https://i.pinimg.com/736x/4c/53/29/4c5329cacb560f94bbaa31fe4aa99f34.jpg",
    category: "Accessories",
    sizes: ["L", "XL"],
    rating: 4.2,
    reviews: [
      {
        user: "Данияр",
        review: "Хорошее качество, но хотелось бы больше вариантов цветов.",
      },
      {
        user: "Гульнура",
        review: "Очень стильный аксессуар, замечательно смотрится.",
      },
    ],
  },
  {
    id: 37,
    name: "Drip Knot",
    price: "$22",
    img: "https://i.pinimg.com/736x/25/49/77/254977c3b027887b68a74c8d958cf111.jpg",
    category: "Accessories",
    sizes: ["S"],
    rating: 4.6,
    reviews: [
      { user: "Арман", review: "Очень хороший аксессуар, стоит своих денег." },
      {
        user: "Жанар",
        review: "Сильно понравился, надеюсь будет служить долго.",
      },
    ],
  },
  {
    id: 38,
    name: "Echo Ring",
    price: "$18",
    img: "https://i.pinimg.com/736x/62/94/f2/6294f22934bb1af8318e5ff3663388e1.jpg",
    category: "Accessories",
    sizes: ["M", "L"],
    rating: 4.0,
    reviews: [
      {
        user: "Гульнара",
        review: "Для повседневного использования — отличный выбор.",
      },
      { user: "Тимур", review: "Доволен покупкой, соответствуют ожиданиям." },
    ],
  },
  {
    id: 39,
    name: "Frost Band",
    price: "$20",
    img: "https://i.pinimg.com/736x/e0/57/eb/e057ebb86362f87ad1034efda5838a05.jpg",
    category: "Accessories",
    sizes: ["S", "M"],
    rating: 4.4,
    reviews: [
      { user: "Ирина", review: "Отличное качество, классный дизайн." },
      {
        user: "Алмас",
        review: "Очень понравился аксессуар, буду заказывать еще.",
      },
    ],
  },
  {
    id: 40,
    name: "Velvet Loop",
    price: "$17",
    img: "https://i.pinimg.com/736x/b9/8e/e1/b98ee1bfe66045a9238d8feeba305f37.jpg",
    category: "Accessories",
    sizes: ["L"],
    rating: 4.1,
    reviews: [
      {
        user: "Сабина",
        review: "Очень удобный аксессуар для повседневной жизни.",
      },
      { user: "Илья", review: "Хорошая вещь, но немного великоват." },
    ],
  },
  {
    id: 41,
    name: "Ash Pendant",
    price: "$24",
    img: "https://i.pinimg.com/736x/5f/b9/77/5fb9771549b00562ef5feff314957840.jpg",
    category: "Accessories",
    sizes: ["M"],
    rating: 4.5,
    reviews: [
      { user: "Мадина", review: "Очень стильный и качественный аксессуар." },
      { user: "Станислав", review: "Отлично подходит для вечерних выходов." },
    ],
  },
  {
    id: 42,
    name: "Grav Charm",
    price: "$28",
    img: "https://i.pinimg.com/736x/47/23/42/472342815fe898b0372cba22a996699d.jpg",
    category: "Accessories",
    sizes: ["M", "L"],
    rating: 4.3,
    reviews: [
      { user: "Диана", review: "Очень красивый и качественный аксессуар." },
      { user: "Данияр", review: "Товар полностью соответствует описанию." },
    ],
  },
  {
    id: 43,
    name: "Quartz Halo",
    price: "$32",
    img: "https://i.pinimg.com/736x/4d/c3/70/4dc3702bae622f4bfea9398ebd72fd8e.jpg",
    category: "Accessories",
    sizes: ["S", "M"],
    rating: 4.2,
    reviews: [
      { user: "Малика", review: "Довольно хороший аксессуар, рекомендую." },
      { user: "Руслан", review: "Как всегда, все на высоте!" },
    ],
  },
  {
    id: 44,
    name: "Iris Link",
    price: "$99",
    img: "https://i.pinimg.com/736x/49/df/d6/49dfd647994e9498fa1d437a92642f88.jpg",
    category: "Jewelry",
    sizes: ["S", "M", "L"],
    rating: 4.7,
    reviews: [
      { user: "Анастасия", review: "Очень стильное кольцо, рекомендую." },
      { user: "Данияр", review: "Отличное кольцо, идеально подошло!" },
    ],
  },
  {
    id: 45,
    name: "Clestine Crown",
    price: "$120",
    img: "https://i.pinimg.com/736x/3a/98/9a/3a989aabd38e387de638bc533c733c11.jpg",
    category: "Jewelry",
    sizes: ["M", "L"],
    rating: 4.5,
    reviews: [
      {
        user: "Нурсултан",
        review: "Очень красивое ожерелье, стоит своих денег.",
      },
      { user: "Лейла", review: "Очень понравилось! Идеальный подарок." },
    ],
  },
  {
    id: 46,
    name: "Lucid Stone",
    price: "$85",
    img: "https://i.pinimg.com/736x/7d/60/d7/7d60d726f72d6706c2b4760b17d86abb.jpg",
    category: "Jewelry",
    sizes: ["S", "M"],
    rating: 4.3,
    reviews: [
      {
        user: "Светлана",
        review: "Очень элегантное колье, отличное качество.",
      },
      { user: "Эмиль", review: "Отличный выбор для вечернего выхода." },
    ],
  },
  {
    id: 47,
    name: "Obsidian Veil",
    price: "$110",
    img: "https://i.pinimg.com/736x/0c/02/5e/0c025ee232eefe810b8c92342854b0ff.jpg",
    category: "Jewelry",
    sizes: ["L", "XL"],
    rating: 4.6,
    reviews: [
      { user: "Дина", review: "Очень красивое, идеально подошло." },
      { user: "Арман", review: "Шикарный выбор для подарка." },
    ],
  },
  {
    id: 48,
    name: "Myth Glow",
    price: "$140",
    img: "https://i.pinimg.com/736x/bd/2f/3e/bd2f3e3c9efb5cd2093c1fbfb14ee521.jpg",
    category: "Jewelry",
    sizes: ["M", "L"],
    rating: 4.8,
    reviews: [
      { user: "Камила", review: "Превосходное качество, рекомендую всем." },
      { user: "Мира", review: "Очень довольна покупкой, превосходный товар!" },
    ],
  },
  {
    id: 49,
    name: "Solstice Band",
    price: "$160",
    img: "https://i.pinimg.com/736x/82/c7/b0/82c7b0e69c44eff66efa2190ab7ad4bd.jpg",
    category: "Jewelry",
    sizes: ["S", "M"],
    rating: 4.9,
    reviews: [
      { user: "Гульназ", review: "Идеально подходит для любых мероприятий." },
      { user: "Жанель", review: "Очень элегантное кольцо, всем рекомендую!" },
    ],
  },
  {
    id: 50,
    name: "Stellar Bloom",
    price: "$99",
    img: "https://i.pinimg.com/736x/4c/6a/3a/4c6a3aaafd272e4ee0dae4a44883314c.jpg",
    category: "Jewelry",
    sizes: ["M", "L"],
    rating: 4.4,
    reviews: [
      { user: "Алина", review: "Красивое и качественное украшение." },
      { user: "Дмитрий", review: "Прекрасное качество, идеальный подарок." },
    ],
  },
  {
    id: 51,
    name: "Amber Crest",
    price: "$105",
    img: "https://i.pinimg.com/736x/d8/64/a4/d864a4b3087d9a08eb7ec0dd9b368ee2.jpg",
    category: "Tops",
    sizes: ["S", "M", "L"],
    rating: 4.4,
    reviews: [
      { user: "Мария", review: "Очень красивый топ, стильный и удобный." },
      { user: "Алексей", review: "Отличное качество, размер подошел." },
    ],
  },
  {
    id: 52,
    name: "Nova Drape",
    price: "$130",
    img: "https://i.pinimg.com/736x/48/0e/72/480e7225ef3f6d8c22708b81a7b44644.jpg",
    category: "Tops",
    sizes: ["M", "L"],
    rating: 4.7,
    reviews: [
      { user: "Оля", review: "Топ красивый, идеально сидит." },
      { user: "Руслан", review: "Очень качественная ткань, рекомендую." },
    ],
  },
  {
    id: 53,
    name: "Velvet Syntax",
    price: "$115",
    img: "https://i.pinimg.com/736x/6d/31/51/6d315192a83db4b45a77966ec1b6331e.jpg",
    category: "Tops",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviews: [
      { user: "Ирина", review: "Очень стильный топ, сидит как влитой." },
      { user: "Вадим", review: "Хорошая модель для повседневной носки." },
    ],
  },
  {
    id: 54,
    name: "Moonlite Fold",
    price: "$99",
    img: "https://i.pinimg.com/736x/a8/7b/ea/a87bea3b7e5418659db28a46b36277a9.jpg",
    category: "Tops",
    sizes: ["S", "M"],
    rating: 4.6,
    reviews: [
      { user: "Ксения", review: "Идеальный топ для летнего сезона." },
      { user: "Денис", review: "Очень удобно, ткань приятная на ощупь." },
    ],
  },
  {
    id: 55,
    name: "zure Thread",
    price: "$125",
    img: "https://cdna.lystit.com/photos/baltini/080d7cb1/diesel-Brown-Tank-Top.jpeg",
    category: "Tops",
    sizes: ["M", "L", "XL"],
    rating: 4.8,
    reviews: [
      {
        user: "Светлана",
        review: "Очень нравится, отличный топ для вечеринок.",
      },
      { user: "Михаил", review: "Топ хорошего качества, размер подошел." },
    ],
  },
  {
    id: 56,
    name: "Drift Echo",
    price: "$135",
    img: "https://cdna.lystit.com/200/250/tr/photos/baltini/2bc02403/diesel-Black-M-vera-ls-Off-the-shoulder-Top-In-Ribbed-Knit.jpeg",
    category: "Tops",
    sizes: ["S", "M", "L"],
    rating: 4.7,
    reviews: [
      { user: "Гуля", review: "Очень комфортный топ, выглядит шикарно." },
      { user: "Егор", review: "Очень стильный топ, мне понравился." },
    ],
  },
  {
    id: 57,
    name: "Shadow Stitch",
    price: "$150",
    img: "https://cdna.lystit.com/200/250/tr/photos/cettire/5f1b3a97/diesel-White-M-Valary-Logo-Plaque-Cropped-Ribbed-Top.jpeg",
    category: "Tops",
    sizes: ["M", "L"],
    rating: 4.9,
    reviews: [
      { user: "Алия", review: "Топ просто супер! Очень элегантный." },
      { user: "Марина", review: "Отличное качество ткани, всем рекомендую!" },
    ],
  },
  {
    id: 58,
    name: "Frostline Curve",
    price: "$145",
    img: "https://i.pinimg.com/736x/e6/31/3f/e6313fca66519788206c6de28e72fddb.jpg",
    category: "Tops",
    sizes: ["S", "M", "L"],
    rating: 4.6,
    reviews: [
      { user: "Ирина", review: "Топ сидит идеально, прекрасный цвет." },
      { user: "Наталья", review: "Очень красивый, но размер немного мал." },
    ],
  },
  {
    id: 59,
    name: "Urban Mirage",
    price: "$95",
    img: "https://i.pinimg.com/736x/f3/2b/02/f32b02389d0b77c8a6d7236b8f88ada0.jpg",
    category: "More",
    sizes: ["S", "M", "L"],
    rating: 4.3,
    reviews: [
      { user: "Алина", review: "Очень качественный продукт, удобно носить." },
      { user: "Сергей", review: "Цена соответствует качеству." },
    ],
  },
  {
    id: 60,
    name: "Homad Echo",
    price: "$85",
    img: "https://i.pinimg.com/736x/25/54/de/2554deb8074089ce127b4619b6e445f3.jpg",
    category: "More",
    sizes: ["M", "L"],
    rating: 4.6,
    reviews: [
      { user: "Екатерина", review: "Отличное качество за такую цену!" },
      { user: "Дмитрий", review: "Удобно и стильно, мне понравилось." },
    ],
  },
  {
    id: 61,
    name: "Sable Drift",
    price: "$75",
    img: "https://i.pinimg.com/736x/99/5c/b8/995cb81ddbbb0b4f6abd5c58d41fbc89.jpg",
    category: "More",
    sizes: ["S", "M"],
    rating: 4.2,
    reviews: [
      { user: "Ирина", review: "Не самый лучший, но за такую цену норм." },
      { user: "Максим", review: "Удобный, но немного мал." },
    ],
  },
  {
    id: 62,
    name: "Twilight Edge",
    price: "$110",
    img: "https://i.pinimg.com/736x/ac/16/84/ac1684d45d93cda8f3567cc14140ecf0.jpg",
    category: "More",
    sizes: ["M", "L", "XL"],
    rating: 4.7,
    reviews: [
      { user: "Татьяна", review: "Очень нравится, супер качественно." },
      { user: "Илья", review: "Прекрасный продукт, советую!" },
    ],
  },
  {
    id: 63,
    name: "Fogbound Thread",
    price: "$88",
    img: "https://i.pinimg.com/736x/c3/64/fc/c364fc2f3c0c7c2c1fd417f82caa7cc1.jpg",
    category: "More",
    sizes: ["S", "M"],
    rating: 4.5,
    reviews: [
      { user: "Марина", review: "Очень хороший продукт, удобно носить." },
      { user: "Кирилл", review: "Качество на высоте, размер подошел." },
    ],
  },
  {
    id: 64,
    name: "Nomura Flow",
    price: "$115",
    img: "https://i.pinimg.com/736x/a8/b8/66/a8b866369182725b4718f115fb03f047.jpg",
    category: "More",
    sizes: ["M", "L"],
    rating: 4.6,
    reviews: [
      { user: "Алина", review: "Очень стильный и удобный." },
      { user: "Денис", review: "Супер качество, отлично сидит." },
    ],
  },
  {
    id: 65,
    name: "Halo Frequency",
    price: "$99",
    img: "https://media.glamour.com/photos/67f5857b976f932a0a6382ee/3:4/w_640,c_limit/Layer_6-005.jpg",
    category: "More",
    sizes: ["S", "M", "L"],
    rating: 4.4,
    reviews: [
      { user: "Светлана", review: "Очень удобный, приятный на ощупь." },
      { user: "Артем", review: "Хороший продукт, рекомендую." },
    ],
  },
  {
    id: 66,
    name: "Wraith Stitch",
    price: "$105",
    img: "https://cdna.lystit.com/300/375/tr/photos/cettire/c5f51fe9/diesel-Grey-G-Khlow-N1-Logo-Embroidered-Zipped-Jacket.jpeg",
    category: "More",
    sizes: ["S", "M"],
    rating: 4.7,
    reviews: [
      { user: "Елена", review: "Прекрасный продукт, отличное качество." },
      { user: "Александр", review: "Превосходный выбор за эту цену." },
    ],
  },
];

export default function ProductPage() {
  const { id } = useParams(); // Получаем ID продукта из URL
  const product = products.find((prod) => prod.id.toString() === id); // Ищем товар по ID

  const navigate = useNavigate(); // Хук для навигации

  if (!product) {
    return <div>Продукт не найден</div>; // Если продукт не найден
  }

  // Стейт для выбранного размера
  const [selectedSize, setSelectedSize] = React.useState(null);

  const handleSizeClick = (size) => {
    setSelectedSize(size); // Устанавливаем выбранный размер
  };

  // Функция для обработки клика по кнопке "Заказать"
  const handleOrderClick = () => {
    // Переход на страницу оплаты с передачей товара и выбранного размера
    navigate("/payment", { state: { product, selectedSize } });
  };

  return (
    <div className="product-page">
      {/* Основная информация о товаре */}
      <div className="product-info">
        <div className="product-image">
          <img src={product.img} alt={product.name} />
        </div>
        <div className="product-details">
          <h1>{product.name}</h1>
          {/* Добавил описание товара, если оно есть */}
          <p>{product.description || "Описание товара отсутствует."}</p>
          <p className="price">{product.price} </p>

          {/* Отображение размеров */}
          <div className="sizes">
            <h3>Доступные размеры:</h3>
            <ul>
              {product.sizes.map((size, index) => (
                <li key={index}>
                  <button
                    className={`size-btn ${
                      selectedSize === size ? "selected" : ""
                    }`}
                    onClick={() => handleSizeClick(size)}>
                    {size}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Кнопка заказать */}
          <button
            className="order-button"
            onClick={handleOrderClick}
            disabled={!selectedSize}>
            Заказать
          </button>

          {/* Рейтинг товара */}
          <div className="rating">
            <p>Рейтинг: {product.rating} / 5</p>
            <div className="stars">
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  className={`star ${
                    index < Math.round(product.rating) ? "filled" : ""
                  }`}>
                  &#9733;
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Отзывы */}
      <div className="reviews">
        <h2>Отзывы:</h2>
        {product.reviews.map((review, index) => (
          <div key={index} className="review">
            <p>
              <strong>{review.user}</strong>: {review.review}
            </p>
            <div className="stars">
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  className={`star ${
                    index < Math.round(product.rating) ? "filled" : ""
                  }`}>
                  &#9733;
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
