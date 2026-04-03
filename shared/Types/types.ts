export type MenuType = "pizzas" | "pastas" | "drinks";

export type pizzaDtoType = {
  id: string;
  pizzaName: string;
  pizzaPrice32: number;
  pizzaPrice45: number;
  pizzaDescription: string;
  publicUrl: string | null;
};

export type MenuObjectType = PizzaType | PastaType | DrinkType;

export type SimpleResponseType =
  | { success: true; message: string }
  | { success: false; message: string };

export type ActionResponseType<T> =
  | { success: true; message: string; data: T }
  | { success: false; message: string };

export type PizzaType = {
  id: string;
  pizzaName: string;
  pizzaDescription: string;
  pizzaPrice32: number;
  pizzaPrice45: number;
  isAvailableOnMenu: boolean;
  image: {
    id: string;
    pizzaId: string | null;
    publicId: string;
    publicUrl: string;
    originalName: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type PastaType = {
  id: string;
  pastaName: string;
  pastaDescription: string;
  pastaPrice: number;
  isAvailableOnMenu: boolean;
  image: {
    id: string;
    pastaId: string | null;
    publicId: string;
    publicUrl: string;
    originalName: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type DrinkType = {
  id: string;
  drinkName: string;
  drinkPrice: number;
  isAvailableOnMenu: boolean;
  image: {
    id: string;
    drinkId: string | null;
    publicId: string;
    publicUrl: string;
    originalName: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};
