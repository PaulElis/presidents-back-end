const _ = require('lodash');
const request = require('request');
const express = require('express');
const app = express();
var cors = require('cors')

// Constants
const SHEET_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1i2qbKeasPptIrY1PkFVjbHSrLtKEPIIwES6m2l2Mdd8/values/A1%3AE45?key=AIzaSyDKy_NLpawUj6ylQ5-ylXVKajMevNV9byo';
const ASCEND_SORT = 'asc';
const DESCEND_SORT = 'desc';

app.use(cors())

app.use('/presidents', (req, res) => {
  const sortOrder = req.query.sort === DESCEND_SORT ? DESCEND_SORT : ASCEND_SORT;
  console.log(sortOrder, req.query);

  request(
    SHEET_URL,
    (err, response, body) => {
      const parsedBody = JSON.parse(body);
      const { values } = parsedBody;

      const [columnNames, ...presidentData] = values;
      const presidentDataWithColumnHash = _.map(presidentData, v => _.zipObject(columnNames, v));
      const sortedPresidentData = _.orderBy(presidentDataWithColumnHash, ['President'], [sortOrder]);

      res.send(sortedPresidentData);
    },
  );
});

app.listen(3000);
