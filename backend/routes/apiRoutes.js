import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import {
    addMyBlacklistItem,
    addOrUpdateCartItem,
    checkoutCart,
    clearCart,
    createBooking,
    createDestination,
    createPayFastCheckout,
    createPayment,
    createPaymentMethod,
    createSpinOffer,
    createSupportTicket,
    deleteMyAccount,
    deleteMyBooking,
    deleteDestination,
    deletePaymentMethod,
    getDestinationById,
    getHelpTopicBySlug,
    getMe,
    getMyBookingById,
    getMyBlacklist,
    getMyPayFastPayment,
    getMyPreferences,
    getMyProfile,
    getPublishedBlogPostBySlug,
    listCartItems,
    listDestinations,
    listDestinationsByRegion,
    listFeaturedDestinations,
    listFaqs,
    listHelpTopics,
    listMyBookings,
    listMyPaymentMethods,
    listMyPayments,
    listMySpinOffers,
    listMySupportTickets,
    listPublishedBlogPosts,
    listTestimonials,
    handlePayFastCancel,
    handlePayFastNotify,
    handlePayFastReturn,
    removeCartItem,
    removeMyBlacklistItem,
    searchDestinations,
    updateBookingStatus,
    updateCartItemQuantity,
    updateDestination,
    updateSpinOfferStatus,
    upsertMyPreferences,
    upsertMyProfile
} from '../controllers/apiController.js';

const router = express.Router();

router.get('/destinations', listDestinations);
router.get('/destinations/featured', listFeaturedDestinations);
router.get('/destinations/region/:region', listDestinationsByRegion);
router.get('/destinations/search', searchDestinations);
router.get('/destinations/:id', getDestinationById);
router.get('/faqs', listFaqs);
router.get('/help-topics', listHelpTopics);
router.get('/help-topics/:slug', getHelpTopicBySlug);
router.get('/testimonials', listTestimonials);
router.get('/blog-posts', listPublishedBlogPosts);
router.get('/blog-posts/:slug', getPublishedBlogPostBySlug);

router.get('/me', authenticateToken, getMe);
router.delete('/me/account', authenticateToken, deleteMyAccount);
router.get('/me/profile', authenticateToken, getMyProfile);
router.patch('/me/profile', authenticateToken, upsertMyProfile);
router.get('/me/preferences', authenticateToken, getMyPreferences);
router.patch('/me/preferences', authenticateToken, upsertMyPreferences);

router.get('/me/blacklist', authenticateToken, getMyBlacklist);
router.post('/me/blacklist', authenticateToken, addMyBlacklistItem);
router.delete('/me/blacklist/:destinationId', authenticateToken, removeMyBlacklistItem);

router.get('/me/cart', authenticateToken, listCartItems);
router.post('/me/cart', authenticateToken, addOrUpdateCartItem);
router.delete('/me/cart/:destinationId', authenticateToken, removeCartItem);
router.get('/cart', authenticateToken, listCartItems);
router.post('/cart/items', authenticateToken, addOrUpdateCartItem);
router.put('/cart/items/:itemId', authenticateToken, updateCartItemQuantity);
router.delete('/cart/items/:itemId', authenticateToken, removeCartItem);
router.delete('/cart', authenticateToken, clearCart);
router.post('/cart/checkout', authenticateToken, checkoutCart);
router.post('/payfast/checkout', authenticateToken, createPayFastCheckout);
router.post('/payfast/notify', handlePayFastNotify);
router.get('/payfast/return', handlePayFastReturn);
router.get('/payfast/cancel', handlePayFastCancel);
router.get('/payfast/payments/:paymentId', authenticateToken, getMyPayFastPayment);

router.get('/me/spin-offers', authenticateToken, listMySpinOffers);
router.post('/me/spin-offers', authenticateToken, createSpinOffer);
router.patch('/me/spin-offers/:offerId/status', authenticateToken, updateSpinOfferStatus);

router.get('/me/bookings', authenticateToken, listMyBookings);
router.post('/me/bookings', authenticateToken, createBooking);
router.patch('/me/bookings/:bookingId/status', authenticateToken, updateBookingStatus);
router.delete('/me/bookings/:bookingId', authenticateToken, deleteMyBooking);
router.get('/bookings', authenticateToken, listMyBookings);
router.get('/bookings/:bookingId', authenticateToken, getMyBookingById);
router.post('/bookings', authenticateToken, createBooking);
router.patch('/bookings/:bookingId/status', authenticateToken, updateBookingStatus);
router.delete('/bookings/:bookingId', authenticateToken, deleteMyBooking);

router.get('/me/payment-methods', authenticateToken, listMyPaymentMethods);
router.post('/me/payment-methods', authenticateToken, createPaymentMethod);
router.delete('/me/payment-methods/:paymentMethodId', authenticateToken, deletePaymentMethod);

router.get('/me/payments', authenticateToken, listMyPayments);
router.post('/me/payments', authenticateToken, createPayment);

router.get('/me/support-tickets', authenticateToken, listMySupportTickets);
router.post('/me/support-tickets', authenticateToken, createSupportTicket);

router.post('/admin/destinations', authenticateToken, createDestination);
router.patch('/admin/destinations/:id', authenticateToken, updateDestination);
router.delete('/admin/destinations/:id', authenticateToken, deleteDestination);

export default router;
