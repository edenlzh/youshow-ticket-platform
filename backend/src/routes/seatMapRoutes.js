const express = require('express');
const router = express.Router();
const { createSeatMap, updateSeatMap, getSeatMapByEvent } = require('../controllers/seatMapController');

router.post('/', createSeatMap);
router.put('/:seatMapId', updateSeatMap);
router.get('/event/:eventId', getSeatMapByEvent);

module.exports = router;
