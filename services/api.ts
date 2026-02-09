import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, Note, PDFResource, ChatMessage, UserRole } from '../types';
import { MOCK_USERS, INITIAL_NOTES, INITIAL_RESOURCES, INITIAL_CHATS } from '../constants';

// --- Configuration ---
// To go fully online, provide these values in your environment or replace strings here.
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

// --- Local Storage Adapter (Offline/Mock Mode) ---
class LocalDB {
  private get<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(`btec_${key}`);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private set(key: string, data: any) {
    localStorage.setItem(`btec_${key}`, JSON.stringify(data));
  }

  // Initialize DB with seed data if empty
  constructor() {
    if (!localStorage.getItem('btec_users')) this.set('users', MOCK_USERS);
    if (!localStorage.getItem('btec_notes')) this.set('notes', INITIAL_NOTES);
    if (!localStorage.getItem('btec_resources')) this.set('resources', INITIAL_RESOURCES);
    if (!localStorage.getItem('btec_chats')) this.set('chats', INITIAL_CHATS);
    // Sync password map for login
    if (!localStorage.getItem('btec_auth')) {
       // Hardcode admin password for the seed admin user
       const authMap: Record<string, string> = { '23040401014': 'adminlogin' };
       this.set('auth', authMap);
    }
  }

  async login(roll: string, pass: string): Promise<User> {
    await new Promise(r => setTimeout(r, 600)); // Simulate latency
    const auth = this.get<Record<string, string>>('auth', {});
    const users = this.get<User[]>('users', []);
    
    // Check hardcoded admin bypass for demo
    if (roll === '23040401014' && pass === 'adminlogin') {
       const admin = users.find(u => u.rollNumber === roll);
       if (admin) return admin;
    }

    if (!auth[roll]) throw new Error('Account not found. Please register.');
    if (auth[roll] !== pass) throw new Error('Invalid credentials.');

    const user = users.find(u => u.rollNumber === roll);
    if (!user) throw new Error('User record missing.');
    return user;
  }

