import { connectToDatabase } from './connection';
import bcryptjs from 'bcryptjs';
import { ObjectId } from 'mongodb';

// Interfaces
export interface User {
  _id?: ObjectId;
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  passwordHash: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface Session {
  _id?: ObjectId;
  token: string;
  userId: string;
  createdAt: Date;
}

// Collection names
const USERS_COLLECTION = 'users';
const SESSIONS_COLLECTION = 'sessions';

// Helper functions
export const generateId = (): string => Math.random().toString(36).slice(2) + Date.now().toString(36);
export const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePhoneNumber = (phone: string): boolean => /^\d{10}$/.test(phone);
export const verifyPassword = (password: string, hashedPassword: string): boolean => bcryptjs.compareSync(password, hashedPassword);

// User Service
export const userService = {
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { db } = await connectToDatabase();
      
      // Check unique constraints
      const existingUsername = await db.collection<User>(USERS_COLLECTION).findOne({ 
        username: { $regex: new RegExp(`^${userData.username}$`, 'i') } 
      });
      if (existingUsername) return { success: false, error: 'Username already exists' };

      const existingEmail = await db.collection<User>(USERS_COLLECTION).findOne({ 
        email: { $regex: new RegExp(`^${userData.email}$`, 'i') } 
      });
      if (existingEmail) return { success: false, error: 'Email already exists' };

      const existingPhone = await db.collection<User>(USERS_COLLECTION).findOne({ 
        phoneNumber: userData.phoneNumber 
      });
      if (existingPhone) return { success: false, error: 'Phone number already exists' };

      const newUser: User = { 
        ...userData, 
        id: generateId(), 
        createdAt: new Date() 
      };
      
      const result = await db.collection<User>(USERS_COLLECTION).insertOne(newUser);
      newUser._id = result.insertedId;

      return { success: true, user: newUser };
    } catch (error) {
      console.error('❌ Error creating user:', error);
      return { success: false, error: 'Database error' };
    }
  },

  async findUserByUsername(username: string): Promise<User | null> {
    const { db } = await connectToDatabase();
    return db.collection<User>(USERS_COLLECTION).findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } 
    });
  },

  async findUserByEmail(email: string): Promise<User | null> {
    const { db } = await connectToDatabase();
    return db.collection<User>(USERS_COLLECTION).findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
  },

  async findUserById(id: string): Promise<User | null> {
    const { db } = await connectToDatabase();
    return db.collection<User>(USERS_COLLECTION).findOne({ id });
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
    const { db } = await connectToDatabase();
    const result = await db.collection<User>(USERS_COLLECTION).updateOne(
      { id: userId }, 
      { $set: updates }
    );
    return result.modifiedCount > 0;
  },

  async deleteUser(userId: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const result = await db.collection<User>(USERS_COLLECTION).deleteOne({ id: userId });
    return result.deletedCount > 0;
  }
};

// Session Service
export const sessionService = {
  async createSession(userId: string): Promise<Session> {
    const { db } = await connectToDatabase();
    const session: Session = { 
      token: generateId(), 
      userId, 
      createdAt: new Date() 
    };
    await db.collection<Session>(SESSIONS_COLLECTION).insertOne(session);
    return session;
  },

  async getSession(token: string): Promise<Session | null> {
    const { db } = await connectToDatabase();
    return db.collection<Session>(SESSIONS_COLLECTION).findOne({ token });
  },

  async deleteSession(token: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const result = await db.collection<Session>(SESSIONS_COLLECTION).deleteOne({ token });
    return result.deletedCount > 0;
  },

  async deleteUserSessions(userId: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const result = await db.collection<Session>(SESSIONS_COLLECTION).deleteMany({ userId });
    return result.deletedCount > 0;
  }
};