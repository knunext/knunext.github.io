/*
 * Tutorials 페이지: 연구실 구성원과 지원자(candidates)를 위한 교육 자료.
 * - sections: 분야. illustration 은 assets/js/illustrations.js 의 그림 이름, link 는 분야 소개 페이지 주소 (제목과 그림에 연결)
 * - items: 자료 하나하나
 *     section: 분야 id, title, audience: ["Members", "Candidates"] 중 해당
 *     link: 자료 주소, summary: 한 줄 소개
 *     body: '자세히 보기'에 들어갈 설명 (HTML 가능)
 *     related: 연관 연구/프로젝트 [{ title, link }]
 *     more: '자세히 보기' 아래 MORE 칸, 더 기초적이거나 연관된 다른 튜토리얼 사이트 [{ title, note, link }] (2열, 4개 정도까지 권장)
 *     sponsors / partners: 로고 [{ name, logo, url }] (뉴스와 같은 형식)
 *     resources: 교재·영상 등 참고 자료 [{ type, title, note, image, link }] → 오른쪽 "MATERIALS" 칸
 *       type 은 그림이 없을 때만 칸에 표시됨 (예: "Textbook", "YouTube") / note 는 저자·판 등 (마우스를 올리면 보임)
 *       image 는 assets/img/tutorials/ 의 표지 그림 (흰 선, 투명 배경 권장). 오른쪽에 3열로 같은 크기로 정렬됩니다.
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
    { id: "hwbio", link: "HW_Accel/", title: "HW for Bio", illustration: "tutHwBio",   // TODO: RTL·HLS 를 묶는 메인 페이지 주소
      description: "De novo 유전체 조립 알고리즘을 익히고, 이를 가속하는 하드웨어를 RTL과 HLS로 설계합니다." },
    { id: "opart", link: "KNU_Intro_to_Wargaminig/", title: "Operational Art", illustration: "tutOpart",
      description: "작전술의 개념과 워게임을 통해 국방 M&S 연구의 배경 지식을 다집니다." },
    { id: "orbit", link: "KNU_Intro_to_Simulations/starship_ai1.html", title: "Orbit AI Datacenter", illustration: "tutOrbit",
      description: "궤도 AI 데이터센터를 위한 M&S 및 극한 환경에서의 컴퓨팅 아키텍처를 다룹니다." },
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
    {
      section: "arch",
      title: "Computer Architecture",
      audience: ["Members", "Candidates"],
      link: "ComArchi/",
      summary: "학부 수준 컴퓨터구조 및 대학원 수준 고급컴퓨터구조",
      body: "<p>- ISA<br>- Processor Design<br>- Pipelining<br>- Out-of-Order Processor<br>- Memory Hierarchy<br>- SSD<br>- PIM/NDP/ISC<br>- GPU & Accelerators</p>",
      related: [{ title: "BIO-PIM", link: "research.html#detail-ai-accelerator" }],
      resources: [
        { type: "Textbook", title: "Computer Organization and Design RISC-V Edition", note: "Patterson & Hennessy, 2nd ed.", image: "assets/img/tutorials/cod-riscv.png", link: "" },
        { type: "Textbook", title: "Computer Architecture: A Quantitative Approach", note: "Hennessy, Patterson & Kozyrakis, 7th ed.", image: "assets/img/tutorials/ca-quantitative.png", link: "" },
        { type: "Textbook", title: "RISC-V System-on-Chip Design", note: "Harris, Stine, Thompson & Harris", image: "assets/img/tutorials/riscv-soc-design.png", link: "" },
        { type: "Textbook", title: "Digital Design and Computer Architecture RISC-V Edition", note: "Harris, Stine, Thompson & Harris", image: "assets/img/tutorials/harris-ca-rv.png", link: "" }
      ],
      sponsors: [],
      partners: []
    },
    {
      section: "robotics",
      title: "Introduction to Robotics & Physical AI",
      audience: ["Members", "Candidates"],
      link: "KNU_Intro_to_Robotics/",
      summary: "학부 수준 로보틱스 AI",
      body: "<p>- Motion Models<br>- Motion Planning<br>- Path Planning<br>- Bayesian Filters<br>- Decision Making<br>- VLM & VLA</p>",
      related: [{ title: "항공드론혁신융합대학사업(첨단기술융합대학)", link: "research.html#detail-mns-ax" }],
      // TODO: 실제 튜토리얼 주소로 변경
      more: [
        { title: "Math 101", note: "선형대수, 확률, 미적분 기초", link: "KNU_Intro_to_Simulations/math-101-site/" },
        //{ title: "Python 101", note: "NumPy와 시뮬레이션을 위한 파이썬 기초", link: "KNU_Intro_to_Robotics/python101/" }
      ],
      resources: [
        { type: "Textbook", title: "강화 학습", note: "1st ed.", image: "assets/img/tutorials/rl_book.png", link: "" },
        //{ type: "Textbook", title: "The Hundred-Page Language Models Book", note: "", image: "assets/img/tutorials/100-lang.png", link: "" },
        { type: "Textbook", title: "Hands-On Large Language Models", note: "", image: "assets/img/tutorials/handson-llm.png", link: "" },
        { type: "Textbook", title: "Introduction to Autonomous Robots", note: "", image: "assets/img/tutorials/intro-auto-robots.png", link: "" },
        { type: "Textbook", title: "피지컬 AI 시스템 설계", note: "", image: "assets/img/tutorials/robot-vla.png", link: "" },
        //{ type: "Textbook", title: "모던 로보틱스", note: "", image: "assets/img/tutorials/modern-robots.png", link: "" },
        { type: "Textbook", title: "Introduction to AI Robotics", note: "", image: "assets/img/tutorials/intro-robot-ai.png", link: "" },
        { type: "Textbook", title: "Statistical Robotics", note: "", image: "assets/img/tutorials/stat-robots.png", link: "" },
        //{ type: "Textbook", title: "Build a Reasoning Model", note: "", image: "assets/img/tutorials/build-a-reasoningmodel.png", link: "" },
      ],
      sponsors: [],
      partners: []
    },
    {
      section: "mns",
      title: "Introduction to Modeling & Simulation (M&S)",
      audience: ["Members", "Candidates"],
      link: "KNU_Intro_to_Simulations/",
      summary: "Modeling & Simulation 기초 트레이닝",
      body: "<p>- Discrete Event Simulation<br>- Agent-based Modeling<br>- DEVS<br>- Behavior Planning<br>- Robotics & Physical AI</p>",
      related: [{ title: "지역지능화혁신인재양성사업(GrandICT)", link: "research.html#detail-mns-ax" }],
      resources: [
        { type: "Textbook", title: "강화 학습", note: "1st ed.", image: "assets/img/tutorials/rl_book.png", link: "" },
        { type: "Textbook", title: "Theory of Modeling and Simulation", note: "", image: "assets/img/tutorials/mns.png", link: "" },
        { type: "Textbook", title: "시스템 모델링 시뮬레이션", note: "", image: "assets/img/tutorials/sys_mns.png", link: "" },
        { type: "Textbook", title: "Agent-based Modeling", note: "", image: "assets/img/tutorials/abm_geo.png", link: "" },
        { type: "Textbook", title: "Agent-Based and Indivisual-Based Modeling", note: "", image: "assets/img/tutorials/abm_indivisual.png", link: "" },
        { type: "Textbook", title: "Introduction to the Modeling and Analysis of Complex Systems", note: "", image: "assets/img/tutorials/intro-maa.png", link: "" },
      ],
      sponsors: [],
      partners: []
    },
    {
      section: "hwbio",
      title: "Hardware for Bioinformatics",
      audience: ["Members", "Candidates"],
      link: "HW_Accel/",   // TODO: RTL·HLS 를 묶는 메인 페이지가 생기면 그 주소로
      summary: "De novo 유전체 조립과 이를 가속하는 RTL·HLS 하드웨어 설계",
      // RTL, HLS 자료는 지금 따로 있으므로 각각 링크 (TODO: 실제 주소로 변경)
      body: "<p>- De novo Genome Assembly (k-mer, de Bruijn Graph)<br>- Sequence Alignment & Read Mapping<br>- <a href=\"KNU_HW_for_Bio/rtl.html\">RTL Design (Verilog)</a><br>- <a href=\"KNU_HW_for_Bio/hls.html\">High-Level Synthesis (HLS)</a><br>- FPGA & PIM Acceleration</p>",
      related: [{ title: "BIO-PIM", link: "research.html#detail-ai-accelerator" }],
      resources: [
        { type: "Textbook", title: "Bioinformatics Algorithms", note: "3nd ed.", image: "assets/img/tutorials/bioinfor-algo.png", link: "" },
        { type: "Textbook", title: "An Introduction to Bioinformatics Algorithms", note: "", image: "assets/img/tutorials/bioinfo-algo2.png", link: "" },
        { type: "Textbook", title: "Digital Design and Computer Architecture RISC-V Edition", note: "Harris, Stine, Thompson & Harris", image: "assets/img/tutorials/harris-ca-rv.png", link: "" },
        { type: "Textbook", title: "Getting Started with FPGAs", note: "", image: "assets/img/tutorials/fpga-primary.png", link: "" },
        { type: "Textbook", title: "Parallel Programming for FPGAs", note: "", image: "assets/img/tutorials/parapro-fpgas.png", link: "" },
        { type: "Textbook", title: "Reconfigurable Computing", note: "", image: "assets/img/tutorials/reconfig-compu.png", link: "" },
      ],
      sponsors: [],
      partners: []
    },
    {
      section: "opart",
      title: "Operational Art",
      audience: ["Members", "Candidates"],
      link: "KNU_Intro_to_Simulations/",
      summary: "Defense Modeling & Simulation 기초 트레이닝",
      body: "<p>- Discrete Event Simulation<br>- Agent-based Modeling<br>- DEVS<br>- Behavior Planning<br>- Robotics & Physical AI</p>",
      related: [{ title: "지역지능화혁신인재양성사업(GrandICT)", link: "research.html#detail-mns-ax" }],
      resources: [
        { type: "Textbook", title: "국방 M&S", note: "3nd ed.", image: "assets/img/tutorials/mil-mns.png", link: "" },
        { type: "Textbook", title: "Engineering Principles of Combat Modeling and Distributed Simulation", note: "", image: "assets/img/tutorials/combat-mns.png", link: "" },
        { type: "Textbook", title: "시스템 모델링 시뮬레이션", note: "", image: "assets/img/tutorials/sys_mns.png", link: "" },
        { type: "Textbook", title: "수학적 전투모델링과 컴퓨터 워게임", note: "", image: "assets/img/tutorials/math_wargame.png", link: "" },
        { type: "Textbook", title: "전술학", note: "", image: "assets/img/tutorials/mil-str.png", link: "" },
        { type: "Textbook", title: "전술과 지휘", note: "", image: "assets/img/tutorials/mil-tac.png", link: "" },
      ],
      sponsors: [],
      partners: []
    },
    {
      section: "orbit",
      title: "Orbit AI Datacenter",
      audience: ["Candidates"],
      link: "KNU_Intro_to_Simulations/starship_ai1.html",
      summary: "Defense Modeling & Simulation 기초 트레이닝",
      body: "<p>- Fault-tolerant Computing Architecture<br>- Dependable Computing<br>- Discrete Event Simulation<br>- Agent-based Modeling<br>- DEVS<br>- Behavior Planning<br>- Robotics & Physical AI</p>",
      related: [{ title: "지역지능화혁신인재양성사업(GrandICT)", link: "research.html#detail-mns-ax" }],
      resources: [
        { type: "Textbook", title: "강화 학습", note: "1st ed.", image: "assets/img/tutorials/rl_book.png", link: "" },        
        { type: "Textbook", title: "Theory of Modeling and Simulation", note: "", image: "assets/img/tutorials/mns.png", link: "" },
        { type: "Textbook", title: "시스템 모델링 시뮬레이션", note: "", image: "assets/img/tutorials/sys_mns.png", link: "" },
        { type: "Textbook", title: "Fault Tolerant Computer Architecture", note: "", image: "assets/img/tutorials/ft-archi.png", link: "" },
        { type: "Textbook", title: "FAULT-TOLERANT SYSTEMS", note: "", image: "assets/img/tutorials/ft-sys.png", link: "" },
        { type: "Textbook", title: "Dependable Computing", note: "", image: "assets/img/tutorials/de-com.png", link: ""},
      ],
      sponsors: [],
      partners: []
    },
  ]
};
