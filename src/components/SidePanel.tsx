import React, { useState } from 'react';
import { Plus, Sheet, ExternalLink, Trash2, Users, Bell, MapPin, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { extractSheetTitle } from '@/utils/sheetParser';
import { SheetGroupManager } from './SheetGroupManager';
import { PublicTemplates } from './PublicTemplates';
import { SourceTracker } from './SourceTracker';
import { NotificationManager } from './NotificationManager';
import { SheetConnection, SheetGroup, SourceInfo, NotificationSettings } from '@/types/sheetTypes';

interface SidePanelProps {
  onSheetAdd?: (sheet: SheetConnection) => void;
  onTitleUpdate?: (title: string) => void;
  onGroupEnter?: (group: SheetGroup) => void;
  onGroupExit?: () => void;
}

export const SidePanel = ({ onSheetAdd, onTitleUpdate, onGroupEnter, onGroupExit }: SidePanelProps) => {
  const [currentGroup, setCurrentGroup] = useState<SheetGroup | null>(null);
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

  const [sheetGroups, setSheetGroups] = useState<SheetGroup[]>([
    {
      id: '1',
      name: '팀 관리 그룹',
      description: '일정, 청소, 과제 관리를 위한 통합 그룹',
      sheets: sheets,
      isPublic: false,
      createdBy: 'user1',
      createdAt: new Date(),
      permissions: {
        owner: 'user1',
        viewers: [],
        editors: [],
        isTemplate: false
      }
    }
  ]);

  const [publicTemplates] = useState<SheetGroup[]>([
    {
      id: 'template1',
      name: '프로젝트 관리 템플릿',
      description: '프로젝트 일정, 태스크, 리소스 관리용',
      sheets: [],
      isPublic: true,
      createdBy: 'admin',
      createdAt: new Date(),
      permissions: {
        owner: 'admin',
        viewers: [],
        editors: [],
        isTemplate: true
      }
    }
  ]);

  const [sources] = useState<SourceInfo[]>([
    {
      sheetName: '팀 일정 관리 시트',
      sheetUrl: 'https://docs.google.com/spreadsheets/d/example1',
      cellLocation: 'A3',
      description: '방학식 일정',
      previewText: '7월 20일 금요일 방학식'
    }
  ]);

  const [notifications, setNotifications] = useState<NotificationSettings[]>([]);

  const handleAddSheet = async () => {
    if (newSheetUrl && currentGroup) {
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
        
        const updatedGroup = {
          ...currentGroup,
          sheets: [...currentGroup.sheets, newSheet]
        };
        
        setSheetGroups(groups => groups.map(g => 
          g.id === currentGroup.id ? updatedGroup : g
        ));
        setCurrentGroup(updatedGroup);
        
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
    if (currentGroup) {
      const updatedGroup = {
        ...currentGroup,
        sheets: currentGroup.sheets.filter(sheet => sheet.id !== id)
      };
      
      setSheetGroups(groups => groups.map(g => 
        g.id === currentGroup.id ? updatedGroup : g
      ));
      setCurrentGroup(updatedGroup);
    }
  };

  const handleCreateGroup = (name: string, description?: string) => {
    const newGroup: SheetGroup = {
      id: Date.now().toString(),
      name,
      description,
      sheets: [],
      isPublic: false,
      createdBy: 'current-user',
      createdAt: new Date(),
      permissions: {
        owner: 'current-user',
        viewers: [],
        editors: [],
        isTemplate: false
      }
    };
    setSheetGroups([...sheetGroups, newGroup]);
  };

  const handleDeleteGroup = (groupId: string) => {
    setSheetGroups(sheetGroups.filter(group => group.id !== groupId));
    if (currentGroup?.id === groupId) {
      handleExitGroup();
    }
  };

  const handleTogglePublic = (groupId: string, isPublic: boolean) => {
    setSheetGroups(sheetGroups.map(group => 
      group.id === groupId ? { ...group, isPublic } : group
    ));
  };

  const handleEnterGroup = (group: SheetGroup) => {
    setCurrentGroup(group);
    onTitleUpdate?.(group.name);
    onGroupEnter?.(group);
    console.log(`${group.name} 그룹 방에 입장했습니다`);
  };

  const handleExitGroup = () => {
    setCurrentGroup(null);
    onTitleUpdate?.('시트봇');
    onGroupExit?.();
    console.log('그룹 방에서 나왔습니다');
  };

  const handleTemplateUse = (template: SheetGroup) => {
    const newGroup: SheetGroup = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (복사본)`,
      createdBy: 'current-user',
      createdAt: new Date(),
      isPublic: false
    };
    setSheetGroups([...sheetGroups, newGroup]);
  };

  const handleSourceClick = (source: SourceInfo) => {
    window.open(source.sheetUrl, '_blank');
  };

  const handleCreateNotification = (notification: Omit<NotificationSettings, 'id'>) => {
    const newNotification: NotificationSettings = {
      ...notification,
      id: Date.now().toString()
    };
    setNotifications([...notifications, newNotification]);
  };

  const handleToggleNotification = (id: string, isActive: boolean) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isActive } : notif
    ));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  // 그룹 방에 들어가 있는 경우의 UI
  if (currentGroup) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExitGroup}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              나가기
            </Button>
          </div>
          
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-blue-900">{currentGroup.name}</h2>
              </div>
              {currentGroup.description && (
                <p className="text-sm text-blue-700">{currentGroup.description}</p>
              )}
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-blue-600">시트 {currentGroup.sheets.length}개</span>
                <Badge variant={currentGroup.isPublic ? "default" : "outline"} className="text-xs">
                  {currentGroup.isPublic ? "공개" : "비공개"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700">그룹 시트</h3>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                시트 추가
              </Button>
            </div>

            {showAddForm && (
              <Card className="border-blue-200">
                <CardContent className="p-3 space-y-3">
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

            {currentGroup.sheets.map((sheet) => (
              <Card key={sheet.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sheet className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <h4 className="font-medium text-gray-900 truncate">{sheet.name}</h4>
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

            {currentGroup.sheets.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Sheet className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">이 그룹에는 아직 시트가 없습니다.</p>
                <p className="text-xs">위 버튼을 눌러 시트를 추가해보세요.</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">💬 {currentGroup.name} 방에서 대화하기</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• 이 그룹의 시트들을 기반으로 질문해보세요</li>
                <li>• 대화 내역은 이 방에서만 저장됩니다</li>
                <li>• 다른 그룹으로 이동하면 새로운 대화가 시작됩니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 그룹 목록 화면 (기본 상태)
  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <Tabs defaultValue="groups" className="h-full">
        <TabsList className="grid w-full grid-cols-4 sticky top-0 z-10">
          <TabsTrigger value="groups" className="text-xs">
            <Users className="w-3 h-3" />
          </TabsTrigger>
          <TabsTrigger value="sheets" className="text-xs">
            <Sheet className="w-3 h-3" />
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-xs">
            <Search className="w-3 h-3" />
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs">
            <Bell className="w-3 h-3" />
          </TabsTrigger>
        </TabsList>

        <div className="p-4">
          <TabsContent value="groups" className="mt-0">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
              <h3 className="font-medium text-blue-900 mb-2">🚀 시작하기</h3>
              <p className="text-sm text-blue-800">
                시트 그룹을 선택해서 각각의 독립적인 작업 공간에 입장하세요.
              </p>
            </div>
            <SheetGroupManager
              groups={sheetGroups}
              onCreateGroup={handleCreateGroup}
              onDeleteGroup={handleDeleteGroup}
              onTogglePublic={handleTogglePublic}
              onGroupSelect={handleEnterGroup}
            />
          </TabsContent>

          <TabsContent value="sheets" className="mt-0 space-y-4">
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
                          onClick={() => setSheets(sheets.filter(s => s.id !== sheet.id))}
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

            <SourceTracker sources={sources} onSourceClick={handleSourceClick} />

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">💡 사용 팁</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• "이번 주 청소 누구야?"</li>
                <li>• "방학식 언제야?"</li>
                <li>• "과제 제출일 알려줘"</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-0">
            <PublicTemplates
              templates={publicTemplates}
              onTemplateUse={handleTemplateUse}
              onTemplatePreview={(template) => console.log('미리보기:', template)}
            />
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <NotificationManager
              notifications={notifications}
              onCreateNotification={handleCreateNotification}
              onToggleNotification={handleToggleNotification}
              onDeleteNotification={handleDeleteNotification}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
