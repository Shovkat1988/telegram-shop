import { selector } from "recoil";
import _ from "/src/storage/atoms/main";

export const getPlatform = selector({
  key: "getPlatform",
  get: ({ get }) => get(_).platform,
});

export const getUserData = selector({
  key: "getUserData",
  get: ({ get }) => get(_).userData,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      userData: newValue,
    }));
  },
});

export const getCategories = selector({
  key: "getCategories",
  get: ({ get }) => get(_).categories,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      categories: newValue,
    }));
  },
});

export const getProducts = selector({
  key: "getProducts",
  get: ({ get }) => get(_).products,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      products: newValue,
    }));
  },
});

export const getCategoryId = selector({
  key: "getCategoryId",
  get: ({ get }) => get(_).categoryId,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      categoryId: newValue,
    }));
  },
});

export const getCart = selector({
  key: "getCart",
  get: ({ get }) => get(_).cart,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      cart: newValue,
    }));
  },
});

export const getIsUploading = selector({
  key: "getIsUploading",
  get: ({ get }) => get(_).isUploading,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      isUploading: newValue,
    }));
  },
});

export const getProductId = selector({
  key: "getProductId",
  get: ({ get }) => get(_).productId,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      productId: newValue,
    }));
  },
});

export const getTitle = selector({
  key: "getTitle",
  get: ({ get }) => get(_).title,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      title: newValue,
    }));
  },
});

export const getTotalPrice = selector({
  key: "getTotalPrice",
  get: ({ get }) => get(_).totalPrice,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      totalPrice: newValue,
    }));
  },
});

export const getActivePanel = selector({
  key: "getActivePanel",
  get: ({ get }) => get(_).activePanel,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      activePanel: newValue,
    }));
  },
});

export const getOrderData = selector({
  key: "getOrderData",
  get: ({ get }) => get(_).orderData,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      orderData: newValue,
    }));
  },
});

export const getFeedback = selector({
  key: "getFeedback",
  get: ({ get }) => get(_).feedback,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      feedback: newValue,
    }));
  },
});

export const getOrders = selector({
  key: "getOrders",
  get: ({ get }) => get(_).orders,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      orders: newValue,
    }));
  },
});

export const getOrderId = selector({
  key: "getOrderId",
  get: ({ get }) => get(_).orderId,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      orderId: newValue,
    }));
  },
});
