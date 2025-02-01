import { atom } from "recoil";

const _ = atom({
  key: "adminStorage",
  default: {
    statistics: null,
    categories: null,
    categoryId: null,
    products: null,
    productId: null,
    warehouses: null,
    usersList: null,
    feedback: null,
    feedbackId: null,
    promocodes: null,
    orders: null,
    orderId: null,
  },
});

export default _;
