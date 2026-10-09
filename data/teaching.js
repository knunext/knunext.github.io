/*
 * Teaching 페이지.
 * - currentTerm: 이 학기(포함) 이후가 Current Courses, 이전은 Past Courses 로 나뉩니다. 학기가 바뀌면 이 값만 고치세요.
 * - courses: 과목 정보 (한 번만 적고, 학기별 목록에서는 id 로 참조)
 *     name: 한글 과목명, nameEn: 영문 과목명, level: "undergrad" | "grad"
 *     tags: 분야 태그 (아래 tagColors 에 있는 이름), link: 과목 사이트 주소 (선택)
 *     illustration: 이번 학기 개설 과목 옆에 나오는 움직이는 그림 (courseArch | courseDrone | courseGpu, assets/js/illustrations.js)
 * - terms: 학기별 개설 과목. term 은 "연도-학기" (예: "2026-2")
 *     courses 항목은 과목 id 문자열, 또는 그 학기 자료가 따로 있으면 { id, link } 로 적습니다.
 */
window.LAB = window.LAB || {};

LAB.teaching = {
  intro: "Courses",
  currentTerm: "2026-2",

  // 태그 색상: magenta(홍색) | green(녹색) | yellow(황색) | orange(주황) | blue(청색)
  tagColors: {
    "Architecture": "magenta",
    "Robotics": "green",
    "Compiler & PL": "yellow",
    "Algorithm & SW": "orange",
    "AI": "blue"
  },

  courses: {
    "comp-arch":        { name: "컴퓨터구조", nameEn: "Computer Architecture", level: "undergrad", tags: ["Architecture"],
                          link: "ComArchi/", illustration: "courseArch" },   // TODO: 실제 과목 사이트 주소로 변경
    "drone-algo":       { name: "항공드론알고리즘", nameEn: "Aerial Drone Algorithms", level: "undergrad", tags: ["Algorithm & SW", "AI", "Robotics"],
                          link: "courses/aerial-drone-algorithms/", illustration: "courseDrone" },   // TODO: 실제 과목 사이트 주소로 변경
    "logic-circuits":   { name: "논리회로", nameEn: "Logic Circuits", level: "undergrad", tags: ["Architecture"] },
    "prog-lang":        { name: "프로그래밍언어론", nameEn: "Programming Languages", level: "undergrad", tags: ["Compiler & PL"] },
    "compiler":         { name: "컴파일러", nameEn: "Compilers", level: "undergrad", tags: ["Compiler & PL"] },
    "sys-prog":         { name: "시스템프로그래밍", nameEn: "System Programming", level: "undergrad", tags: ["Algorithm & SW", "Architecture"] },
    "ct-coding":        { name: "컴퓨팅사고와 SW코딩", nameEn: "Computational Thinking and SW Coding", level: "undergrad", tags: ["Algorithm & SW"] },
    "algorithms":       { name: "알고리즘", nameEn: "Algorithms", level: "undergrad", tags: ["Algorithm & SW"] },
    "sys-design":       { name: "컴퓨터시스템설계론", nameEn: "Computer System Design", level: "grad", tags: ["Architecture"],
                          link: "ComArchi/", illustration: "courseGpu" },   // TODO: 실제 과목 사이트 주소로 변경
    "nextgen-sys":      { name: "차세대 컴퓨팅 시스템", nameEn: "Next-Generation Computing Systems", level: "grad", tags: ["Architecture", "AI"] },
    "theory-sys":       { name: "컴퓨팅이론 및 시스템 특강", nameEn: "Special Topics in Computing Theory and Systems", level: "grad", tags: ["Algorithm & SW", "Architecture"] },
    "adv-compiler":     { name: "컴파일러특론", nameEn: "Advanced Compilers", level: "grad", tags: ["Compiler & PL"] }
  },

  terms: [
    { term: "2026-2", courses: ["comp-arch", "drone-algo", "sys-design"] },
    { term: "2026-1", courses: ["logic-circuits", "nextgen-sys"] },
    { term: "2025-2", courses: ["comp-arch", "prog-lang", "theory-sys"] },
    { term: "2025-1", courses: ["compiler", "adv-compiler"] },
    { term: "2024-2", courses: ["comp-arch", "sys-prog"] },
    { term: "2024-1", courses: ["comp-arch", "sys-design"] },
    { term: "2023-2", courses: ["comp-arch", "nextgen-sys"] },
    { term: "2023-1", courses: ["compiler"] },
    { term: "2022-2", courses: ["comp-arch", "ct-coding"] },
    { term: "2022-1", courses: ["algorithms", "theory-sys"] }
  ]
};
