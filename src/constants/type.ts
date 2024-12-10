export const Role = {
  Owner: "Owner",
  Employee: "Employee",
  Guest: "Guest",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export const RoleValues = [Role.Owner, Role.Employee, Role.Guest] as const;

export const DishStatus = {
  Available: "Available",
  Unavailable: "Unavailable",
  Hidden: "Hidden",
} as const;

export const DishStatusValues = [
  DishStatus.Available,
  DishStatus.Unavailable,
  DishStatus.Hidden,
] as const;

export const DishCategory = {
  Drink: "Drink",
  Food: "Food",
  Vegetarian: "Vegetarian",
  Dessert: "Dessert",
  Snacks: "Snacks",
} as const;

export const DishCategoryValues = [
  DishCategory.Food,
  DishCategory.Dessert,
  DishCategory.Drink,
  DishCategory.Vegetarian,
  DishCategory.Snacks,
] as const;

export const TableStatus = {
  Available: "Available",
  Hidden: "Hidden",
  Reserved: "Reserved",
} as const;

export const TableStatusValues = [
  TableStatus.Available,
  TableStatus.Hidden,
  TableStatus.Reserved,
] as const;

export const OrderStatus = {
  Pending: "Pending",
  Processing: "Processing",
  Rejected: "Rejected",
  Delivered: "Delivered",
  Paid: "Paid",
} as const;

export const OrderStatusValues = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.Rejected,
  OrderStatus.Delivered,
  OrderStatus.Paid,
] as const;
