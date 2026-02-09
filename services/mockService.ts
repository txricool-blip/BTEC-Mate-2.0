import { MOCK_USERS } from '../constants';
import { User } from '../types';

// Helper to get registered users from LocalStorage
const getRegisteredUsers = (): Record<string, string> => {
  try {
    const data = localStorage.getItem('btec_registered_users');
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveRegisteredUser = (roll: string, pass: string) => {
  const users = getRegisteredUsers();
  users[roll] = pass;
  localStorage.setItem('btec_registered_users', JSON.stringify(users));
};

export const mockLogin = async (rollNumber: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // 1. Hardcoded Super Admin Check (Bypasses Registration for demo purposes as per prompt "Hardcoded")
  if (rollNumber === '23040401014' && password === 'adminlogin') {
    const adminUser = MOCK_USERS.find(u => u.rollNumber === rollNumber);
    if (!adminUser) throw new Error('System error: Admin user not found in Master DB');
    return adminUser;
  }

  // 2. Check if user exists in Master Database
  const masterUser = MOCK_USERS.find(u => u.rollNumber === rollNumber);
  if (!masterUser) {
    throw new Error('Roll Number not found in University records.');
  }

  // 3. Check if user is registered and password matches
  const registeredUsers = getRegisteredUsers();
  const savedPassword = registeredUsers[rollNumber];

  if (!savedPassword) {
    throw new Error('Account not registered. Please register first.');
  }

  if (savedPassword !== password) {
    throw new Error('Invalid password.');
  }

  return masterUser;
};

export const mockRegister = async (rollNumber: string, password: string, batch: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // 1. Check if user exists in Master Database
  const masterUser = MOCK_USERS.find(u => u.rollNumber === rollNumber);
  if (!masterUser) {
    throw new Error('Roll Number not found in University records.');
  }

  // 2. Check if already registered
  const registeredUsers = getRegisteredUsers();
  if (registeredUsers[rollNumber]) {
    throw new Error('This Roll Number is already registered. Please login.');
  }

  // 3. Save "Registration"
  saveRegisteredUser(rollNumber, password);

  // Return user with the batch they selected (updating the mock instance in memory for this session)
  // We also update the MOCK_USERS array so subsequent logins/fetches have the correct batch
  const userIndex = MOCK_USERS.findIndex(u => u.rollNumber === rollNumber);
  if (userIndex !== -1) {
    MOCK_USERS[userIndex] = { ...masterUser, batch };
  }
  
  return { ...masterUser, batch };
};

export const updateUserProfile = async (rollNumber: string, updates: { phoneNumber?: string; profileImageUrl?: string; batch?: string }): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const userIndex = MOCK_USERS.findIndex(u => u.rollNumber === rollNumber);
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // Update the mock database (in-memory)
  const updatedUser = { ...MOCK_USERS[userIndex], ...updates };
  MOCK_USERS[userIndex] = updatedUser;

  return updatedUser;
};

export const getBatchUsers = (batchId: string): User[] => {
  return MOCK_USERS.filter(u => u.batch === batchId);
};