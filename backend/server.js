const express = require('express')
const app = express();
const db = require('./config/db.js')
const cors = require('cors')
const dotenv = require('dotenv')
const userRoutes = require('./routes/userRoutes.js')
const chatRoutes = require("./routes/chatRoutes");


dotenv.config();
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