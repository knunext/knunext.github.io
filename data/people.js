/*
 * People 페이지.
 * - photo 를 비우면 이니셜 아바타가 표시됩니다. photoFit: "contain" 이면 라인 아트처럼 잘리지 않고 전체가 보입니다.
 *   (tools/outline_white.py 로 그림의 검은 선만 흰색으로 남긴 이미지를 만들 수 있습니다)
 * - 사진은 assets/img/people/ 에 넣어 주세요. (정사각형 권장)
 * - aliases: 논문 저자 표기가 다를 때(영문/한글) 적어두면 Publications 에서 굵게 표시됩니다.
 * - role: 이름 옆에 붙는 짧은 표시 (예: "NCSL 랩장")
 * - period: 소속 기간, research: 연구 분야 목록, extra: 추가 정보 목록
 * - emailImage: 메일 주소 이미지 (tools/email_image.py 로 생성, 주소를 직접 적지 마세요)
 * - compact: true 인 그룹은 사진 없이 한 줄 목록으로 표시됩니다.
 * - subgroups: [{ title, members }] 로 그룹 안을 소제목별로 나눌 수 있습니다 (예: Alumni → Graduates / Former Interns).
 * - badges: 설명 아래 작게 붙는 로고 [{ name, logo, height }] (주요 펀딩, 수상, 선발 기록 등). height 는 선택 (기본 40px, 가로로 긴 로고는 줄여서)
 */
window.LAB = window.LAB || {};

LAB.people = {
  intro: "MEMBERS",
  pi: {
    name: "김정근",
    nameEn: "Jeonggeun Kim, Ph.D.",
    aliases: ["Jeonggeun Kim"],
    title: "Professor, School of Computer Science and Engineering",
    emailImage: "assets/img/email/email-pi.png",
    photo: "assets/img/people/pi.png",
    photoFit: "contain",
    bio: "",
    research: ["Processing-in-Memory", "GPU & Processor Architecture", "Defense M&S (Modeling & Simulation), LLM w/ M&S", "Copyright & AI-Generated Content"],
    links: []
  },
  groups: [
    {
      title: "M.S. Students & Joint BS/MS Students",
      members: [
        {
          name: "임정훈",
          role: "NCSL 랩장",
          period: "Mar. 2024 – Present",
          research: ["GPU", "Processing-in-Memory", "Defense M&S", "Quantum Computing"],
          extra: ["IBM Quantum Leadership Training Program (2024)"],
          badges: [
            { name: "IBM Quantum Leadership Training Program (2024)", logo: "assets/img/sponsors/ibm.png", height: 20 }
          ],
          photo: "assets/img/people/student-mascot.png",
          photoFit: "contain"
        },
        {
          name: "김준형",
          role: "PIM 랩장",
          period: "Dec. 2024 – Present",
          research: ["BioPIM", "Processing-in-Memory", "FPGA", "HLS"],
          photo: "assets/img/people/student-mascot.png",
          photoFit: "contain"
        },
        {
          name: "안재원",
          role: "M&S 랩장",
          period: "Dec. 2024 – Present",
          research: ["Defense M&S", "RL", "LLM", "Agentic AI"],
          extra: ["과학기술전문사관 2기"],
          badges: [
            { name: "과학기술정보통신부 장관상", logo: "assets/img/badges/msit-minister-award.svg" },
            { name: "과학기술전문사관 2기", logo: "assets/img/news/tech-officer-emblem.png" }
          ],
          photo: "assets/img/people/student-mascot.png",
          photoFit: "contain"
        },
        {
          name: "유상훈",
          period: "Jun. 2025 – Present",
          research: ["Defense M&S", "RL", "LLM", "Agentic AI"],
          photo: "assets/img/people/student-mascot.png",
          photoFit: "contain"
        },
        {
          name: "조재용",
          period: "Dec. 2024 – Present",
          research: ["BioPIM, Processing-in-Memory", "FPGA", "HLS"],
          photo: "assets/img/people/student-mascot.png",
          photoFit: "contain"
        },
        {
          name: "Seong-kyo Seo",
          period: "Sep. 2024 – Present",
          extra: ["부사장, 범일정보 (Bumil Information)"],
          research: ["Cloud Computing", "Distributed Computing"],
          photo: "assets/img/people/student-mascot.png",
          photoFit: "contain"
        },
        {
          name: "이부현",
          period: "Mar. 2026 – Present",
          extra: ["대표(CEO), 주식회사 링크즈(LinkZ inc.)"],
          research: ["LLM (Agentic AI)"],
          photo: "assets/img/people/student-mascot.png",
          photoFit: "contain"
        }
      ]
    },
    {
      title: "Undergraduate Interns",
      members: [
        {
          name: "정세엽",
          period: "Dec. 2024 – Present",
          research: ["Defense M&S", "LLM", "Agentic AI"],
          extra: ["@ Technische Hochschule Ulm, Deutschland ('26.03 - 08)"],
          photo: "assets/img/people/student-mascot.png",
          photoFit: "contain"
        },
        {
          name: "정석주",
          period: "Mar. 2026 – Present",
          research: ["Defense M&S", "LLM", "Agentic AI"],
          photo: "assets/img/people/student-mascot.png",
          photoFit: "contain"
        }
      ]
    },
    {
      title: "Alumni",
      compact: true,
      subgroups: [
        {
          title: "Graduates",
          members: [
            {
              name: "Hoyong Kang (M.S.)",
              aliases: ["Hoyong Kang"],
              period: "Mar. 2023 – Feb. 2025",
              now: "Researcher, 인피닉스 (Infinyx)",
              research: ["Cache Prefetching", "Memory Architecture", "Machine Learning for Computer Architecture"]
            }
          ]
        },
        {
          title: "Former Interns",
          members: [
            {
              name: "류정민",
              period: "Jul. 2026 –",
              now: "",
              research: ["BioPIM, Processing-in-Memory", "FPGA, Processor Design"]
            },
            {
              name: "김지환",
              period: "Jan. 2026 –",
              now: "",
              research: ["Defense M&S"]
            },
            {
              name: "FAZILOV MIRODILBEK",
              period: "Jul. 2025 –",
              now: "",
              research: ["Modeling & Simulation"]
            },
            {
              name: "한진호",
              period: "Dec. 2024 –",
              now: "",
              research: ["BioPIM"]
            },
            {
              name: "손승익 (BE)",
              period: "Dec. 2024 – Dec. 2025",
              now: "School of Electronics Engineering",
              research: ["BioPIM"]
            },
            {
              name: "이정화",
              period: "Dec. 2024 – Feb. 2025",
              now: "School of Electronics Engineering",
              research: ["BioPIM"]
            }
          ]
        }
      ]
    }
  ]
};
