






const addBus = (db) => (req,res) => {
const {bus_num, start_, end_, day_, seats,ticket_price,Hour} = req.body;

if(!bus_num || !start_ || !end_ || !day_ || !seats || !ticket_price){
  return res.status(400).json('incorrect form submission');
}
db('buses')
.returning('*')
.insert({
bus_num:bus_num,
start_:start_,
end_:end_,
day_:day_,
seats:seats,
ticket_price:ticket_price,
Hour:Hour
})
.then(bus => {
res.json(bus[0]);
})
.catch(err => res.status(400).json(err));
}



const deleteBus = (db) => (req, res) => {
	
const { bus_num } = req.body;
db('buses')
.where('bus_num', '=', bus_num)
.del()
.then(sucess => res.json(sucess))
.catch(err => res.status(400).json("unable to delete"))
}


const showUsersInBus = (db) =>  (req,res) => {
  const {bus_num} = req.body;
  
  db.select('users.email','name').from('reserved_buses')
  .innerJoin('users', 'users.email', 'reserved_buses.email')
  .where('reserved_buses.bus_num', '=', bus_num)
  .then(users => { console.log(users); res.json(users)})
  .catch(err => res.status(400).json("cant get users", err))


}


module.exports = {
addBus: addBus,
deleteBus: deleteBus,
showUsersInBus:showUsersInBus
};