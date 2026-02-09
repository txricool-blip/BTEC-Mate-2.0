import { User, Note, PDFResource, ChatMessage, UserRole } from '../types';
import { MOCK_USERS, INITIAL_NOTES, INITIAL_RESOURCES, INITIAL_CHATS } from '../constants';

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

  async loginWithGoogle(): Promise<User> {
    // Mock Google Login for Offline Mode
    await new Promise(r => setTimeout(r, 800));
    
    // Try to find existing google user in local users list
    const users = this.get<User[]>('users', []);
    const existingUser = users.find(u => u.id === 'google_mock_123');
    
    if (existingUser) {
        return existingUser;
    }

    const mockGoogleUser: User = {
      id: 'google_mock_123',
      rollNumber: 'G-123456',
      fullName: 'Google User (Mock)',
      department: 'General',
      batch: '13th Batch',
      level: 1,
      term: 1,
      role: UserRole.STUDENT,
      attendancePercent: 100,
      cgpa: 0.00,
      profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google'
    };
    
    // Save new google user to local DB so they persist
    users.push(mockGoogleUser);
    this.set('users', users);

    return mockGoogleUser;
  }

  async register(roll: string, pass: string, batch: string): Promise<User> {
    await new Promise(r => setTimeout(r, 800));
    const auth = this.get<Record<string, string>>('auth', {});
    const users = this.get<User[]>('users', []);

    let userIndex = users.findIndex(u => u.rollNumber === roll);
    let user = users[userIndex];

    if (!user) {
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
    if (batch) user.batch = batch;
    if (userIndex !== -1) users[userIndex] = user;
    
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
    const auth = this.get<Record<string, string>>('auth', {});

    // Filter to show only "Registered/Active" users in the chat list
    // 1. Must be in Auth map (registered with password)
    // 2. OR be the hardcoded admin
    // 3. OR be a Google user (checked by ID format or 'G-' roll)
    const activeUsers = users.filter(u => {
      const isRegistered = !!auth[u.rollNumber];
      const isAdmin = u.rollNumber === '23040401014'; // Hardcoded admin
      const isGoogle = u.rollNumber.startsWith('G-') || u.id.startsWith('google');
      
      return isRegistered || isAdmin || isGoogle;
    });

    if (batchId) return activeUsers.filter(u => u.batch === batchId);
    return activeUsers;
  }

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

  async getResources(): Promise<PDFResource[]> {
    return this.get<PDFResource[]>('resources', []);
  }

  async addResource(res: PDFResource): Promise<PDFResource> {
    const list = this.get<PDFResource[]>('resources', []);
    list.push(res);
    this.set('resources', list);
    return res;
  }

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
  private localDB: LocalDB;

  constructor() {
    this.localDB = new LocalDB();
    console.log('Online Mode: Using Local DB due to missing Firebase configuration/imports');
  }

  // --- Auth & Users ---
  async login(roll: string, pass: string): Promise<User> {
    return this.localDB.login(roll, pass);
  }

  async loginWithGoogle(): Promise<User> {
    return this.localDB.loginWithGoogle();
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
    return this.localDB.sendMessage(msg);
  }
}

export const api = new ApiService();