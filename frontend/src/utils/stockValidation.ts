export interface Product {
  _id: string;
  name: string;
  quantity: number;
  pricePerDay: number;
  image?: string;
  category: string;
  description?: string;
}

export const validateStock = async (productId: string, requestedQuantity: number = 1): Promise<{
  valid: boolean;
  availableQuantity: number;
  message?: string;
}> => {
  try {
    const response = await fetch(`https://camera-rental-ndr0.onrender.com/api/products/${productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product data');
    }
    
    const product: Product = await response.json();
    
    if (product.quantity <= 0) {
      return {
        valid: false,
        availableQuantity: 0,
        message: 'This product is currently out of stock.'
      };
    }
    
    if (product.quantity < requestedQuantity) {
      return {
        valid: false,
        availableQuantity: product.quantity,
        message: `Only ${product.quantity} ${product.quantity === 1 ? 'unit' : 'units'} available. Please adjust your quantity.`
      };
    }
    
    return {
      valid: true,
      availableQuantity: product.quantity,
      message: 'Stock validation successful'
    };
  } catch (error) {
    console.error('Error validating stock:', error);
    return {
      valid: false,
      availableQuantity: 0,
      message: 'Unable to check stock availability. Please try again.'
    };
  }
};

export const getProductStock = async (productId: string): Promise<number> => {
  try {
    const response = await fetch(`https://camera-rental-ndr0.onrender.com/api/products/${productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product data');
    }
    
    const product: Product = await response.json();
    return product.quantity || 0;
  } catch (error) {
    console.error('Error fetching product stock:', error);
    return 0;
  }
};