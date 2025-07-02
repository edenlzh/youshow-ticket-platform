const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, address, price, canRefund, dates } = req.body;
    
    // 如果要保存上传的海报，需要先通过multer中间件获取文件信息
    // 这里假设我们已经把文件上传到S3，返回了 posterUrl
    const posterUrl = req.file ? req.file.location : null; // 仅演示

    const newEvent = new Event({
      title,
      description,
      address,
      price,
      canRefund,
      dates,
      posterUrl
    });
    await newEvent.save();

    res.json({ success: true, event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, address, price, canRefund, dates, promotions } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { title, description, address, price, canRefund, dates, promotions },
      { new: true }
    );

    res.json({ success: true, event: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    await Event.findByIdAndDelete(eventId);
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
