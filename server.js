const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const DataModel = require('./models/Data'); // Import Schema

// MongoDB Connection
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const dns = require('node:dns');
const os = require('node:os');

const options = { family: 4 };

dns.lookup(os.hostname(), options, (err, addr) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`IPv4 address: ${addr}`);
  }
});


const app = express();
app.use(bodyParser.json());

// POST Endpoint - Save data
app.post('/api/data', async (req, res) => {
  try {
    const data = new DataModel(req.body);
    await data.save();
    res.status(200).send({ message: "Data saved successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error saving data", error });
  }
});

app.post('/api/data', async (req, res) => {
    try {
      // รับข้อมูล JSON ที่ส่งมา
      const data = req.body;
  
      // บันทึกข้อมูล JSON ลงใน MongoDB
      const savedData = await DataModel.create(data);
  
      res.status(200).send({ message: "Data saved successfully", data: savedData });
    } catch (error) {
      res.status(500).send({ message: "Error saving data", error });
    }
  });
  

// GET Endpoint - Retrieve all data
app.get('/api/data', async (req, res) => {
  try {
    const data = await DataModel.find(); // ค้นหาข้อมูลทั้งหมดใน MongoDB
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving data", error });
  }
});

// GET Endpoint - Retrieve data by query (optional)
app.get('/api/data/:sensor', async (req, res) => {
  try {
    const sensorType = req.params.sensor; // รับ sensor type จาก URL
    const data = await DataModel.find({ sensor: sensorType }); // ค้นหาข้อมูลตาม sensor type
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving data", error });
  }
});

const PORT = 3000;
const HOST = '0.0.0.0'; // ใช้ '0.0.0.0' เพื่อฟังทุก IP Address

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
