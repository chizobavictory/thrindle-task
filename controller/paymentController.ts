import axios from 'axios';
import { Request, Response } from 'express';
import {config} from "../utils/config"
const BASE_URL = 'https://api.paystack.co';

export const initializePayment = async (req: Request, res: Response) => {
  const { amount, email } = req.body;

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(
      `${BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amount * 100,
      },
      { headers }
    );

    res.json({
      status: true,
      message: 'successful transaction',
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'failed to initialize transaction',
      data: null,
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  const { reference } = req.params;

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
  };

  try {
    const response = await axios.get(`${BASE_URL}/transaction/verify/${reference}`, { headers });

    res.json({
      status: true,
      message: 'transaction verified',
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'failed to verify transaction',
      data: null,
    });
  }
};

export const listTransactions = async (req: Request, res: Response) => {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
  };

  try {
    const response = await axios.get(`${BASE_URL}/transaction`, { headers });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'failed to retrieve transactions',
      data: null,
    });
  }
};
