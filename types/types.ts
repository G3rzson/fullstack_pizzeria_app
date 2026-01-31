export type PizzaType = {
  id: string;
  pizzaName: string;
  pizzaPrice32: number;
  pizzaPrice45: number;
  pizzaDescription: string;
};

export type UserType = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
};
