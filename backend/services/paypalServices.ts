import axios from "axios";
import { AppError } from "../utils/AppError.js";

type CaptureResponse = {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
  purchase_units: {
    amount_value: string;
    payments: {
      captures: {
        id: string;
        status: string;
        update_time: string;
        amount: {
          value: string;
          currency_code: string;
        };
        links: {
          href: string;
          rel: string;
          method: string;
        }[];
      }[];
    };
  }[];
  payer: {
    email_address: string;
  };
};

// 1️⃣ PayPal Verification Service (Server → PayPal)
const PAYPAL_API = process.env.PAYPAL_API || "https://api-m.sandbox.paypal.com";

export const getAccessToken = async (): Promise<string> => {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
  ).toString("base64");

  const { data }: { data: { access_token: string } } = await axios.post(
    `${PAYPAL_API}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
  return data.access_token;
};

export const verifyPayPalOrder = async (
  paypalOrderId: string,
  expectedAmount: string,
) => {
  const accessToken = await getAccessToken();
  console.log("*".repeat(20));
  console.log("CAPTURING PAYPAL ORDER:", paypalOrderId);

  const { data } = await axios.get(
    `${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  console.log("ORDER STATUS:", data.status);
  console.log("INTENT:", data.intent);

  try {
    // 🔥 CAPTURE ORDER DIRECTLY
    const {
      data: captureData,
    }: {
      data: CaptureResponse;
    } = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const capture = captureData.purchase_units?.[0].payments?.captures?.[0];

    console.log("ORDER STATUS:", captureData.status);
    console.log("CAPTURE STATUS:", capture?.status);

    console.log("Amount", capture.amount);
    console.log("Capture Data", captureData);
    console.log("Capture ", capture);

    if (!capture) {
      throw new AppError("PayPal capture failed ", 400);
    }

    if (capture?.status !== "COMPLETED") {
      throw new AppError("PayPal Payment not completed", 400);
    }

    if (capture.amount.value !== expectedAmount) {
      throw new AppError("Amount mismatch", 400);
    }

    return {
      id: capture.id,
      status: capture.status,
      update_time: capture.update_time,
      email_address: captureData.payer.email_address,
    };
  } catch (error) {
    console.log("PAYPAL CAPTURE ERROR:");
    const err = error as {
      response: {
        status: number;
        data: {
          name: string;
          message: string;
          debug_id: string;
        };
      };
    };
    console.log(err.response?.data); // 🔥 THIS IS WHAT WE NEED
    console.log(err.response?.status);
    throw new AppError(err.response?.data.message, err.response?.status);
  }
};
