import * as mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';

mongoose.connect('mongodb://127.0.0.1:27017/Ejercicio-Practica-11', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});

interface UserInterface {
  name: string,
  surname: string,
  age?: number,
  email: string,
  password: string,
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Name user must start with a capital letter');
      }
    },
  },
  surname: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Surame user must start with a capital letter');
      }
    },
  },
  age: {
    type: Number,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('Age must be positive');
      }
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value: string) => {
      if (!isEmail(value)) {
        throw new Error('Email not correct');
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length < 4) {
        throw new Error('The password must has more of 4 characters');
      }
    },
  },
});

const User = mongoose.model<UserInterface>('User', UserSchema);

const user = new User({
  name: 'JORGE',
  surname: 'GARCIA BORGES',
  age: 20,
  email: 'alu01012064796@ull.edu.es',
  password: 'MiUsuario2021',
});

user.save().then((result) => {
  console.log(result);
}).catch((error) => {
  console.log(error);
});
