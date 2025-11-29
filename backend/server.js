// Load env FIRST before any other requires that depend on it
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const cors = require('cors');
// Require DB after env so MONGO_URI is available
const db = require('./config/db.js');
// Routes (they may read env vars at module load)
const userRoutes = require('./routes/userRoutes.js');
const chatRoutes = require('./routes/chatRoutes');
app.use(cors())
app.use(express.json())
db();
app.use('/api/users', userRoutes)
app.use("/api/chat", chatRoutes);

app.get('/', (req, res)=>{
    res.send('API RUNNING....')
});

const PORT = 5000 || process.env.PORT;
app.listen(PORT, (req, res)=>{
    console.log('listening on port 5000')
})