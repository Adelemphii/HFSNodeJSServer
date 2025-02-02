const { default: mongoose } = require('mongoose')

const args = process.argv
const requiredArgsLength = 3

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

const handleError = (message) => {
  console.log(message)
  process.exit(1)
}

if (args.length < requiredArgsLength) {
  handleError('Insert password as arg[1]')
}

const password = args[2]
const url = `mongodb+srv://fullstack:${password}@fullstack.iinjv.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Fullstack`

const fetchEntries = () => {
  console.log('Fetching all entries...')
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

const savePerson = (name, number) => {
  const person = new Person({
    name,
    number
  })
  person.save().then(() => {
    console.log(`Saving person: Name: ${name}, Number: ${number}`)
    mongoose.connection.close()
  })
}

const handleArguments = () => {
  if (args.length === requiredArgsLength) {
    fetchEntries()
  } else if (args.length > requiredArgsLength) {
    const name = args[3]
    const number = args[4]

    if (!name || !number) {
      handleError('Insert both name and number as arg[3] and arg[4]')
    }

    savePerson(name, number)
  }
}

const connectAndProcess = () => {
  mongoose.set('strictQuery', false)
  mongoose.connect(url)
  console.log('Connected to MongoDB')
  handleArguments()
}

connectAndProcess()