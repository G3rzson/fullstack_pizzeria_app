export type BasePizzaDtoType = {
  id: string;
  pizzaName: string;
  pizzaPrice32: number;
  pizzaPrice45: number;
  pizzaDescription: string;
};

export type PizzaDtoType = BasePizzaDtoType & {
  image: {
    publicUrl: string;
  } | null;
};

export type AdminPizzaDtoType = BasePizzaDtoType & {
  isAvailableOnMenu: boolean;
  image: {
    id: string;
    pizzaId: string | null;
    publicId: string;
    originalName: string;
    publicUrl: string;
  } | null;
};

export type BasePastaDtoType = {
  id: string;
  pastaName: string;
  pastaPrice: number;
  pastaDescription: string;
};

export type PastaDtoType = BasePastaDtoType & {
  image: {
    publicUrl: string;
  } | null;
};

export type AdminPastaDtoType = BasePastaDtoType & {
  isAvailableOnMenu: boolean;
  image: {
    id: string;
    pastaId: string | null;
    publicId: string;
    publicUrl: string;
    originalName: string;
  } | null;
};

export type BaseDrinkDtoType = {
  id: string;
  drinkName: string;
  drinkPrice: number;
};

export type DrinkDtoType = BaseDrinkDtoType & {
  image: {
    publicUrl: string;
  } | null;
};

export type AdminDrinkDtoType = BaseDrinkDtoType & {
  isAvailableOnMenu: boolean;
  image: {
    id: string;
    drinkId: string | null;
    publicId: string;
    publicUrl: string;
    originalName: string;
  } | null;
};

export type Role = "USER" | "ADMIN";

export type BaseUserDtoType = {
  id: string;
  email: string;
  username: string;
  role: Role;
};

export type AddressDtoType = {
  id: string;
  fullName: string;
  phoneNumber: string;
  postalCode: string;
  city: string;
  street: string;
  houseNumber: string;
  floorAndDoor: string | null;
  isSaved: boolean;
};

export type AdminUserDtoType = BaseUserDtoType & {
  orderAddress: AddressDtoType | null;
};
