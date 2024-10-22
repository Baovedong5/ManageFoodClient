import http from "@/lib/http";
import {
  AccountListResType,
  AccountResType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import {
  ChangePasswordBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/auth.schema";

const accountApiRequest = {
  me: () => http.get<AccountResType>("/auth/me"),
  updateMe: (body: UpdateMeBodyType) =>
    http.patch<AccountResType>("/auth/me", body),
  changePassword: (body: ChangePasswordBodyType) =>
    http.patch<AccountResType>("/auth/change-password", body),
  list: () => http.get<AccountListResType>("/accounts"),
  addEmployee: (body: CreateEmployeeAccountBodyType) =>
    http.post<AccountResType>(`/accounts`, body),
  updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) =>
    http.patch<AccountResType>(`/accounts/${id}`, body),
  getEmployee: (id: number) => http.get<AccountResType>(`/accounts/${id}`),
  deleteEmployee: (id: number) =>
    http.delete<AccountResType>(`/accounts/${id}`),
};

export default accountApiRequest;
