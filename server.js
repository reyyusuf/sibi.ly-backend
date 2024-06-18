const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const kostRoutes = require('./src/routes/kostRoutes');
const authRoutes = require('./src/routes/authRoutes');
const bookmarkRoutes = require('./src/routes/bookmarkRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json()); 
app.use('/api/auth', authRoutes); 

app.listen(PORT, () => {
    console.log(`Kostify Back-End Server is running on port ${PORT}`);
});