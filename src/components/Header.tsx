
import React from 'react';
import { MessageSquare, Sheet } from 'lucide-react';

interface HeaderProps {
  sheetTitle?: string;
}

export const Header = ({ sheetTitle }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Sheet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {sheetTitle ? `시트봇 - ${sheetTitle}` : '시트봇'}
            </h1>
            <p className="text-sm text-gray-500">
              {sheetTitle ? `${sheetTitle} 정보 응답 서비스` : '구글 시트 정보 응답 서비스'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">스마트한 정보 도우미</span>
        </div>
      </div>
    </header>
  );
};
