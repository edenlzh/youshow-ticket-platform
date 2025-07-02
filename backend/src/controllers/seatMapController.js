const SeatMap = require('../models/SeatMap');

exports.createSeatMap = async (req, res) => {
  try {
    const { eventId, seatMapData, name } = req.body;
    const seatMap = new SeatMap({ eventId, seatMapData, name });
    await seatMap.save();
    return res.json({ success: true, seatMap });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateSeatMap = async (req, res) => {
  try {
    const seatMapId = req.params.seatMapId;
    const { seatMapData, name } = req.body;

    const updated = await SeatMap.findByIdAndUpdate(
      seatMapId,
      { seatMapData, name },
      { new: true }
    );
    return res.json({ success: true, seatMap: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSeatMapByEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const seatMap = await SeatMap.findOne({ eventId });
    return res.json({ success: true, seatMap });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 也可以加 getSeatMapById, getAllSeatMaps 等方法...
