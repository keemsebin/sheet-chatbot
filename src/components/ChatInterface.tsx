
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateResponse, ParsedSheetContent } from '@/utils/sheetParser';
import { SheetGroup } from '@/types/sheetTypes';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  sheetContent?: ParsedSheetContent;
  currentGroup?: SheetGroup | null;
}

export const ChatInterface = ({ sheetContent, currentGroup }: ChatInterfaceProps) => {
  // 그룹별로 독립적인 대화 내역 관리
  const [groupMessages, setGroupMessages] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 현재 그룹의 메시지들 가져오기
  const getCurrentMessages = (): Message[] => {
    if (!currentGroup) {
      return [{
        id: 'welcome',
        type: 'bot',
        content: '안녕하세요! 시트봇입니다. 시트 그룹을 선택해서 각 그룹의 시트들과 대화를 시작해보세요! 😊',
        timestamp: new Date()
      }];
    }

    const groupId = currentGroup.id;
    if (!groupMessages[groupId]) {
      // 새 그룹에 처음 입장할 때의 환영 메시지
      return [{
        id: `welcome-${groupId}`,
        type: 'bot',
        content: `${currentGroup.name} 그룹에 오신 것을 환영합니다! 🎉\n\n이 그룹의 ${currentGroup.sheets.length}개 시트에 대해 무엇이든 물어보세요. 예를 들어:\n• "이번 주 일정 알려줘"\n• "청소 담당 누구야?"\n• "과제 제출일 언제야?"`,
        timestamp: new Date()
      }];
    }

    return groupMessages[groupId];
  };

  const messages = getCurrentMessages();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !currentGroup) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    const groupId = currentGroup.id;
    const currentGroupMessages = groupMessages[groupId] || [];
    const updatedMessages = [...currentGroupMessages, userMessage];
    
    setGroupMessages(prev => ({
      ...prev,
      [groupId]: updatedMessages
    }));

    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // 현재 그룹의 시트들을 기반으로 응답 생성
    setTimeout(() => {
      // 그룹의 시트들을 기반으로 한 Mock 데이터 생성
      const mockSheetContent: ParsedSheetContent = {
        schedules: [
          { date: '7월 20일', event: '방학식', description: '여름방학 시작' },
          { date: '8월 25일', event: '개학', description: '2학기 시작' }
        ],
        cleaning: [
          { week: '이번 주', team: '김세빈, 박민수', area: '3층 복도' },
          { week: '다음 주', team: '이지은, 최동욱', area: '2층 교실' }
        ],
        assignments: [
          { dueDate: '7월 25일', topic: '프론트엔드 개발 프로젝트', submitter: '전체' }
        ],
        general: []
      };

      // 그룹 컨텍스트를 포함한 응답 생성
      let response = generateResponse(currentInput, mockSheetContent);
      response = `[${currentGroup.name} 그룹] ${response}`;
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date()
      };
      
      setGroupMessages(prev => ({
        ...prev,
        [groupId]: [...(prev[groupId] || []), userMessage, botResponse]
      }));
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPlaceholder = () => {
    if (!currentGroup) {
      return "시트 그룹을 선택해주세요...";
    }
    return `${currentGroup.name} 그룹에서 궁금한 것을 물어보세요...`;
  };

  const getSuggestions = () => {
    if (!currentGroup) {
      return ['시트 그룹을 먼저 선택해주세요'];
    }
    return ['이번 주 청소 누구야?', '방학식 언제야?', '과제 제출일 알려줘'];
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {currentGroup && (
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              {currentGroup.name} 그룹에서 대화 중
            </span>
            <span className="text-xs text-gray-500">
              시트 {currentGroup.sheets.length}개 연결됨
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 p-4">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'bot' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <span className={`text-xs mt-1 block ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {currentGroup?.name} 그룹의 시트를 분석하고 있어요...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getPlaceholder()}
            className="flex-1"
            disabled={isLoading || !currentGroup}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || !currentGroup}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {getSuggestions().map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => currentGroup && setInput(suggestion)}
              className="text-xs"
              disabled={isLoading || !currentGroup}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
