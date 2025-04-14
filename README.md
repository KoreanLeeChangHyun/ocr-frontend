# OCR 프론트엔드 애플리케이션

## 개요
React와 styled-components를 사용한 OCR 프론트엔드 애플리케이션입니다. 이미지 업로드, OCR 처리 결과 표시, PDF 다운로드 기능을 제공합니다.

## 기능
- 이미지 파일 드래그 앤 드롭 업로드
- OCR 처리 결과 실시간 표시
- 텍스트 요약 표시
- PDF 파일 생성 및 다운로드

## 기술 스택
- React
- styled-components
- axios
- AWS Amplify (옵션)

## CI/CD 파이프라인

### AWS Amplify를 사용한 배포
AWS Amplify 콘솔에서 다음과 같이 설정합니다:

1. **소스 연결**
   - GitHub 저장소 연결
   - 배포할 브랜치 선택 (`main`)

2. **빌드 설정**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: build
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **환경 변수**
   - `REACT_APP_API_URL`: 백엔드 API 엔드포인트
   - `REACT_APP_USER_POOL_ID`: Cognito 사용자 풀 ID (인증 사용 시)
   - `REACT_APP_USER_POOL_CLIENT_ID`: Cognito 클라이언트 ID (인증 사용 시)
   - `REACT_APP_S3_BUCKET`: S3 버킷 이름 (파일 저장 사용 시)

4. **자동 배포 설정**
   - `main` 브랜치에 푸시 시 자동 배포
   - 프리뷰 배포 활성화 (선택적)

## 로컬 개발 환경 설정

1. 의존성 설치:
   ```bash
   npm install
   ```

2. 환경 변수 설정:
   ```bash
   cp .env.example .env
   # .env 파일에 필요한 환경 변수 설정
   ```

3. 개발 서버 실행:
   ```bash
   npm start
   ```

## 배포

1. AWS Amplify 콘솔 설정:
   - 소스 연결
   - 빌드 설정
   - 환경 변수 설정

2. `main` 브랜치에 푸시:
   ```bash
   git push origin main
   ```

3. 배포 상태 확인:
   - AWS Amplify 콘솔에서 배포 상태 확인
   - CloudWatch 로그 확인

## 환경 변수

- `REACT_APP_API_URL`: 백엔드 API 엔드포인트
- `REACT_APP_USER_POOL_ID`: Cognito 사용자 풀 ID (인증 사용 시)
- `REACT_APP_USER_POOL_CLIENT_ID`: Cognito 클라이언트 ID (인증 사용 시)
- `REACT_APP_S3_BUCKET`: S3 버킷 이름 (파일 저장 사용 시)

## 모니터링

- AWS Amplify 배포 로그
- CloudWatch 애플리케이션 로그
- 사용자 접근 통계 