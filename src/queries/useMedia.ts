import mediaApiRequest from "@/app/apiRequests/media";
import { useMutation } from "@tanstack/react-query";

export const useUploadMediaMutation = () => {
  return useMutation({
    mutationFn: (data: { formData: FormData; type: string }) =>
      mediaApiRequest.upload(data.formData, data.type),
  });
};
