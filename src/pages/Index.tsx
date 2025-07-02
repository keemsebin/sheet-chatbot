
import React, { useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { SidePanel } from '@/components/SidePanel';
import { Header } from '@/components/Header';
import { ParsedSheetContent } from '@/utils/sheetParser';
import { SheetGroup } from '@/types/sheetTypes';

const Index = () => {
  const [currentSheetTitle, setCurrentSheetTitle] = useState<string>('시트봇');
  const [sheetContent, setSheetContent] = useState<ParsedSheetContent>();
  const [currentGroup, setCurrentGroup] = useState<SheetGroup | null>(null);

  const handleTitleUpdate = (title: string) => {
    setCurrentSheetTitle(title);
  };

  const handleSheetAdd = (sheet: any) => {
    console.log('새 시트 추가됨:', sheet);
  };

  const handleGroupEnter = (group: SheetGroup) => {
    setCurrentGroup(group);
    // 그룹의 시트들을 기반으로 컨텍스트 설정
    console.log(`${group.name} 그룹에 입장 - 대화 컨텍스트 초기화`);
  };

  const handleGroupExit = () => {
    setCurrentGroup(null);
    console.log('그룹에서 나감 - 기본 컨텍스트로 복원');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header sheetTitle={currentSheetTitle} />
      <div className="flex h-[calc(100vh-4rem)]">
        <SidePanel 
          onTitleUpdate={handleTitleUpdate}
          onSheetAdd={handleSheetAdd}
          onGroupEnter={handleGroupEnter}
          onGroupExit={handleGroupExit}
        />
        {/* 시트 그룹이 선택되지 않았을 때만 채팅 인터페이스 표시 */}
        {!currentGroup && (
          <ChatInterface 
            sheetContent={sheetContent} 
            currentGroup={currentGroup}
          />
        )}
        {/* 시트 그룹이 선택되었을 때는 빈 공간 또는 그룹 정보 표시 */}
        {currentGroup && (
          <div className="flex-1 bg-gray-50 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <h2 className="text-xl font-semibold mb-2">{currentGroup.name}</h2>
              <p className="text-sm">그룹 작업 공간이 활성화되었습니다.</p>
              <p className="text-xs mt-1">왼쪽 패널에서 시트를 관리하세요.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
