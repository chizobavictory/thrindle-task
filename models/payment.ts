import mongoose, { Document, Schema } from 'mongoose';

export interface Transaction extends Document {
  reference: string;
  amount: number;
  email: string;
  status: string;
  // Add more fields as needed
}

const transactionSchema: Schema<Transaction> = new Schema(
  {
    reference: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    email: { type: String, required: true },
    status: { type: String, required: true },
    // Add more fields as needed
  },
  { timestamps: true }
);

const TransactionModel = mongoose.model<Transaction>('Transaction', transactionSchema);

export default TransactionModel;
