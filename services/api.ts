import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, Firestore, collection, doc, getDoc, setDoc, addDoc, query, where, getDocs, orderBy, deleteDoc, updateDoc } from 'firebase/firestore';
import { User, Note, PDFResource, ChatMessage, UserRole } from '../types';
import { MOCK_USERS, INITIAL_NOTES, INITIAL_RESOURCES, INITIAL_CHATS } from '../constants';

// --- Configuration ---
// Safe access to import.meta.env to prevent runtime crashes
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    return import.meta.env && import.meta.env[key] ? import.meta.env[key] : '';
  } catch {
    return '';
  }
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

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
    if (batchId) return users.filter(u => u.batch === batchId);
    return users;
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
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private db: Firestore | null = null;
  private localDB: LocalDB;

  constructor() {
    this.localDB = new LocalDB();
    
    // Check if config exists and looks valid (api key presence)
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
      try {
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
        console.log('Online Mode: Firebase Connected');
      } catch (e) {
        console.warn('Firebase init failed, falling back to local DB', e);
      }
    } else {
      console.log('Offline Mode: Using Local Persistence (No Firebase Config)');
    }
  }

  // Helper to map Roll Number to pseudo-email for Firebase Auth
  private getEmail(roll: string) {
    return `${roll}@btec.app`;
  }

  // --- Auth & Users ---
  async login(roll: string, pass: string): Promise<User> {
    if (this.auth && this.db) {
      try {
        // 1. Authenticate with Firebase Auth
        await signInWithEmailAndPassword(this.auth, this.getEmail(roll), pass);
        
        // 2. Fetch User Profile from Firestore 'users' collection
        // Assumes document ID is the roll number for simplicity
        const docRef = doc(this.db, 'users', roll);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return docSnap.data() as User;
        } else {
          // Fallback if auth exists but profile doc is missing (rare/legacy)
          // We create a basic profile based on local constants if found, else generic
          const seedUser = MOCK_USERS.find(u => u.rollNumber === roll);
          const newUser: User = seedUser || {
            id: roll,
            rollNumber: roll,
            fullName: 'Student',
            department: 'Unknown',
            batch: 'Unknown',
            level: 1,
            term: 1,
            role: UserRole.STUDENT,
            attendancePercent: 0,
            cgpa: 0,
            profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${roll}`
          };
          // Save this to firestore so it exists next time
          await setDoc(docRef, newUser);
          return newUser;
        }
      } catch (error: any) {
        console.error("Firebase Login Error", error);
        throw new Error(error.message || 'Login failed');
      }
    }
    return this.localDB.login(roll, pass);
  }

  async register(roll: string, pass: string, batch: string): Promise<User> {
    if (this.auth && this.db) {
      try {
        // 1. Create Auth User
        await createUserWithEmailAndPassword(this.auth, this.getEmail(roll), pass);
        
        // 2. Prepare User Profile
        // Check if we have seed data for this roll
        const seedUser = MOCK_USERS.find(u => u.rollNumber === roll);
        
        const newUser: User = {
          ...(seedUser || {
             id: roll,
             rollNumber: roll,
             fullName: `Student ${roll.slice(-3)}`,
             department: 'General',
             level: 1,
             term: 1,
             role: UserRole.STUDENT,
             attendancePercent: 100,
             cgpa: 0.00,
             profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${roll}`
          }),
          batch: batch // Override/Set batch from registration form
        };

        // 3. Save to Firestore
        await setDoc(doc(this.db, 'users', roll), newUser);
        return newUser;
      } catch (error: any) {
        console.error("Firebase Register Error", error);
        throw new Error(error.message || 'Registration failed');
      }
    }
    return this.localDB.register(roll, pass, batch);
  }

  async updateProfile(roll: string, updates: Partial<User>): Promise<User> {
    if (this.db) {
      const docRef = doc(this.db, 'users', roll);
      await updateDoc(docRef, updates);
      // Fetch latest
      const snap = await getDoc(docRef);
      return snap.data() as User;
    }
    return this.localDB.updateUser(roll, updates);
  }

  async getBatchUsers(batch: string): Promise<User[]> {
    if (this.db) {
      const q = query(collection(this.db, 'users'), where('batch', '==', batch));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => d.data() as User);
    }
    return this.localDB.getUsers(batch);
  }

  // --- Notes ---
  async getNotes(userRoll: string): Promise<Note[]> {
    if (this.db) {
      const q = query(
        collection(this.db, 'notes'), 
        where('userRoll', '==', userRoll)
      );
      const snapshot = await getDocs(q);
      const notes = snapshot.docs.map(d => d.data() as Note);
      // Client-side sort if index missing
      return notes.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    return this.localDB.getNotes(userRoll);
  }

  async saveNote(note: Note): Promise<Note> {
    if (this.db) {
      const docRef = doc(this.db, 'notes', note.id);
      await setDoc(docRef, note);
      return note;
    }
    return this.localDB.saveNote(note);
  }

  async deleteNote(id: string): Promise<void> {
    if (this.db) {
      await deleteDoc(doc(this.db, 'notes', id));
      return;
    }
    return this.localDB.deleteNote(id);
  }

  // --- Resources ---
  async getResources(level?: number, term?: number, dept?: string): Promise<PDFResource[]> {
    if (this.db) {
      // Basic query, client-side filtering for simplicity due to multiple permutations
      const q = query(collection(this.db, 'resources'));
      const snapshot = await getDocs(q);
      let resources = snapshot.docs.map(d => d.data() as PDFResource);
      
      if (level) resources = resources.filter(r => r.level === level);
      if (term) resources = resources.filter(r => r.term === term);
      if (dept) resources = resources.filter(r => r.department === dept);
      
      return resources;
    }

    const all = await this.localDB.getResources();
    return all.filter(r => 
      (!level || r.level === level) &&
      (!term || r.term === term) &&
      (!dept || r.department === dept)
    );
  }

  async addResource(res: PDFResource): Promise<PDFResource> {
    if (this.db) {
      await setDoc(doc(this.db, 'resources', res.id), res);
      return res;
    }
    return this.localDB.addResource(res);
  }

  // --- Chat ---
  async getMessages(batchId: string): Promise<ChatMessage[]> {
    if (this.db) {
      const q = query(
        collection(this.db, 'chats'), 
        where('batchId', '==', batchId)
      );
      const snapshot = await getDocs(q);
      const msgs = snapshot.docs.map(d => d.data() as ChatMessage);
      return msgs.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
    return this.localDB.getMessages(batchId);
  }

  async sendMessage(msg: ChatMessage): Promise<ChatMessage> {
    if (this.db) {
      await setDoc(doc(this.db, 'chats', msg.id), msg);
      return msg;
    }
    return this.localDB.sendMessage(msg);
  }
}

export const api = new ApiService();