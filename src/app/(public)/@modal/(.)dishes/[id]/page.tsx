import dishApi from "@/app/apiRequests/dish";
import { wrapServerApi } from "@/lib/utils";
import DishDetail from "@/app/(public)/dishes/[id]/dish-detail";
import Modal from "./modal";

export default async function DishPage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const data = await wrapServerApi(() => dishApi.getDish(Number(id)));

  const dish = data?.payload?.data;

  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  );
}
