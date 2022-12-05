const resturantItems = [
  {
    _id: 1,
    title: 'Chicken Burger',
    category: 'Food',
    price: 'RS 500',
    image:
      'https://simply-delicious-food.com/wp-content/uploads/2020/08/Bourbon-basted-cheeseburger-2-300x300.jpg',
  },
  {
    _id: 2,
    title: 'Large Pizza',
    category: 'Food',
    price: 'RS 1500',
    image:
      'https://images.deliveryhero.io/image/fd-pk/LH/cziz-hero.jpg?width=300&height=300&quality=45',
  },
  {
    _id: 3,
    title: 'Regular Pepsi',
    category: 'Food',
    price: 'RS 100',
    image:
      'https://hangoverprices.com/wp-content/uploads/2017/08/pepsi-300x300.jpg',
  },
];

export const cartItems = [
  {
    _id: 1,
    image: 'https://i.ibb.co/c1F65jb/Screenshot-1.png',
    title: 'Cafeela Resturant',
    category: 'Resturant',
    rating: 5,
    items: resturantItems,
  },
  {
    _id: 2,
    image: 'https://i.ibb.co/PDhCSXQ/Screenshot-2.png',
    title: 'Subway',
    category: 'Resturant',
    rating: 5,
    items: resturantItems,
  },
];
