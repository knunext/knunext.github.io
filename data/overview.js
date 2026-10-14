/*
 * Overview 페이지: 연구 분야들을 하나의 고리(Model → Simulate → Explore → Deploy → Feedback)와
 * 하나의 추상화(대기열 네트워크)로 묶어 소개합니다.
 * - loop: 고리의 다섯 단계
 * - domains: 분야별로 같은 그림의 이름표가 바뀜 (labels), 오른쪽 표 (map)
 * - matrix: 연구 주제별로 고리의 어느 단계에 중점을 두는지 (research.js 의 주제 id 기준)
 */
window.LAB = window.LAB || {};

LAB.overview = {
  intro: "넓어 보이는 연구 분야들은 하나의 고리로 이어집니다. 현실의 시스템을 모델링하고, 시뮬레이션으로 실험하고, 더 나은 설계와 운용 기법을 찾아, 현실에 적용한 뒤, 그 결과로 다시 모델을 고칩니다.",

  loop: [
    { id: "model", title: "Model", ko: "모델링",
      text: "현실의 시스템을 개체(entity), 자원(resource), 그리고 그 사이의 흐름으로 표현합니다. 프로세서의 명령어, 공장의 부품, 전장의 임무, 궤도 위 AI 작업이 모두 같은 언어로 기술됩니다." },
    { id: "simulate", title: "Simulate", ko: "시뮬레이션",
      text: "사이클 수준 시뮬레이터, 이산 사건 시뮬레이션(DES), 에이전트 기반 시뮬레이션(ABS), 워게임으로 모델을 실행해, 실제로 만들기 전에 성능과 병목, 위험을 미리 봅니다." },
    { id: "explore", title: "Explore", ko: "탐색 · 최적화",
      text: "구조, 스케줄링, 자원 배분, 의사결정 정책을 바꿔 가며 설계 공간을 탐색합니다. 강화학습과 LLM 에이전트가 사람 대신 수많은 대안을 시도하고 비교합니다." },
    { id: "deploy", title: "Deploy", ko: "현실 적용",
      text: "찾아낸 설계를 하드웨어(PIM, FPGA, GPU 서버), 공장과 물류 현장, 국방 체계, 궤도 데이터센터의 운용에 적용합니다." },
    { id: "feedback", title: "Feedback", ko: "피드백",
      text: "현실에서 측정한 데이터로 모델을 보정하고, 다음 고리를 더 정확하게 돕니다. Project Ouroboros는 이 고리 자체를 AI로 자동화하는 연구입니다." }
  ],

  // 표의 행 이름 (모든 분야 공통)
  roles: [
    ["entity", "Entity", "흐르는 것"],
    ["queue", "Queue", "기다리는 곳"],
    ["server", "Server", "처리하는 것"],
    ["constraint", "Constraint", "제약"],
    ["policy", "Policy", "우리가 설계하는 것"],
    ["objective", "Objective", "목표"]
  ],

  domains: [
    { id: "arch", title: "Computer Architecture",
      labels: { source: "PROGRAM", queue: "ISSUE QUEUE", servers: ["CORE", "GPU", "PIM"], sink: "RETIRE", policy: "SCHEDULER", constraint: "BANDWIDTH · POWER · AREA" },
      map: { entity: "명령어, 메모리 요청", queue: "이슈 큐, 메모리 컨트롤러 큐", server: "파이프라인, 코어, GPU, PIM 뱅크", constraint: "메모리 대역폭, 전력, 칩 면적", policy: "스케줄링, 프리페칭, 연산 오프로딩", objective: "IPC ↑ · 지연 ↓ · 에너지 ↓" } },
    { id: "bio", title: "Bioinformatics PIM",
      labels: { source: "GENOME READS", queue: "MEMORY QUEUE", servers: ["DPU", "DPU", "DPU"], sink: "ALIGNED", policy: "PARTITIONER", constraint: "MEMORY BANDWIDTH · ENERGY" },
      map: { entity: "유전체 리드, 질의", queue: "메모리 요청 큐", server: "메모리 안의 연산 유닛 (DPU)", constraint: "메모리 대역폭, 에너지", policy: "데이터 배치, 작업 분할", objective: "분석 시간 ↓ · 에너지 ↓" } },
    { id: "mfg", title: "Manufacturing AX",
      labels: { source: "ORDERS", queue: "WIP BUFFER", servers: ["CNC", "ROBOT", "AGV"], sink: "SHIP", policy: "DISPATCHER", constraint: "MACHINES · DUE DATES · SPACE" },
      map: { entity: "주문, 부품", queue: "재공품(WIP) 버퍼", server: "설비, 로봇, 운반 차량", constraint: "설비 수, 납기, 공간", policy: "디스패칭, 배치, AI 공정 계획", objective: "처리량 ↑ · 리드타임 ↓" } },
    { id: "def", title: "Defense AX",
      labels: { source: "SENSORS", queue: "C2 QUEUE", servers: ["ISR", "FIRES", "MANEUVER"], sink: "EFFECTS", policy: "COA AGENT", constraint: "TIME · UNCERTAINTY · ASSETS" },
      map: { entity: "표적, 임무, 부대", queue: "지휘결심 과정 (MDMP)", server: "감시정찰, 화력, 기동 자산", constraint: "시간, 정보 불확실성, 가용 자산", policy: "방책(COA) 생성, LLM 에이전트", objective: "결심 시간 ↓ · 임무 성공률 ↑" } },
    { id: "orbit", title: "Orbital Data Center",
      labels: { source: "AI JOBS", queue: "JOB QUEUE", servers: ["SAT-1", "SAT-2", "SAT-3"], sink: "RESULTS", policy: "ORCHESTRATOR", constraint: "SOLAR POWER · HEAT · RADIATION · LINKS" },
      map: { entity: "AI 학습·추론 작업", queue: "작업 큐", server: "궤도 위 연산 위성", constraint: "태양광 전력, 방열, 방사선, 통신 링크", policy: "지상-궤도 작업 분배, 내결함 운용", objective: "와트당 처리량 ↑ · 신뢰성 ↑" } }
  ],

  // 재귀적 자기개선: AI 가 고리를 돌 때마다 위의 대기열 네트워크(선택한 분야)가 한 세대씩 나아짐
  rsi: {
    lead: "Project Ouroboros가 그리는 다음 단계입니다. 파운데이션 모델(LLM) 기반 AI 에이전트가 이 고리를 맡아, 위의 시스템을 스스로 모델링하고, 설계하고, 최적화하고, 분석합니다. 에이전트가 만든 더 나은 세대가 다음 고리의 출발점이 되고, 고리를 돌수록 시스템은 더 강해집니다.",
    agent: "LLM AGENT",                     // 고리를 도는 표식
    hub: "FOUNDATION MODEL",               // 고리 가운데 위 캡션
    steps: [
      { id: "model", title: "Model", call: "observe() → fit_model()",
        text: "에이전트가 현재 세대의 시스템을 관측하고, 측정 데이터로 대기열 네트워크 모델을 다시 세웁니다.",
        log: "observe(system) → fit queueing model" },
      { id: "design", title: "Design", call: "propose(design)",
        text: "병목을 찾아 새 구조를 제안합니다. 처리 자원을 늘리거나 흐름을 다시 짜는 설계안을 직접 작성합니다.",
        log: "propose(add_server, reroute_flow)" },
      { id: "optimize", title: "Optimize", call: "simulate(×128)",
        text: "시뮬레이터를 도구로 호출해 수많은 정책을 병렬로 시험하고, 처리 순서와 자원 배분을 최적화합니다.",
        log: "simulate(128 policies) → select best" },
      { id: "analyze", title: "Analyze", call: "analyze() → memory",
        text: "결과를 측정하고 원인을 설명한 뒤, 배운 것을 기억(memory)에 남겨 다음 세대가 그 위에서 시작하게 합니다.",
        log: "analyze(metrics) → write memory" }
    ]
  },


  // 연구 주제 × 고리 단계 (중점을 두는 단계)
  matrix: [
    { id: "ai-accelerator", stages: ["model", "simulate", "explore", "deploy"] },
    { id: "near-far-memory", stages: ["model", "simulate", "explore"] },
    { id: "heterogeneous", stages: ["simulate", "explore", "deploy"] },
    { id: "mns-ax", stages: ["model", "simulate", "explore", "deploy"] },
    { id: "defense-mns", stages: ["model", "simulate", "explore", "feedback"] },
    { id: "orbital-dc", stages: ["model", "simulate", "explore"] },
    { id: "ouroboros", stages: ["explore", "feedback"] },
    { id: "copyright-ai", stages: ["model", "deploy", "feedback"] }
  ],

  closing: "규모와 대상은 달라도 질문은 하나입니다. 제약 속에서, 흐름을 어떻게 설계하고 운용해야 가장 좋은가."
};
