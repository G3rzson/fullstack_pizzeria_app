export type FrontendPizzaType = {
  pizzaName: string;
  pizzaPrice32: number;
  pizzaPrice45: number;
  pizzaDescription: string;
  isAvailableOnMenu: boolean;
  publicId?: string;
  originalName?: string;
  publicUrl?: string;
  createdBy?: string;
};

export type BackendPizzaType = {
  id: string;
  pizzaName: string;
  pizzaPrice32: number;
  pizzaPrice45: number;
  pizzaDescription: string;
  isAvailableOnMenu: boolean;
  publicId: string | null;
  originalName: string | null;
  publicUrl: string | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
};
