import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const MainLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <Header />
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 ml-64 mt-16">{children}</main>
    </div>
  </div>
);
