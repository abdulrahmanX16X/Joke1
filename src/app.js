require("dotenv").config();

const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express()

app.use(express.json())
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected ✅"))
    .catch(err => console.log(err));

const schema = new mongoose.Schema({
    Name: String,
    Body: String,
    Type: String,
    DateOfAdd: Date
});

const Joke = mongoose.model("jokes", schema);

app.post("/creat", async (req, res) => {
    try {
        const addJoke = new Joke({
            Name: req.body.name,
            Body: req.body.body,
            Type: req.body.type,
            DateOfAdd: Date.now()
        });

        await addJoke.save();

        res.status(200).json({ Success: true });
    } catch (err) {
        console.error(err);
        res.status(400).json({ Success: false, e: "تعذر اضافة" });
    }
});

app.get("/jokes", async (req, res) => {
    try {
        const type = req.query.type;

        let jokes;

        if (type && type !== "any") {
            jokes = await Joke.find({ Type: type }).sort({ DateOfAdd: -1 });
        } else {
            jokes = await Joke.find({}).sort({ DateOfAdd: -1 });
        }

        res.json({
            Success: true,
            jokes
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({ Success: false });
    }
});

app.get("/", (req, res) => {
    res.json({ nothing: "hiii" })
})

const PORT = process.env.PORT || 3500;
app.listen(PORT);