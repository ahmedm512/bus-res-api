const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const findface = require('./controllers/findface');
const user = require('./controllers/user');
const admin = require('./controllers/admin');
const bus = require('./controllers/bus');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '1234',
    database : 'bus-res'
  }
});



const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res)=>{
	db.select().from('users')
	.then(data => {
		res.json(data);
	})
	
})

app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', profile.handleProfileGet(db));





app.put('/incrementEnt', user.incrementEntries(db));
app.put('/reserveBus', user.reserveBus(db));
app.post('/cancelReservation', user.cancelReservation(db));
app.post('/userReservedBuses', user.getReservedBuses(db));



app.post('/addBus', admin.addBus(db));
app.post('/deleteBus' , admin.deleteBus(db));
app.post('/usersInBus', admin.showUsersInBus(db));




app.put('/decrementSeats', bus.decrementSeats(db));
app.get('/bustable', bus.getTable(db));


const PORT = process.env.PORT;
app.listen(PORT || 4000, ()=>{
	console.log(`app is running on port ${PORT}`)
})


// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

// db.insert({
//         bus_num: bus_num,
//         email: email
//       }).into('reserved_buses')
//       .returning('bus_num')
//       .then(bus_num => {
//         res.json(bus_num[0]);
//       })
//         .catch(err => res.status(400).json('unable to reserve bus'))
