import bodyParser from 'body-parser';
import cors from 'cors';
import {exec} from 'child_process'
import * as fs from 'fs'
import express from 'express';
import mime from 'mime';
const port = 3333;
const app = express();

app.use(bodyParser.json({ limit: '250mb' }));
var router = express.Router();
app.use(cors({origin: '*', allowedHeaders: '*'}))
router.get('/test-tts', function(req, res, next) {
  const text = req.query.text;
  console.log(text)
  fs.writeFile("//home/hungnh/Desktop/projects/vietTTS/assets/transcript.txt", `${text}`, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
  const FILE_NAME = `assets/infore/audio_${Date.now()}.wav`
  exec(`cd /home/hungnh/Desktop/projects/vietTTS && FILE_NAME='${FILE_NAME}' /home/hungnh/Desktop/projects/vietTTS/scripts/quick_start.sh`,
    (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        next({ data: "Error", status: 500})
      }
      var filePath = `/home/hungnh/Desktop/projects/vietTTS/${FILE_NAME}`; // Or format the path using the `id` rest param
      var fileName = "report.wav"; // The default name the browser will use
      var mimetype = mime.getType(filePath);
      res.setHeader('Content-disposition', 'attachment; filename=' + FILE_NAME);
      res.setHeader('Content-type', mimetype);
      res.download(filePath, fileName);
      // var filestream = fs.createReadStream(filePath);
      // filestream.pipe(res);
      // next({ data: null, status: 200})
    });
});

router.get('/listen', function(req, res, next) {
  var filePath = `/home/hungnh/Desktop/projects/vietTTS/assets/infore/audio_1703405924612.wav`; // Or format the path using the `id` rest param
  var fileName = "audio_1703405924612.wav"; // The default name the browser will use
  var mimetype = mime.getType(filePath);
  res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
  res.setHeader('Content-type', mimetype);
  console.log(123)
  // res.download(filePath, fileName);
  var filestream = fs.createReadStream(filePath);
  filestream.pipe(res);
  // next({ data: null, status: 200})
})


app.use('/', router)

app.use((params, req, res, next) => {
  const { status, body } = params;
  res.status(+status || 500).json(body);
  next();
});

app.listen(port, () =>
  console.log(`Account API Service Started on ${Date()}, Port ${port}`),
);
