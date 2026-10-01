const express = require("express");
const app = express();
const PORT = 5000;
const cors = require("cors");
const dbConnection = require("./client/dbConnection")


app.use(express.json())
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

//User Creation

app.use("/api/v1/auth", require("./routes/user"));









//Server Connection And Db connection

app.listen(PORT, () => {
    try {
        console.log(`Server Running on PORT: ${PORT} `)
        dbConnection()
    } catch (error) {
        console.error("error Running the Server", error);

    }
})