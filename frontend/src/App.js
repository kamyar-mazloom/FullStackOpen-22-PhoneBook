import { useState, useEffect } from "react";
import phonebookService from "./services/phonebook";
import "./css/app.css";

const App = () => {
  //useState
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newSearch, setNewSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //useEffect
  useEffect(() => {
    phonebookService.getAll().then((initialContacts) => {
      setPersons(initialContacts);
    });
  }, []);

  //component
  const Numbers = () => {
    if (newSearch === "") {
      return (
        <ul>
          {persons.map((x) => (
            <li key={x.id}>
              {x.name} {x.number}
              <button
                type="submit"
                id={x.id}
                onClick={() => deleteContact(x.id)}
              >
                delete
              </button>
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <ul>
          {filteredResult.map((x) => (
            <li key={x.id}>
              {x.name} {x.number}
              <button
                type="submit"
                id={x.id}
                onClick={() => deleteContact(x.id)}
              >
                delete
              </button>
            </li>
          ))}
        </ul>
      );
    }
  };

  const Notification = ({ message }) => {
    if (message === "") {
      return null;
    }
    return <div className="positive_notification">{message}</div>;
  };

  //event handlers
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const handleSearchChange = (event) => {
    setNewSearch(event.target.value);
  };

  //logic

  const isDuplicate = persons.some((element) => {
    if (element.name === newName) {
      return true;
    }
    return false;
  });

  const filteredResult = persons.filter((person) =>
    person.name.toLowerCase().includes(newSearch.toLowerCase())
  );

  const deleteName = (id) => {
    for (let i = 0; i < persons.length; i++) {
      if (persons[i].id === id) {
        return persons[i].name;
      }
    }
  };

  const deleteContact = (id) => {
    if (window.confirm(`Remove ${deleteName(id)} from phone book?`))
      phonebookService
        .deleteContact(id)
        .then(() => setPersons(persons.filter((persons) => persons.id !== id)))
        .catch((error) => {
          setErrorMessage(
            `${deleteName(id)} was already removed from the phonebook`
          );
          setTimeout(() => {
            setErrorMessage("");
          }, 5000);
        });
  };

  // const updateNumber = (newName, newNumber) => {
  //   let person = persons.find((person) => person.name === newName);
  //   let id = person.id;
  //   let object = {
  //     name: newName,
  //     number: newNumber,
  //     id: id,
  //   };
  //   phonebookService.updateNumber(id, object).then((returnedNote) => {
  //     setPersons(
  //       persons.map((person) => (person.id !== id ? person : returnedNote))
  //     );
  //   });
  // };

  const addContact = (event) => {
    event.preventDefault();
    if (isDuplicate) {
      // if (
      //   window.confirm(
      //     `${newName} is already in the phonebook,replace the old number with the new one?`
      //   )
      // ) {
      //   updateNumber(newName, newNumber);
      //   setErrorMessage(`${newName}'s phone number was updated`);
      //   setTimeout(() => {
      //     setErrorMessage("");
      //   }, 5000);
      // }

      setErrorMessage(`${newName} is already in the phonebook`);
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } else {
      const phoneObject = {
        name: newName,
        number: newNumber,
      };
      phonebookService
        .create(phoneObject)
        .then((createdPerson) => {
          setPersons(persons.concat(createdPerson));
          setNewName("");
          setNewNumber("");
          setErrorMessage(`Added ${newName}`);
          setTimeout(() => {
            setErrorMessage("");
          }, 5000);
        })
        .catch((error) => {
          setErrorMessage(error.response.data.error);
          setTimeout(() => {
            setErrorMessage("");
          }, 5000);
        });
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={errorMessage} />
      <div>
        filter names with
        <input value={newSearch} onChange={handleSearchChange} />
      </div>
      <form>
        <>
          <h2>Add a new contact</h2>
          <div>
            Name: <input value={newName} onChange={handleNameChange} />
          </div>
          <div>
            Phone: <input value={newNumber} onChange={handleNumberChange} />
          </div>
        </>
        <div>
          <button type="submit" onClick={addContact}>
            add
          </button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Numbers />
    </div>
  );
};

export default App;
