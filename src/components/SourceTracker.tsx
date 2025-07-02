
import React from 'react';
import { ExternalLink, MapPin, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { SourceInfo } from '@/types/sheetTypes';

interface SourceTrackerProps {
  sources: SourceInfo[];
  onSourceClick: (source: SourceInfo) => void;
}

export const SourceTracker = ({ sources, onSourceClick }: SourceTrackerProps) => {
  return (
    <TooltipProvider>
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
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="text-xs font-medium cursor-pointer hover:text-blue-600 underline">
                          {source.sheetName}
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">{source.sheetName}</h4>
                          <p className="text-xs text-gray-600">
                            <strong>위치:</strong> {source.cellLocation}
                          </p>
                          {source.description && (
                            <p className="text-xs text-gray-600">
                              <strong>설명:</strong> {source.description}
                            </p>
                          )}
                          {source.previewText && (
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                              <p className="text-xs text-gray-700">
                                <strong>미리보기:</strong>
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {source.previewText}
                              </p>
                            </div>
                          )}
                          <p className="text-xs text-gray-500">
                            클릭하여 원본 시트로 이동
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {source.cellLocation}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>셀 위치: {source.cellLocation}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {source.description && (
                    <p className="text-xs text-gray-600 mb-1">{source.description}</p>
                  )}
                  {source.previewText && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-xs text-gray-500 line-clamp-2 cursor-help">
                          {source.previewText}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{source.previewText}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSourceClick(source)}
                      className="p-1 h-auto"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>시트 열기</p>
                  </TooltipContent>
                </Tooltip>
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
    </TooltipProvider>
  );
};
