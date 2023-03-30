const express = require('express');
const app = express();
const fs = require('fs');

const storesFilePath = './db/stores.json';

// parse JSON
app.use(express.json());

// /api/store
// GET all stores and their items
app.get('/api/store', (req, res) => {
  try {
    const storesData = fs.readFileSync(storesFilePath);
    const stores = JSON.parse(storesData);
    res.status(200).json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// /api/store/:id
// GET a specific store and its items based on the ID
app.get('/api/store/:id', (req, res) => {
  try {
    const storesData = fs.readFileSync(storesFilePath);
    const stores = JSON.parse(storesData);
    const store = stores.find((s) => s.id === parseInt(req.params.id));
    if (!store) {
      res.status(404).send('Store not found');
    } else {
      res.status(200).json(store);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

//api/stores/:store/item
// GET a specific item in a specific store based on store and item 
app.get('/api/stores/:store/:item', (req, res) => {
  try {
    const storesData = fs.readFileSync(storesFilePath);
    const stores = JSON.parse(storesData);
    const store = stores.find((s) => s.name.toLowerCase() === req.params.store.toLowerCase());
    if (!store) {
      res.status(404).send('Store not found');
    } else {
      const item = store.items.find((i) => i.name.toLowerCase() === req.params.item.toLowerCase());
      if (!item) {
        res.status(404).send('Item not found');
      } else {
        res.status(200).json(item);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// /api/store/add
// POST a new store to the JSON file
app.post('/api/store/add', (req, res) => {
  try {
    const storesData = fs.readFileSync(storesFilePath);
    const stores = JSON.parse(storesData);
    const newStore = {
      id: stores.length + 1,
      name: req.body.name,
      city: req.body.city,
      items: []
    };
    stores.push(newStore);
    fs.writeFileSync(storesFilePath, JSON.stringify(stores));
    res.status(201).send('Store added successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// /api/store/:store/items/add
// POST a new item to a specific store
app.post('/api/store/:store/items/add', (req, res) => {
  try {
    const storesData = fs.readFileSync(storesFilePath);
    const stores = JSON.parse(storesData);
    const storeIndex = stores.findIndex((s) => s.name.toLowerCase() === req.params.store.toLowerCase());
    if (storeIndex === -1) {
      res.status(404).send('Store not found');
    } else {
      const newItem = {
        id: stores[storeIndex].items.length + 1,
        name: req.body.name,
        regularPrice: req.body.regularPrice,
        salePrice: req.body.salePrice
      };
      stores[storeIndex].items.push(newItem);
      fs.writeFileSync(storesFilePath, JSON.stringify(stores));
      res.status(201).send('Item added successfully');
      }
      } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      }
      });
      
      
      // start the server
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
      });
      
