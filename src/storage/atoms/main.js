import { atom } from "recoil";

const _ = atom({
  key: "mainStorage",
  default: {
    platform: "",
    userData: null,
    categories: null,
    products: null,
    categoryId: null,
    productId: null,
    title: "",
    totalPrice: 0,
    activePanel: "home",
    isUploading: false,
    cart: [],
    orders: null,
    orderId: null,
    feedback: "",
    orderData: {
      full_name: "",
      comment: "",
      address: "",
      payment_type: 0,
      change_from: "",
      phone: "",
      promocode: "",
    },
  },
});

export default _;
