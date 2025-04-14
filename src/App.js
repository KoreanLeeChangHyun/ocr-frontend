// OCR 프론트엔드 애플리케이션의 메인 컴포넌트
// React와 styled-components를 사용하여 구현된 웹 인터페이스

import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { createPdf } from 'pdfmake/build/pdfmake';
import { vfsFonts } from 'pdfmake/build/vfs_fonts';
// import { Amplify, API, Storage } from 'aws-amplify';
// import { withAuthenticator } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';

// AWS Amplify 설정
// Amplify.configure({
//   Auth: {
//     region: 'ap-northeast-2',
//     userPoolId: process.env.REACT_APP_USER_POOL_ID,
//     userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
//   },
//   Storage: {
//     AWSS3: {
//       bucket: process.env.REACT_APP_S3_BUCKET,
//       region: 'ap-northeast-2',
//     },
//   },
//   API: {
//     endpoints: [
//       {
//         name: 'ocrApi',
//         endpoint: process.env.REACT_APP_API_URL,
//         region: 'ap-northeast-2',
//       },
//     ],
//   },
// });

const API_URL = 'https://6gv7n95wcc.execute-api.ap-northeast-2.amazonaws.com/prod/api';

// axios 기본 설정
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json'
  }
});

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background-color: #f5f7fa;
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;
`;

const UploadSection = styled.div`
  border: 2px dashed ${props => props.isDragging ? '#2ecc71' : '#bdc3c7'};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: ${props => props.isDragging ? '#f0f9f4' : '#f8f9fa'};
  transition: all 0.3s ease;
  margin-bottom: 2rem;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background-color: #2ecc71;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  margin-top: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #27ae60;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const FileItem = styled.li`
  background: white;
  padding: 0.5rem 1rem;
  margin: 0.5rem 0;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const RemoveButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.8rem;
  cursor: pointer;
  
  &:hover {
    background: #c0392b;
  }
`;

const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const PageResult = styled.div`
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  
  h3 {
    margin: 0;
    color: #2c3e50;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const PageSummary = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #666;
`;

const PageContentText = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
`;

const SummarySection = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-left: 4px solid #4CAF50;
  
  h2 {
    color: #2c3e50;
    margin-top: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &::before {
      content: "📝";
    }
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #333;
    white-space: pre-wrap;
  }
`;

const BookContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  width: 100%;
  max-width: 1200px;
`;

const Book = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Page = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PageContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  min-height: 400px;
`;

const PageImage = styled.div`
  img {
    width: 100%;
    height: auto;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const PageText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PageTitle = styled.h3`
  color: #2c3e50;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background: #4CAF50;
    color: white;
    cursor: pointer;
    
    &:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }
  }
`;

const PageCounter = styled.div`
  margin-top: 1rem;
  text-align: center;
  font-size: 1.2rem;
  color: #666;
`;

const DownloadButton = styled.button`
  background-color: #2196F3;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #1976D2;
  }
`;

function App() {
  // 상태 관리
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 파일 드래그 앤 드롭 핸들러
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  // 파일 선택 핸들러
  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  }, []);

  // 파일 제거 핸들러
  const handleRemoveFile = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // OCR 처리 핸들러
  const handleOCR = async () => {
    if (files.length === 0) return;
    
    setIsLoading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await api.post('/ocr', formData);
      setResults(response.data.results);
      setCurrentPage(0);
    } catch (error) {
      console.error('OCR 처리 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // PDF 다운로드 핸들러
  const handleDownload = async () => {
    try {
      const response = await api.post('/generate-pdf', { results }, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ocr_results.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('PDF 다운로드 중 오류 발생:', error);
    }
  };

  return (
    <AppContainer>
      <Title>OCR 이미지 처리 시스템</Title>
      
      <UploadSection
        isDragging={isDragging}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <p>이미지 파일을 드래그 앤 드롭하거나 선택하세요</p>
        <FileInput
          type="file"
          id="file-upload"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
        />
        <UploadButton
          onClick={() => document.getElementById('file-upload').click()}
          disabled={isLoading}
        >
          파일 선택
        </UploadButton>
      </UploadSection>

      {files.length > 0 && (
        <>
          <FileList>
            {files.map((file, index) => (
              <FileItem key={index}>
                {file.name}
                <RemoveButton onClick={() => handleRemoveFile(index)}>
                  제거
                </RemoveButton>
              </FileItem>
            ))}
          </FileList>
          
          <UploadButton
            onClick={handleOCR}
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : 'OCR 처리'}
          </UploadButton>
        </>
      )}

      {results.length > 0 && (
        <>
          <ResultsContainer>
            {results.map((result, index) => (
              <PageResult key={index}>
                <PageHeader>
                  <h3>{result.filename}</h3>
                </PageHeader>
                <ImagePreview
                  src={`data:image/jpeg;base64,${result.image}`}
                  alt={result.filename}
                />
                <PageSummary>
                  <strong>요약:</strong> {result.summary}
                </PageSummary>
                <PageContentText>
                  {result.text}
                </PageContentText>
              </PageResult>
            ))}
          </ResultsContainer>
          
          <UploadButton onClick={handleDownload}>
            PDF 다운로드
          </UploadButton>
        </>
      )}
    </AppContainer>
  );
}

// export default withAuthenticator(App);
export default App;