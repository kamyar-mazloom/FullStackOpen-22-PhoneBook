const express = require("express");
const app = express();
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const morgan = require("morgan");

const Contact = require("./models/contact");

app.use(express.static("build"));
app.use(express.json());

morgan.token("content", function getContent(request) {
  return JSON.stringify(request.body);
});
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :content"
  )
);
app.use(cors());

//get

app.get("/api/persons", (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts.map((contact) => contact.toJSON()));
  });
});

app.get("/info", (request, response) => {
  const currentDate = new Date().toLocaleString();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  Contact.find({}).then((contacts) => {
    response.send(
      `<div>
        <p>Phonebook has info for ${contacts.length} people</p>
      </div>
      <div>
        <p>${currentDate} (${timeZone})</p>
      </div>`
    );
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact.toJSON());
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

//Delete
app.delete("/api/persons/:id", (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

//post
app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact
    .save()
    .then((contact) => {
      response.json(contact.toJSON());
    })
    .catch((error) => next(error));
});

//put
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Contact.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson.toJSON());
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);
