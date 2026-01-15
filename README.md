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
- `npm run deploy` 명령어로 자동 배포 가능

## 🚀 배포 가이드 (Deployment Guide)
사용자분의 의견을 반영하여 **GitHub Actions**를 통한 자동 배포 방식으로 설정을 변경했습니다. 이제 로컬에서 빌드 명령어를 실행할 필요가 없습니다.

1. **설정 확인**:
   - GitHub 저장소의 `Settings` > `Pages`로 이동합니다.
   - **Source**를 `GitHub Actions`로 변경합니다 (베타 기능일 수 있으나 권장됨).
   - 혹은 Source가 `Deploy from a branch`라면, Actions가 자동으로 생성해 줄 `gh-pages` 브랜치를 선택하세요.

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

## 🤖 AI 도구 사용 내역 (AI Usage Log)
이 프로젝트는 **Google DeepMind Antigravity** 에이전트와의 협업으로 제작되었습니다.

### 1. 기획 및 설계
- **요구사항 분석**: 사용자의 칸반 보드 요구사항(3컬럼, D&D, 로컬스토리지, 모달 등)을 분석하여 기능 명세서 작성
- **아키텍처 제안**: React + TypeScript + Vite 기반의 프로젝트 구조 및 Zustand 상태 관리 패턴 제안
- **디자인 컨셉**: "Rich Aesthetics"를 목표로 Glassmorphism 스타일 및 애니메이션 효과 제안

### 2. 코드 구현
- **스캐폴딩**: Vite 프로젝트 초기화 및 라이브러리 설치 자동화
- **컴포넌트 개발**:
  - `Board`, `Column`, `TaskCard` 등 핵심 컴포넌트의 타입스크립트 코드 작성
  - `useTaskStore`를 통한 상태 관리 로직(CRUD, D&D 핸들링) 구현
- **스타일링**: CSS Variables를 활용한 전역 테마 및 반응형 레이아웃(`kanban-board-container`) 구현

### 3. 문제 해결
- **빌드 오류 수정**: TypeScript 타입 정의 오류(`import type`) 및 미사용 변수 자동 수정
- **배포 방식 개선**: 사용자의 피드백을 반영하여 수동 배포(`gh-pages` 패키지)에서 **GitHub Actions 자동 배포**로 전환 (`deploy.yml` 작성)

---
© 2026 SyncLife Project. All rights reserved.
