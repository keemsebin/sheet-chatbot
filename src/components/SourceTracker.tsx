
import React from 'react';
import { ExternalLink, MapPin, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SourceInfo } from '@/types/sheetTypes';

interface SourceTrackerProps {
  sources: SourceInfo[];
  onSourceClick: (source: SourceInfo) => void;
}

export const SourceTracker = ({ sources, onSourceClick }: SourceTrackerProps) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700 flex items-center">
        <MapPin className="w-4 h-4 mr-2" />
        출처 정보
      </h4>
      
      {sources.map((source, index) => (
        <Card key={index} className="border-l-4 border-l-blue-500">
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <FileText className="w-3 h-3 text-blue-500" />
                  <span className="text-xs font-medium">{source.sheetName}</span>
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {source.cellLocation}
                  </Badge>
                </div>
                {source.description && (
                  <p className="text-xs text-gray-600 mb-1">{source.description}</p>
                )}
                {source.previewText && (
                  <p className="text-xs text-gray-500 line-clamp-2">{source.previewText}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSourceClick(source)}
                className="p-1 h-auto"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {sources.length === 0 && (
        <div className="text-center py-4 text-gray-400">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-xs">출처 정보가 없습니다.</p>
        </div>
      )}
    </div>
  );
};
