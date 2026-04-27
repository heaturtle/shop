const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors()); // 允許前端存取

const PORT = process.env.PORT || 3000;

// 設定 API 路由
app.get("/api/records", async (req, res) => {
  const AIRTABLE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`;

  try {
    const response = await fetch(AIRTABLE_URL, {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "無法取得資料" });
  }
});

app.listen(PORT, () => {
  console.log(`伺服器運行中：http://localhost:${PORT}`);
});
