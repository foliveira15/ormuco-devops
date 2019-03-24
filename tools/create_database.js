const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('../db/ormuco_devops.db');

db.serialize(() => {
  db.run("CREATE TABLE preferences (id INTEGER PRIMARY KEY ASC, name TEXT UNIQUE COLLATE NOCASE, color TEXT , animal TEXT)");
  db.run("INSERT INTO preferences (name, color, animal) VALUES ('Fernando', 'Blue', 'dogs')");
  
  console.log('successfully created the preferences table in ormuco_devops.db');

  db.each("SELECT name, color, animal FROM preferences", (err, row) => {
      console.log(row.name + ": " + row.color + ' - ' + row.animal);
  });
});

db.close();
