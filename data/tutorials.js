/*
 * Tutorials 페이지: 연구실 구성원과 지원자(candidates)를 위한 교육 자료.
 * - sections: 분야. illustration 은 assets/js/illustrations.js 의 그림 이름, link 는 분야 소개 페이지 주소 (제목과 그림에 연결)
 * - items: 자료 하나하나
 *     section: 분야 id, title, audience: ["Members", "Candidates"] 중 해당
 *     link: 자료 주소, summary: 한 줄 소개
 *     body: '자세히 보기'에 들어갈 설명 (HTML 가능)
 *     related: 연관 연구/프로젝트 [{ title, link }]
 *     sponsors / partners: 로고 [{ name, logo, url }] (뉴스와 같은 형식)
 */
window.LAB = window.LAB || {};

LAB.tutorials = {
  intro: "Tutorials: For lab members.",
  // link: 임시 주소입니다. 실제 자료 페이지가 생기면 바꿔 주세요.
  sections: [
    { id: "arch", link: "ComArchi/", title: "Computer Architecture", illustration: "tutArch",
      description: "파이프라인, 메모리 계층, PIM, GPU 구조를 시뮬레이터와 실습으로 익힙니다." },
    { id: "robotics", link: "KNU_Intro_to_Robotics/", title: "Robotics", illustration: "tutRobot",
      description: "드론과 휴머노이드 로봇의 계획, 제어, 의사결정을 시뮬레이션 환경에서 실습합니다." },
    { id: "mns", link: "KNU_Intro_to_Simulations/", title: "Modeling & Simulation", illustration: "tutMns",
      description: "이산 사건 시뮬레이션(DES)과 에이전트 기반 시뮬레이션(ABS)으로 실세계 문제를 모델링합니다." },
    { id: "opart", link: "KNU_Intro_to_Wargaminig/", title: "Operational Art", illustration: "tutOpart",
      description: "작전술의 개념과 워게임을 통해 국방 M&S 연구의 배경 지식을 다집니다." }
  ],
  items: [
    // 예시 (주석을 풀고 내용을 바꿔 쓰세요)
    // {
    //   section: "robotics",
    //   title: "자료 제목",
    //   audience: ["Members", "Candidates"],
    //   link: "https://...",
    //   summary: "한 줄 소개",
    //   body: "<p>자세히 보기에 들어갈 설명</p>",
    //   related: [{ title: "연관 연구나 과목", link: "research.html" }],
    //   sponsors: [],
    //   partners: []
    // }
  ]
};
