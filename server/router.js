const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs').promises;
require('dotenv').config();
router.post('/createInvoice', async (req, res, next) => {
  try {
    const { AccountKey, moves } = req.body;
    moves.forEach(move => {
      for (const i in move) {
        if (move[i] === '') {
          delete move[i];
        }
      }
    });

    const data = {
      issueStock: 'true',
      deleteTemp: 'false',
      rows: {
        DocumentID: 1,
        AccountKey,
        moves,
      },
    };

    const url = `https://${process.env.WizcloudApiServer}/invApi/createDoc`;
    const token = process.env.TOKEN;
    const headers = {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(url, data, { headers });
    console.log(response.status);
    return res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});


router.post('/exportMovments', async (req, res,next) => {
  try {
    const { accountKey } = req.body;
    if(accountKey=='')
        return res.status(400)
    const data = JSON.parse(await fs.readFile('./reportsConfig/movments.txt', 'utf8'));
    data.parameters[0].defVal = accountKey;
    const url = `https://${process.env.WizcloudApiServer}/ExportDataApi/exportData`;
    const token = process.env.TOKEN//await createSession();
    const headers = {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    };
    const response = await axios.post(url, data, { headers });
    console.log(response.status);
    return res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});
router.post('/exportAccountDetails', async (req, res,next) => {
  try {
    const { accountKey } = req.body;
    if(accountKey==''){
      return res.status(400).json()

    }
    const data = JSON.parse(await fs.readFile('./reportsConfig/accountDetails.txt', 'utf8'));
    data.parameters[0].defVal = accountKey;
    const url = `https://${process.env.WizcloudApiServer}/ExportDataApi/exportData`;
    const token = process.env.TOKEN;
    const headers = {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    };
    const response = await axios.post(url, data, { headers });
    
    console.log(response.status);
    return res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
