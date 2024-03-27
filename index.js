import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import Client from "pg";

const app = express();
const port = 3000;


let totalCorrect = 0;
let theFlag=[]

const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"Form-1",
  password:"jk32@12345AA",
  port:5432,
})

db.connect()



db.query("SELECT * FROM FLAGS;",(error,res)=>{
  if(error){
    console.log("Error in DB.Query part:",error.stack)
  }else{
    theFlag=res.rows;
  }
})

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('views engine', 'ejs');


let currentQuestion = {};

// GET home page
console.group("Timmings for get(\"/\"): are")
console.time();


app.get("/", async (req,res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});


console.timeEnd();
console.groupEnd();


// POST a new post
console.group("Timings for post(\"/submit\"): are")
console.time();


app.post("/submit", async (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase())
  {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }
  
  await nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});


console.timeEnd();
console.groupEnd();

function nextQuestion() {
 const randomCountry = theFlag[Math.floor(Math.random() * theFlag .length)];
 currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
