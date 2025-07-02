const express = require('express');
const router = express.Router();
const { createEvent, updateEvent, getEventById, getAllEvents, deleteEvent } = require('../controllers/eventController');

// 若需要上传海报，用multer处理
// const upload = require('../middleware/multerUpload');

router.post('/', /* upload.single('poster'), */ createEvent);
router.put('/:eventId', updateEvent);
router.get('/', getAllEvents);
router.get('/:eventId', getEventById);
router.delete("/:eventId", deleteEvent);

module.exports = router;
