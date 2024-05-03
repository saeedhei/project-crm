const db = require("../models");
const Tutorial = db.tutorials;

// Check if any documents exist in the collection
// https://seointro.de/api/tutorials/count
exports.count = (req, res) => {
  Tutorial.countDocuments()
    .then((data) => {
      res.send({ count: data });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while counting the Tutorial.",
      });
    });
};
// https://seointro.de/api/tutorials/last
exports.last = (req, res) => {
  Tutorial.findOne({}, {}, { sort: { _id: -1 } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the last Tutorial.",
      });
    });
};

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  // if (!req.body.en.vcontent) {
  //   res.status(400).send({ message: "Content can not be empty!" });
  //   return;
  // }

  // Create a Tutorial
  const tutorial = new Tutorial({
    email: req.body.email,
    password: req.body.password,
    // de: req.body.de
    //   ? req.body.de
    //   : {
    //     bname: "",
    //     vtitle: "",
    //     vcontent: "",
    //   },
  });

  // Save Tutorial in the database
  tutorial
    .save(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User.",
      });
    });
};

// Create and Save Many new Tutorial
exports.createMany = (req, res) => {
  const Users = req.body
  Tutorial
    .insertMany(Users)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating Many Tutorials.",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const email = req.query.email;
  var condition = email
    ? { email: { $regex: new RegExp(email), $options: "i" } }
    : {};

  Tutorial.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

// Find a single Tutorial with an id or Email
exports.findOne = (req, res) => {
  const idOrEmail = req.params.id;
  const isEmail = idOrEmail.includes("@");

  if (isEmail) {
    Tutorial.findOne({ email: idOrEmail })
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "Not found Tutorial with email " + idOrEmail });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Error retrieving Tutorial with email=" + idOrEmail });
      });
  } else {
    // If it's not an email, use findById to search by ID
    Tutorial.findById(idOrEmail)
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "Not found Tutorial with id " + idOrEmail });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Error retrieving Tutorial with id=" + idOrEmail });
      });
  }
};

// Find a single Tutorial with Multi Params
exports.findOneMulti = (req, res) => {
  const { sport, book, chapter, verse } = req.query;
  const vid = req.params.vid
  const query = {};
  // query
  if (sport) {
    query.sport = sport;
  }
  if (book) {
    query.book = book;
  }
  if (chapter) {
    query.chapter = chapter;
  }
  if (verse) {
    query.verse = verse;
  }
  // param
  if (vid) {
    query.vid = vid;
  }

  Tutorial.findOne(query)
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: 'Document not found' });
      }
    // Access the 'bname' property safely for each language
    const enBname = data.en ? data.en.bname || '' : '';
    const faBname = data.fa ? data.fa.bname || '' : '';
    const deBname = data.de ? data.de.bname || '' : '';
    const etBname = data.de ? data.de.bname || '' : '';

    // Proceed with your logic using 'enBname', 'faBname', 'deBname', and other data
    // ...

    // Create the 'de' object with 'bname', 'vtitle', and 'vcontent' properties
    const deObject = {
      bname: deBname,
      vtitle: data.de?.vtitle || '',
      vcontent: data.de?.vcontent || '',
    };
    const faObject = {
      bname: data.fa?.bname || '',
      vtitle: data.fa?.vtitle || '',
      vcontent: data.fa?.vcontent || '',
    };
    const etObject = {
      bname: etBname,
      vtitle: data.et?.vtitle || '',
      vcontent: data.et?.vcontent || '',
    };

    // Add 'de' object to the 'data' object
    data.de = deObject;
    data.fa = faObject;
    data.et = etObject;

    // Send the response with the updated 'data' object
    res.status(200).json({
      data,
      // fa: { bname: faBname, vtitle: data.fa?.vtitle || '', vcontent: data.fa?.vcontent || '' },
    });

    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with Multi Params" });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id,
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.findByIdAndDelete(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id,
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Tutorial.find({ published: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};
