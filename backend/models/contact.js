const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
console.log("connecting to", url);

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (value) => /\d{2,3}-\d{5,8}/.test(value),
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
});

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Contact", contactSchema);
