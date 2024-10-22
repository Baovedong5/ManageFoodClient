import http from "@/lib/http";
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";

const dishApi = {
  list: () => http.get<DishListResType>("/dishs"),
  add: (body: CreateDishBodyType) => http.post<DishResType>("/dishs", body),
  getDish: (id: number) => http.get<DishResType>(`/dishs/${id}`),
  updateDish: (id: number, body: UpdateDishBodyType) =>
    http.patch<DishResType>(`/dishs/${id}`, body),
  deleteDish: (id: number) => http.delete<DishResType>(`/dishs/${id}`),
};

export default dishApi;
