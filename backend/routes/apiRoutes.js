import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import {
    addMyBlacklistItem,
    addOrUpdateCartItem,
    createBooking,
    createDestination,
    createPayment,
    createPaymentMethod,
    createSpinOffer,
    createSupportTicket,
    deleteDestination,
    deletePaymentMethod,
    getDestinationById,
    getHelpTopicBySlug,
    getMe,
    getMyBlacklist,
    getMyPreferences,
    getMyProfile,
    getPublishedBlogPostBySlug,
    listCartItems,
    listDestinations,
    listFaqs,
    listHelpTopics,
    listMyBookings,
    listMyPaymentMethods,
    listMyPayments,
    listMySpinOffers,
    listMySupportTickets,
    listPublishedBlogPosts,
    listTestimonials,
    removeCartItem,
    removeMyBlacklistItem,
    updateBookingStatus,
    updateDestination,
    updateSpinOfferStatus,
    upsertMyPreferences,
    upsertMyProfile
} from '../controllers/apiController.js';

const router = express.Router();

router.get('/destinations', listDestinations);
router.get('/destinations/:id', getDestinationById);
router.get('/faqs', listFaqs);
router.get('/help-topics', listHelpTopics);
router.get('/help-topics/:slug', getHelpTopicBySlug);
router.get('/testimonials', listTestimonials);
router.get('/blog-posts', listPublishedBlogPosts);
router.get('/blog-posts/:slug', getPublishedBlogPostBySlug);

router.get('/me', authenticateToken, getMe);
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

router.get('/me/spin-offers', authenticateToken, listMySpinOffers);
router.post('/me/spin-offers', authenticateToken, createSpinOffer);
router.patch('/me/spin-offers/:offerId/status', authenticateToken, updateSpinOfferStatus);

router.get('/me/bookings', authenticateToken, listMyBookings);
router.post('/me/bookings', authenticateToken, createBooking);
router.patch('/me/bookings/:bookingId/status', authenticateToken, updateBookingStatus);

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
