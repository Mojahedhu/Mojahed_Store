import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  QueryActionCreatorResult,
  QueryDefinition,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import type { OrderDTO } from "./redux/features/order/orderTypes";

type Refetch = () => QueryActionCreatorResult<
  QueryDefinition<
    string,
    BaseQueryFn<
      string | FetchArgs,
      unknown,
      FetchBaseQueryError,
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      {},
      FetchBaseQueryMeta
    >,
    "User" | "Category" | "Product" | "Order",
    OrderDTO,
    "api",
    unknown
  >
>;
export const waitForOrderToBePaid = async (refetch: Refetch) => {
  for (let i = 0; i < 6; i++) {
    // retry 6 times
    const updated = await refetch().unwrap();

    if (updated?.isPaid) {
      return true;
    }

    // wait 2 seconds before retrying
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return false;
};
