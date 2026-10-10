/*
 * Publications 페이지.
 * - scope: "international" | "domestic"
 * - tags: 등급/분류 배지 (예: "BK1", "ICORE-A*", "KCI", "SCIE", "Top-tier")
 * - authors: 저자 목록. 교신저자는 이름 뒤에 * 를 붙이세요.
 *   people.js 의 이름(또는 aliases)과 같으면 자동으로 굵게 표시됩니다.
 * - details: 권/호/페이지/날짜 등, status: "Accepted" 등, note: 채택률 등
 * - links: { pdf, doi, code, slides, video } 중 필요한 것만
 *
 * LAB.ongoingWork: 아직 출판되지 않은 진행 중 연구 (심사 중, 프리프린트, 작성 중).
 * - 목록 맨 위 'Ongoing' 칸에 상태별로 묶여 표시되고, 비어 있으면 칸 자체가 보이지 않습니다.
 * - status: "Under Review" | "Major Revision" | "Minor Revision" | "Preprint" | "In Preparation" (이 순서로 정렬)
 * - venue 는 선택. 양면 블라인드 심사 중인 논문은 학회/저널 이름을 적지 않는 것이 관례입니다.
 *   프리프린트는 venue: "arXiv" 와 links.pdf 로 arXiv 주소를 넣으면 됩니다.
 * - 나머지 필드(scope, tags, authors, title, links)는 LAB.publications 와 같습니다.
 */
window.LAB = window.LAB || {};

// 태그 색상: teal(청록) | red(붉은색) | purple(보라) | orange(주황). 목록에 없는 태그는 기본 회색.
LAB.tagColors = {
  "Intl.conf": "grey", "Dom.conf": "grey",
  "BK1": "teal", "BK2": "teal", "BK3": "red", "BK4": "red",
  "ICORE-A*": "red", "ICORE-A": "red", "ICORE-B": "teal",
  "KCI": "purple", "SCIE": "orange",
  "KIISE-S": "red", "KIISE-A": "teal",
  "Top-tier": "red", "High-impact": "red"
};

LAB.publicationsIntro = "Selected publications";

LAB.ongoingWork = [
  {
    status: "In Preparation",
    tags: ["KCI"],
    scope: "domestic",
    authors: ["Jeonggeun Kim", "Anonymous-authors*"],
    title: "CombatSimul: A Combat Simulator for Military Digital-Twin Environment",
    venue: "KCI",
    details: "2026",
    links: {}
  },
  {
    status: "In Preparation",
    tags: ["BK1"],
    scope: "international",
    authors: ["Anonymous-authors", "Jeonggeun Kim*"],
    title: "Designing a HBM-based FPGA Accelerator for K-mer Counting Operations",
    venue: "IntlConf",
    details: "2026",
    links: {}
  },
  {
    status: "In Preparation",
    tags: ["BK1"],
    scope: "international",
    authors: ["Anonymous-authors", "Jeonggeun Kim*"],
    title: "CombatBench: Combat Scenario-based Benchmarks for Military Decision Making Process",
    venue: "IntlConf",
    details: "2026",
    links: {}
  },
  {
    status: "In Preparation",
    tags: ["SCIE"],
    scope: "international",
    authors: ["Anonymous-authors", "Jeonggeun Kim*"],
    title: "RT-PIM: Accelerating the Raytracing operations with a Processing-in-Memory Device",
    venue: "IntlJournal",
    details: "2026",
    links: {}
  },
  // {
  //   status: "Preprint",
  //   scope: "international",
  //   authors: ["Hong Gildong", "Jeonggeun Kim*"],
  //   title: "논문 제목",
  //   venue: "arXiv",
  //   details: "2026",
  //   links: { pdf: "https://arxiv.org/abs/0000.00000" }
  // }
];

