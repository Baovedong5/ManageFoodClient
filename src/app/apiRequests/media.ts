import http from "@/lib/http";
import { uploadMediaResType } from "@/schemaValidations/media.schema";

export const mediaApiRequest = {
  upload: (formData: FormData, type: string) =>
    http.post<uploadMediaResType>("/files/upload", formData, {
      headers: {
        folder_type: `${type}`,
      },
    }),
};

export default mediaApiRequest;
