const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();
const app = require('./app');

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

// mongoose.connect(DB).then(() => console.log('DB connection successful!'));

mongoose
  .connect(`mongodb://${process.env.MONGO_URI}/`, {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    dbName: process.env.MONGO_DATABASE,
  })
  .then(() => {
    console.log('connected succesfully!');
  })
  .catch((error) => {
    throw new Error(error);
  });

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
