
const errorHandler=(error, req, res, next)=>{
  console.log('error');
  if(error.response.data){
    console.log(error.response.data);
      return res.status(500).json(error.response.data);
  }
      return res.status(500).json(error);
  };

module.exports = errorHandler