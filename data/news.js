/*
 * 메인 화면 News. 최신순으로 적어 주세요.
 * - date: "YYYY-MM-DD"
 * - tag: 분류 (예: "국방AX"). 비워도 됩니다.
 * - summary: 목록에 항상 보이는 한두 문장
 * - body: '자세히 보기'를 눌렀을 때 펼쳐지는 본문 (HTML 가능, 비우면 버튼이 안 생김)
 * - image: 날짜 아래에 들어갈 사진/그림 "assets/img/news/파일명.jpg" (비워도 됩니다)
 * - imageHover: 마우스를 올렸을 때 바뀔 그림 (예: 흰 라인 그림 → 같은 크기·위치의 컬러 그림)
 * - imageFit: "cover" (사진, 칸을 꽉 채움, 기본값) | "contain" (로고/마크, 여백을 두고 전체가 보이게)
 * - imageAlt: 그림 설명 (스크린리더용, 선택)
 * - sponsors: '자세히 보기' 아래에 표시할 기관 로고 [{ name, logo, url }] (없으면 칸 자체가 안 보임)
 * - partners: 그 아래 'Partners' 칸 (공동연구기관·협력 대학 로고), 없으면 안 보임
 */
window.LAB = window.LAB || {};

LAB.newsLimit = 4; // 처음에 보여줄 개수

