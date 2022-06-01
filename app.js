import express from "express";
import { getAdvices, getAdviceById, createAdvice, updateAdvice, deleteAdvice } from "./services/advices.services.js";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import favicon from "serve-favicon";
import { createUser, loginUser } from "./services/auth.js";


const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000;
const server = express();

server.use(express.urlencoded({ extended: false }));
server.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')))
server.use(express.static('public'));
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, '/public/templates'));
server.use(express.json());

server.get("/login", async (req, res) => {
    res.render('login');
});

server.get("/cadastro", async (req, res) => {
    res.render('register');
});

server.post("/api/cadastro", async (req, res) => {
    try {
        res.json(await createUser(req.body));
    } catch (error) {
        res.status(400).json({ message : error.message })
    }
});

server.post("/api/login", async (req, res) => {
    try {
        res.json(await loginUser(req.body));
    } catch (error) {
        res.status(400).json({message:error.message})
    }
});

server.get("/", async (req, res) => {
    res.render('home');
});

server.get("/api/avisos", async (req, res) => {
    res.json(await getAdvices());
});

server.get("/avisos", async (req, res) => {
    const advices = await getAdvices();
    res.render('advices', { dataToRender:advices });
});

server.get("/eventos", async (req, res) => {
    res.render('on-construction');
});

server.get("/midias", async (req, res) => {
    res.render('on-construction');
});

server.get("/sobre", async (req, res) => {
    res.render('on-construction');
});

server.get("/api/avisos/:id", async (req, res) => {
    try {
        if (!(JSON.parse(JSON.stringify(req.params)).hasOwnProperty("id"))) {
            throw new Error("Informe o id do advice pelos parametros.")    
        }
        res.json(await getAdviceById(req.params.id));
    } catch (error) {
        res.status(400).send(error.message);
    }
})

server.post("/api/avisos", async (req, res) => {
    try {
        const createdAdvice = await createAdvice(req.body);
        res.status(201).send(createdAdvice);
    } catch (error) {

        res.status(400).send(error.message);
    }
});

server.put("/api/avisos/:id", async (req, res) => {
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

server.delete("/api/avisos/:id", async (req, res) => {
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

server.listen(process.env.PORT || port, () => {
    console.log(`Server running at http://localhost:${port}`);
})