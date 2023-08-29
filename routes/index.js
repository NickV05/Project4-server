var express = require('express');
var router = express.Router();

const Project = require("../models/Project")

router.get('/',(req, res, next) => {
  
Project.find()
.then((projects) => {
  console.log("All projects ===>", projects);
  res.json(projects)
})
.catch((err) => {
  console.log(err);
  next(err)
})

router.post('/create', (req, res, next) => {
  const { image, description, link, title } = req.body;
  Project.create({
      image:image,
      description:description,
      link:link,
      title:title
  })
  .then((createdProject) => {
    console.log("Created Project ===>", createdProject)
    res.json(createdProject)
  })
  .catch((err) => {
    console.log(err);
    next(err)
  })
})

});

module.exports = router;
