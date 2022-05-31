import express from "express";
import { getAdvices, getAdviceById, createAdvice, updateAdvice } from "./services/advices.services.js";
import { areNotAdvicesVoidFields, isNotVoid } from "./utils/areNotFieldsVoid.js";

const server = express();

server.use(express.urlencoded({ extended: false }));
server.use(express.json());

server.get("/advices", async (req, res) => {
    res.send(await getAdvices());
});

server.get("/advices/:id", async (req, res) => {
    try {
        res.send(await getAdviceById(req.params.id));
    } catch (error) {
        res.status(400).send(error.message);
    }
})

server.post("/advices", async (req, res) => {
    try {
        const createdAdvice = await createAdvice(req.body);
        res.status(201).send(createdAdvice);
    } catch (error) {

        res.status(400).send(error.message);
    }
});

server.put("/advices/:id", async (req, res) => {
    try {
        isNotVoid(req.params.id, "Informe um id, parametro não pode ser vazio.");
        console.log();
        const updatedAdvice = await updateAdvice(req.params.id, req.body);
        res.status(200).send(updatedAdvice);
    } catch (error) {
        console.log("aqui");
        res.status(400).send(error.message);
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
})