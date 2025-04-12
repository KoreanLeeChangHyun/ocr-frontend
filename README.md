# 한글 책 OCR 변환기

스캔된 책 이미지를 OCR로 변환하고 LLM을 통해 요약하는 웹 애플리케이션입니다.

## 기술 스택

- Frontend: React
- Backend: AWS Lambda
- Storage: AWS S3
- OCR: Google Cloud Vision
- LLM: OpenAI
- Authentication: AWS Cognito
- CDN: AWS CloudFront

## 설정 방법

1. 의존성 설치
```bash
npm install
```

2. 환경 변수 설정
`.env` 파일에 다음 정보를 입력하세요:
- REACT_APP_USER_POOL_ID: AWS Cognito User Pool ID
- REACT_APP_USER_POOL_CLIENT_ID: AWS Cognito User Pool Client ID
- REACT_APP_S3_BUCKET: S3 버킷 이름
- REACT_APP_API_URL: API Gateway URL

3. 개발 서버 실행
```bash
npm start
```

4. 프로덕션 빌드
```bash
npm run build
```

## 기능

- 이미지 파일 업로드
- OCR 텍스트 변환
- LLM을 통한 텍스트 요약
- AWS 인증 통합

## 배포

빌드된 파일은 AWS CloudFront를 통해 배포됩니다. 