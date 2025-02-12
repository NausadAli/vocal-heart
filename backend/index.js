const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log(PORT)

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, 
   {
      dbName: 'job-portal'
   }
)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Define Job Schema
const jobSchema = new mongoose.Schema({
   title: String,
   company: String,
   location: String,
   description: String
});

const Job = mongoose.model('Job', jobSchema);


app.post('/api/jobs', async (req, res) => {
   try {
     const job = new Job(req.body);
     await job.save();
     res.status(201).send(job);
   } catch (error) {
     console.error('Error creating job:', error);
     res.status(500).json({ message: 'Internal Server Error' });
   }
 });
 
 app.get('/api/jobs', async (req, res) => {
   try {
     const { keywords, location } = req.query;
     let query = {};
     if (keywords) query.title = new RegExp(keywords, 'i');
     if (location) query.location = new RegExp(location, 'i');
     const jobs = await Job.find(query);
     res.send(jobs);
   } catch (error) {
     console.error('Error fetching jobs:', error);
     res.status(500).json({ message: 'Internal Server Error' });
   }
 });

app.get('/', ()=>{
  console.log("Hello Vercel")
})
 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));