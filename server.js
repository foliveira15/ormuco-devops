const express = require('express');
const PORT = 4545;
const HOST = 'localhost';
const app = express();
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(__dirname + '/db/ormuco_devops.db');

app.use('/static',express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/ormuco.html");
});

app.get('/preferences/', (req, res) => {
   db.all('SELECT name FROM preferences', (err, rows) => {
    console.log(rows);
    const allUsernames = rows.map(e => e.name);
    console.log(allUsernames);
    res.send(allUsernames);
  });
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); 
app.post('/', (req, res) => {
  console.log(req.body);
  db.run(
    'INSERT INTO preferences (name, color, animal) VALUES ($name, $color, $animal)',
    {
      $name: req.body.name,
      $color: req.body.color,
      $animal: req.body.animal,
    },
    (err) => {
      if (err) {
        res.send({message: 'Not possible to insert data. Name already exist!<BR>Message:' + err.message});
        } else {
        res.send({message: 'Data successfully saved!'});
      }
    }
  );
});

app.get('/preferences/:userid', (req, res) => {
  const nameToLookup = req.params.userid; 

  db.all(
    'SELECT * FROM preferences WHERE name=$name COLLATE NOCASE',
    {
      $name: nameToLookup
    },
    (err, rows) => {
      console.log(rows);
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        res.send({}); 
      }
    }
  );
});

process.on('SIGINT', function() {
  db.stop(function(err) {
    process.exit(err ? 1 : 0);
  });
});

app.listen(PORT, HOST);

console.log(`Server started at http://${HOST}:${PORT}`);


