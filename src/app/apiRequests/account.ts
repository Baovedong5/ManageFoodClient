import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";
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
};

export default accountApiRequest;
