const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://mangoDB-phonebook:fheWPSqsIWCmrYZO@cluster0.nfrtr.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

//remind to put in password
if (process.argv.length < 3 || process.argv.length === 4) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

//Show all the entries
if (process.argv.length === 3) {
  Contact.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    console.log(`total of ${result.length} entries`);
    mongoose.connection.close();
  });
}

//add to the DB
if (process.argv.length === 5) {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  });

  contact.save().then(() => {
    console.log(
      `added ${contact.name} with phone number ${contact.number} to phonebook`
    );
    mongoose.connection.close();
  });
}
