const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const mongoose = require('mongoose');
// const { resolveNs } = require('dns/promises');

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
}));
app.set("views", "./views");
app.use(express.static(path.join(__dirname, 'public')));

const url = `mongodb+srv://3322project:3322@cluster0.wsjpw.mongodb.net/MusicStore?retryWrites=true&w=majority`;

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

var Schema = mongoose.Schema;

var loginSchema = new Schema({
    UserId : String,
    PW: String
});

var musicSchema = new Schema({
    musicId: Number,
    musicName: String,
    category: String,
    composer: String,
    description: String,
    price: Number,
    published : String,
    new_arrival: Boolean
});

var cartSchema = new Schema({
    musicId: Number,
    UserId: String,
    quantity: Number,
    musicName: String,
    price: Number
});

var loginRecord = mongoose.model("login", loginSchema, "logins");
var musicRecord = mongoose.model("music", musicSchema, "musics");
var cartRecord = mongoose.model("cart", cartSchema, "carts");


loginRecord.deleteMany({}, function (err) {
  if (!err) {
    console.log("Reset loginRecord successful")
  } else console.log(err)
});

musicRecord.deleteMany({}, function (err) {
  if (!err) {
    console.log("Reset musicRecord successful")
  } else console.log(err)
});

cartRecord.deleteMany({}, function (err) {
  if (!err) {
    console.log("Reset cartRecord successful")
  } else console.log(err)
});



var music1 = new musicRecord({
  musicId: 1,
  musicName: "Symphony No. 41 Jupiter, 1st Movement Allegro Vivace",
  category: "Classical",
  composer: "Wolfgang Amadeus Mozart",
  description: "Jupiter Symphony, byname of Symphony No. 41 in C Major, K 551, orchestral work by Austrian composer Wolfgang Amadeus Mozart, known for its good humour, exuberant energy, and unusually grand scale for a symphony of the Classical period.",
  price: 30,
  published: "1788",
  new_arrival: true
});

var music2 = new musicRecord({
  musicId: 2,
  musicName: "Scherzo: Allegro vivace con delicatezza",
  category: "Classical",
  composer: "Schubert, Franz",
  description: "In the first part of the Classical period, the dance movement, when it appeared, usually consisted of a minuet in fairly simple binary form (the two-part form from which sonata form evolved)...",
  price: 80,
  published: "1828",
  new_arrival: false
});

var music3 = new musicRecord({
  musicId: 3,
  musicName: "Bach, J.S.: Goldberg Variations, BWV 988",
  category: "Baroque",
  composer: "J.S. Bach",
  description: "On his visits to Dresden, Bach had won the regard of the Russian envoy, Hermann Karl, Reichsgraf (count) von Keyserlingk, who commissioned the so-called Goldberg Variations; these were published in 1741...",
  price: 100,
  published: "1741",
  new_arrival: false
});

var music4 = new musicRecord({
  musicId: 4,
  musicName: "Mussorgsky, Modest: Night on Bald Mountain",
  category: "Classical",
  composer: "Mussorgsky, Modest",
  description: "Night on Bald Mountain, Russian Noch na lysoy gore, also called Night on Bare Mountain, orchestral work by the Russian composer Modest Mussorgsky that was completed in June 1867...",
  price: 40,
  published: "1867",
  new_arrival: false
});

var music5 = new musicRecord({
  musicId: 5,
  musicName: "Claudio Monteverdi: Madrigals",
  category: "Baroque",
  composer: "Claudio Monteverdi's Madrigals",
  description: "Claudio Giovanni Antonio Monteverdi was an Italian composer, gambist, singer and Roman Catholic priest. Monteverdi's work, often regarded as revolutionary, marked the transition from the Renaissance style of music to that of the Baroque period...",
  price: 200,
  published: "1587-1651",
  new_arrival: false
});

var music6 = new musicRecord({
  musicId: 6,
  musicName: "Bach: Concerto No. 1 in D Major",
  category: "Baroque",
  composer: "Bach",
  description: "Baroque music, a style of music that prevailed during the period from about 1600 to about 1750, known for its grandiose, dramatic, and energetic spirit but also for its stylistic diversity...",
  price: 140,
  published: "1791",
  new_arrival: true
});

var music7 = new musicRecord({
  musicId: 7,
  musicName: "Frederic Chopin: Piano Concerto No. 1 in E Minor",
  category: "Romantic",
  composer: "Frederic Chopin",
  description: "A second concert confirmed his success, and on his return home he prepared himself for further achievements abroad by writing his Piano Concerto No. 2 in F Minor (1829) and his Piano Concerto No. 1 in E Minor (1830)...",
  price: 130,
  published: "1830",
  new_arrival: true
});
var music8 = new musicRecord({
  musicId: 8,
  musicName: "Franz Liszt: Christus",
  category: "Late 19th",
  composer: "Franz Liszt",
  description: "For the next eight years Liszt lived mainly in Rome and occupied himself more and more with religious music. He completed the oratorios Die Legende von der heiligen Elisabeth (1857-62) and Christus (1855-66) and a number of smaller works...",
  price: 199,
  published: "1855-1866",
  new_arrival: false
});

var music9 = new musicRecord({
  musicId: 9,
  musicName: "Claude Debussy: Children's Corner",
  category: "Romantic",
  composer: "Claude Debussy",
  description: "Repelled by the gossip and scandal arising from this situation, he sought refuge for a time at Eastbourne, on the south coast of England. For his daughter, nicknamed Chouchou, he wrote the piano suite Children's Corner (1908)...",
  price: 149,
  published: "1908",
  new_arrival: false
});

var music10 = new musicRecord({
  musicId: 10,
  musicName: "Robert Schumann: Papillons",
  category: "Romantic",
  composer: "Robert Schumann",
  description: "In the summer of 1829 he left Leipzig for Heidelberg. There he composed waltzes in the style of Franz Schubert, afterward used in his piano cycle Papillons (Opus 2; 1829-31), and practiced industriously...",
  price: 131,
  published: "1831",
  new_arrival: false
});

var music11 = new musicRecord({
  musicId: 11,
  musicName: "Symphony No. 3",
  category: "Late 19th",
  composer: "Gustav Mahler",
  description: "Symphony No. 3, symphony for orchestra and choruses by Austrian composer Gustav Mahler that purports to encapsulate everything the composer had learned about life to date...",
  price: 80,
  published: "1902",
  new_arrival: false
});

var music12 = new musicRecord({
  musicId: 12,
  musicName: "Liszt: Bagatelle sans tonalite",
  category: "Late 19th",
  composer: "Liszt",
  description: "In 1869 Liszt was invited to return to Weimar by the grand duke to give master classes in piano playing, and two years later he was asked to do the same in Budapest...",
  price: 103,
  published: "1872",
  new_arrival: false
});

music1.save((err,result)=>{});
music2.save((err,result)=>{});
music3.save((err,result)=>{});
music4.save((err,result)=>{});
music5.save((err,result)=>{});
music6.save((err,result)=>{});
music7.save((err,result)=>{});
music8.save((err,result)=>{});
music9.save((err,result)=>{});
music10.save((err,result)=>{});
music11.save((err,result)=>{});
music12.save((err,result)=>{});