LAB.news = [
  {
    date: "2026-07-28",
    tag: "국방AX",
    title: "안재원 학생 (석사과정), 과학기술전문사관 2기생 최종 합격",
    summary: "우리 연구실 안재원 학생이 과학기술전문사관 2기생에 최종 합격했습니다. 축하합니다!",
    body:
      "<p>과학기술전문사관에 선발되면 사관후보생 신분이 되고, 졸업 후 중위 계급으로 임관하여 국방과학연구소(ADD)에서 3년간 연구를 수행하며 복무합니다.</p><p>안내: 과학기술전문사관 과정에 관심이 있는 학부생 및 진학희망자는 누구든 컨택하세요.</p>",
    image: "assets/img/news/tech-officer-emblem.png",
    imageHover: "assets/img/news/tech-officer-emblem-color.png",
    imageFit: "contain",
    imageAlt: "과학기술전문사관 휘장",
    sponsors: [
      { name: "국방과학연구소 (ADD)", logo: "assets/img/sponsors/add.png", url: "" },
      { name: "과학기술정보통신부", logo: "assets/img/sponsors/msit.png", url: "" }
    ]
  },
  {
    date: "2026-04-17",
    tag: "문화AX",
    title: "국가 사업 선정: '26 저작권 기술 글로벌 인재양성 (문체부)",
    summary: "선도형 저작권 기술개발사업, 저작권기술 글로벌 인재 양성 과제에 건국대-경북대 컨소시엄으로 선정되었습니다.",
    body:
      "<p><strong>과제명</strong>: 멀티모달 콘텐츠 저작권 핵심기술 성능평가 글로벌 인재양성<br>" +
      "<strong>유형</strong>: 글로벌 저작권 현안 신속대응사업, 플랫폼 안전진단 및 성능평가</p>" +
      "<ul><li>문화/콘텐츠(저작권) AX 기술</li><li>AI 생성 콘텐츠 관련 기술</li></ul>" +
      "<p>건국대: 윤경로 교수 (주관연구기관 PI)<br>경북대: 박상효 교수 (공동연구기관 PI), 김정근 교수, 이재협 교수</br></p>",
    image: "assets/img/news/copyright-consortium-mascots.png",
    imageHover: "assets/img/news/copyright-consortium-mascots-color.png",
    imageFit: "contain",
    imageAlt: "건국대, 경북대 마스코트 라인 드로잉",
    sponsors: [
      { name: "문화체육관광부", logo: "assets/img/sponsors/moc.png", url: "" },
      { name: "한국콘텐츠진흥원 (KOCCA)", logo: "assets/img/sponsors/kocca.png", url: "" }
    ],
    partners: [
      { name: "건국대학교", logo: "assets/img/partners/konkuk.png", url: "" },
      { name: "Tsinghua University (清華大學)", logo: "assets/img/partners/tsinghua.png", url: "" },
      { name: "Waseda University (早稲田大学)", logo: "assets/img/partners/waseda.png", url: "" },
      { name: "Zhejiang University (浙江大學)", logo: "assets/img/partners/zhejiang.png", url: "" },
      { name: "Télécom SudParis", logo: "assets/img/partners/telecom-sudparis.png", url: "" }
    ]
  },
  {
    date: "2026-01-30",
    tag: "제조AX",
    title: "국가 사업 선정: '26 지역주도형 AI대전환사업 (중기부)",
    summary: "AI솔루션 개발·실증 지원(가치사슬형) 사업에 (주)아라소프트, 경상국립대-경북대-건국대 컨소시엄으로 선정되었습니다.",
    body:
      "<p>아래 핵심 3개 축을 중심으로, 사회(경제)체계의 핵심인 생산수단과 노동행위가 모두 자동화될 것입니다.</p>" +
      "<ol><li>에너지 (생산, 원료)</li><li>제조 및 생산 (인프라 및 기술 전반)</li><li>AI (HW[반도체] 및 SW)</li></ol>" +
      "<p>세 축 중 하나라도 완비하지 못한 국가는, 모두 갖춘 국가와 앞으로 경쟁할 수 없습니다. (2)에 AI 혁신을 도입할 모험가들을 찾습니다.</p>",
    image: "assets/img/news/ax-consortium-mascots.png",
    imageHover: "assets/img/news/ax-consortium-mascots-color.png",
    imageFit: "contain",
    imageAlt: "경상국립대, 건국대, 경북대 마스코트 라인 드로잉",
    sponsors: [
      { name: "중소벤처기업부", logo: "assets/img/sponsors/mos.png", url: "" },
      { name: "경남테크노파크 (GNTP)", logo: "assets/img/sponsors/gntp.png", url: "" }
    ],
    partners: [
      { name: "경상국립대학교", logo: "assets/img/partners/gnu.png", url: "" },
      { name: "건국대학교", logo: "assets/img/partners/konkuk.png", url: "" }
    ]
  },
  {
    date: "2025-11-21",
    tag: "국방AX",
    title: "학석연계생 성과 발표: '25 한국군사과학기술학회 추계학술대회",
    summary: "\"DEVS 교전 시뮬레이션을 통한 LLM 기반의 자동 방책 생성 및 평가\" 연구가 발표되었습니다.",
    body:
      "<p>국방 ICT (국방 AI, 국방 M&S) 연구에 참여 중인 안재원, 장성욱, 유상훈, 정세엽 학생들의 연구성과가 2025년 한국군사과학기술학회 추계학술대회에서 발표되었습니다.</p>" +
      "<p>한국군사과학기술학회는 국내 군사과학 및 기술 학회 중 가장 큰 규모의 행사입니다. 이 연구에서는 DEVS 기반 교전 시뮬레이션 상에서 CoA 수립을 LLM 에이전트로 수행한다는 과감한 아이디어를 적용하고 개념 증명을 시도했습니다.</p>" +
      "<p>연관 프로젝트: Golden Army (완전 자율화된 MDMP를 수행하는 무인화 무기 체계 연구)</p>",
    image: "assets/img/news/kimst-2025-poster.jpg",
    imageFit: "cover",
    imageAlt: "2025 한국군사과학기술학회 추계학술대회 발표 표지"
  },
  {
    date: "2024-09-30",
    tag: "Quantum",
    title: "임정훈 학생, 2024 IBM Quantum Leadership Training Program 선발 및 수료",
    summary: "석사과정 임정훈 학생이 2024 IBM 양자 리더십 트레이닝 프로그램에 선발되어 교육을 수료했습니다.",
    body:
      "<p>이 프로그램은 전국 대학원생, 박사후연구원, 5년 이상의 산업계 경력자 중 매년 15명만 선발하며, 양자정보연구지원센터와 과학기술정보통신부의 지원을 받습니다.</p>" +
      "<p>선발된 참여자는 4주간 양자컴퓨팅 기본 교육을 받고, 3주차에는 미국 뉴욕의 IBM T.J. Watson Research Center로 연수를 다녀옵니다.</p>",
    image: "assets/img/news/ibm-logo.png",
    imageHover: "assets/img/news/ibm-logo-color.png",
    imageFit: "contain",
    imageAlt: "IBM 로고",
    sponsors: [
      { name: "IBM", logo: "assets/img/sponsors/ibm.png", url: "" }
    ]
  },
  {
    date: "2024-08-01",
    tag: "AI 가속기",
    title: "2024 기초연구실 (Basic Research Lab, BRL) 선정",
    summary: "\"유전체 DNA 염기서열 분석 가속화를 위한 페타스케일 인-스토리지 컴퓨팅 기초연구실\" 사업이 최종 선정되었습니다.",
    body:
      "<p>우리 학부 김용태 교수님이 연구책임자(Lead-PI)를 맡으시고, 우리 연구실과 정인욱 교수님, 김명석 교수님이 공동연구자(Co-PI)로 참여합니다.</p>" +
      "<p>최장 약 6년(33개월 + 후속 3년) 동안 학부의 4개 연구실이 연구그룹으로 과제를 수행합니다.</p>",
    image: "assets/img/news/brl-2024-plaque.jpg",
    imageFit: "cover",
    imageAlt: "기초연구실 현판",
    sponsors: [
      { name: "과학기술정보통신부", logo: "assets/img/sponsors/msit.png", url: "" },
      { name: "한국연구재단 (NRF)", logo: "assets/img/sponsors/nrf.png", url: "" }
    ]
  }
];
