import express from "express";
import { getAdvices, getAdviceById, createAdvice, updateAdvice, deleteAdvice } from "./services/advices.services.js";

const port = 3000;
const server = express();

server.use(express.urlencoded({ extended: false }));
server.use(express.json());

server.get("/advices", async (req, res) => {
    res.send(await getAdvices());
});

server.get("/advices/:id", async (req, res) => {
    try {
        if (!(JSON.parse(JSON.stringify(req.params)).hasOwnProperty("id"))) {
            throw new Error("Informe o id do advice pelos parametros.")    
        }
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
        if (!(JSON.parse(JSON.stringify(req.params)).hasOwnProperty("id"))) {
            throw new Error("Informe o id do advice pelos parametros.")    
        }
        const updatedAdvice = await updateAdvice(req.params.id, req.body);
        res.status(200).send(updatedAdvice);
    } catch (error) {
        console.log("aqui");
        res.status(400).send(error.message);
    }
});

server.delete("/advices/:id", async (req, res) => {
    try {
        if (!(JSON.parse(JSON.stringify(req.params)).hasOwnProperty("id"))) {
            throw new Error("Informe o id do advice pelos parametros.")    
        }
        const deletedAdvice = await deleteAdvice(req.params.id);
        res.status(200).send(deletedAdvice);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})