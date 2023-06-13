const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const dotenv = require('dotenv');
const mail = require('./helper/mail');
dotenv.config();

const app = express();
app.use(cors())
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

app.post('/api/sendemail', async(req,res) => {
  try{
    const email = await mail.send({
      to: req.body.email,
      template:'new-user',
      content: { name: req.name }
    })
    res.send(JSON.stringify({ success: true }));
  }
  catch(err){
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
  
});

app.listen(PORT, () => {
console.log(`Example app listening on port ${PORT}`);
});