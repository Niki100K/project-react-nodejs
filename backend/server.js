const express = require('express')
const cors = require('cors')
const multer = require('multer');
const aws = require('aws-sdk');
const fs = require('fs');
const mysql = require('mysql')
const util = require('util')
require('dotenv').config();

const app = express()
const upload = multer({ dest: 'uploads/' });

app.use(express.json())
app.use(cors())

aws.config.update({
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
  region: process.env.AWS_REGION,
});
const s3 = new aws.S3();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})

const query = util.promisify(db.query).bind(db)

app.post('/upload', upload.single('image'), async (req, res) => {
  const imageFile = req.file;
  const { title, description } = req.body;

  const params = {
    Bucket: 'project-nodejs',
    Key: imageFile.originalname,
    Body: require('fs').createReadStream(imageFile.path),
    ContentType: imageFile.mimetype,
    ContentDisposition: 'inline',
  };
  
  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading to S3:', err);
      return res.status(500).send(err.message);
    } else {
      console.log('Image uploaded to S3:', data.Location);
      
      fs.unlink(imageFile.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting temporary file:', unlinkErr);
        } else {
          console.log('Temporary file deleted successfully');
        }
      });
      console.log(title);
      query(
        'INSERT INTO images (url, title, description) VALUES (?, ?, ?)',
        [data.Location, title, description]
      )
      return res.status(200).json(data.Location);
    }
  });
});


app.get('/data', async (req, res) => {
  try {
    const response = await query('SELECT * FROM images')
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json(error)
  }
})

app.delete('/delete', async (req, res) => {
  const { markImages } = req.body;

  try {
    const deleteOperations = markImages.map(id => {
      return query('DELETE FROM images WHERE id = ?', [id]);
    });

    await Promise.all(deleteOperations);
    
    const affectedRows = deleteOperations.reduce((totalRows, result) => totalRows + result.affectedRows, 0);
    
    res.status(200).json(affectedRows);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(5000)