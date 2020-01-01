


const getTable = (db) => (req,res) => {
	db.select().from('buses')
	.then(data => {
		res.json(data)

	})
}


const decrementSeats = (db) => (req,res)=>{
const { reservation_number } = req.body;
var busNum;
db.select("bus_num")
.from('reserved_buses')
.where('reservation_number', '=', reservation_number)
.then(res =>{
  busNum = res[0].bus_num;

})
.then(()=>{
  db('buses').where('bus_num', '=', busNum)
  .decrement('res_seats', 1)
  .returning('res_seats')
  .then(resSeats => {
    res.json(resSeats[0]);
  })
  .catch(err => res.status(400).json('unable to get user')) 
})

}



module.exports = {
getTable:getTable,
decrementSeats:decrementSeats

};

