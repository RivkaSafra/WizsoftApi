const express = require('express');
const app = express();
const port = 4000;
const axios = require('axios');
const bodyParser = require('body-parser');
const cors=require('cors'); 
require('dotenv').config()
const router=require('./router');
const handleErrors=require('./middlewares/errorHandler')
const handleSession=require('./middlewares/handleSession')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(handleSession)
app.use('/', router);
app.use(handleErrors);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
