const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

const getDb = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { users: [], trips: [], cab_types: [] };
    }
    const content = fs.readFileSync(DB_PATH, 'utf8');
    if (!content.trim()) return { users: [], trips: [], cab_types: [] };
    return JSON.parse(content);
  } catch (err) {
    console.error("Database read error:", err);
    return { users: [], trips: [], cab_types: [] };
  }
};

const saveDb = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

module.exports = {
  findUsers: (query) => {
    const db = getDb();
    return db.users.filter(u => Object.keys(query).every(k => u[k] === query[k]));
  },
  findUserById: (id) => {
    const db = getDb();
    return db.users.find(u => u._id === id);
  },
  saveUser: (user) => {
    const db = getDb();
    const newUser = { ...user, _id: Date.now().toString() };
    db.users.push(newUser);
    saveDb(db);
    return newUser;
  },
  updateUser: (id, updates) => {
    const db = getDb();
    const index = db.users.findIndex(u => u._id === id);
    if (index === -1) return null;
    db.users[index] = { ...db.users[index], ...updates };
    saveDb(db);
    return db.users[index];
  },
  findTrips: (query) => {
    const db = getDb();
    return db.trips.filter(t => Object.keys(query).every(k => t[k] === query[k] || (k === 'driver' && t.driver?._id === query[k])));
  },
  findTripById: (id) => {
    const db = getDb();
    return db.trips.find(t => t._id === id);
  },
  saveTrip: (trip) => {
    const db = getDb();
    const newTrip = { ...trip, _id: Date.now().toString() };
    db.trips.push(newTrip);
    saveDb(db);
    return newTrip;
  },
  updateTrip: (id, updates) => {
    const db = getDb();
    const index = db.trips.findIndex(t => t._id === id);
    if (index === -1) return null;
    db.trips[index] = { ...db.trips[index], ...updates };
    saveDb(db);
    return db.trips[index];
  },
  deleteTrip: (id) => {
    const db = getDb();
    db.trips = db.trips.filter(t => t._id !== id);
    saveDb(db);
  },
  // Cab Types
  findCabTypes: () => {
    const db = getDb();
    return db.cab_types || [];
  },
  findCabTypeById: (id) => {
    const db = getDb();
    return (db.cab_types || []).find(c => c._id === id);
  },
  saveCabType: (cabType) => {
    const db = getDb();
    if (!db.cab_types) db.cab_types = [];
    const newCabType = { ...cabType, _id: Date.now().toString() };
    db.cab_types.push(newCabType);
    saveDb(db);
    return newCabType;
  },
  updateCabType: (id, updates) => {
    const db = getDb();
    const index = db.cab_types.findIndex(c => c._id === id);
    if (index === -1) return null;
    db.cab_types[index] = { ...db.cab_types[index], ...updates };
    saveDb(db);
    return db.cab_types[index];
  },
  deleteCabType: (id) => {
    const db = getDb();
    db.cab_types = db.cab_types.filter(c => c._id !== id);
    saveDb(db);
  },
  clearDb: () => saveDb({ users: [], trips: [], cab_types: [] })
};
