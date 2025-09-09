export interface User {
  id: string;
  name: string;
  role: 'admin' | 'student';
  avatar?: string;
  class?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Mock users for demo
export const mockUsers: User[] = [
  {
    id: 'admin1',
    name: 'Diretor Silva',
    role: 'admin',
    avatar: 'DS'
  },
  {
    id: 'student1', 
    name: 'Ana Santos',
    role: 'student',
    avatar: 'AS',
    class: '5ºA'
  }
];

export const loginUser = (role: 'admin' | 'student'): User => {
  return mockUsers.find(user => user.role === role) || mockUsers[0];
};