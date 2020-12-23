const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories =[]
//middleware:
function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.time(logLabel);

  next();

  console.timeEnd(logLabel)
  }

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (! isUuid(id)){
      return response.status(400).json({ error: "Invalid project ID."})
    }
  return next();
      }

app.use(logRequests);
app.use('/repositories/:id', validateProjectId);

app.get("/repositories", (request, response) => {

  return response.status("200").json(repositories)
});

app.post("/repositories", (request, response) => {

  const { title, url, techs}  = request.body

  const repositorie = { id: uuid(), title, url, techs:[techs], likes:0 }

  repositories.push(repositorie)
  return response.json(repositorie)

});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

    console.log(request.body)

  const repositoriesIndex = repositories.findIndex(repositorie => repositorie.id == id)
  if(repositoriesIndex < 0) {
    return response.status(400).json({ error: 'Project not found' });
  }

  const result = {
    id, title, url, techs, likes:repositories[repositoriesIndex].likes
  }

  repositories[repositoriesIndex] = result
  
  return response.json( result)
 
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex(repositorie => repositorie.id == id)

  if(repositoriesIndex < 0) {
    return response.status(400).json({ error: 'Project not found' });
  }
  repositories.splice(repositoriesIndex, 1);

  return response.status(204).send()
});

app.put("/repositories/:id/likes", (request, response) => {
  const { id } = request.params;
  
  const repositoriesIndex = repositories.findIndex(repositorie => repositorie.id == id)

  if(repositoriesIndex < 0) {
    return response.status(400).json({ error: 'Project not found' });
  }

  repositories[repositoriesIndex].likes+=1

return response.json(repositories[repositoriesIndex])
});

module.exports = app;
