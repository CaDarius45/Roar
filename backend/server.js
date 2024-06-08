const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

/*-----------------------------Controllers-----------------------------*/
const jWTRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const profilesRouter = require('./controllers/profiles');
const roarRouter = require('./controllers/roar');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.use(cors());
app.use(express.json());

app.set('view engine', 'js')

// Routes go here
app.use('/test-jwt', jWTRouter);
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/roars', roarRouter);

app.listen(3000, () => {
    console.log('The express app is ready!');
});