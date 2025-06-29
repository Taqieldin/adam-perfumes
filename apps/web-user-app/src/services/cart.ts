import { Cart, CartItem } from '../../../shared/types/cart';
import { Product } from '../../../shared/types/product';
import { Coupon } from '../../../shared/types/coupon';
import apiService from './api';

export interface AddToCartData {
  productId: string;
  variantSku?: string;
  quantity: number;
  customizations?: Record<string, any>;
}

export interface UpdateCartItemData {
  quantity: number;
  customizations?: Record<string, any>;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
  couponCode?: string;
  loyaltyPointsUsed: number;
  loyaltyPointsDiscount: number;
}

class CartService {
  // Get current cart
  async getCart(): Promise<Cart | null> {
    try {
      return await apiService.get<Cart>('/cart');
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // Add item to cart
  async addToCart(data: AddToCartData): Promise<Cart> {
    return apiService.post<Cart>('/cart/items', data);
  }

  // Update cart item
  async updateCartItem(itemId: string, data: UpdateCartItemData): Promise<Cart> {
    return apiService.put<Cart>(`/cart/items/${itemId}`, data);
  }

  // Remove item from cart
  async removeFromCart(itemId: string): Promise<Cart> {
    return apiService.delete<Cart>(`/cart/items/${itemId}`);
  }

  // Clear entire cart
  async clearCart(): Promise<void> {
    return apiService.delete('/cart');
  }

  // Get cart summary
  async getCartSummary(): Promise<CartSummary> {
    return apiService.get<CartSummary>('/cart/summary');
  }

  // Apply coupon
  async applyCoupon(couponCode: string): Promise<Cart> {
    return apiService.post<Cart>('/cart/coupon', { couponCode });
  }

  // Remove coupon
  async removeCoupon(): Promise<Cart> {
    return apiService.delete<Cart>('/cart/coupon');
  }

  // Validate coupon
  async validateCoupon(couponCode: string): Promise<{
    valid: boolean;
    coupon?: Coupon;
    error?: string;
  }> {
    try {
      const coupon = await apiService.get<Coupon>(`/coupons/validate/${couponCode}`);
      return { valid: true, coupon };
    } catch (error: any) {
      return { 
        valid: false, 
        error: error.response?.data?.message || 'Invalid coupon code' 
      };
    }
  }

  // Apply loyalty points
  async applyLoyaltyPoints(points: number): Promise<Cart> {
    return apiService.post<Cart>('/cart/loyalty-points', { points });
  }

  // Remove loyalty points
  async removeLoyaltyPoints(): Promise<Cart> {
    return apiService.delete<Cart>('/cart/loyalty-points');
  }

  // Calculate shipping
  async calculateShipping(addressId: string): Promise<{
    cost: number;
    estimatedDelivery: string;
    options: Array<{
      id: string;
      name: string;
      cost: number;
      estimatedDelivery: string;
    }>;
  }> {
    return apiService.post('/cart/shipping', { addressId });
  }

  // Set shipping method
  async setShippingMethod(methodId: string): Promise<Cart> {
    return apiService.post<Cart>('/cart/shipping-method', { methodId });
  }

  // Check item availability
  async checkItemsAvailability(): Promise<{
    available: boolean;
    unavailableItems: Array<{
      itemId: string;
      productId: string;
      reason: string;
    }>;
  }> {
    return apiService.get('/cart/availability');
  }

  // Get recommended products based on cart
  async getCartRecommendations(limit: number = 4): Promise<Product[]> {
    return apiService.get<Product[]>(`/cart/recommendations?limit=${limit}`);
  }

  // Save cart for later (for guest users)
  async saveCartForLater(email: string): Promise<{ token: string }> {
    return apiService.post('/cart/save', { email });
  }

  // Restore saved cart
  async restoreCart(token: string): Promise<Cart> {
    return apiService.post<Cart>('/cart/restore', { token });
  }

  // Merge guest cart with user cart
  async mergeCart(guestCartId: string): Promise<Cart> {
    return apiService.post<Cart>('/cart/merge', { guestCartId });
  }

  // Get cart item count
  async getCartItemCount(): Promise<number> {
    try {
      const cart = await this.getCart();
      return cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
    } catch (error) {
      return 0;
    }
  }

  // Quick add to cart (for product listings)
  async quickAddToCart(productId: string, quantity: number = 1): Promise<{
    success: boolean;
    message: string;
    cartItemCount: number;
  }> {
    try {
      await this.addToCart({ productId, quantity });
      const itemCount = await this.getCartItemCount();
      return {
        success: true,
        message: 'Product added to cart',
        cartItemCount: itemCount
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add product to cart',
        cartItemCount: await this.getCartItemCount()
      };
    }
  }

  // Update multiple cart items
  async updateMultipleItems(updates: Array<{
    itemId: string;
    quantity: number;
  }>): Promise<Cart> {
    return apiService.put<Cart>('/cart/items/bulk', { updates });
  }

  // Get cart totals breakdown
  async getCartTotals(): Promise<{
    subtotal: number;
    discounts: Array<{
      type: 'coupon' | 'loyalty' | 'promotion';
      name: string;
      amount: number;
    }>;
    taxes: Array<{
      name: string;
      rate: number;
      amount: number;
    }>;
    shipping: {
      cost: number;
      method: string;
    };
    total: number;
  }> {
    return apiService.get('/cart/totals');
  }

  // Estimate delivery time
  async estimateDelivery(addressId: string): Promise<{
    standard: string;
    express: string;
    sameDay?: string;
  }> {
    return apiService.get(`/cart/delivery-estimate?addressId=${addressId}`);
  }

  // Check if cart has digital products
  async hasDigitalProducts(): Promise<boolean> {
    const cart = await this.getCart();
    return cart?.items.some(item => item.product?.isDigital) || false;
  }

  // Get cart weight (for shipping calculation)
  async getCartWeight(): Promise<number> {
    const cart = await this.getCart();
    return cart?.items.reduce((total, item) => {
      const weight = item.product?.weight || 0;
      return total + (weight * item.quantity);
    }, 0) || 0;
  }
}

export const cartService = new CartService();
export default cartService;