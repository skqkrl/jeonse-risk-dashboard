import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, Legend, ScatterChart, Scatter, ZAxis } from "recharts";

const guData = [
  { name: "관악구", score: 1.23, z3: 0.042, over1: 0.038, top10: 0.112, surge: 0.029, strong: 0.058, medium: 0.134 },
  { name: "노원구", score: 0.88, z3: 0.031, over1: 0.029, top10: 0.098, surge: 0.022, strong: 0.044, medium: 0.118 },
  { name: "도봉구", score: 0.59, z3: 0.025, over1: 0.024, top10: 0.089, surge: 0.018, strong: 0.037, medium: 0.105 },
  { name: "성북구", score: 0.43, z3: 0.019, over1: 0.026, top10: 0.082, surge: 0.014, strong: 0.033, medium: 0.095 },
  { name: "동작구", score: 0.38, z3: 0.017, over1: 0.018, top10: 0.078, surge: 0.013, strong: 0.028, medium: 0.088 },
];

const dongData = [
  { name: "동소문동2가", score: 3.81, gu: "성북구" },
  { name: "동소문동1가", score: 1.49, gu: "성북구" },
  { name: "상산동5가", score: 1.15, gu: "성북구" },
  { name: "한강동3가", score: 1.13, gu: "용산구" },
  { name: "성북동", score: 0.75, gu: "성북구" },
];

const clusterData = [
  { name: "고평가\n지역형", fullName: "Cluster 0: 고평가 지역형", count: 45, ratio: 32.1, color: "#94A3B8", desc: "위험스코어 낮으나 전세가율 자체가 높음", strategy: "고전세율 거래 모니터링 강화" },
  { name: "극단\n고위험군", fullName: "Cluster 1: 극단 고위험군", count: 8, ratio: 5.7, color: "#DC2626", desc: "모든 지표에서 이상 수준, 소수 행정동", strategy: "집중관리구역 지정, 거래 전수조사" },
  { name: "불균형\n고위험군", fullName: "Cluster 2: 불균형 고위험군", count: 28, ratio: 20.0, color: "#F97316", desc: "전세가율은 낮지만 특정 지표 취약", strategy: "취약 지표별 맞춤 관리" },
  { name: "저위험\n안정군", fullName: "Cluster 3: 저위험 안정군", count: 59, ratio: 42.1, color: "#22C55E", desc: "다수 동 포함, 전반적 위험 낮음", strategy: "분기별 추세 모니터링" },
];

const matchingData = [
  { name: "1차\n구×유형(4)×분기×면적(4)", fail: 18.69 },
  { name: "2차\n구×유형(4)×반기×면적(3)", fail: 17.94 },
  { name: "최종\n구×유형(2)×반기×면적(3)", fail: 0.32 },
];

const radarDataGu = guData.map(g => ({
  name: g.name,
  "Z3+ 비율": +(g.z3 * 1000).toFixed(1),
  "전세가율1.0+": +(g.over1 * 1000).toFixed(1),
  "상위10%": +(g.top10 * 1000).toFixed(1),
  "급등비율": +(g.surge * 1000).toFixed(1),
}));

const COLORS = ["#1E293B", "#475569", "#64748B", "#94A3B8", "#CBD5E1"];

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "gu", label: "자치구 위험도" },
  { id: "dong", label: "행정동 위험도" },
  { id: "cluster", label: "리스크 유형" },
];

