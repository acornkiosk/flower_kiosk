# flower kiosk

**팀 프로젝트의 프론트 엔드 Repository 입니다.**

[백엔드 Repositroy](https://github.com/acornkiosk/flower-back) <br/>
[프론트엔드 Repository](https://github.com/acornkiosk/flower_front)<br/>
[키오스크 안드로이드 Repository](https://github.com/acornkiosk/flower_android)

## 프로젝트 특징

* React, Spring Boot을 기반으로 꽃을 판매하는 키오스크 서비스
    
* 프론트엔드와 백엔드를 분리하여 프로젝트 개발
    * 각 파트의 별도 Repository를 생성 후 작업
    * 프론트 : React 프레임워크 이용
    * 백엔드 : Spring Boot를 이용

## 개요

* 명칭 : flower_kiosk

* 개발 인원 : 7명

* 개발 기간 : 2024.02.18 ~ 2024.03.29

* 주요 기능 
	* 키오스크 관리 : 추가, 조회, 삭제, 위치 변경, 전원 변경
	* 메뉴 관리 : 추가, 조회, 수정, 삭제
	* 사용자 관리 : 추가, 조회, 수정, 삭제 
	* 주문 관리 : 추가, 조회, 수정 , 삭제
	* 로그인 관리 : 로그인 role 설정, Jwt를 이용한 로그인 상태 유지

* 개발 언어 : JavaScript

* 개발 라이브러리 : React.js

* 형상 관리 툴 : git

* 협업 툴 : Notion 
* 간단 소개 : 꽃 키오스크 서비스 프로젝트
## 사용 패키지

* react-bootstrap-icons
  * 각종 아이콘
* bootstrap
  * 부트스트랩과 react를 연동
* axios
  * 서버 통신을 위한 패키지
* react-router-dom
  * 라우팅을 위한 패키지
* react-redux, redux
  * 프론트엔드에서 데이터의 전역관리를 위한 패키지
* cross-env
  * mac, window port 설정을 위한 패키지
 
## 요구사항 
![image](https://github.com/acornkiosk/flower_kiosk/assets/94777814/76d94a93-455f-428e-8d27-f77676eeaa4d)

## 개발 역할분담 (프론트)

| 이름       | 진행 목록                                                    |
| ------------ | ------------------------------------------------------------- |
| 김동주         | 초기 프로젝트 셋팅, 키오스크 로그인, 장바구니, 주문, 성공 페이지 및 기능 |  |                          

| 이름       | 진행 목록                                                    |
| ------------ | ------------------------------------------------------------- |                       
| 이승우         |주문 기능(웹소켓) |     


| 이름       | 진행 목록                                                    |
| ------------ | ------------------------------------------------------------- |                      
| 오영찬         | 웰컴 페이지 |         

## 개발 타임라인

## 개발 타임라인(백엔드, 프론트 공통)

| 일자       | 진행 목록                                                    |
| ---------- | ------------------------------------------------------------ |
| 2024.02.17 | [ 프로젝트 화면계획서 V0.1 작성](https://drive.google.com/drive/folders/19cVOkx5jpWMl9KqFia3Dd_BrflqpRaVl) <br />백엔드 Repository 생성 |
| 2024.02.19 | [ 프로젝트 화면계획서 V0.3 작성](https://drive.google.com/drive/folders/19cVOkx5jpWMl9KqFia3Dd_BrflqpRaVl) |
| 2024.02.20 | [ 프로젝트 화면계획서 V0.5 작성](https://drive.google.com/drive/folders/19cVOkx5jpWMl9KqFia3Dd_BrflqpRaVl) <br/> 키오스크 관리 DB, API 추가|
| 2024.02.21 | [ 프로젝트 화면계획서 V0.6 작성](https://drive.google.com/drive/folders/19cVOkx5jpWMl9KqFia3Dd_BrflqpRaVl) <br/> 주문 관리 DB, API 추가<br/> 프론트 Repository 생성|
| 2024.02.23 | [ 프로젝트 화면계획서 V0.7 작성](https://drive.google.com/drive/folders/19cVOkx5jpWMl9KqFia3Dd_BrflqpRaVl) <br/> API 명세서 작성|
| 2024.02.24 | 키오스크 관리 기능 완료|
| 2024.02.27 | 주문 관리 기능 완료|
| 2024.02.28 | 사이드바 기능 완료|
| 2024.03.03 | 키오스크 메인 화면 레포 이전|
| 2024.03.08 | 요구사항 수정|
| 2024.03.13 | [ 프로젝트 화면계획서 V0.8 작성](https://drive.google.com/drive/folders/19cVOkx5jpWMl9KqFia3Dd_BrflqpRaVl)|
| 2024.03.14 | [ 프로젝트 화면계획서 V0.9 작성](https://drive.google.com/drive/folders/19cVOkx5jpWMl9KqFia3Dd_BrflqpRaVl)|
| 2024.03.26 | [ 프로젝트 화면계획서 V0.10 작성](https://drive.google.com/drive/folders/19cVOkx5jpWMl9KqFia3Dd_BrflqpRaVl)|


## Contents

### 키오스크 로그인 페이지

### 키오스크 웰컴 페이지

### 키오스크 페이지

### 주문완료 페이지
