
import React from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { SidePanel } from '@/components/SidePanel';
import { Header } from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <SidePanel />
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;
