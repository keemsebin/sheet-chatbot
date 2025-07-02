
import React, { useState } from 'react';
import { Bell, Plus, Clock, Mail, Smartphone, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NotificationSettings } from '@/types/sheetTypes';

interface NotificationManagerProps {
  notifications: NotificationSettings[];
  onCreateNotification: (notification: Omit<NotificationSettings, 'id'>) => void;
  onToggleNotification: (id: string, isActive: boolean) => void;
  onDeleteNotification: (id: string) => void;
}

export const NotificationManager = ({ 
  notifications, 
  onCreateNotification, 
  onToggleNotification,
  onDeleteNotification 
}: NotificationManagerProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    frequency: 'daily' as const,
    notificationMethods: ['push'] as ('email' | 'push' | 'app')[],
    message: ''
  });

  const handleCreateNotification = () => {
    if (newNotification.title.trim()) {
      onCreateNotification({
        userId: 'current-user', // 실제로는 현재 사용자 ID
        sheetGroupId: 'current-group', // 실제로는 현재 선택된 그룹 ID
        title: newNotification.title,
        frequency: newNotification.frequency,
        notificationMethods: newNotification.notificationMethods,
        isActive: true,
        message: newNotification.message
      });
      
      setNewNotification({
        title: '',
        frequency: 'daily',
        notificationMethods: ['push'],
        message: ''
      });
      setShowCreateForm(false);
    }
  };

  const toggleMethod = (method: 'email' | 'push' | 'app') => {
    const methods = newNotification.notificationMethods;
    const hasMethod = methods.includes(method);
    
    setNewNotification({
      ...newNotification,
      notificationMethods: hasMethod 
        ? methods.filter(m => m !== method)
        : [...methods, method]
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          알림 설정
        </h3>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          size="sm"
          className="bg-purple-500 hover:bg-purple-600"
        >
          <Plus className="w-4 h-4 mr-1" />
          알림 추가
        </Button>
      </div>

      {showCreateForm && (
        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">새 알림 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="알림 제목"
              value={newNotification.title}
              onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
            />
            
            <Select 
              value={newNotification.frequency} 
              onValueChange={(value: any) => setNewNotification({...newNotification, frequency: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="알림 주기" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">매일</SelectItem>
                <SelectItem value="weekly">매주</SelectItem>
                <SelectItem value="monthly">매월</SelectItem>
                <SelectItem value="custom">사용자 지정</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <label className="text-xs font-medium">알림 방식</label>
              <div className="flex space-x-3">
                <Button
                  variant={newNotification.notificationMethods.includes('email') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleMethod('email')}
                  className="text-xs"
                >
                  <Mail className="w-3 h-3 mr-1" />
                  이메일
                </Button>
                <Button
                  variant={newNotification.notificationMethods.includes('push') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleMethod('push')}
                  className="text-xs"
                >
                  <Bell className="w-3 h-3 mr-1" />
                  푸시
                </Button>
                <Button
                  variant={newNotification.notificationMethods.includes('app') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleMethod('app')}
                  className="text-xs"
                >
                  <Smartphone className="w-3 h-3 mr-1" />
                  앱
                </Button>
              </div>
            </div>

            <Input
              placeholder="알림 메시지 (선택사항)"
              value={newNotification.message}
              onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
            />

            <div className="flex space-x-2">
              <Button onClick={handleCreateNotification} size="sm" className="flex-1">
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
        {notifications.map((notification) => (
          <Card key={notification.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <h4 className="font-medium">{notification.title}</h4>
                    <Badge variant={notification.isActive ? 'default' : 'secondary'} className="text-xs">
                      {notification.isActive ? '활성' : '비활성'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                    <span>주기: {
                      notification.frequency === 'daily' ? '매일' :
                      notification.frequency === 'weekly' ? '매주' :
                      notification.frequency === 'monthly' ? '매월' : '사용자 지정'
                    }</span>
                    <span>방식: {notification.notificationMethods.join(', ')}</span>
                  </div>
                  
                  {notification.message && (
                    <p className="text-xs text-gray-600">{notification.message}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={notification.isActive}
                    onCheckedChange={(checked) => onToggleNotification(notification.id, checked)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteNotification(notification.id)}
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

      {notifications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>설정된 알림이 없습니다.</p>
        </div>
      )}
    </div>
  );
};
