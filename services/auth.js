import User from "./dto/create-user.dto.js";
import db from "../database/firebaseDataBase.js";
import { collection, query, where, setDoc, doc, getDocs } from "firebase/firestore";
import isEmptyString from "../utils/isEmptyString.js";
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from "uuid";

const userConverter = {
    toFirestore: (user) => {
      return {
        name : user.name,
        email : user.email,
        password : user.password
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new User(data.name, data.email, data.password);
    }
};

function validatePassword(password) {
  return new Promise((res) => {
      let isValidPassword = true;
      const regexValidation = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/;
    if (!(password.match(regexValidation))) { 
          isValidPassword = false;
    }
      res(isValidPassword);
  })
}

function isThereAnyUser(users) {
    return new Promise((res) => {
        const alreadyUser = [];
        users.forEach((user) => {
            alreadyUser.push(user.data());
            if (alreadyUser.length > 0) {
                res(alreadyUser);
            }
        });
        res(alreadyUser);
    })
}

async function getUserByEmail(email) {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const usersQuery = await getDocs(q);
        return isThereAnyUser(usersQuery);
    } catch (error) {
        throw error;
    }  
}

async function doesUserAlreadyExists(email, dataResult = null) {
    let result;
    try {
        if (!dataResult) {
            result = await getUserByEmail(email);
        } else {
            result = dataResult;
        }
        if (result.length > 0) {
            return true;
        }
        return false;
  } catch (error) {
    throw error;
  }
}

async function createUser(body) {
    let errorMessage = "Insira um nome válido, este campo não pode ser vazio.";
    let name, email, password;
    if (!(JSON.parse(JSON.stringify(body)).hasOwnProperty("name"))) {
      throw new Error(errorMessage);
    } else {
      isEmptyString(body.name, errorMessage);
      name = body.name;
    }
  
    errorMessage = "Insira um email válido, este campo não pode ser vazio.";
    if (!(JSON.parse(JSON.stringify(body)).hasOwnProperty("email"))) {
      throw new Error(errorMessage);
    } else {
      if (isEmptyString(body.email, errorMessage)) {
        throw new Error(errorMessage);
      }
      email = body.email;
    }
  
    errorMessage = "Insira um senha válida, este campo não pode ser vazio.";
    if (!(JSON.parse(JSON.stringify(body)).hasOwnProperty("password"))) {
      throw new Error(errorMessage);
    } else {
      if (isEmptyString(body.password, errorMessage)) {
        throw new Error(errorMessage);
      }
      const isValidPassword = await validatePassword(body.password);
      if (!isValidPassword) {
        throw new Error(`Senha fraca. A senha deve conter: 
        ●  Pelo menos 8 caracters.
        ●  Pelo menos 1 número.
        ●  Pelo menos uma letra minúscula.
        ●  Pelo menos uma letra maiúscula.
        ●  Somente letras e números.
        `);
      }
      const salt = bcrypt.genSaltSync(10);
      password = bcrypt.hashSync(body.password, salt);
    }
  
    if (await doesUserAlreadyExists(email)) {
      throw new Error("Usuário já cadastrado com este email.");
    }
  
    try {
      const id = uuidv4();
      const ref = doc(db, "users", id).withConverter(userConverter);
      await setDoc(ref, new User(name, email, password));
      return {id, name, email};
    } catch (error) {
      throw error;
    }
}

async function loginUser(body) {
    let user;
    let email, password;
    let errorMessage = "Insira um email válido, este campo não pode ser vazio.";
    if (!(JSON.parse(JSON.stringify(body)).hasOwnProperty("email"))) {
      throw new Error(errorMessage);
    } else {
      if (isEmptyString(body.email, errorMessage)) {
        throw new Error(errorMessage);
      }
      email = body.email;
    }
    errorMessage = "Insira um senha válida, este campo não pode ser vazio.";
    if (!(JSON.parse(JSON.stringify(body)).hasOwnProperty("password"))) {
      throw new Error(errorMessage);
    } else {
      if (isEmptyString(body.password, errorMessage)) {
        throw new Error(errorMessage);
      }
      password = body.password;
    }

    user = await getUserByEmail(email);
    user = user[0];
    if (!(await doesUserAlreadyExists(email))) {
        throw new Error("Usuário ou senha inválido.");
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    if (!passwordIsCorrect) {
      throw new Error("Usuário ou senha inválido.");
    }
  
    return { id: user.id, name: user.name, email:user.email };
}

export { createUser, loginUser, getUserByEmail }