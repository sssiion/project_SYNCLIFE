# SyncLife Kanban Board

## 📋 프로젝트 소개
React, TypeScript, Vite를 사용하여 개발된 프리미엄 디자인의 칸반 보드 애플리케이션입니다.
Glassmorphism(유리 아키텍처) 디자인을 적용하여 심미적으로 우수하며, 사용자 친화적인 드래그 앤 드롭 인터페이스를 제공합니다.

## 🛠 기술 스택
- **Core**: React, TypeScript, Vite
- **State Management**: Zustand (Persist Middleware for LocalStorage)
- **UI Framework**: Ant Design (Customized)
- **Styling**: CSS Modules / Vanilla CSS (Glassmorphism variables)
- **Drag & Drop**: @hello-pangea/dnd
- **Icons**: Lucide React

## 📅 개발 과정 (Development Process)
- **개발 기간**: 2026.01.15 ~ 2026.01.16 (2일)
*이 섹션은 개발 진행 상황에 따라 지속적으로 업데이트됩니다.*

### 1. 프로젝트 초기화
- Vite + React + TypeScript 템플릿으로 프로젝트 생성
- 불필요한 보일러플레이트 코드 제거 및 디렉토리 구조 재설정
- 필요한 라이브러리 설치 (`antd`, `zustand`, `@hello-pangea/dnd`)
- 전역 스타일(`index.css`)에 Glassmorphism 변수 및 Reset CSS 적용

### 2. 핵심 기능 구현 (완료)
- **상태 관리**: Zustand + LocalStorage를 연동하여 태스크 데이터를 영구 저장
- **칸반 보드**: `@hello-pangea/dnd`를 사용하여 부드러운 드래그 앤 드롭 구현
- **태스크 관리**: 
  - 태스크 생성 모달 (`NewTaskModal`)
  - 우선순위/날짜 표시 카드 (`TaskCard`)
  - 제목 검색 및 우선순위 필터링 (`SearchBar`)
- **컴포넌트 구조**: `Board` > `Column` > `TaskCard` 계층 구조 완성

### 3. UI 및 폴리싱 (진행 예정)
- 모바일 반응형 레이아웃 최적화
- 세부 애니메이션 및 디자인 디테일 강화

### 4. 배포 (준비 완료)
- GitHub Pages 배포 설정 완료
- `main` 브랜치 푸시 시 자동 배포 (GitHub Actions)

## 🚀 배포 가이드 (Deployment Guide)
사용자분의 의견을 반영하여 **GitHub Actions**를 통한 자동 배포 방식으로 설정을 변경했습니다. 이제 로컬에서 빌드 명령어를 실행할 필요가 없습니다.

1. **설정 확인**:
   - GitHub 저장소의 `Settings` > `Pages`로 이동합니다.
   - **Source**를 `GitHub Actions`로 변경합니다.

2. **코드 푸시**:
   작업한 코드를 GitHub `main` 브랜치에 푸시하면 자동으로 배포가 시작됩니다.
   ```bash
   git add .
   git commit -m "Complete Kanban Board features"
   git push origin main
   ```

3. **진행 확인**:
   - GitHub 저장소의 `Actions` 탭에서 `Deploy to GitHub Pages` 워크플로우가 실행되는 것을 확인할 수 있습니다.
   - 완료되면 설정된 URL(예: `https://<username>.github.io/project_SYNCLIFE/`)에서 사이트를 볼 수 있습니다.

## 🤖 AI 도구 및 활용 방법 (AI Tools & Methodology)

본 프로젝트는 **Google DeepMind의 Antigravity (Agentic AI)** 를 활용하여 기획부터 배포까지의 전 과정을 협업으로 진행했습니다.

### 1. 활용된 AI 도구
- **Core Agent**: Google DeepMind Antigravity
    - *역할*: 프로젝트 매니징, 코드 설계, UI/UX 디자인, 트러블슈팅
- **IDE Integration**: VS Code 기반의 Agentic Workflow

### 2. AI 활용 방법 (Development Workflow)
AI 에이전트는 단순한 코드 생성을 넘어, 다음과 같은 주도적인 역할을 수행했습니다:

- **🏗️ 아키텍처 설계 (Architecture Design)**
    - React + TypeScript + Vite 기반의 모던 웹 스택 제안
    - 확장성을 고려한 Zustand 상태 관리 및 컴포넌트 구조 설계

- **🎨 UI/UX 디자인 (Generative UI)**
    - "Rich Aesthetics" 프롬프트를 기반으로 Glassmorphism 디자인 시스템 구축
    - 모바일 반응형 레이아웃 및 심미적인 애니메이션 효과 구현

- **⚡ 기능 구현 (Autonomous Coding)**
    - 복잡한 드래그 앤 드롭(DnD) 로직 및 데이터 영속성(LocalStorage) 구현
    - 사용자의 피드백을 실시간으로 반영하여 모달, 검색 기능 등 추가 개발

- **🔧 디버깅 및 최적화 (Self-Correction)**
    - 빌드 에러 및 런타임 이슈 발생 시, 에이전트가 스스로 로그를 분석하고 해결책 제시
    - 코드 리팩토링 및 린트(Lint) 규칙 준수

### 3. 미구현 기능 및 이유 (Unimplemented Features)
*   **없음**: Priority 1, 2, 3의 모든 핵심 및 권장 기능을 구현했습니다.

### 4. 추가 구현 기능 (Bonus Features)
*   **Keyboard Shortcuts**: 생산성 향상을 위한 단축키 지원
    *   `N`: 새 태스크 생성
    *   `S`: 검색창 포커스
    *   `M`: 사이드바 토글

이 프로젝트는 인간 개발자의 **의사결정(Decision Making)**과 AI의 **실행력(Execution)**이 결합된 성공적인 협업 사례입니다.

---
© 2026 SyncLife Project. All rights reserved.
