
import React, { useState } from 'react';
import { Plus, Users, Lock, Unlock, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { SheetGroup, SheetConnection } from '@/types/sheetTypes';

interface SheetGroupManagerProps {
  groups: SheetGroup[];
  onCreateGroup: (name: string, description?: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onTogglePublic: (groupId: string, isPublic: boolean) => void;
  onGroupSelect: (group: SheetGroup) => void;
}

export const SheetGroupManager = ({ 
  groups, 
  onCreateGroup, 
  onDeleteGroup, 
  onTogglePublic,
  onGroupSelect 
}: SheetGroupManagerProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      onCreateGroup(newGroupName, newGroupDescription);
      setNewGroupName('');
      setNewGroupDescription('');
      setShowCreateForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">시트 그룹</h3>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          size="sm"
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus className="w-4 h-4 mr-1" />
          그룹 생성
        </Button>
      </div>

      {showCreateForm && (
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">새 그룹 만들기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="그룹 이름"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <Input
              placeholder="그룹 설명 (선택사항)"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button onClick={handleCreateGroup} size="sm" className="flex-1">
                생성
              </Button>
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4" onClick={() => onGroupSelect(group)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <h4 className="font-medium">{group.name}</h4>
                    {group.isPublic ? (
                      <Badge variant="secondary" className="text-xs">
                        <Unlock className="w-3 h-3 mr-1" />
                        공개
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        <Lock className="w-3 h-3 mr-1" />
                        비공개
                      </Badge>
                    )}
                  </div>
                  {group.description && (
                    <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>시트 {group.sheets.length}개</span>
                    <span>{group.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={group.isPublic}
                    onCheckedChange={(checked) => onTogglePublic(group.id, checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteGroup(group.id);
                    }}
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
    </div>
  );
};
