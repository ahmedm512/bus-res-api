




const incrementEntries = (db) => (req,res) => {
const { email } = req.body;
  db('users').where('email', '=', email)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get user'))
}




const reserveBus = (db) => (req,res) => {
const { email, bus_num } = req.body;
    db.transaction(trx => {
        trx.insert({
        bus_num: bus_num,
        email: email
        })
        .into('reserved_buses')
        .returning('reservation_number')
        .then(res_num => {
      	var resNum = res_num[0];
        console.log("res_num",res_num);
    	return trx('reserved_buses')
    	.select('bus_num').where('reservation_number', '=', res_num[0])
        .then(busesBus_num => {
        	console.log('buses', busesBus_num[0].bus_num);
          return trx('buses').where('bus_num', '=', busesBus_num[0].bus_num)
        .increment('res_seats', 1)   
    	})
    	.then(()=> res.json(resNum) )  
    })
 
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => res.status(400).json('unable to get bus'))
}

const cancelReservation = (db) => (req, res) => {
  const {reservation_number, email} = req.body;
  var busNum;
db.select("bus_num")
.from('reserved_buses')
.where('reservation_number', '=', reservation_number).andWhere('email', '=', email)
.then(res =>{
  busNum = res[0].bus_num;
  console.log(busNum);
})
.then(()=>{
  db('buses').where('bus_num', '=', busNum)
  .decrement('res_seats', 1)
   .catch(err => res.status(400).json('unable to get reservation')) 
})
.then(()=>{
  db('reserved_buses')
  .where('reservation_number', '=' ,reservation_number).andWhere('email', '=', email)
  .del()
  .then(sucess => res.json(sucess))
})
  .catch(err => res.status(400).json("unable to cancel reservation"))
}

const getReservedBuses = (db) => (req,res) => {
  const {email} = req.body;
  
  db.select('buses.bus_num','day_', 'ticket_price' , 'Hour', 'reservation_number').from('reserved_buses')
  .innerJoin('buses', 'buses.bus_num', 'reserved_buses.bus_num')
  .where('reserved_buses.email', '=', email)
  .then(buses => { res.json(buses)})
  .catch(err => res.status(400).json("cant get buses", err))


}




module.exports = {

	incrementEntries: incrementEntries,
	reserveBus: reserveBus,
  cancelReservation:cancelReservation,
  getReservedBuses:getReservedBuses,
};


