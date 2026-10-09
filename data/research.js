/*
 * Research 페이지.
 * - topics: 연구 주제. id 는 메인 '탐험 분야' 링크(research.html#id)에 쓰입니다.
 * - projects: 진행 중인 과제.
 * - lists: [{ label: "제목", items: ["항목", ...] }] 형식으로 원하는 만큼 추가할 수 있습니다.
 * - 슬라이드 카드용 필드
 *     illustration: pim | sim | wargame | provenance | loop | nearfar | hetero | orbit (assets/js/illustrations.js)
 *     labels: 그림 왼쪽에 붙는 짧은 라벨 2–3개
 *     wordmark: 카드 아래 큰 글자 [앞, 뒤] (별표로 이어짐)
 * - sponsors: 상세 아래 'Sponsors' 칸에 들어갈 로고 [{ name, logo, url }]
 * - partners: 그 아래 'Partners' 칸 (공동연구기관·협력 대학 로고). 비워 두면 칸이 보이지 않음
 *     logo 는 어두운 배경용 흰색(투명 배경) PNG/SVG 권장. assets/img/sponsors/ 에 넣어 주세요.
 *     비워 두면 빈 로고 칸이 표시됩니다 (showEmptySponsor: false 로 숨김).
 * - image: "assets/img/research/파일명.jpg" 를 넣으면 라인 드로잉 대신 이미지가 나옵니다. imageCredit: 출처 (선택)
 */
window.LAB = window.LAB || {};

