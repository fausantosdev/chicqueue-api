import app from './App'

const PORT = app.get('port')

app.listen(PORT, () => {
  console.log(`~ server running on port ${PORT}`)
})
