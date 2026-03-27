require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes/routers")

const Server = express();

Server.use(cors());
Server.use(express.json());
Server.use("/uploads", express.static("uploads"));

Server.use(router);

Server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

Server.get('/',(req,res)=>{
    res.status(200).send(`<h1> Server Started.. And waiting for Client Request !!!!</h1>`)
})