LAB.research = {
  intro: "Next-Generation Technologies",
  showEmptySponsor: true,

  topics: [
    {
      id: "ai-accelerator",
      short: "PIM for Bioinformatics", // 상단 칩에 표시되는 짧은 이름
      illustration: "pim",
      labels: ["Genome", "Memory", "Accelerator"],
      wordmark: ["Bio", "PIM"],
      category: "AI 가속기",
      title: "Processing-In-Memory for Bioinformatics Workloads",
      subtitle: "생물정보처리 워크로드 가속을 위한 PIM 아키텍처 연구",
      description:
        "컴퓨팅 자원에 기반한 유전자 정보 처리는 신약 개발, 질병 분석, 수명 연장 등 현재 생명공학 분야의 가장 뜨거운 주제입니다.",
      lists: [
        {
          label: "관련 연구 프로젝트 (진행 중)",
          items: ["유전체 염기서열 분석 가속화를 위한 페타스케일 인-스토리지 컴퓨팅 기초연구실 (BRL, 한국연구재단, 2024–2027)"]
        }
      ],
      sponsors: [{ name: "과학기술정보통신부", logo: "assets/img/sponsors/msit.png", url: "" }],
      image: "",
      imageCredit: ""
    },
    {
      id: "near-far-memory",
      short: "Near-Far Memory", // 상단 칩에 표시되는 짧은 이름
      illustration: "nearfar",
      labels: ["Multi-GPU", "CXL", "Far Memory"],
      wordmark: ["Near", "Far"],
      category: "Collaboration",
      title: "Scalable Near-Far Memory Architecture for Multi-GPUs with CXL-interface",
      subtitle: "CXL 기반 Multi-GPU를 위한 확장가능한 Near-Far 메모리 아키텍처",
      description:
        "LLM을 넘어 AGI 시대에 다가가면서, 딥러닝 모델의 학습과 추론을 위한 대규모 GPU 자원 활용이 중요해지고 있습니다. " +
        "이 연구는 다중 GPU 환경의 메모리 병목을 해소하기 위해, (1) 차세대 메모리(eNVM) 및 스토리지급 메모리(SCM) 기반의 Far Memory와 " +
        "(2) HBM 기반의 Near Memory로 구성된 Near-Far Memory Architecture를 설계합니다. ",
      lists: [
        {
          label: "관련 연구 프로젝트",
          items: [
            "A Smart Near-Far Memory Architecture for Data-intensive Workloads. Yonsei-Samsung Joint Research Program, Samsung Electronics (2021–2025). PI: Prof. Bernd Burgstaller, Yonsei University (Collaboration)"
          ]
        }
      ],
      sponsors: [{ name: "Samsung Electronics", logo: "assets/img/sponsors/samsung.png", url: "" }],
      image: ""
    },
    {
      id: "defense-mns",
      short: "Defense M&S", // 상단 칩에 표시되는 짧은 이름
      illustration: "wargame",
      labels: ["Wargame", "M&S", "LLM Agent"],
      wordmark: ["War", "Game"],
      category: "국방 AX + 국방 M&S",
      title: "국방 M&S (모델링 및 시뮬레이션)",
      subtitle: "차세대 전장을 위한 M&S + LLM 기반 MDMP 플랫폼 연구",
      description: "이 연구 주제에 대해 자세히 알고 싶다면 직접 면담하거나 메일로 문의해 주세요.",
      note: "연구 주제 특성상 대한민국 (단일) 국적의 학생만 참여할 수 있습니다.",
      lists: [
        {
          label: "관련 분야",
          items: [
            "국방 AI (M&S + LLM), 국방 ICT",
            "차세대 무기 체계의 도입, 전술, 전략적 타당성 평가를 위한 워게임 시뮬레이션 및 모델링"
          ]
        }
      ],
      sponsors: [{ name: "교육부", logo: "assets/img/sponsors/moe.png", url: "" }],
      image: "",
      imageCredit: "Image source: Wikipedia, Professional wargaming"
    },
    {
      id: "mns-ax",
      short: "M&S for AX", // 상단 칩에 표시되는 짧은 이름
      illustration: "sim",
      labels: ["Logistics", "Manufacturing", "Space"],
      wordmark: ["Sim", "AX"],
      category: "제조/물류 AX",
      title: "Modeling and Simulation for AX",
      subtitle: "DES/ABS를 통한 실세계 문제 해결",
      description:
        "Discrete Event Simulation (DES), Agent-based Simulation (ABS) 등 여러 모델링 방법론으로 현실 세계의 문제들을 모델링합니다.",
      lists: [
        {
          label: "활용 분야",
          items: [
            "물류 최적화 (Warehouse Simulation, Route Optimization, Last-Mile Delivery Optimization)",
            "우주 개척을 위한 지구 외 위성/행성 자원 개발 시뮬레이션",
            "제조 혁신 AI"
          ]
        },
        { label: "관련 연구 프로젝트 (진행 중)", items: ["지역주도형 인공지능(AI) 대전환 사업 (중소벤처기업부, 2025-2026)"] }
      ],
      sponsors: [{ name: "중소벤처기업부", logo: "assets/img/sponsors/mos.png", url: "" }, { name: "경남테크노파크 (GNTP)", logo: "assets/img/sponsors/gntp.png", url: "" }],
      partners: [
        { name: "경상국립대학교", logo: "assets/img/partners/gnu.png", url: "" },
        { name: "건국대학교", logo: "assets/img/partners/konkuk.png", url: "" }
      ],
      image: "",
      imageCredit: "Image source: NVIDIA AI Solutions for Efficient Supply Chain Operation"
    },
    {
      id: "ouroboros",
      short: "Project Ouroboros", // 상단 칩에 표시되는 짧은 이름
      illustration: "loop",
      labels: ["Design", "Feedback", "Improve"],
      wordmark: ["Ouro", "boros"],
      category: "Agentic AI",
      title: "Project Ouroboros: Recursive Self-Improving Design Loop",
      subtitle: "스스로 설계하고, 피드백으로 다시 개선하는 AI 에이전트",
      description:
        "꼬리를 문 전설 속의 뱀, 우로보로스(οὐροβόρος)처럼 끝없이 이어지는 개선 루프를 만듭니다. " +
        "AI 에이전트가 시스템을 설계하고, 그 시스템을 실행해 얻은 피드백을 다시 받아 더 나은 시스템을 설계하는 과정을 반복합니다. " +
        "한 세대의 결과가 다음 세대의 입력이 되는 재귀적 개선(Recursive Self-Improvement) 구조를 연구합니다.",
      lists: [
        {
          label: "개선 루프",
          items: [
            "Design: AI 에이전트가 시스템을 설계",
            "Build &amp; Run: 설계한 시스템을 구현하고 실행",
            "Feedback: 실행 결과와 성능 데이터를 수집해 에이전트에게 전달",
            "Improve: 피드백을 반영해 다음 세대 시스템을 설계",
            "[Targets] 차세대 아키텍처 (CPU, GPU, TPU, Memory), M&S (국방시뮬레이션, 제조AX 등)"
          ]
        }
      ],
      sponsors: [],
      image: ""
    },
    {
      id: "heterogeneous",
      short: "Heterogeneous Computing", // 상단 칩에 표시되는 짧은 이름
      illustration: "hetero",
      labels: ["xPU", "Memory", "NoC"],
      wordmark: ["Hetero", "HPC"],
      category: "Collaboration",
      title: "Heterogeneous Computing Systems with xPUs and Multi-layer Memories",
      subtitle: "xPU 및 다중 계층 메모리 시스템 기반의 초고성능 이종 컴퓨팅 시스템 구축",
      description:
        "xPU (CPU, GPU, NPU, DPU, QPU, NDPU 등)와 다중 계층 메모리 (Near-Far Memory, CXL 기반 Pooled Memory)를 바탕으로, " +
        "이종 컴퓨팅 구조 설계, 관리 기법, 프로그래밍 모델 등 다양한 관점에서 초고성능 이종 컴퓨팅 시스템을 연구합니다. ",
      lists: [
        {
          label: "관련 연구 프로젝트",
          items: [
            "지역지능화 혁신인재양성사업 (GrandICT/ITRC), IITP (2022–2029). ICT융합연구센터 (Lead-PI: 김지현 교수님) <a href=\"https://www.youtube.com/watch?v=gH4JrcAvZW0\">소개 영상</a>",
            "공동연구: 경북대학교 컴퓨터학부 남덕윤 교수님 (HPC Lab)"
          ]
        },
        {
          label: "관련 분야",
          items: ["Computer Architecture, Algorithm, Compiler", "Programming Model", "Processing-in-Memory, Neural Processing Unit"]
        }
      ],
      sponsors: [{ name: "교육부", logo: "assets/img/sponsors/moe.png", url: "" }],
      image: ""
    },
    {
      id: "copyright-ai",
      short: "Content Provenance", // 상단 칩에 표시되는 짧은 이름
      illustration: "provenance",
      labels: ["C2PA", "AI Detection", "Reuse Tracing"],
      wordmark: ["Proven", "ance"],
      category: "문화 AX",
      title: "Copyright and AI-Generated Content",
      subtitle: "저작권과 AI 생성물을 위한 컴퓨터 비전 기술",
      description:
        "생성형 AI로 만든 영상과 이미지가 빠르게 늘어나면서, 콘텐츠가 어디서 왔고 어떻게 만들어졌는지를 확인하는 기술이 중요해지고 있습니다. " +
        "C2PA 같은 콘텐츠 출처 표준을 활용한 이력 검증, AI 생성 영상과 이미지의 판별, 기존 저작물이 새로운 콘텐츠에 어떻게 활용되었는지 찾아내는 컴퓨터 비전 기술을 연구합니다.",
      lists: [
        {
          label: "연구 분야",
          items: [
            "C2PA 기반 콘텐츠 출처 및 이력 검증 (Content Provenance)",
            "AI 생성 영상/이미지 판별",
            "기존 저작물의 재활용, 변형 여부 탐지"
          ]
        },
        {
          label: "관련 연구 프로젝트 (진행 중)",
          items: ["저작권기술 글로벌 인재 양성 사업 (문화체육관광부, 2026–2031)"]
        }
      ],
      sponsors: [{ name: "문화체육관광부", logo: "assets/img/sponsors/moc.png", url: "" }, { name: "한국콘텐츠진흥원 (KOCCA)", logo: "assets/img/sponsors/kocca.png", url: "" }],
      partners: [
        { name: "건국대학교", logo: "assets/img/partners/konkuk.png", url: "" },
        { name: "Tsinghua University (清華大學)", logo: "assets/img/partners/tsinghua.png", url: "" },
        { name: "Waseda University (早稲田大学)", logo: "assets/img/partners/waseda.png", url: "" },
        { name: "Zhejiang University (浙江大學)", logo: "assets/img/partners/zhejiang.png", url: "" },
        { name: "Télécom SudParis", logo: "assets/img/partners/telecom-sudparis.png", url: "" }
      ],
      image: ""
    },
    {
      id: "orbital-dc",
      short: "Orbital Data Center",
      illustration: "orbit",
      labels: ["Satellite", "Radiation", "Thermal"],
      wordmark: ["Orbit", "DC"],
      category: "Space Computing",
      title: "Orbital Data Centers",
      subtitle: "우주 궤도 위 데이터센터를 위한 컴퓨팅 시스템 연구",
      description:
        "AI 학습과 추론에 필요한 전력과 냉각 수요가 급증하면서, 태양광 전력을 상시 활용하고 우주 공간으로 열을 방출할 수 있는 궤도 데이터센터가 새로운 대안으로 떠오르고 있습니다. " +
        "방사선, 전력, 열, 통신 대역폭이 모두 제한된 궤도 환경에서 안정적으로 동작하는 컴퓨팅 아키텍처와 시스템 소프트웨어를 연구합니다.",
      lists: [
        {
          label: "연구 분야",
          items: [
            "방사선 환경에서의 신뢰성 있는 컴퓨팅 (메모리 오류 정정, 내결함성 아키텍처)",
            "전력·열 제약 하의 고효율 AI 가속기와 메모리 시스템",
            "위성 간 광통신 링크 기반 분산 컴퓨팅",
            "지상-궤도 하이브리드 작업 분배와 스케줄링"
          ]
        }
      ],
      sponsors: [],
      image: ""
    }
  ],

  projects: [
    {
      title: "유전체 DNA 염기서열 분석 가속화를 위한 페타스케일 인-스토리지 컴퓨팅 기초연구실",
      subtitle: "생물정보학 프로그램 가속을 위한 Processing-in-Memory 구조 및 관리 기법 연구",
      sponsor: "기초연구실사업(BRL), 한국연구재단",
      period: "2024–2027",
      description:
        "차세대 컴퓨팅 디바이스로 떠오르는 메모리 기반 프로세싱 장치(PIM)를 활용해, 생물정보학 프로그램의 처리를 가속하는 구조를 개발합니다.",
      lists: [
        {
          label: "연구 그룹",
          items: [
            "KNU SCENT Lab (Lead-PI: Prof. Yongtae Kim)",
            "KNU COBI Lab (Co-PI: Prof. Inuk Jung)",
            "KNU MECCA Lab (Co-PI: Prof. Myungsuk Kim)",
            "KNU NCSL"
          ]
        }
      ]
    },
    {
      title: "Project Ouroboros",
      subtitle: "οὐροβόρος, AI 에이전트 기반 재귀적 시스템 개선 루프",
      sponsor: "",
      period: "",
      description: "AI 에이전트가 시스템을 설계하고, 실행 피드백을 받아 더 개선된 시스템을 다시 설계하는 과정을 반복합니다. <a href=\"#ouroboros\">연구 주제 보기</a>",
      lists: []
    },
    {
      title: "Scalable Near-Far Memory Architecture for Multi-GPUs with CXL-interface",
      subtitle: "다중 GPU 환경을 위한, 확장 가능한 Near-Far 메모리 아키텍처 연구",
      sponsor: "Yonsei-Samsung Joint Research Program, Samsung Electronics",
      period: "2020–",
      description: "다중 GPU 환경에서의 메모리 병목 현상을 해소하기 위한 Near-Far Memory Architecture 설계",
      lists: [
        { label: "연구 그룹", items: ["Project PI: Prof. Bernd Burgstaller, Yonsei University"] },
        {
          label: "Publications",
          items: [
            "LPGSim: A Lightweight Parallel GPU Simulator Maximizing Speed with Trustworthy Simulation (SIGMETRICS 2026)",
            "Comprehensive Design Space Exploration for Graph Neural Network Aggregation on GPUs (IEEE CAL 2025)"
          ]
        }
      ]
    },
    {
      title: "AI솔루션 개발·실증 지원(가치사슬형) 사업",
      subtitle: "지역 제조 혁신을 위한 AX",
      sponsor: "지역주도형 AI대전환사업, 중소벤처기업부",
      period: "2026.01–2026.12",
      description: "",
      lists: [{ label: "공동 연구진", items: ["아라소프트(주)", "경상국립대학교 부석준 교수님", "건국대학교 오병국 교수님"] }]
    },
    {
      title: "저작권기술 글로벌 인재 양성 사업",
      subtitle: "멀티모달 기반 콘텐츠 저작권 관련 기술 (문화AX)",
      sponsor: "선도형 저작권 기술개발사업, 문화체육관광부",
      period: "2026–2031",
      description: "",
      lists: [
        {
          label: "공동 연구진",
          items: ["주관: 건국대학교", "경북대학교 (PI: 박상효 교수, 공동연구진: 김정근 교수, 이재협 교수)", "엘에스웨어(주)"]
        }
      ]
    },
    {
      title: "자율화된 군지휘결심체계(MDMP)를 위한 국방M&S 및 에이전트AI 기반 프레임워크",
      subtitle: "완전히 자율화된 무인 전투 부대 운영을 위한 지휘결심체계 자동화 연구 (국방AX)",
      sponsor: "",
      period: "",
      description: "",
      lists: [
        { label: "공동 연구진", items: ["경북대학교 김명석 교수님 (MECCA Lab)"] },
        { label: "Publications", items: ["한국멀티미디어학회 학술지", "한국군사과학기술학회 추계학술대회"] }
      ]
    },
    {
      title: "다중 가속기 기반의 이종 컴퓨팅 연구 (Accelerator-rich Heterogeneous Computing)",
      subtitle: "xPU 및 다중 계층 메모리 시스템 기반의 초고성능 이종 컴퓨팅 시스템 구축",
      sponsor: "",
      period: "",
      description: "다중/이기종 프로세서 xPU (CPU, GPU, NPU, PIM, ISC) 및 다계층 메모리 기반 이종 컴퓨팅 구조 연구",
      lists: [{ label: "공동 연구진", items: ["경북대학교 남덕윤 교수님 (HPC Lab)"] }]
    }
  ]
};
