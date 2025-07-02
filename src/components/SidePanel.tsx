import React, { useState } from 'react';
import { Plus, Sheet, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { extractSheetTitle } from '@/utils/sheetParser';

interface SheetConnection {
  id: string;
  name: string;
  url: string;
  status: 'connected' | 'error';
  lastUpdated: string;
}

interface SidePanelProps {
  onSheetAdd?: (sheet: SheetConnection) => void;
  onTitleUpdate?: (title: string) => void;
}

export const SidePanel = ({ onSheetAdd, onTitleUpdate }: SidePanelProps) => {
  const [sheets, setSheets] = useState<SheetConnection[]>([
    {
      id: '1',
      name: '팀 일정 관리 시트',
      url: 'https://docs.google.com/spreadsheets/d/example1',
      status: 'connected',
      lastUpdated: '5분 전'
    },
    {
      id: '2',
      name: '청소 구역 배정표',
      url: 'https://docs.google.com/spreadsheets/d/example2',
      status: 'connected',
      lastUpdated: '1시간 전'
    }
  ]);
  const [newSheetUrl, setNewSheetUrl] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSheet = async () => {
    if (newSheetUrl) {
      setIsLoading(true);
      try {
        const title = await extractSheetTitle(newSheetUrl);
        const newSheet: SheetConnection = {
          id: Date.now().toString(),
          name: title,
          url: newSheetUrl,
          status: 'connected',
          lastUpdated: '방금 전'
        };
        
        const updatedSheets = [...sheets, newSheet];
        setSheets(updatedSheets);
        
        // 첫 번째 시트의 제목을 헤더에 업데이트
        if (updatedSheets.length === 1) {
          onTitleUpdate?.(title);
        }
        
        onSheetAdd?.(newSheet);
        setNewSheetUrl('');
        setShowAddForm(false);
      } catch (error) {
        console.error('시트 추가 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemoveSheet = (id: string) => {
    setSheets(sheets.filter(sheet => sheet.id !== id));
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">연결된 시트</h2>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            추가
          </Button>
        </div>

        {showAddForm && (
          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">새 시트 연결</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="구글 시트 공유 링크를 입력하세요"
                value={newSheetUrl}
                onChange={(e) => setNewSheetUrl(e.target.value)}
                className="text-sm"
                disabled={isLoading}
              />
              <div className="flex space-x-2">
                <Button 
                  onClick={handleAddSheet} 
                  size="sm" 
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  disabled={isLoading}
                >
                  {isLoading ? '연결 중...' : '연결'}
                </Button>
                <Button 
                  onClick={() => setShowAddForm(false)} 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  disabled={isLoading}
                >
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {sheets.map((sheet) => (
            <Card key={sheet.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sheet className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <h3 className="font-medium text-gray-900 truncate">{sheet.name}</h3>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge 
                        variant={sheet.status === 'connected' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {sheet.status === 'connected' ? '연결됨' : '오류'}
                      </Badge>
                      <span className="text-xs text-gray-500">{sheet.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(sheet.url, '_blank')}
                      className="p-1 h-auto"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSheet(sheet.id)}
                      className="p-1 h-auto text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">💡 사용 팁</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• "이번 주 청소 누구야?"</li>
            <li>• "방학식 언제야?"</li>
            <li>• "과제 제출일 알려줘"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
