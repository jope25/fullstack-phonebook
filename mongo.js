const Note = require('./models/note')

if (process.argv.length > 2) {
  const name = process.argv[2]
  const number = process.argv[3]
  
  console.log(`lisätään henkilö ${name} numero ${number} luetteloon`)
  
  const person = new Person({
    name,
    number
  })

  person
    .save()
    .then(response => {
      mongoose.connection.close()
    })
} else {
  console.log('puhelinluettelo:')
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}
