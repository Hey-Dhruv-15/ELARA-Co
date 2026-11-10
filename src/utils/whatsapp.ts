import { CartItem, CheckoutFormData } from '../types';
import { formatINR } from './formatters';

// Configurable Business WhatsApp Number (Sample configuration for demo)
export const BUSINESS_WHATSAPP_CONFIG = {
  phoneNumber: '919876543210', // Configurable international format without '+' or spaces
  displayNumber: '+91 98765 43210',
  brandName: 'ELARA & CO.',
};

export const generateWhatsAppOrderUrl = (
  items: CartItem[],
  customer: Partial<CheckoutFormData>,
  subtotal: number,
  discount: number,
  giftWrapFee: number,
  shippingFee: number,
  total: number
): string => {
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  let message = `*✨ NEW ORDER INQUIRY — ${BUSINESS_WHATSAPP_CONFIG.brandName} ✨*\n`;
  message += `_Date: ${dateStr}_\n\n`;

  message += `*🛍️ ORDER ITEMS:*\n`;
  items.forEach((item, index) => {
    const variantStr = item.selectedVariation
      ? Object.entries(item.selectedVariation)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')
      : '';
    message += `${index + 1}. *${item.product.name}* (Qty: ${item.quantity})\n`;
    if (variantStr) {
      message += `   ↳ _${variantStr}_\n`;
    }
    message += `   ↳ Price: ${formatINR(item.product.price * item.quantity)}\n`;
  });

  message += `\n*🧾 PRICE SUMMARY:*\n`;
  message += `• Subtotal: ${formatINR(subtotal)}\n`;
  if (discount > 0) {
    message += `• Discount: -${formatINR(discount)}\n`;
  }
  if (giftWrapFee > 0) {
    message += `• Premium Gift Wrap: +${formatINR(giftWrapFee)}\n`;
  }
  message += `• Shipping: ${shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}\n`;
  message += `*• Total Payable: ${formatINR(total)}*\n\n`;

  if (customer.fullName || customer.phone || customer.addressLine1) {
    message += `*📦 CUSTOMER & DELIVERY DETAILS:*\n`;
    if (customer.fullName) message += `• Name: ${customer.fullName}\n`;
    if (customer.phone) message += `• Phone: ${customer.phone}\n`;
    if (customer.email) message += `• Email: ${customer.email}\n`;
    if (customer.addressLine1) {
      message += `• Address: ${customer.addressLine1}${
        customer.addressLine2 ? ', ' + customer.addressLine2 : ''
      }, ${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}\n`;
    }
    if (customer.giftMessage) {
      message += `• Special Gift Note: "${customer.giftMessage}"\n`;
    }
  }

  message += `\nHello ELARA & CO.! I would like to place this order with you. Kindly confirm availability and payment details. Thank you! 🌸`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS_WHATSAPP_CONFIG.phoneNumber}?text=${encoded}`;
};
