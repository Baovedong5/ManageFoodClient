"use client";

import { OrderStatus } from "@/constants/type";
import { useUpdateStatusVnpayMutation } from "@/queries/useOrder";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button, Result } from "antd";
import Link from "next/link";

const ResultPage = () => {
  const searchParams = useSearchParams();

  const paymentRef = searchParams?.get("vnp_TxnRef") ?? "";
  const responseCode = searchParams?.get("vnp_ResponseCode") ?? "";

  const changePaymentStatus = useUpdateStatusVnpayMutation();

  useEffect(() => {
    if (paymentRef) {
      const changeStatus = async () => {
        await changePaymentStatus.mutateAsync({
          status:
            responseCode === "00" ? OrderStatus.Paid : OrderStatus.Rejected,
          paymentRef,
        });
      };

      changeStatus();
    }
  }, [paymentRef]);

  return (
    <>
      {responseCode === "00" ? (
        <Result
          status="success"
          title="Thanh toán thành công"
          subTitle="Hệ thông đã ghi nhận thông tin thanh toán của bạn."
          extra={[
            <Button>
              <Link href={"/"}>Trang Chủ</Link>
            </Button>,
          ]}
        />
      ) : (
        <Result
          status="error"
          title="Giao dịch thanh toán không thành công"
          subTitle="Vui lòng liên hệ nhân viên để được hỗ trợ để được hỗ trợ."
          extra={
            <Button type="primary" key="console">
              <Link href={"/"} type="primary">
                Trang Chủ
              </Link>
            </Button>
          }
        />
      )}
    </>
  );
};

export default ResultPage;
