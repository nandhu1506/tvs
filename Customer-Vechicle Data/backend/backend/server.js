require('dotenv').config();
const express = require('express');
const cors = require('cors');


const customerRoutes = require('./routes/customers');
const vehicleRoutes = require('./routes/vehicles');
const userRoutes = require('./routes/user');
const reportRoutes = require('./routes/reports')

const app = express();
const PORT = process.env.PORT;


app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
  res.send('Server is running...');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



app.use('/customers', customerRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/users', userRoutes);
app.use('/reports', reportRoutes)