LAB.publications = [
  // ---------- 2026 ----------
  {
    year: 2026,
    scope: "international",
    tags: ["BK1"],
    authors: ["Minsu Choi*", "Jeonggeun Kim", "Dukyun Nam*"],
    title: "SCOPE: Shared-stage CPU–DPU Orchestration for PIM Environments",
    venue: "IEEE International Conference on High Performance Computing (HiPC)",
    details: "2026",
    status: "Accepted",
    links: {}
  },
  {
    year: 2026,
    scope: "international",
    tags: ["BK3", "ICORE-A*", "KIISE-S"],
    authors: ["Hyunwoo Nam*", "Jay Hwan Lee", "Yeonsoo Kim", "Mengzhao Zhang", "Jeonggeun Kim", "Bernd Burgstaller*"],
    title: "LPGSim: A Lightweight Parallel GPU Simulator Maximizing Speed with Trustworthy Simulation",
    venue: "Proceedings of the ACM on Measurement and Analysis of Computing Systems (SIGMETRICS)",
    details: "10(2), 2026, 1-27",
    note: "Acceptance rate: 17% (82/479)",
    links: {}
  },
  {
    year: 2026,
    scope: "domestic",
    tags: ["Dom.conf"],
    authors: ["임정훈*", "Jeonggeun Kim*"],
    title: "UPMEM Processing-in-Memory 기반의 효율적인 Ray Tracing을 위한 BVH Traversal 기법",
    venue: "대한전자공학회 하계종합학술대회",
    details: "June, 2026",
    links: {}
  },
  {
    year: 2026,
    scope: "international",
    tags: ["BK1", "ICORE-A"],
    authors: ["Oladayo Ajani*", "Jeonggeun Kim*", "Jong Taek Lee", "Byungchul Tak"],
    title:
      "Measuring Intrinsic Dimension of Multiobjective Landscapes and Dimensionality-Reduced Neuroevolution of Deep Reinforcement Learning",
    venue: "Proceedings of the Genetic and Evolutionary Computation Conference Companion (GECCO)",
    details: "2026",
    note: "Acceptance rate: 35% (150/425)",
    links: {}
  },
  {
    year: 2026,
    scope: "domestic",
    tags: ["KCI"],
    authors: ["장성욱*", "전하운", "김범준", "홍일표", "김정근", "김명석*"],
    title: "읽기 재시도 동작 최적화를 통한 대용량 SSD의 성능 개선",
    venue: "반도체디스플레이기술학회지",
    details: "25(1), Mar. 2026",
    links: {}
  },
  {
    year: 2026,
    scope: "domestic",
    tags: ["KCI"],
    authors: ["안재원*", "김명석", "김정근*"],
    title: "LLM 기반 워게임 교전 시나리오 생성 및 DEVS 기반 M&S를 통한 개선 방안 연구",
    venue: "멀티미디어학회지",
    details: "Jan. 2026",
    links: {}
  },

  // ---------- 2025 ----------
  {
    year: 2025,
    scope: "domestic",
    tags: ["Dom.conf"],
    authors: ["안재원*", "장성욱", "유상훈", "정세엽", "김명석", "Jeonggeun Kim*"],
    title: "DEVS 교전 시뮬레이션을 통한 LLM 기반의 자동 방책 생성 및 평가",
    venue: "한국군사과학기술학회 추계학술대회",
    details: "Nov, 2025",
    links: {}
  },
  {
    year: 2025,
    scope: "international",
    tags: ["SCIE", "High-impact"],
    authors: ["Hyunwoo Nam*", "Jay Hwan Lee", "Shinhyung Yang", "Yeonsoo Kim", "Jiun Jeong", "Jeonggeun Kim", "Bernd Burgstaller*"],
    title: "Comprehensive Design Space Exploration for Graph Neural Network Aggregation on GPUs",
    venue: "IEEE Computer Architecture Letters (IEEE CAL)",
    details: "24(1), 2025",
    links: {}
  },
  {
    year: 2025,
    scope: "international",
    tags: ["Intl.conf"],
    authors: ["Seokhyeon Lee*", "Jeonggeun Kim", "Yongtae Kim*"],
    title: "Accuracy Performance Analysis of Quantized DNN Models using Approximate 4-2 Compressor Based Multipliers",
    venue: "International Conference on Artificial Intelligence in Information and Communication (ICAIIC)",
    details: "Feb, 2025",
    links: {}
  },
  {
    year: 2024,
    scope: "international",
    tags: ["SCIE"],
    authors: ["Myeongjin Kwak*", "Jeonggeun Kim", "Yongtae Kim*"],
    title: "A Comprehensive Exploration of Approximate DNN Models with a Novel Floating-Point Simulation Framework",
    venue: "Performance Evaluation",
    details: "vol. 165, pp. 1-15, Aug, 2024",
    status: "Invited (Special Issue)",
    links: {}
  },

  // ---------- 2023 ----------
  {
    year: 2023,
    scope: "international",
    tags: ["BK2", "ICORE-B", "KIISE-A"],
    authors: ["Myeongjin Kwak*", "Jeonggeun Kim", "Yongtae Kim*"],
    title: "TorchAxf: Enabling Rapid Simulation of Approximate DNN Models using GPU-based Floating-Point Computing Framework",
    venue: "International Symposium on Modeling, Analysis, and Simulation of Computer and Telecommunication Systems (MASCOTS)",
    details: "Oct. 2023",
    note: "Acceptance rate: 29%",
    links: {}
  }
];
