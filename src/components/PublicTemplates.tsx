
import React, { useState } from 'react';
import { Search, Download, Eye, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SheetGroup } from '@/types/sheetTypes';

interface PublicTemplatesProps {
  templates: SheetGroup[];
  onTemplateUse: (template: SheetGroup) => void;
  onTemplatePreview: (template: SheetGroup) => void;
}

export const PublicTemplates = ({ templates, onTemplateUse, onTemplatePreview }: PublicTemplatesProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="템플릿 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                  {template.description && (
                    <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  템플릿
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span>시트 {template.sheets.length}개</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{template.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTemplatePreview(template)}
                    className="text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    미리보기
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onTemplateUse(template)}
                    className="text-xs bg-blue-500 hover:bg-blue-600"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    사용하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};
