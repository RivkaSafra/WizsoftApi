const axios = require('axios');
require('dotenv').config()

const handleSession=async( req, res, next)=>{
  const expired=process.env.TOKEN_EXPIRED;
    if(expired=='' ||new Date(expired)<=new Date()){
      process.env.TOKEN= await createSession();
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 24);
      process.env.TOKEN_EXPIRED=expirationDate;
    }
    next()
  };


async function createSession() {
  const WizcloudApiServer = process.env.WizcloudApiServer;
  const WizcloudApiPrivateKey = process.env.WizcloudApiPrivateKey; 
  const WizcloudApiDBName = process.env.WizcloudApiDBName;
  const url = `https://${WizcloudApiServer}/createSession/${WizcloudApiPrivateKey}/${WizcloudApiDBName}`;
      const response = await axios.get(url);
      console.log('Response session:', response.data);
      return response.data; 
  }
module.exports = handleSession