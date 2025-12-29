require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected ✅"))
    .catch(err => console.log("Mongo Error ❌", err));

const schema = new mongoose.Schema({
    Name: String,
    Body: String,
    Type: String,
    DateOfAdd: Date
});

const Joke = mongoose.model("jokes", schema);

app.post("/create", async (req, res) => {
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
        res.status(400).json({ Success: false, e: "تعذر الإضافة" });
    }
});

app.get("/jokes", async (req, res) => {
    try {
        const type = req.query.type;

        const jokes = (type && type !== "any")
            ? await Joke.find({ Type: type }).sort({ DateOfAdd: -1 })
            : await Joke.find({}).sort({ DateOfAdd: -1 });

        res.json({ Success: true, jokes });

    } catch (err) {
        console.error(err);
        res.status(400).json({ Success: false });
    }
});

app.get("/", (req, res) => {
    res.json({ status: "Server running 🚀" });
});

async function call(){
    await axios.get("https://joke1.onrender.com/")
}

setInterval(() => {
  call();
}, 60000);

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});