const StatCard = ({ label, value, sub, accent }) => (
  <div style={{
    background: accent ? "#1E293B" : "#F8FAFC",
    borderRadius: 12,
    padding: "20px 24px",
    flex: 1,
    minWidth: 160,
  }}>
    <div style={{ fontSize: 13, color: accent ? "#94A3B8" : "#64748B", marginBottom: 6, fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color: accent ? "#F8FAFC" : "#1E293B", lineHeight: 1.2 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: accent ? "#64748B" : "#94A3B8", marginTop: 4 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 20 }}>
    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", margin: 0 }}>{children}</h2>
    {sub && <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0" }}>{sub}</p>}
  </div>
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCluster, setSelectedCluster] = useState(null);

  return (
    <div style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#F1F5F9", minHeight: "100vh", padding: 0 }}>
      {/* Header */}
      <div style={{ background: "#1E293B", padding: "28px 32px 20px", color: "#F8FAFC" }}>
        <div style={{ fontSize: 12, color: "#64748B", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Seoul Jeonse Fraud Risk Detection</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>서울시 전세사기 고위험지역 탐지 대시보드</h1>
        <p style={{ fontSize: 13, color: "#94A3B8", margin: "6px 0 0" }}>국토교통부 실거래가 데이터 (2023.6 ~ 2024.12) · 전세 169,779건 기반</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, background: "#E2E8F0", borderBottom: "1px solid #CBD5E1" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? "#1E293B" : "#64748B",
              background: activeTab === tab.id ? "#F8FAFC" : "transparent",
              borderBottom: activeTab === tab.id ? "2px solid #1E293B" : "2px solid transparent",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "24px 28px", maxWidth: 960, margin: "0 auto" }}>

        {/* ===== OVERVIEW ===== */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
              <StatCard label="분석 대상 전세 거래" value="169,779건" sub="4개 주택유형 × 2개년" accent />
              <StatCard label="전세가율 매칭 성공률" value="99.68%" sub="0.32% 실패율" accent />
              <StatCard label="최고 위험 자치구" value="관악구" sub="종합위험지수 1.23" />
              <StatCard label="최고 위험 행정동" value="동소문동2가" sub="위험스코어 3.81" />
            </div>

            <SectionTitle sub="매칭 실패율을 최소화하기 위한 조건조합 3회 반복 실험">전세가율 매칭 최적화 과정</SectionTitle>
            <div style={{ background: "#fff", borderRadius: 12, padding: "20px 16px", marginBottom: 28 }}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={matchingData} layout="vertical" margin={{ left: 20, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" domain={[0, 22]} tick={{ fontSize: 12 }} unit="%" />
                  <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="fail" name="매칭 실패율" radius={[0, 6, 6, 0]}>
                    {matchingData.map((entry, i) => (
                      <Cell key={i} fill={i === 2 ? "#1E293B" : "#CBD5E1"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ textAlign: "center", fontSize: 13, color: "#64748B", marginTop: 8 }}>
                유형 4종→2종, 분기→반기, 면적 4구간→3구간 조정으로 <span style={{ fontWeight: 700, color: "#1E293B" }}>18.69% → 0.32%</span> 개선
              </div>
            </div>

            <SectionTitle>분석 파이프라인</SectionTitle>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {[
                { step: "①", title: "전처리", desc: "8개 파일 정제·통합" },
                { step: "②", title: "전세가율", desc: "집단평균매매가 매칭" },
                { step: "③", title: "이상탐지", desc: "Z-score 4개 지표" },
                { step: "④", title: "위험분석", desc: "자치구→행정동 2단계" },
                { step: "⑤", title: "유형화", desc: "KMeans k=4" },
              ].map((item, i) => (
                <div key={i} style={{ flex: 1, minWidth: 130, background: "#fff", borderRadius: 10, padding: "16px 14px", textAlign: "center", position: "relative" }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, marginBottom: 4 }}>{item.step}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{item.desc}</div>
                  {i < 4 && <div style={{ position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)", color: "#CBD5E1", fontSize: 16, fontWeight: 700 }}>→</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== 자치구 위험도 ===== */}
        {activeTab === "gu" && (
          <div>
            <SectionTitle sub="4개 위험지표 가중합 기반 종합위험지수">자치구별 종합위험지수 Top 5</SectionTitle>
            <div style={{ background: "#fff", borderRadius: 12, padding: "20px 16px", marginBottom: 28 }}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={guData} margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 1.5]} />
                  <Tooltip formatter={(v) => v.toFixed(2)} />
                  <Bar dataKey="score" name="종합위험지수" radius={[6, 6, 0, 0]}>
                    {guData.map((entry, i) => (
                      <Cell key={i} fill={i === 0 ? "#1E293B" : i < 3 ? "#64748B" : "#CBD5E1"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <SectionTitle sub="지표값 ×1000 스케일 (비교 용이성)">자치구별 위험지표 비교</SectionTitle>
            <div style={{ background: "#fff", borderRadius: 12, padding: "20px 16px", marginBottom: 28 }}>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarDataGu}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} />
                  {["Z3+ 비율", "전세가율1.0+", "상위10%", "급등비율"].map((key, i) => (
                    <Radar key={key} name={key} dataKey={key} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.15} strokeWidth={2} />
                  ))}
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <SectionTitle>위험 등급 기준</SectionTitle>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1, background: "#FEF2F2", borderRadius: 10, padding: "14px 16px", borderLeft: "4px solid #DC2626" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#DC2626" }}>강한 위험</div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>전세가율 ≥ 1.0 OR Z-score ≥ 3</div>
              </div>
              <div style={{ flex: 1, background: "#FFF7ED", borderRadius: 10, padding: "14px 16px", borderLeft: "4px solid #F97316" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#F97316" }}>중간 위험</div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>전세가율 ≥ 0.9 OR Z-score ≥ 2</div>
              </div>
            </div>
          </div>
        )}

        {/* ===== 행정동 위험도 ===== */}
        {activeTab === "dong" && (
          <div>
            <SectionTitle sub="상위 위험 자치구 내 거래건수 100건 이상 행정동 대상">행정동별 위험스코어 Top 5</SectionTitle>
            <div style={{ background: "#fff", borderRadius: 12, padding: "20px 16px", marginBottom: 28 }}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dongData} layout="vertical" margin={{ left: 10, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" domain={[0, 4.5]} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 13 }} />
                  <Tooltip formatter={(v) => v.toFixed(2)} />
                  <Bar dataKey="score" name="위험스코어" radius={[0, 6, 6, 0]}>
                    {dongData.map((entry, i) => (
                      <Cell key={i} fill={i === 0 ? "#DC2626" : i < 3 ? "#64748B" : "#CBD5E1"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <SectionTitle>핵심 인사이트</SectionTitle>
            <div style={{ background: "#fff", borderRadius: 12, padding: "24px", marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>⚠️</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1E293B" }}>동소문동2가 — 압도적 고위험</div>
                  <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>위험스코어 3.81로, 2위(동소문동1가 1.49) 대비 <b>약 2.6배</b></div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 16 }}>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.8 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#DC2626", marginRight: 8 }}></span>
                    Top 5 중 4개 행정동이 <b>성북구</b>에 집중 → 성북구 내 특정 지역에 위험이 편중
                  </div>
                  <div>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#64748B", marginRight: 8 }}></span>
                    한강동3가(용산구)는 자치구 종합위험지수는 낮지만 개별 행정동 위험은 높은 사례
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== 리스크 유형 ===== */}
        {activeTab === "cluster" && (
          <div>
            <SectionTitle sub="StandardScaler 정규화 + KMeans (k=4, Elbow Method)">KMeans 클러스터링 리스크 유형</SectionTitle>

            <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 300px", background: "#fff", borderRadius: 12, padding: "16px" }}>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={clusterData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      dataKey="count"
                      onClick={(_, i) => setSelectedCluster(i)}
                      style={{ cursor: "pointer" }}
                    >
                      {clusterData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.color}
                          stroke={selectedCluster === i ? "#1E293B" : "#fff"}
                          strokeWidth={selectedCluster === i ? 3 : 1}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, name, props) => [`${v}개 동 (${props.payload.ratio}%)`, props.payload.fullName]} />
                    <Legend
                      formatter={(value, entry) => (
                        <span style={{ fontSize: 11, color: "#475569" }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ textAlign: "center", fontSize: 12, color: "#94A3B8" }}>클릭하여 상세 보기</div>
              </div>

              <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 10 }}>
                {clusterData.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedCluster(i)}
                    style={{
                      background: selectedCluster === i ? "#F8FAFC" : "#fff",
                      borderRadius: 10,
                      padding: "14px 16px",
                      cursor: "pointer",
                      borderLeft: `4px solid ${c.color}`,
                      boxShadow: selectedCluster === i ? "0 0 0 1px #1E293B" : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{c.fullName}</span>
                      <span style={{ fontSize: 12, color: "#64748B" }}>{c.count}개 동 ({c.ratio}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedCluster !== null && (
              <div style={{
                background: "#fff",
                borderRadius: 12,
                padding: "24px",
                marginBottom: 28,
                borderLeft: `4px solid ${clusterData[selectedCluster].color}`,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E293B", margin: "0 0 12px" }}>
                  {clusterData[selectedCluster].fullName}
                </h3>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: "#1E293B" }}>특성: </span>
                    {clusterData[selectedCluster].desc}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, color: "#1E293B" }}>대응 전략: </span>
                    {clusterData[selectedCluster].strategy}
                  </div>
                </div>
              </div>
            )}

            <SectionTitle>입력 변수 (5개)</SectionTitle>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["동_강한위험비율", "동_급등비율", "동_평균대비초과율", "동_z3비율", "동_전세가율1초과비율"].map((v, i) => (
                <div key={i} style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontSize: 12,
                  color: "#475569",
                  fontWeight: 500,
                  border: "1px solid #E2E8F0",
                }}>
                  {v}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "20px 28px 32px", fontSize: 11, color: "#94A3B8" }}>
        데이터 출처: 국토교통부 부동산 실거래가 공개시스템 (2023.6 ~ 2024.12) · 통계 데이터 활용대회 참가 프로젝트
      </div>
    </div>
  );
}
