import { selector } from "recoil";
import _ from "/src/storage/atoms/admin";

export const getAdminStatistics = selector({
  key: "getAdminStatistics",
  get: ({ get }) => get(_).statistics,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      statistics: newValue,
    }));
  },
});

export const getAdminCategories = selector({
  key: "getAdminCategories",
  get: ({ get }) => get(_).categories,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      categories: newValue,
    }));
  },
});

export const getAdminCategoryId = selector({
  key: "getAdminCategoryId",
  get: ({ get }) => get(_).categoryId,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      categoryId: newValue,
    }));
  },
});

export const getAdminProducts = selector({
  key: "getAdminProducts",
  get: ({ get }) => get(_).products,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      products: newValue,
    }));
  },
});

export const getAdminProductId = selector({
  key: "getAdminProductId",
  get: ({ get }) => get(_).productId,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      productId: newValue,
    }));
  },
});

export const getAdminWarehouses = selector({
  key: "getAdminWarehouses",
  get: ({ get }) => get(_).warehouses,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      warehouses: newValue,
    }));
  },
});

export const getAdminUsersList = selector({
  key: "getAdminUsersList",
  get: ({ get }) => get(_).usersList,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      usersList: newValue,
    }));
  },
});

export const getAdminFeedback = selector({
  key: "getAdminFeedback",
  get: ({ get }) => get(_).feedback,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      feedback: newValue,
    }));
  },
});

export const getAdminFeedbackId = selector({
  key: "getAdminFeedbackId",
  get: ({ get }) => get(_).feedbackId,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      feedbackId: newValue,
    }));
  },
});

export const getAdminPromocodes = selector({
  key: "getAdminPromocodes",
  get: ({ get }) => get(_).promocodes,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      promocodes: newValue,
    }));
  },
});

export const getAdminOrders = selector({
  key: "getAdminOrders",
  get: ({ get }) => get(_).orders,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      orders: newValue,
    }));
  },
});

export const getAdminOrderId = selector({
  key: "getAdminOrderId",
  get: ({ get }) => get(_).orderId,
  set: ({ set }, newValue) => {
    set(_, (prev) => ({
      ...prev,
      orderId: newValue,
    }));
  },
});
