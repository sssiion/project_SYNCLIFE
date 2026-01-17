# 프론트엔드 개발자 채용 과제 - SYNCLIFE Task Manager Report

1. AI 도구 사용 정책 (AI Tools Policy)

본 프로젝트는 개발 생산성 향상과 효율적인 문제 해결을 위해 Gemini 2.0 (Google DeepMind) 에이전트와 협업하여 개발되었습니다.

- 사용 도구: Google DeepMind Agent (Antigravity)
- 활용 방법:
    - 초기 보일러플레이트 생성: Vite 기반 React 프로젝트 구조 및 기본 컴포넌트 스캐폴딩 생성.
    - 복잡한 비즈니스 로직 구현: 드래그 앤 드롭 (react-beautiful-dnd) 로직, 상태 관리 (Zustand) 스토어 설계 및 데이터 영속성 처리.
    - UI/UX 디자인 및 CSS 애니메이션: Glassmorphism 디자인 시스템 구축, 커스텀 CSS 애니메이션 (keyframes), 반응형 레이아웃 (Flexbox/Grid) 코드 생성 및 최적화.
    - 버그 디버깅 및 리팩토링: useTaskStore 타입 오류 수정, 성능 최적화 (Debouncing), 브라우저 호환성 문제 (Ghost Drag) 해결.
    - 문서 작성: README.md 및 기술 문서 초안 작성 보조.


---

2. 요구사항 구현 현황 (Implementation Status)

Priority 1 - 필수 구현 (Essential)
반드시 구현되어야 하는 핵심 기능

- 기본 칸반보드 (완료)
    - 3개 컬럼 레이아웃: To Do, In Progress, Done (완료)
    - 태스크 카드 표시: 제목, 우선순위, 생성 날짜 (완료)
- 태스크 추가 기능 (완료)
    - 새 태스크 생성 모달 (NewTaskModal) (완료)
    - 필수 입력: 제목, 우선순위 (기본값 제공) (완료)
    - 선택 입력: 설명, 담당자(추가 기능), 마감일(추가 기능) (완료)
- 데이터 저장 (완료)
    - localStorage를 활용한 영구 저장 (Zustand Persist Middleware) (완료)
    - 새로고침 시 데이터 유지 (완료)
    - 초기 샘플 데이터 제공 (앱 최초 실행 시 자동 로드) (완료)
- GitHub Pages 배포 (완료)
    - 접속 가능한 URL 제공 (설정 완료) (완료)
    - 배포 환경 정상 동작 확인 (완료)

Priority 2 - 권장 구현 (Recommended)
시간이 허락하면 구현을 권장하는 기능

- 드래그 앤 드롭 (완료)
    - 컬럼 간 태스크 이동 (To Do ↔ In Progress ↔ Done) (완료)
    - 드래그 중 시각적 피드백 (투명도, 각도 변경, 그림자 효과) (완료)
    - 드롭 영역 하이라이트 및 플레이스홀더 (완료)
- 태스크 관리 기능 (완료)
    - 태스크 수정 (제목, 설명, 우선순위, 태그, 마감일 등) (완료)
    - 태스크 삭제 (Ant Design Modal 확인 다이얼로그) (완료)
    - 태스크 상세 보기 (카드 내 확장/축소 애니메이션 적용) (완료)
- 기본 검색 (완료)
    - 제목 기반 실시간 검색 (완료)
    - 검색 결과 즉시 필터링 반영 (완료)
    - 검색어 없을 시 전체 표시 (완료)

Priority 3 - 추가 구현 (Advanced)
여유가 있을 경우 도전할 수 있는 기능

- 고급 필터링 (완료)
    - 우선순위별 필터 (High/Medium/Low) - 다중 선택 가능 (완료)
    - 상태별 필터 (Hide Done 기능 제공) (완료)
    - 태그 시스템 및 태그별 필터 (다중 선택 가능) (완료)
    - 다중 필터 조합 (AND 조건 적용) (완료)
- 검색 고도화 (완료)
    - 디바운싱 적용 (300ms, setTimeout & useEffect) (완료)
    - 검색어 하이라이트 (제목, 설명, 태그 내 검색어 노란색 강조) (완료)
    - 최근 검색어 저장 (localStorage 연동, 최대 5개, 삭제 가능) (완료)
- UI/UX 개선 (완료)
    - 반응형 디자인 (Mobile, Tablet, Desktop) (완료)
        - Mobile: 플로팅 사이드바, 하단 시트 스타일, 카드형 스와이프 액션
        - Tablet: 하이브리드 레이아웃, 오버레이 사이드바, 터치 친화적 UI
        - Desktop: 3단 컬럼, 우측 플로팅 툴바
    - 애니메이션 효과 (완료)
        - 카드 호버/드래그 애니메이션
        - 모달 등장/퇴장 트랜지션
        - 리스트 필터링 애니메이션
    - 다크 모드 (시스템 설정 감지 및 수동 토글, 로컬 스토리지 저장) (완료)
    - 빈 상태 안내 메시지 (데이터 없을 시 Empty State 표시) (완료)
- 추가 기능 (완료)
    - 태스크 통계 (To Do/Progress/Done 카운트 및 시각화 패널) (완료)
    - 정렬 기능 (중요도순, 최신순, 마감일순, 자유 정렬) (완료)
    - 키보드 단축키 (N: 새 태스크, S: 검색, M: 메뉴 토글) (완료)

---

3. 추가 구현 기능 (Additional Features)

요구사항 외에 사용자 경험(UX) 향상을 위해 추가로 구현된 기능입니다.

1. 온보딩 튜토리얼 (Onboarding Overlay): 앱 최초 실행 시 8단계 가이드 제공 (스킵 가능, 다시 보기 가능).
2. Glassmorphism 디자인 시스템: 배경 블러(Backdrop Filter)와 반투명 레이어를 활용한 현대적인 UI 디자인.
3. 모바일 스와이프 액션 (Swipe Actions): 모바일 환경에서 태스크 카드를 좌우로 스와이프하여 수정/삭제 가능.
4. 퀵 무브 (Precision Move): 더블 클릭 시 빠르게 상태를 변경할 수 있는 단축 오버레이 메뉴 제공.
5. 글로벌 고스트 드래그 방지: 웹 앱임에도 네이티브 앱처럼 느껴지도록 불필요한 텍스트 선택 및 이미지 드래그 방지 처리.
6. 담당자 (Assignee) & 마감일 (Due Date): 태스크 속성 확장 및 D-Day 계산 표시 기능.
7. 즐겨찾기 (Favorite): 중요 태스크 상단 고정 및 별표 표시 기능.

---

4. 기술 스택 및 라이브러리 (Tech Stack & Libraries)

Core
- Framework: React 19
- Build Tool: Vite
- Language: TypeScript

Allowed Libraries (사용 가능 라이브러리)
- Drag & Drop: @hello-pangea/dnd (react-beautiful-dnd의 최신 포크 버전, React 18+ 호환성 개선)
- UI Components: antd (Ant Design 5.0 - 커스터마이징 테마 적용)
- State Management: zustand (가볍고 직관적인 상태 관리 및 Persist Middleware 사용)

Extra Libraries (추가 사용 라이브러리)
- Icons: lucide-react (가볍고 통일성 있는 SVG 아이콘 세트)
- ID Generation: uuid (고유한 태스크 ID 생성)


