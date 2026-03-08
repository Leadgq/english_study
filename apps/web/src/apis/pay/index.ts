import type { CreatePayDto, ResultPay } from "@en/common/pay";
import { serverApi } from "../index";
import type { Response } from "../index.ts";

export const createPay = (createPayDto: CreatePayDto) => {
  return serverApi.post("/pay/create", createPayDto) as Promise<
    Response<ResultPay>
  >;
};
