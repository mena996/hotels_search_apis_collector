const express = require('express');
var xml2js = require('xml2js');
const { getDataFromApi, dataMapper } = require('./utils');

const port = 5000;
const app = express();

var builder = new xml2js.Builder();

app.use(express.json({ limit: '5mb' }));
app.use('/public', express.static('public'));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE');
  next();
});



app.get('/', (req, res, next) => {
  let apis = ['https://gist.githubusercontent.com/ahmed3mar/483fa6bf1f5bdb8bf58f37fcd538d068/raw/561f9748d60823a6cd6a88ad024d6a73821a9dee/supplier-a.json', 'https://gist.githubusercontent.com/ahmed3mar/483fa6bf1f5bdb8bf58f37fcd538d068/raw/561f9748d60823a6cd6a88ad024d6a73821a9dee/supplier-b.json?utm_campaign=TY'];
  try {
    getDataFromApi(apis).then((allData) => {
      let mappedData = dataMapper(allData);
      res.send(req.query.format === 'xml' ? builder.buildObject(mappedData) : mappedData);
    });
  } catch {
    next("Error in mapping data")
  }
});

app.use((err, req, res, next) => {
  console.log(err)
  res.send("oh no there is some thing wrong happend :( \n" + err);
});

app.listen(port, (err) => {
  if (!err) console.log(`started new server on port ${port}`)
})