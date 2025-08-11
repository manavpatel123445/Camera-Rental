import { validateStock } from './stockValidation';

export interface CartItem {
  _id: string;
  name: string;
  pricePerDay: number;
  quantity: number;
  image?: string;
  rentalDays: number;
  pickupDate?: string;
  dropoffDate?: string;
}

export const validateCart = async (cartItems: CartItem[]): Promise<{
  valid: boolean;
  invalidItems: Array<{
    item: CartItem;
    availableQuantity: number;
    message: string;
  }>;
}> => {
  const invalidItems: Array<{
    item: CartItem;
    availableQuantity: number;
    message: string;
  }> = [];

  for (const item of cartItems) {
    const validation = await validateStock(item._id, item.quantity);
    
    if (!validation.valid) {
      invalidItems.push({
        item,
        availableQuantity: validation.availableQuantity,
        message: validation.message || 'Stock validation failed'
      });
    }
  }

  return {
    valid: invalidItems.length === 0,
    invalidItems
  };
};

export const getCartSummary = async (cartItems: CartItem[]): Promise<{
  totalItems: number;
  totalPrice: number;
  stockIssues: Array<{
    item: CartItem;
    availableQuantity: number;
  }>;
}> => {
  let totalItems = 0;
  let totalPrice = 0;
  const stockIssues: Array<{
    item: CartItem;
    availableQuantity: number;
  }> = [];

  for (const item of cartItems) {
    const validation = await validateStock(item._id, item.quantity);
    
    totalItems += item.quantity;
    totalPrice += item.pricePerDay * item.quantity * item.rentalDays;
    
    if (!validation.valid) {
      stockIssues.push({
        item,
        availableQuantity: validation.availableQuantity
      });
    }
  }

  return {
    totalItems,
    totalPrice,
    stockIssues
  };
};