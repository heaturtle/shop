const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // 重要：這行讓後端能讀取前端傳來的 JSON 資料

const PORT = process.env.PORT || 3000;
const AIRTABLE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`;

// --- 原有的：抓取資料 (GET) ---
app.get('/api/records', async (req, res) => {
  try {
    const response = await fetch(AIRTABLE_URL, {
      headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '無法讀取資料' });
  }
});

// --- 新增的：新增資料 (POST) ---
app.post('/api/records', async (req, res) => {
  try {
    const response = await fetch(AIRTABLE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body) // 直接把前端傳來的 records 轉寄給 Airtable
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error.message || 'Airtable 寫入失敗');
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
