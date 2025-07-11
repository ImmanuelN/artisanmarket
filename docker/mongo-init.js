// MongoDB initialization script
db = db.getSiblingDB('artisanmarket');

// Create admin user
db.createUser({
  user: 'admin',
  pwd: 'admin123',
  roles: [
    {
      role: 'readWrite',
      db: 'artisanmarket'
    }
  ]
});

// Create collections with indexes
db.createCollection('users');
db.createCollection('products');
db.createCollection('vendors');
db.createCollection('orders');
db.createCollection('reviews');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ vendor: 1 });
db.products.createIndex({ category: 1 });
db.products.createIndex({ status: 1 });
db.vendors.createIndex({ user: 1 }, { unique: true });
db.orders.createIndex({ user: 1 });
db.orders.createIndex({ 'items.vendor': 1 });

console.log('ArtisanMarket database initialized successfully!');
