
export interface SheetData {
  title: string;
  sheets: SheetTab[];
}

export interface SheetTab {
  name: string;
  data: string[][];
}

export interface ParsedSheetContent {
  schedules: Array<{ date: string; event: string; description?: string }>;
  cleaning: Array<{ week: string; team: string; area: string }>;
  assignments: Array<{ dueDate: string; topic: string; submitter?: string }>;
  general: string[][];
}

export const parseGoogleSheetUrl = (url: string): string | null => {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
};

export const extractSheetTitle = async (url: string): Promise<string> => {
  try {
    const sheetId = parseGoogleSheetUrl(url);
    if (!sheetId) return '시트';
    
    // 실제로는 Google Sheets API를 사용해야 하지만, 여기서는 모의 데이터를 반환
    const mockTitles = [
      '팀 일정 관리 시트',
      '청소 구역 배정표',
      '과제 제출 현황',
      '출석 체크 리스트',
      '회의록 모음'
    ];
    
    return mockTitles[Math.floor(Math.random() * mockTitles.length)];
  } catch (error) {
    console.error('시트 제목 추출 실패:', error);
    return '연결된 시트';
  }
};

export const parseSheetContent = (data: string[][]): ParsedSheetContent => {
  const content: ParsedSheetContent = {
    schedules: [],
    cleaning: [],
    assignments: [],
    general: data
  };

  // 데이터 구조를 분석해서 적절한 카테고리로 분류
  data.forEach((row, index) => {
    if (index === 0) return; // 헤더 스킵
    
    // 날짜 패턴이 있으면 일정으로 분류
    if (row.some(cell => /\d{1,2}[월\/]\d{1,2}[일\/]?|\d{4}-\d{2}-\d{2}/.test(cell))) {
      content.schedules.push({
        date: row[0] || '',
        event: row[1] || '',
        description: row[2] || ''
      });
    }
    
    // '청소', '구역' 키워드가 있으면 청소 배정으로 분류
    else if (row.some(cell => /청소|구역|조/.test(cell))) {
      content.cleaning.push({
        week: row[0] || '',
        team: row[1] || '',
        area: row[2] || ''
      });
    }
    
    // '과제', '제출' 키워드가 있으면 과제로 분류
    else if (row.some(cell => /과제|제출|프로젝트/.test(cell))) {
      content.assignments.push({
        dueDate: row[0] || '',
        topic: row[1] || '',
        submitter: row[2] || ''
      });
    }
  });

  return content;
};

export const generateResponse = (question: string, content: ParsedSheetContent): string => {
  const lowerQuestion = question.toLowerCase();
  
  // 일정 관련 질문
  if (lowerQuestion.includes('언제') || lowerQuestion.includes('일정') || lowerQuestion.includes('방학')) {
    const schedules = content.schedules;
    if (schedules.length > 0) {
      const upcoming = schedules.find(s => s.event.includes('방학') || s.event.includes('시험'));
      if (upcoming) {
        return `${upcoming.event}은 ${upcoming.date}입니다! 📅`;
      }
      return `다가오는 일정: ${schedules[0].event} (${schedules[0].date}) 📅`;
    }
  }
  
  // 청소 관련 질문
  if (lowerQuestion.includes('청소') || lowerQuestion.includes('누구')) {
    const cleaning = content.cleaning;
    if (cleaning.length > 0) {
      const current = cleaning[0]; // 가장 최근 청소 배정
      return `이번 주 청소 담당은 ${current.team}입니다. 청소 구역은 ${current.area}입니다. 🧹`;
    }
  }
  
  // 과제 관련 질문
  if (lowerQuestion.includes('과제') || lowerQuestion.includes('제출')) {
    const assignments = content.assignments;
    if (assignments.length > 0) {
      const upcoming = assignments[0];
      return `다음 과제 제출일은 ${upcoming.dueDate}까지입니다. 주제는 '${upcoming.topic}'입니다. 📝`;
    }
  }
  
  // 기본 응답
  const responses = [
    "죄송해요, 해당 정보를 시트에서 찾을 수 없어요. 다른 방식으로 질문해보시겠어요? 🤔",
    "시트 내용을 확인해봤는데, 관련 정보가 명확하지 않네요. 좀 더 구체적으로 물어봐주세요! 💭",
    "현재 연결된 시트에서는 해당 정보를 찾기 어려워요. 시트 구조를 확인해보시거나 질문을 바꿔보세요! 📋"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};
