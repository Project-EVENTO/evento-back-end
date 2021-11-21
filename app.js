const express = require('express');
const bodyParser = require('body-parser');
const ejs=require("ejs");
const path = require('path');
const mysql = require('mysql');
const cors = require("cors");
const fs = require('fs')
const conn = mysql.createConnection({  //db베이스 연결
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    port     : '3306',
    database : 'evento'
});
let lectures 
const app = express(); //익스프레스 실행
app.use(bodyParser.json())
app.set('view engine', 'ejs');  // 뷰 세팅
app.set('views', './view');  // 뷰 세팅
app.use(cors())

app.set('port', process.env.PORT || 5500); //포트 설정

app.get('/', (res) => {  // logcalhost:5500 일때 get방식
  res.sendFile(path.join(__dirname, '/index.html'));  // 
  fs.readFile('/index.html', (err,data) => {
    res.send(data)
  })
});

app.get('/user/readall', function(req, res){ 
  var sql = 'SELECT st_id,st_name FROM student'; 
  conn.query(sql, function(err, result, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error')
    }
      res.render('readall', { student: result }); 
  });
});

//app.get(['/user/read/st_name/:id'], function(req, res){ 
app.get('/user/read/', function(req, res){ 
  //let id = param['id'];
  let id=req.query.st_name;
  console.log(id)
  if(id) {
    res.json();
    var sql = 'SELECT st_id,st_name FROM student where st_name="' + id + '"'; 
    conn.query(sql, function(err, result, fields) {
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error')
      }
      else res.render('search', { student: result }); 
    });
  }
});


app.post('/lecture',function(req,res){
  console.log(req.body);
  const lecture  = req.body
  const column = "lecture_title,lecture_host,lecture_place,lecture_grade,lecture_member,lecture_des"
  const value = `'${lecture.title}','${lecture.host}','${lecture.place}',${lecture.grade},${lecture.member},'${lecture.des}'`
  var sql = `INSERT INTO lecture (${column}) values(${value})`
  console.log(sql);
  conn.query(sql, (err,resul,fields)=>{
    if(err){
      console.log(err)
    }
  })
})

app.get('/lecture',function(req,res){
  var sql = `SELECT * from lecture`
  conn.query(sql,(err,result,fields)=>{
    if(err){
      console.log(err)
    }
    res.json(result)
  })  
})

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});