const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (req, res) => {
  return res.json(repositories);
});

app.post('/repositories', (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return res.json(repository);
});

app.put('/repositories/:id', (req, res) => {
  const { id } = req.params;
  const { title, url, techs, likes } = req.body;

  if(!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid repository ID.'});
  }

  // busca o indice do vetor que eu quero atualizar
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  const repository = { id, title, url, techs, likes };

  repositories[repoIndex] = repository;

  return res.json(repository);
});

app.delete('/repositories/:id', (req, res) => {
  const { id } = req.params;

  if(!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid repository ID.'});
  }

  // busca o indice do vetor que eu quero atualizar
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0) {
    return res.status(400).json({ error: 'Repository not found'});
  }

  repositories.splice(repoIndex, 1);

  return res.status(204).send();
});

app.post('/repositories/:id/like', (req, res) => {
  const { id } = req.params;
  
  if(!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid repository ID.'});
  }

  const repository = repositories.find(repo => repo.id === id);

  repository.likes = repository.likes + 1;

  return res.json(repository);
});

module.exports = app;