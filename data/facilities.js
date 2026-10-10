/*
 * Facilities 페이지.
 * - groups: 분류별 묶음. items 가 비어 있는 분류는 페이지에 나오지 않습니다 (나중에 채우면 자동으로 나타남).
 * - 장비 항목: name, qty (수량, 선택), summary (짧은 설명), specs: [[항목, 값], ...], illustration (assets/js/illustrations.js)
 */
window.LAB = window.LAB || {};

LAB.facilities = {
  intro: "Computing resources & Facilities",
  groups: [
    {
      id: "servers",
      title: "Servers",
      items: [
        {
          name: "UPMEM PIM Server",
          summary: "메모리 안에서 연산하는 Processing-in-Memory 서버입니다. PIM 워크로드 분석과 생물정보처리 가속 연구에 씁니다.",
          specs: [["PIM", "UPMEM PIM DIMM 16 GB"], ["Main memory", "256 GB DRAM"], ["CPU", "Intel Xeon Gold"]],
          illustration: "facPim"
        },
        {
          name: "FPGA & Computational Storage Server",
          summary: "HBM을 단 FPGA 가속기 카드와 FPGA 내장 SSD로 근접 데이터 처리와 하드웨어 가속기를 실험합니다.",
          specs: [["CPU", "AMD Ryzen Threadripper PRO 9975WX, 32 cores / 64 threads"], ["FPGA", "AMD Alveo U50 × 3 (HBM2 8 GB each, 24 GB total)"], ["Storage", "AMD / Samsung SmartSSD 4 TB"]],
          illustration: "facFpga"
        },
        {
          name: "Simulation & HLS Server",
          summary: "대용량 캐시 CPU와 넉넉한 메모리로 아키텍처 시뮬레이션과 FPGA용 고수준 합성(HLS)을 돌립니다.",
          specs: [["CPU", "AMD Ryzen 9 9900X3D, 12 cores / 24 threads"], ["Main memory", "256 GB DDR5"], ["Storage", "10 TB"], ["Use", "Simulation, HLS synthesis"]],
          illustration: "facHls"
        },
        {
          name: "Quad-GPU Workstation",
          summary: "대용량 GPU 메모리로 LLM 학습·추론과 시뮬레이션 기반 AI 연구를 수행합니다.",
          specs: [["GPU", "NVIDIA RTX PRO 6000 Max-Q Workstation Edition × 4"], ["GPU memory", "96 GB each, 384 GB total"]],
          illustration: "facGpu4"
        },
        {
          name: "NVIDIA DGX Spark Cluster",
          qty: "× 3",
          summary: "고속 네트워크로 묶은 DGX Spark 세 대로 분산 AI 학습과 추론, 멀티 노드 시스템을 연구합니다.",
          specs: [["Nodes", "NVIDIA DGX Spark × 3"], ["Memory", "128 GB unified memory each"], ["Interconnect", "QSFP, 200 Gb/s"]],
          illustration: "facSpark"
        }
      ]
    },
    // 나중에 채울 분류 (items 를 채우면 페이지에 나타납니다)
    { id: "space", title: "Research Space", items: [] },
    { id: "personal", title: "Personal Equipment", items: [] }
  ]
};
