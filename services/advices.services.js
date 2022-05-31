import { deleteDoc, updateDoc, getDoc, getDocs, setDoc, doc, collection } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import db from "../database/firebaseDataBase.js";
import Advice from "./dto/create-advice.dto.js";
import filterData from "../utils/filterData.js";
import isEmptyString from "../utils/isEmptyString.js";

const adviceConverter = {
  toFirestore: (advice) => {
    return {
      day: advice.day,
      time: advice.time,
      description: advice.description
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Advice(data.day, data.time, data.description);
  }
};

async function getAdvices() {
  const querySnapshot = await getDocs(collection(db, "advices"));
  const advicesList = await filterData(querySnapshot);
  return advicesList;
}

async function getAdviceById(id) {
  const ref = doc(db, "advices", id).withConverter(adviceConverter);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    const advice = docSnap.data();
    return advice;
  } else {
    throw new Error("Não há nenhum aviso registrado com o id: " + id+".");
  }
}

async function createAdvice(body) {
  let errorMessage = "Insira um dia válido, este campo não pode ser vazio.";
  let day, time, description;
  if (!(JSON.parse(JSON.stringify(body)).hasOwnProperty("day"))) {
    throw new Error(errorMessage);
  } else {
    isEmptyString(body.day, errorMessage);
    day = body.day;
  }

  errorMessage = "Insira um horário válido, este campo não pode ser vazio.";
  if (!(JSON.parse(JSON.stringify(body)).hasOwnProperty("time"))) {
    throw new Error(errorMessage);
  } else {
    isEmptyString(body.time, errorMessage);
    time = body.time;
  }

  errorMessage = "Insira uma descrição, este campo não pode ser vazio.";
  if (!(JSON.parse(JSON.stringify(body)).hasOwnProperty("description"))) {
    throw new Error(errorMessage);
  } else {
    isEmptyString(body.description, errorMessage);
    description = body.description;
  }

  try {
    const id = uuidv4();
    const ref = doc(db, "advices", id).withConverter(adviceConverter);
    await setDoc(ref, new Advice(day, time, description));
    return {id, day, time, description};
  } catch (error) {
    throw error;
  }
}

async function updateAdvice(id, body) {
  try {
    await getAdviceById(id);
  } catch (error) {
    throw error;
  }
  
  const dataUpdate = {};
  
  if (JSON.parse(JSON.stringify(body)).hasOwnProperty("day")) {
    isEmptyString(body.day, "Insira um dia válido.");
    dataUpdate.day = body.day;
  }
  
  if (JSON.parse(JSON.stringify(body)).hasOwnProperty("time")) {
    isEmptyString(body.time, "Insira um horário válido.");
    dataUpdate.time = body.time;
  }

  if (JSON.parse(JSON.stringify(body)).hasOwnProperty("description")) {
    isEmptyString(body.description, "Insira uma descrição válida.");
    dataUpdate.description = body.description;
  }

  if (Object.entries(dataUpdate).length === 0) {
    throw new Error("Insira pelo menos um campo para atualizar.");
  }

  try{
    const ref = doc(db, "advices", id);
    await updateDoc(ref, dataUpdate);
    return { id, dataUpdated: dataUpdate };
  } catch (error) {
    throw error;
  }
}

async function deleteAdvice(id) {
  try {
    await getAdviceById(id);
    await deleteDoc(doc(db, "advices", id));
    return { deletedAdvice: id };
  } catch (error) {
    throw error;
  }
}

export { getAdvices, getAdviceById, createAdvice, updateAdvice, deleteAdvice };