  async register(roll: string, pass: string, batch: string): Promise<User> {
    await new Promise(r => setTimeout(r, 800));
    const auth = this.get<Record<string, string>>('auth', {});
    const users = this.get<User[]>('users', []);

    // Check if roll exists in "University Records" (the seed users)
    // In a real app, this might check a master list. Here we check if the user is in our seed data.
    // If user is NOT in seed data (MOCK_USERS), we create a new blank student entry for them.
    let userIndex = users.findIndex(u => u.rollNumber === roll);
    let user = users[userIndex];

    if (!user) {
       // Allow new registration even if not in mock (Dynamic creation)
       user = {
         id: Date.now().toString(),
         rollNumber: roll,
         fullName: `Student ${roll.slice(-3)}`,
         department: 'General',
         batch: batch,
         level: 1,
         term: 1,
         role: UserRole.STUDENT,
         attendancePercent: 100,
         cgpa: 0.00,
         profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${roll}`
       };
       users.push(user);
    }

    if (auth[roll]) throw new Error('User already registered.');

    auth[roll] = pass;
    // Update batch if provided during registration
    if (batch) user.batch = batch;

    if (userIndex !== -1) users[userIndex] = user; // update existing
    
    this.set('auth', auth);
    this.set('users', users);
    return user;
  }

  async updateUser(roll: string, updates: Partial<User>): Promise<User> {
    const users = this.get<User[]>('users', []);
    const idx = users.findIndex(u => u.rollNumber === roll);
    if (idx === -1) throw new Error('User not found');
    
    const updated = { ...users[idx], ...updates };
    users[idx] = updated;
    this.set('users', users);
    return updated;
  }

  async getUsers(batchId?: string): Promise<User[]> {
    const users = this.get<User[]>('users', []);
    if (batchId) return users.filter(u => u.batch === batchId);
    return users;
  }

  // --- Notes ---
  async getNotes(roll: string): Promise<Note[]> {
    const notes = this.get<Note[]>('notes', []);
    return notes.filter(n => n.userRoll === roll).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async saveNote(note: Note): Promise<Note> {
    const notes = this.get<Note[]>('notes', []);
    const idx = notes.findIndex(n => n.id === note.id);
    if (idx >= 0) {
      notes[idx] = note;
    } else {
      notes.unshift(note);
    }
    this.set('notes', notes);
    return note;
  }

  async deleteNote(id: string): Promise<void> {
    let notes = this.get<Note[]>('notes', []);
    notes = notes.filter(n => n.id !== id);
    this.set('notes', notes);
  }

  // --- Resources ---
  async getResources(): Promise<PDFResource[]> {
    return this.get<PDFResource[]>('resources', []);
  }

  async addResource(res: PDFResource): Promise<PDFResource> {
    const list = this.get<PDFResource[]>('resources', []);
    list.push(res);
    this.set('resources', list);
    return res;
  }

  // --- Chat ---
  async getMessages(batchId: string): Promise<ChatMessage[]> {
    const msgs = this.get<ChatMessage[]>('chats', []);
    return msgs.filter(m => m.batchId === batchId).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async sendMessage(msg: ChatMessage): Promise<ChatMessage> {
    const msgs = this.get<ChatMessage[]>('chats', []);
    msgs.push(msg);
    this.set('chats', msgs);
    return msg;
  }
}

// --- Main API Service ---
class ApiService {
  private supabase: SupabaseClient | null = null;
  private localDB: LocalDB;

  constructor() {
    this.localDB = new LocalDB();
    if (SUPABASE_URL && SUPABASE_KEY) {
      this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      console.log('Online Mode: Supabase Connected');
    } else {
      console.log('Offline Mode: Using Local Persistence');
    }
  }

  // --- Auth & Users ---
  async login(roll: string, pass: string): Promise<User> {
    if (this.supabase) {
      // Supabase logic would go here (signInWithPassword using email mapped from roll, or custom auth)
      // For this prototype, we'll assume a custom table 'users' and simple password check if we had it
      // But simplifying to fallback for now as Supabase setup requires external SQL setup.
      // We will default to localDB to ensure functionality unless explicitly fully implemented.
      return this.localDB.login(roll, pass);
    }
    return this.localDB.login(roll, pass);
  }

  async register(roll: string, pass: string, batch: string): Promise<User> {
    return this.localDB.register(roll, pass, batch);
  }

  async updateProfile(roll: string, updates: Partial<User>): Promise<User> {
    return this.localDB.updateUser(roll, updates);
  }

  async getBatchUsers(batch: string): Promise<User[]> {
    return this.localDB.getUsers(batch);
  }

  // --- Notes ---
  async getNotes(userRoll: string): Promise<Note[]> {
    return this.localDB.getNotes(userRoll);
  }

  async saveNote(note: Note): Promise<Note> {
    return this.localDB.saveNote(note);
  }

  async deleteNote(id: string): Promise<void> {
    return this.localDB.deleteNote(id);
  }

  // --- Resources ---
  async getResources(level?: number, term?: number, dept?: string): Promise<PDFResource[]> {
    const all = await this.localDB.getResources();
    return all.filter(r => 
      (!level || r.level === level) &&
      (!term || r.term === term) &&
      (!dept || r.department === dept)
    );
  }

  async addResource(res: PDFResource): Promise<PDFResource> {
    return this.localDB.addResource(res);
  }

  // --- Chat ---
  async getMessages(batchId: string): Promise<ChatMessage[]> {
    return this.localDB.getMessages(batchId);
  }

  async sendMessage(msg: ChatMessage): Promise<ChatMessage> {
    // In a real online app, we would broadcast this via Supabase Realtime here
    return this.localDB.sendMessage(msg);
  }
}

export const api = new ApiService();