import {MongoClient} from 'mongodb';

const dbURL = 'mongodb://127.0.0.1:27017';
const dbName = 'Ejercicio-Practica-11';

interface UserInterface {
  name: string,
  surname: string,
  age?: number,
  email: string,
  password: string,
}

MongoClient.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((client) => {
  const db = client.db(dbName);

  return db.collection<UserInterface>('users').updateOne({
    email: 'alu0101206479@ull.edu.es',
  }, {
    $set: {
      password: 'HolaMundo63',
    },
  });
}).then((result) => {
  console.log(result.modifiedCount);
}).catch((error) => {
  console.log(error);
});
