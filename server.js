const express = require('express');
const dbConnect = require('./dbConnect');
const bodyParser = require('body-parser');
var cors = require('cors');
const Record = require('./Record');
const Score = require('./Score');
const app = express();
const port = 3000;
dbConnect();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/global', async (req, res) => {
  const records = await Record.find();
  res.json(records);
});

app.get('/level', async (req, res) => {
  try {
    const {level} = req.query;
    console.log('level');
    console.log(level);
    const record = await Record.findOne({level});
    res.json(record);
  } catch (error) {
    console.log(error);
  }
});

app.post('/global', async (req, res) => {
  try {
    const {time, level, username, country} = req.body;
    console.log('add data to recs');
    console.log(time, level);
    const rec = await Record.findOne({level});
    // let itemToAdd = null;
    if (!rec) {
      itemToAdd = await Record.create(req.body);
      return res.send('record create succesfully!');
    }
    if (rec.time > time) {
      const itemToAdd = await Record.findOneAndUpdate(
        {time: {$gte: time}},
        {$set: {time, username, country}},
        {new: true},
      );

      return res.send('record updated succesfully!');
    } else {
      return res.send('no record changed!');
    }
  } catch (error) {
    console.log(error);
    return res.send('ther was a problem!' + error.message);
  }
});

app.get('/personal', async (req, res) => {
  const {username} = req.query;
  let filt = username ? {username} : {};
  const scores = await Score.find(filt);
  res.json(scores);
});

app.post('/personal', async (req, res) => {
  try {
    const {time, level, username, country} = req.body;
    console.log('add data to recs personal');
    console.log(time, level);
    let rec = await Score.findOne({username});
    // let itemToAdd = null;
    if (!rec) {
      const item = {
        username,
        country,
        records: [
          {
            time,
            level,
          },
        ],
      };
      itemToAdd = await Score.create(item);
      return res.send('Score create succesfully!');
    }
    let hasChanged = false;

    console.log(rec.toObject());
    let newRecs = rec.toObject().records.map(score => {
      if (score.level === level && score.time > time) {
        console.log('change');
        hasChanged = true;
        return {...score, time};
      }
      return score;
    });
    if (hasChanged) {
      const result = await Score.updateOne({username}, {records: newRecs});
      return res.send('Score updated succesfully!');
    }
    const hasLevel =
      rec.toObject().records.filter(score => score.level === level).length > 0;
    console.log('hasLevel');
    console.log(hasLevel);
    if (!hasChanged && !hasLevel) {
      console.log('I need to update');
      result = await Score.updateOne(
        {username},
        {
          $push: {
            records: {
              time,
              level,
            },
          },
        },
      );
      return res.send('Score add to arr succesfully!');
    }
    // if (result.nModified > 0) {
    //   return res.send('Score updated succesfully!');
    // } else {
    return res.send('no Score changed!');
    // }
  } catch (error) {
    console.log(error);
    return res.send('ther was a problem!' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
