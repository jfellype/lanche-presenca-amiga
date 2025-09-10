export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
  class?: string;
  subject?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Mock users for demo
export const mockUsers: User[] = [
  {
    id: 'admin1',
    name: 'Dr. Maria Santos',
    email: 'maria.santos@sigea.edu',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  {
    id: 'teacher1',
    name: 'Prof. Carlos Lima', 
    email: 'carlos.lima@sigea.edu',
    role: 'teacher',
    subject: 'Matemática',
    class: '9º A',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher'
  },
  {
    id: 'student1', 
    name: 'Ana Oliveira',
    email: 'ana.oliveira@sigea.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
    class: '9º A'
  }
];

export const loginUser = (role: 'admin' | 'teacher' | 'student'): User => {
  return mockUsers.find(user => user.role === role) || mockUsers[0];
};