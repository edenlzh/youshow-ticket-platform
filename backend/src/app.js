require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const eventRoutes = require('./routes/eventRoutes');
const seatMapRoutes = require('./routes/seatMapRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// 连接数据库
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 路由
app.use('/api/events', eventRoutes);
app.use('/api/seatmaps', seatMapRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
