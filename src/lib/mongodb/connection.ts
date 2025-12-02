import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI !;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();

    cachedClient = client;
    cachedDb = db;

    console.log('✅ MongoDB connected successfully');
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}