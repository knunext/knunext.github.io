/*
 * 연구실 기본 정보, 메인 화면, Join us, 연락처.
 * 문장 필드(tagline, intro, body 등)에는 HTML 태그를 써도 됩니다.
 */
window.LAB = window.LAB || {};

LAB.site = {
  name: "Next-generation Computing Systems Laboratory",
  shortName: "NCSL",
  university: "Kyungpook National University",
  department: "경북대학교 컴퓨터학부",
  tagline:
    "AI 반도체와 메모리 중심 컴퓨팅부터 제조, 국방을 위한 AX, 그리고 궤도 데이터센터까지. 미래를 위한 차세대 컴퓨팅 시스템을 연구합니다.",

  // 메인 화면 첫 카드
  hero: {
    label: "KNU / NCSL",
    // 아래 3칸 정보 줄. label 이 있으면 왼쪽에, items 가 있으면 → 목록으로 표시됩니다.
    info: [
      { text: "The Next-generation Computing Systems Laboratory at Kyungpook National University." },
      { label: "Research on:", items: ["Processing-in-Memory", "GPU Architecture", "Defense M&S", "AI Content Forensics", "Orbital Data Centers"] },
      { label: "NCSL", text: "반도체 설계에서 출발해 제조산업과 국방 AI 전환, 우주(궤도) AI데이터센터까지 탐험합니다." }
    ],
    wordmark: ["NextGen", "Computing"] // 별표(✳) 양쪽에 들어갈 두 단어
  },

  // '탐험 분야'. 메인 카드 오른쪽 라인 드로잉 옆에 표시됩니다.
  // illustration: chip | robot | defense | ouroboros | orbitSide (assets/js/illustrations.js)
  explore: {
    title: "탐험 분야",
    items: [
      { name: "AI 반도체", illustration: "chip", link: "research.html#ai-accelerator" },
      { name: "AI 제조혁신", illustration: "robot", link: "research.html#mns-ax" },
      { name: "국방 AX", illustration: "defense", link: "research.html#defense-mns" },
      { name: "Project Ouroboros", illustration: "ouroboros", link: "research.html#ouroboros" },
      { name: "궤도 데이터센터", illustration: "orbitSide", link: "research.html#orbital-dc" }
    ]
  }
};

// Join us 아래 연구실 위치 안내 (KEY / BUILDING / DESCRIPTION 표, 약도, 항공사진)
LAB.location = {
  title: "Find us",
  columns: ["Key", "Building", "Description"],
  rows: [
    { key: "1.", building: "IT Building 4", ko: "IT대학 4호관", desc: "Computer Science & Engineering · NCSL" },
    { key: "2.", building: "Engineering Building 9", ko: "공과대학 9호관", desc: "Computer Science & Engineering" },
    { key: "3.", building: "IT Building 5", ko: "IT대학 5호관", desc: "College of IT · Computer Science & Engineering" },
    { key: "4.", building: "Engineering Building 12", ko: "공과대학 12호관", desc: "Server Rooms" },
    { gap: true },
    { key: "A.", building: "Main Gate", ko: "경북대학교 정문", desc: "KNU Main Gate" }
  ],
  minimap: "assets/img/campus/campus-minimap.svg",
  aerial: "assets/img/campus/campus-aerial.jpg",
  logo: "assets/img/logo/logo-horizontal-light.svg",
  room: "IT4-412-2"
};

LAB.join = {
  title: "모험가들을 모집합니다",
  // 일정 시간마다 바뀌는 인용문 (rotateSeconds 초 간격).
  // 인용문 옆 액자 그림은 아래 순서로 정해집니다.
  //   portraitImage: 흰 잉크 PNG (tools/portrait_ink.py) 또는 외곽선 SVG (tools/portrait_outline.py)
  //   credit: 그림/사진 출처 (액자 아래 작게 표시)
  //   photo: 사진을 그대로 흑백으로 표시
  //   portrait: 기본 라인 드로잉 (explorer | astronaut)
  rotateSeconds: 8,
  quotes: [
    {
      text: "MEN WANTED for hazardous journey, small wages, bitter cold, long months of complete darkness, constant danger, safe return doubtful, honor and recognition in case of success.",
      by: "Ernest Shackleton",
      note: "Recruiting for an Antarctic expedition",
      portrait: "explorer",
      portraitImage: "assets/img/portraits/shackleton.png",
      credit: "",
      years: "1874–1922",
      photo: ""
    },
    {
      text: "We should send rockets not at each other, but rather to the stars.",
      by: "Elon Musk",
      note: "",
      portrait: "astronaut",
      portraitImage: "assets/img/portraits/musk.png",
      credit: "",
      years: "b. 1971",
      photo: ""
    },
    {
      text: "When something is important enough, you do it even if the odds are not in your favor.",
      by: "Elon Musk",
      note: "",
      portrait: "astronaut",
      portraitImage: "assets/img/portraits/musk.png",
      credit: "",
      years: "b. 1971",
      photo: ""
    },
    {
      text: "I'd rather be optimistic and wrong than pessimistic and right.",
      by: "Elon Musk",
      note: "",
      portrait: "astronaut",
      portraitImage: "assets/img/portraits/musk.png",
      credit: "",
      years: "b. 1971",
      photo: ""
    },
    {
      text: "Failure is an option here. If things are not failing, you are not innovating enough.",
      by: "Elon Musk",
      note: "",
      portrait: "astronaut",
      portraitImage: "assets/img/portraits/musk.png",
      credit: "",
      years: "b. 1971",
      photo: ""
    }
  ],
  intro:
    "컴퓨터학부 학생으로서 갖춰야 할 최소한의 지식과 스킬, 사고력을 갖춘 학생이라면 누구든지. 다음과 같은 기본적인 배경만 있다면 누구나 연구를 수행할 수 있습니다.",
  required: {
    title: "필요한 배경",
    items: [
      "CS, CSE, AI, EE 등 전산학과 밀접한 분야를 전공, 부전공, 복수전공 등의 형태로 학부 과정에서 공부한 경험",
      "기본적인 프로그래밍 스킬 (C, C++, Python). 컴퓨터 아키텍처 연구에서 필수적으로 쓰는 언어들입니다.",
      "학부 수준의 컴퓨터 구조 및 운영체제 수업 수강"
    ]
  },
  preferred: {
    title: "있으면 좋은 배경",
    items: [
      "학부 수준의 병렬 컴퓨터 프로그래밍 및 구조, 컴파일러, 알고리즘 지식 (수업을 듣지 않았어도 관련 기반 지식이 있으면 충분합니다)",
      "디지털 논리회로 설계 및 실습 수업 수강 경험 (Verilog/VHDL의 기본 원리 이해)"
    ]
  },
  contact: "관심 있는 학생은 메일로 연락하거나 직접 면담을 요청해 주세요."
};

// TODO: 실제 연구실 위치를 확인/수정해 주세요.
// 메일 주소는 스크래핑 방지를 위해 링크 없이 이미지로만 표시합니다. 주소를 바꾸려면 tools/email_image.py 로 새로 만드세요.
LAB.contact = {
  emailImage: "assets/img/email/email-pi.png",
  address: "경북대학교 IT대학 4호관 412-2호<br>대구광역시 북구 대학로 80",
  mapUrl: "https://map.naver.com/"
};
