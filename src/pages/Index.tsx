
import React, { useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { SidePanel } from '@/components/SidePanel';
import { Header } from '@/components/Header';
import { ParsedSheetContent } from '@/utils/sheetParser';

const Index = () => {
  const [currentSheetTitle, setCurrentSheetTitle] = useState<string>('');
  const [sheetContent, setSheetContent] = useState<ParsedSheetContent>();

  const handleTitleUpdate = (title: string) => {
    setCurrentSheetTitle(title);
  };

  const handleSheetAdd = (sheet: any) => {
    // 실제로는 여기서 구글 시트 API를 호출해서 데이터를 가져와야 함
    console.log('새 시트 추가됨:', sheet);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header sheetTitle={currentSheetTitle} />
      <div className="flex h-[calc(100vh-4rem)]">
        <SidePanel 
          onTitleUpdate={handleTitleUpdate}
          onSheetAdd={handleSheetAdd}
        />
        <ChatInterface sheetContent={sheetContent} />
      </div>
    </div>
  );
};

export default Index;
