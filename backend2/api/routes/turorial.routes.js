module.exports = (app) => {
  const tutorials = require("../controllers/tutorial.controller.js");

  var router = require("express").Router();

  // Retrieve all published Tutorials
  router.get("/count", tutorials.count);

  // Retrieve last published Tutorials
  router.get("/last", tutorials.last);

  // Create a new Tutorial
  router.post("/", tutorials.create);

  // Create Many new Tutorial
  router.post("/many", tutorials.createMany);

  // Retrieve all Tutorials
  router.get("/", tutorials.findAll);

  // Retrieve all published Tutorials
  router.get("/published", tutorials.findAllPublished);

  // Retrieve a single Tutorial with Multi Queries
  // https://seointro.de/api/tutorials/doc?testament=o&book=1&chapter=1&verse=1
  router.get("/doc", tutorials.findOneMulti);

  // Retrieve a single Tutorial with vid Param
  // https://seointro.de/api/tutorials/doc/2
  router.get("/doc/:vid", tutorials.findOneMulti);

  // Retrieve a single Tutorial with id Param
  router.get("/:id", tutorials.findOne);

  // Update a Tutorial with id
  router.put("/:id", tutorials.update);

  // Delete a Tutorial with id
  router.delete("/:id", tutorials.delete);

  // Create a new Tutorial
  router.delete("/", tutorials.deleteAll);

  app.use("/api/users", router);
};
