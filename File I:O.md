# Node Stream API

It allows us to handle data as it comes in, rather than waiting for all the data to be read before we do anything with it.

`fs.createReadStream(path[,options])`

Returns: `<fs.ReadStream>`, which is a kind of eventEmitter

Event: `close`, `data`,`end`,`error`

```js
//csv-parse is a third-party package implemented Node Stream API
const { parse } = require('csv-parse');
const fs = require('fs');

const results = [];

fs.createReadStream('kepler_data.csv')
  .on('data', (data) => {
    results.push(data);
  })
  .on('error', (err) => {
    console.log(err);
  })
  .on('end', () => {
    console.log(results);
    console.log('done');
  });
```

Each 'data' object is a Buffer object that node represent a collection of bytes

<img src="File I:O.assets/Screen Shot 2022-02-17 at 5.31.57 PM.png" alt="Screen Shot 2022-02-17 at 5.31.57 PM" style="zoom:25%;" />

 To parse the data to what we want:<img src="File I:O.assets/Screen Shot 2022-02-17 at 5.36.18 PM.png" alt="Screen Shot 2022-02-17 at 5.36.18 PM" style="zoom:50%;" />

## Readable.pipe(writable);

```js
const { parse } = require('csv-parse');
const fs = require('fs');

const results = [];

fs.createReadStream('kepler_data.csv')
  .pipe(parse({
    comment: '#', //treat all of the lines start with # as comment
    columns: true, //treat each row in csv file as an Object with key value pairs, rather than as just an array of values in row
  }))
  .on('data', (data) => {
    results.push(data);
  })
  .on('error', (err) => {
    console.log(err);
  })
  .on('end', () => {
    console.log(results);
    console.log('done');
  });
```

Results:

<img src="File I:O.assets/Screen Shot 2022-02-17 at 5.43.21 PM.png" alt="Screen Shot 2022-02-17 at 5.43.21 PM" style="zoom:50%;" />

## Filter the result

```js
const parse = require('csv-parse');
const fs = require('fs');

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

fs.createReadStream('kepler_data.csv')
  .pipe(parse({
    comment: '#',
    columns: true,
  }))
  .on('data', (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  .on('error', (err) => {
    console.log(err);
  })
  .on('end', () => {
  	console.log(habitablePlanets.map((planet) => {
      return planet['kepler_name'];
    }));
    console.log(`${habitablePlanets.length} habitable planets found!`);
  });
```

# Resources

NASA Exoplanet Archive: https://exoplanetarchive.ipac.caltech.edu/docs/data.html

used csv data sheet (Kepler KOI Table): https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=cumulative