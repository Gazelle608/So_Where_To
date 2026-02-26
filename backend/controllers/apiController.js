import dbQuery from '../utils/dbQuery.js';
import crypto from 'crypto';

const toBoolInt = (value) => (value ? 1 : 0);
const payfastEncode = (value) => encodeURIComponent(String(value).trim()).replace(/%20/g, '+');

const buildPayFastSignature = (fields, passphrase = '') => {
    const pairs = Object.entries(fields)
        .filter(([, value]) => value !== undefined && value !== null && String(value) !== '')
        .map(([key, value]) => `${key}=${payfastEncode(value)}`);

    if (passphrase) {
        pairs.push(`passphrase=${payfastEncode(passphrase)}`);
    }

    return crypto.createHash('md5').update(pairs.join('&')).digest('hex');
};

export const getMe = async (req, res) => {
    try {
        const rows = await dbQuery(
            `SELECT user_id, full_name, email, role, email_verified, is_active, created_at, updated_at
             FROM users
             WHERE user_id = ?`,
            [req.user.id]
        );
        if (!rows.length) return res.status(404).json({ message: 'User not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const rows = await dbQuery('SELECT * FROM user_profiles WHERE user_id = ?', [req.user.id]);
        res.json(rows[0] || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const upsertMyProfile = async (req, res) => {
    const { phone, date_of_birth, country, city, avatar_url } = req.body;
    try {
        await dbQuery(
            `INSERT INTO user_profiles (user_id, phone, date_of_birth, country, city, avatar_url)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             phone = VALUES(phone),
             date_of_birth = VALUES(date_of_birth),
             country = VALUES(country),
             city = VALUES(city),
             avatar_url = VALUES(avatar_url)`,
            [req.user.id, phone || null, date_of_birth || null, country || null, city || null, avatar_url || null]
        );

        const rows = await dbQuery('SELECT * FROM user_profiles WHERE user_id = ?', [req.user.id]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMyPreferences = async (req, res) => {
    try {
        const rows = await dbQuery('SELECT * FROM user_preferences WHERE user_id = ?', [req.user.id]);
        if (!rows.length) return res.json(null);

        const pref = rows[0];
        if (typeof pref.preferred_regions === 'string') {
            try {
                pref.preferred_regions = JSON.parse(pref.preferred_regions);
            } catch {
                pref.preferred_regions = [];
            }
        }
        res.json(pref);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const upsertMyPreferences = async (req, res) => {
    const { budget_min, budget_max, preferred_duration_days, preferred_regions } = req.body;
    try {
        await dbQuery(
            `INSERT INTO user_preferences (user_id, budget_min, budget_max, preferred_duration_days, preferred_regions)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             budget_min = VALUES(budget_min),
             budget_max = VALUES(budget_max),
             preferred_duration_days = VALUES(preferred_duration_days),
             preferred_regions = VALUES(preferred_regions)`,
            [
                req.user.id,
                budget_min ?? null,
                budget_max ?? null,
                preferred_duration_days ?? null,
                JSON.stringify(preferred_regions || [])
            ]
        );

        const rows = await dbQuery('SELECT * FROM user_preferences WHERE user_id = ?', [req.user.id]);
        const preference = rows[0];
        preference.preferred_regions = JSON.parse(preference.preferred_regions || '[]');
        res.json(preference);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMyBlacklist = async (req, res) => {
    try {
        const rows = await dbQuery(
            `SELECT ub.*, d.name, d.country, d.region, d.image_url
             FROM user_blacklist ub
             JOIN destinations d ON d.destination_id = ub.destination_id
             WHERE ub.user_id = ?
             ORDER BY ub.created_at DESC`,
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addMyBlacklistItem = async (req, res) => {
    const { destination_id, reason } = req.body;
    if (!destination_id) return res.status(400).json({ message: 'destination_id is required' });

    try {
        await dbQuery(
            'INSERT INTO user_blacklist (user_id, destination_id, reason) VALUES (?, ?, ?)',
            [req.user.id, destination_id, reason || null]
        );
        res.status(201).json({ message: 'Destination added to blacklist' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Destination already blacklisted' });
        }
        res.status(500).json({ error: error.message });
    }
};

export const removeMyBlacklistItem = async (req, res) => {
    try {
        const result = await dbQuery(
            'DELETE FROM user_blacklist WHERE user_id = ? AND destination_id = ?',
            [req.user.id, req.params.destinationId]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Blacklist item not found' });
        res.json({ message: 'Blacklist item removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listDestinations = async (req, res) => {
    const {
        region,
        country,
        min_price,
        max_price,
        max_days,
        is_featured,
        search,
        limit = 50,
        offset = 0
    } = req.query;

    const where = ['d.is_active = 1'];
    const params = [];

    if (region) {
        where.push('d.region = ?');
        params.push(region);
    }
    if (country) {
        where.push('d.country = ?');
        params.push(country);
    }
    if (min_price) {
        where.push('d.price >= ?');
        params.push(min_price);
    }
    if (max_price) {
        where.push('d.price <= ?');
        params.push(max_price);
    }
    if (max_days) {
        where.push('d.days <= ?');
        params.push(max_days);
    }
    if (typeof is_featured !== 'undefined') {
        where.push('d.is_featured = ?');
        params.push(Number(is_featured) ? 1 : 0);
    }
    if (search) {
        where.push('(d.name LIKE ? OR d.country LIKE ? OR d.region LIKE ?)');
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    try {
        const rows = await dbQuery(
            `SELECT d.*,
                COALESCE(
                    JSON_ARRAYAGG(
                        CASE WHEN dt.tag IS NOT NULL THEN dt.tag END
                    ),
                    JSON_ARRAY()
                ) AS tags
             FROM destinations d
             LEFT JOIN destination_tags dt ON dt.destination_id = d.destination_id
             WHERE ${where.join(' AND ')}
             GROUP BY d.destination_id
             ORDER BY d.is_featured DESC, d.rating DESC, d.created_at DESC
             LIMIT ? OFFSET ?`,
            [...params, Number(limit), Number(offset)]
        );

        const normalized = rows.map((row) => ({
            ...row,
            tags: (typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags).filter(Boolean)
        }));
        res.json(normalized);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteMyAccount = async (req, res) => {
    try {
        // bookings.user_id does not cascade, so remove bookings first.
        await dbQuery('DELETE FROM bookings WHERE user_id = ?', [req.user.id]);

        const result = await dbQuery('DELETE FROM users WHERE user_id = ?', [req.user.id]);
        if (!result.affectedRows) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listFeaturedDestinations = async (req, res) => {
    req.query = { ...req.query, is_featured: 1 };
    return listDestinations(req, res);
};

export const listDestinationsByRegion = async (req, res) => {
    req.query = { ...req.query, region: req.params.region };
    return listDestinations(req, res);
};

export const searchDestinations = async (req, res) => {
    req.query = { ...req.query, search: req.query.q || req.query.search || '' };
    return listDestinations(req, res);
};

export const getDestinationById = async (req, res) => {
    try {
        const rows = await dbQuery(
            `SELECT d.*,
                COALESCE(
                    JSON_ARRAYAGG(
                        CASE WHEN dt.tag IS NOT NULL THEN dt.tag END
                    ),
                    JSON_ARRAY()
                ) AS tags
             FROM destinations d
             LEFT JOIN destination_tags dt ON dt.destination_id = d.destination_id
             WHERE d.destination_id = ?
             GROUP BY d.destination_id`,
            [req.params.id]
        );

        if (!rows.length) return res.status(404).json({ message: 'Destination not found' });
        const destination = rows[0];
        destination.tags = (typeof destination.tags === 'string' ? JSON.parse(destination.tags) : destination.tags).filter(Boolean);
        res.json(destination);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createDestination = async (req, res) => {
    const { name, country, region, image_url, price, days, rating, latitude, longitude, revealed, is_featured, is_active } = req.body;
    if (!name || !region || !price || !days) {
        return res.status(400).json({ message: 'name, region, price, and days are required' });
    }

    try {
        const result = await dbQuery(
            `INSERT INTO destinations
             (name, country, region, image_url, price, days, rating, latitude, longitude, revealed, is_featured, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                country || null,
                region,
                image_url || null,
                price,
                days,
                rating ?? null,
                latitude ?? null,
                longitude ?? null,
                typeof revealed === 'undefined' ? 1 : toBoolInt(revealed),
                typeof is_featured === 'undefined' ? 0 : toBoolInt(is_featured),
                typeof is_active === 'undefined' ? 1 : toBoolInt(is_active)
            ]
        );
        res.status(201).json({ destination_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateDestination = async (req, res) => {
    const { name, country, region, image_url, price, days, rating, latitude, longitude, revealed, is_featured, is_active } = req.body;
    try {
        const result = await dbQuery(
            `UPDATE destinations
             SET name = COALESCE(?, name),
                 country = COALESCE(?, country),
                 region = COALESCE(?, region),
                 image_url = COALESCE(?, image_url),
                 price = COALESCE(?, price),
                 days = COALESCE(?, days),
                 rating = COALESCE(?, rating),
                 latitude = COALESCE(?, latitude),
                 longitude = COALESCE(?, longitude),
                 revealed = COALESCE(?, revealed),
                 is_featured = COALESCE(?, is_featured),
                 is_active = COALESCE(?, is_active)
             WHERE destination_id = ?`,
            [
                name ?? null,
                country ?? null,
                region ?? null,
                image_url ?? null,
                price ?? null,
                days ?? null,
                rating ?? null,
                latitude ?? null,
                longitude ?? null,
                typeof revealed === 'undefined' ? null : toBoolInt(revealed),
                typeof is_featured === 'undefined' ? null : toBoolInt(is_featured),
                typeof is_active === 'undefined' ? null : toBoolInt(is_active),
                req.params.id
            ]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Destination not found' });
        res.json({ message: 'Destination updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteDestination = async (req, res) => {
    try {
        const result = await dbQuery('DELETE FROM destinations WHERE destination_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Destination not found' });
        res.json({ message: 'Destination deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listCartItems = async (req, res) => {
    try {
        const rows = await dbQuery(
            `SELECT
                c.cart_item_id AS id,
                c.cart_item_id,
                c.destination_id,
                c.quantity,
                c.unit_price,
                c.created_at,
                c.updated_at,
                d.name,
                d.image_url,
                d.region,
                d.country
             FROM cart_items c
             JOIN destinations d ON d.destination_id = c.destination_id
             WHERE c.user_id = ?
             ORDER BY c.updated_at DESC`,
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addOrUpdateCartItem = async (req, res) => {
    const destination_id = req.body.destination_id ?? req.body.destinationId ?? req.body.id;
    const quantity = req.body.quantity ?? 1;
    const unit_price = req.body.unit_price ?? req.body.unitPrice ?? req.body.price;
    if (!destination_id || !unit_price) return res.status(400).json({ message: 'destination_id and unit_price are required' });

    try {
        await dbQuery(
            `INSERT INTO cart_items (user_id, destination_id, quantity, unit_price)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             quantity = VALUES(quantity),
             unit_price = VALUES(unit_price)`,
            [req.user.id, destination_id, quantity, unit_price]
        );
        res.status(201).json({ message: 'Cart item saved' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const itemId = req.params.destinationId || req.params.itemId;
        const result = await dbQuery(
            'DELETE FROM cart_items WHERE user_id = ? AND (destination_id = ? OR cart_item_id = ?)',
            [req.user.id, itemId, itemId]
        );
        if (!result.affectedRows) return res.status(404).json({ message: 'Cart item not found' });
        res.json({ message: 'Cart item removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCartItemQuantity = async (req, res) => {
    const quantity = Number(req.body.quantity);
    const itemId = req.params.itemId;

    if (!itemId) return res.status(400).json({ message: 'itemId is required' });
    if (!Number.isFinite(quantity)) return res.status(400).json({ message: 'quantity is required' });

    try {
        if (quantity <= 0) {
            const result = await dbQuery(
                'DELETE FROM cart_items WHERE user_id = ? AND (destination_id = ? OR cart_item_id = ?)',
                [req.user.id, itemId, itemId]
            );
            if (!result.affectedRows) return res.status(404).json({ message: 'Cart item not found' });
            return res.json({ message: 'Cart item removed' });
        }

        const result = await dbQuery(
            'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND (destination_id = ? OR cart_item_id = ?)',
            [quantity, req.user.id, itemId, itemId]
        );
        if (!result.affectedRows) return res.status(404).json({ message: 'Cart item not found' });
        res.json({ message: 'Cart item updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        await dbQuery('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const checkoutCart = async (req, res) => {
    const { departure_date, return_date, travelers_count = 1, itinerary_url } = req.body;

    try {
        const items = await dbQuery(
            'SELECT destination_id, quantity, unit_price FROM cart_items WHERE user_id = ?',
            [req.user.id]
        );

        if (!items.length) return res.status(400).json({ message: 'Cart is empty' });

        const bookingIds = [];
        for (const item of items) {
            const total_amount = Number(item.unit_price) * Number(item.quantity);
            const bookingResult = await dbQuery(
                `INSERT INTO bookings
                 (user_id, destination_id, departure_date, return_date, travelers_count, total_amount, itinerary_url)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    req.user.id,
                    item.destination_id,
                    departure_date || null,
                    return_date || null,
                    travelers_count,
                    total_amount,
                    itinerary_url || null
                ]
            );
            bookingIds.push(bookingResult.insertId);
        }

        await dbQuery('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

        res.status(201).json({
            message: 'Checkout complete',
            booking_ids: bookingIds
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listMySpinOffers = async (req, res) => {
    try {
        const rows = await dbQuery(
            `SELECT so.*, d.name AS destination_name, d.image_url
             FROM spin_offers so
             JOIN destinations d ON d.destination_id = so.destination_id
             WHERE so.user_id = ?
             ORDER BY so.created_at DESC`,
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createSpinOffer = async (req, res) => {
    const { destination_id, offered_price, expires_at } = req.body;
    if (!destination_id || !offered_price || !expires_at) {
        return res.status(400).json({ message: 'destination_id, offered_price, and expires_at are required' });
    }

    try {
        const result = await dbQuery(
            `INSERT INTO spin_offers (user_id, destination_id, offered_price, expires_at)
             VALUES (?, ?, ?, ?)`,
            [req.user.id, destination_id, offered_price, expires_at]
        );
        res.status(201).json({ offer_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateSpinOfferStatus = async (req, res) => {
    const { status } = req.body;
    if (!['pending', 'accepted', 'declined', 'expired'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    try {
        const result = await dbQuery(
            'UPDATE spin_offers SET status = ? WHERE offer_id = ? AND user_id = ?',
            [status, req.params.offerId, req.user.id]
        );
        if (!result.affectedRows) return res.status(404).json({ message: 'Offer not found' });
        res.json({ message: 'Offer updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listMyBookings = async (req, res) => {
    try {
        const rows = await dbQuery(
            `SELECT
                b.booking_id AS id,
                b.booking_id,
                b.offer_id,
                b.destination_id,
                b.departure_date,
                b.return_date,
                b.travelers_count,
                b.total_amount,
                b.status,
                b.itinerary_url,
                b.created_at,
                b.updated_at,
                d.name AS destination_name,
                d.country,
                d.region,
                d.image_url,
                d.price
             FROM bookings b
             JOIN destinations d ON d.destination_id = b.destination_id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC`,
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMyBookingById = async (req, res) => {
    try {
        const rows = await dbQuery(
            `SELECT
                b.booking_id AS id,
                b.booking_id,
                b.offer_id,
                b.destination_id,
                b.departure_date,
                b.return_date,
                b.travelers_count,
                b.total_amount,
                b.status,
                b.itinerary_url,
                b.created_at,
                b.updated_at,
                d.name AS destination_name,
                d.country,
                d.region,
                d.image_url,
                d.price
             FROM bookings b
             JOIN destinations d ON d.destination_id = b.destination_id
             WHERE b.user_id = ? AND b.booking_id = ?`,
            [req.user.id, req.params.bookingId]
        );
        if (!rows.length) return res.status(404).json({ message: 'Booking not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createBooking = async (req, res) => {
    const {
        offer_id,
        destination_id,
        departure_date,
        return_date,
        travelers_count = 1,
        total_amount,
        itinerary_url
    } = req.body;

    if (!destination_id || !total_amount) {
        return res.status(400).json({ message: 'destination_id and total_amount are required' });
    }

    try {
        const result = await dbQuery(
            `INSERT INTO bookings
             (user_id, offer_id, destination_id, departure_date, return_date, travelers_count, total_amount, itinerary_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.id,
                offer_id || null,
                destination_id,
                departure_date || null,
                return_date || null,
                travelers_count,
                total_amount,
                itinerary_url || null
            ]
        );
        res.status(201).json({ booking_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    try {
        const result = await dbQuery(
            'UPDATE bookings SET status = ? WHERE booking_id = ? AND user_id = ?',
            [status, req.params.bookingId, req.user.id]
        );
        if (!result.affectedRows) return res.status(404).json({ message: 'Booking not found' });
        res.json({ message: 'Booking updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteMyBooking = async (req, res) => {
    try {
        const result = await dbQuery(
            'DELETE FROM bookings WHERE booking_id = ? AND user_id = ?',
            [req.params.bookingId, req.user.id]
        );
        if (!result.affectedRows) return res.status(404).json({ message: 'Booking not found' });
        res.json({ message: 'Booking deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listMyPaymentMethods = async (req, res) => {
    try {
        const rows = await dbQuery(
            `SELECT payment_method_id, method_type, provider, last4, expiry_month, expiry_year, token_ref, is_default, created_at
             FROM payment_methods
             WHERE user_id = ?
             ORDER BY is_default DESC, created_at DESC`,
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createPaymentMethod = async (req, res) => {
    const { method_type, provider, last4, expiry_month, expiry_year, token_ref, is_default = 0 } = req.body;
    if (!method_type) return res.status(400).json({ message: 'method_type is required' });

    try {
        if (toBoolInt(is_default)) {
            await dbQuery('UPDATE payment_methods SET is_default = 0 WHERE user_id = ?', [req.user.id]);
        }

        const result = await dbQuery(
            `INSERT INTO payment_methods
             (user_id, method_type, provider, last4, expiry_month, expiry_year, token_ref, is_default)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, method_type, provider || null, last4 || null, expiry_month || null, expiry_year || null, token_ref || null, toBoolInt(is_default)]
        );
        res.status(201).json({ payment_method_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deletePaymentMethod = async (req, res) => {
    try {
        const result = await dbQuery(
            'DELETE FROM payment_methods WHERE payment_method_id = ? AND user_id = ?',
            [req.params.paymentMethodId, req.user.id]
        );
        if (!result.affectedRows) return res.status(404).json({ message: 'Payment method not found' });
        res.json({ message: 'Payment method removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listMyPayments = async (req, res) => {
    try {
        const rows = await dbQuery(
            `SELECT p.*, b.destination_id
             FROM payments p
             JOIN bookings b ON b.booking_id = p.booking_id
             WHERE p.user_id = ?
             ORDER BY p.created_at DESC`,
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createPayment = async (req, res) => {
    const { booking_id, payment_method_id, amount, currency = 'ZAR', transaction_ref, paid_at } = req.body;
    if (!booking_id || !amount) return res.status(400).json({ message: 'booking_id and amount are required' });

    try {
        const booking = await dbQuery('SELECT booking_id FROM bookings WHERE booking_id = ? AND user_id = ?', [booking_id, req.user.id]);
        if (!booking.length) return res.status(404).json({ message: 'Booking not found' });

        const result = await dbQuery(
            `INSERT INTO payments (booking_id, user_id, payment_method_id, amount, currency, status, transaction_ref, paid_at)
             VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`,
            [booking_id, req.user.id, payment_method_id || null, amount, currency, transaction_ref || null, paid_at || null]
        );
        res.status(201).json({ payment_id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'transaction_ref already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

export const createPayFastCheckout = async (req, res) => {
    const bookingIds = Array.isArray(req.body.booking_ids)
        ? req.body.booking_ids.map((id) => Number(id)).filter((id) => Number.isFinite(id))
        : [];

    if (!bookingIds.length) {
        return res.status(400).json({ message: 'booking_ids is required' });
    }

    const merchantId = process.env.PAYFAST_MERCHANT_ID || '10000100';
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY || '46f0cd694581a';
    const passphrase = process.env.PAYFAST_PASSPHRASE || '';
    const sandbox = String(process.env.PAYFAST_SANDBOX || 'true').toLowerCase() !== 'false';
    const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

    try {
        const placeholders = bookingIds.map(() => '?').join(',');
        const bookings = await dbQuery(
            `SELECT booking_id, total_amount
             FROM bookings
             WHERE user_id = ? AND booking_id IN (${placeholders})`,
            [req.user.id, ...bookingIds]
        );

        if (bookings.length !== bookingIds.length) {
            return res.status(404).json({ message: 'One or more bookings were not found' });
        }

        const totalAmount = bookings.reduce((sum, row) => sum + Number(row.total_amount || 0), 0);
        if (totalAmount <= 0) {
            return res.status(400).json({ message: 'Invalid booking amount' });
        }

        const transactionRef = `PF-${req.user.id}-${Date.now()}`;
        const paymentInsert = await dbQuery(
            `INSERT INTO payments (booking_id, user_id, amount, currency, status, transaction_ref)
             VALUES (?, ?, ?, 'ZAR', 'pending', ?)`,
            [bookingIds[0], req.user.id, totalAmount.toFixed(2), transactionRef]
        );

        const paymentId = paymentInsert.insertId;
        const returnUrl = `${baseUrl}/api/payfast/return?payment_id=${paymentId}`;
        const cancelUrl = `${baseUrl}/api/payfast/cancel?payment_id=${paymentId}`;
        const notifyUrl = `${baseUrl}/api/payfast/notify`;

        const payFastFields = {
            merchant_id: merchantId,
            merchant_key: merchantKey,
            return_url: returnUrl,
            cancel_url: cancelUrl,
            notify_url: notifyUrl,
            m_payment_id: paymentId,
            amount: totalAmount.toFixed(2),
            item_name: `So Where To Booking (${bookingIds.length})`,
            custom_str1: bookingIds.join(',')
        };

        const signature = buildPayFastSignature(payFastFields, passphrase);
        const query = new URLSearchParams({ ...payFastFields, signature }).toString();
        const host = sandbox ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process';
        const paymentUrl = `${host}?${query}`;

        res.status(201).json({
            payment_id: paymentId,
            payment_url: paymentUrl,
            total_amount: totalAmount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const handlePayFastNotify = async (req, res) => {
    const paymentId = Number(req.body?.m_payment_id);
    if (!Number.isFinite(paymentId)) {
        return res.sendStatus(200);
    }

    try {
        const payments = await dbQuery(
            `SELECT payment_id, booking_id, amount, status
             FROM payments
             WHERE payment_id = ?`,
            [paymentId]
        );
        if (!payments.length) return res.sendStatus(200);

        const payment = payments[0];
        const paymentStatus = String(req.body?.payment_status || '').toUpperCase();
        const amountGross = Number(req.body?.amount_gross || 0);
        const expectedAmount = Number(payment.amount || 0);
        const amountMatches = amountGross > 0 && Math.abs(amountGross - expectedAmount) < 0.01;
        const isSuccess = paymentStatus === 'COMPLETE' && amountMatches;
        const newPaymentStatus = isSuccess ? 'success' : 'failed';

        await dbQuery(
            `UPDATE payments
             SET status = ?,
                 paid_at = ?,
                 updated_at = CURRENT_TIMESTAMP
             WHERE payment_id = ?`,
            [newPaymentStatus, isSuccess ? new Date() : null, paymentId]
        );

        const bookingIdsFromPayload = String(req.body?.custom_str1 || '')
            .split(',')
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value));
        const bookingIds = bookingIdsFromPayload.length ? bookingIdsFromPayload : [Number(payment.booking_id)];
        const placeholders = bookingIds.map(() => '?').join(',');

        await dbQuery(
            `UPDATE bookings
             SET status = ?
             WHERE booking_id IN (${placeholders})`,
            [isSuccess ? 'confirmed' : 'cancelled', ...bookingIds]
        );

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
};

export const getMyPayFastPayment = async (req, res) => {
    try {
        const rows = await dbQuery(
            `SELECT payment_id, booking_id, amount, currency, status, transaction_ref, paid_at, created_at, updated_at
             FROM payments
             WHERE payment_id = ? AND user_id = ?`,
            [req.params.paymentId, req.user.id]
        );
        if (!rows.length) return res.status(404).json({ message: 'Payment not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const handlePayFastReturn = async (req, res) => {
    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = new URL('/checkout', frontendBase);
    redirectUrl.searchParams.set('payfast', 'success');
    if (req.query.payment_id) {
        redirectUrl.searchParams.set('payment_id', String(req.query.payment_id));
    }
    res.redirect(redirectUrl.toString());
};

export const handlePayFastCancel = async (req, res) => {
    const paymentId = Number(req.query.payment_id);
    if (Number.isFinite(paymentId)) {
        try {
            await dbQuery(
                `UPDATE payments
                 SET status = 'failed', updated_at = CURRENT_TIMESTAMP
                 WHERE payment_id = ? AND status = 'pending'`,
                [paymentId]
            );
        } catch {
            // no-op: redirect should still happen
        }
    }

    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = new URL('/checkout', frontendBase);
    redirectUrl.searchParams.set('payfast', 'cancel');
    if (req.query.payment_id) {
        redirectUrl.searchParams.set('payment_id', String(req.query.payment_id));
    }
    res.redirect(redirectUrl.toString());
};

export const createSupportTicket = async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'name, email, subject, and message are required' });
    }

    try {
        const result = await dbQuery(
            `INSERT INTO support_tickets (user_id, name, email, subject, message)
             VALUES (?, ?, ?, ?, ?)`,
            [req.user.id, name, email, subject, message]
        );
        res.status(201).json({ ticket_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listMySupportTickets = async (req, res) => {
    try {
        const rows = await dbQuery(
            'SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listFaqs = async (_req, res) => {
    try {
        const rows = await dbQuery(
            'SELECT * FROM faqs WHERE is_active = 1 ORDER BY sort_order ASC, faq_id ASC'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listHelpTopics = async (_req, res) => {
    try {
        const rows = await dbQuery(
            'SELECT topic_id, title, slug, body, created_at, updated_at FROM help_topics WHERE is_active = 1 ORDER BY updated_at DESC'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getHelpTopicBySlug = async (req, res) => {
    try {
        const rows = await dbQuery(
            'SELECT topic_id, title, slug, body, created_at, updated_at FROM help_topics WHERE slug = ? AND is_active = 1',
            [req.params.slug]
        );
        if (!rows.length) return res.status(404).json({ message: 'Help topic not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listTestimonials = async (_req, res) => {
    try {
        const rows = await dbQuery(
            'SELECT * FROM testimonials WHERE is_active = 1 ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listPublishedBlogPosts = async (_req, res) => {
    try {
        const rows = await dbQuery(
            `SELECT post_id, title, slug, excerpt, cover_image_url, published_at, created_at, updated_at
             FROM blog_posts
             WHERE status = 'published'
             ORDER BY published_at DESC, created_at DESC`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPublishedBlogPostBySlug = async (req, res) => {
    try {
        const rows = await dbQuery(
            `SELECT post_id, title, slug, excerpt, body, cover_image_url, published_at, created_at, updated_at
             FROM blog_posts
             WHERE slug = ? AND status = 'published'`,
            [req.params.slug]
        );
        if (!rows.length) return res.status(404).json({ message: 'Blog post not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
