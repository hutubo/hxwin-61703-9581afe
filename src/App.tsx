import { useMemo, useState, type CSSProperties } from "react";
import "./styles.css";

interface BoreholeDetail {
  holeId: string;
  basicInfo: {
    location: string;
    holeDepth: string;
    holeDiameter: string;
    startDate: string;
    endDate: string;
    driller: string;
    elevation: string;
    coordinate: string;
  };
  layers: {
    depth: string;
    soilType: string;
    description: string;
    thickness: string;
  }[];
  sptRecords: {
    depth: string;
    n1: string;
    n2: string;
    n3: string;
    total: string;
  }[];
  samples: {
    sampleId: string;
    depth: string;
    type: string;
    container: string;
  }[];
  groundwater: {
    firstSeenDepth: string;
    stableDepth: string;
    measureDate: string;
    waterType: string;
    remark: string;
  };
}

const boreholeDetails: Record<string, BoreholeDetail> = {
  "ZK-01": {
    holeId: "ZK-01",
    basicInfo: {
      location: "场地东北角",
      holeDepth: "25.0m",
      holeDiameter: "130mm",
      startDate: "2025-05-12",
      endDate: "2025-05-14",
      driller: "王建国",
      elevation: "32.85m",
      coordinate: "X: 32560.12, Y: 18942.88"
    },
    layers: [
      { depth: "0.0-3.8m", soilType: "杂填土", description: "灰褐色，稍湿，松散，含碎石、砖块等建筑垃圾，层厚不均。", thickness: "3.8m" },
      { depth: "3.8-12.6m", soilType: "粉质黏土", description: "黄褐色，可塑状，含少量铁锰氧化物，切面稍有光泽，干强度中等。", thickness: "8.8m" },
      { depth: "12.6-18.2m", soilType: "粉砂", description: "青灰色，饱和，中密状，矿物成分以石英、长石为主，含少量黏粒。", thickness: "5.6m" },
      { depth: "18.2-25.0m", soilType: "强风化花岗岩", description: "褐黄色，岩石风化强烈，原岩结构可辨，岩芯呈碎块状，手捏易碎。", thickness: "6.8m" }
    ],
    sptRecords: [
      { depth: "2.0m", n1: "2", n2: "1", n3: "1", total: "4" },
      { depth: "6.0m", n1: "4", n2: "4", n3: "3", total: "11" },
      { depth: "10.0m", n1: "5", n2: "4", n3: "5", total: "14" },
      { depth: "15.0m", n1: "10", n2: "9", n3: "10", total: "29" },
      { depth: "22.0m", n1: ">50", n2: ">50", n3: "-", total: ">50" }
    ],
    samples: [
      { sampleId: "S01", depth: "1.5-2.0m", type: "扰动样", container: "土样袋" },
      { sampleId: "S05", depth: "8.0-8.5m", type: "原状样", container: "取土器" },
      { sampleId: "S08", depth: "14.0-14.5m", type: "砂样", container: "砂样筒" },
      { sampleId: "S11", depth: "20.0-20.5m", type: "岩样", container: "岩芯箱" }
    ],
    groundwater: {
      firstSeenDepth: "5.2m",
      stableDepth: "6.8m",
      measureDate: "2025-05-16",
      waterType: "孔隙潜水",
      remark: "水位受季节性影响明显，丰水期水位上升约1.2m。"
    }
  },
  "ZK-02": {
    holeId: "ZK-02",
    basicInfo: {
      location: "场地中部",
      holeDepth: "30.0m",
      holeDiameter: "130mm",
      startDate: "2025-05-13",
      endDate: "2025-05-15",
      driller: "李明华",
      elevation: "32.42m",
      coordinate: "X: 32520.45, Y: 18900.30"
    },
    layers: [
      { depth: "0.0-2.5m", soilType: "素填土", description: "黄褐色，稍湿，松散，以黏性土为主，含少量植物根系。", thickness: "2.5m" },
      { depth: "2.5-9.8m", soilType: "粉质黏土", description: "灰褐色，可塑状，含少量有机质，有腥味，切面光滑。", thickness: "7.3m" },
      { depth: "9.8-12.6m", soilType: "粉土", description: "灰黄色，稍密，湿，摇震反应中等，无光泽反应。", thickness: "2.8m" },
      { depth: "12.6-24.0m", soilType: "中砂", description: "青灰色，饱和，密实，矿物成分以石英为主，分选性较好。", thickness: "11.4m" },
      { depth: "24.0-30.0m", soilType: "强风化片麻岩", description: "灰绿色，风化强烈，岩芯呈砂土状，原岩结构模糊。", thickness: "6.0m" }
    ],
    sptRecords: [
      { depth: "5.0m", n1: "3", n2: "4", n3: "4", total: "11" },
      { depth: "11.0m", n1: "7", n2: "8", n3: "7", total: "22" },
      { depth: "16.0m", n1: "9", n2: "10", n3: "9", total: "28" },
      { depth: "20.0m", n1: "11", n2: "10", n3: "11", total: "32" },
      { depth: "27.0m", n1: ">50", n2: ">50", n3: "-", total: ">50" }
    ],
    samples: [
      { sampleId: "S03", depth: "4.0-4.5m", type: "原状样", container: "取土器" },
      { sampleId: "S07", depth: "10.5-11.0m", type: "扰动样", container: "土样袋" },
      { sampleId: "S12", depth: "18.0-18.5m", type: "砂样", container: "砂样筒" },
      { sampleId: "S15", depth: "26.0-26.5m", type: "岩样", container: "岩芯箱" }
    ],
    groundwater: {
      firstSeenDepth: "4.8m",
      stableDepth: "6.2m",
      measureDate: "2025-05-17",
      waterType: "孔隙潜水",
      remark: "砂层中水量丰富，钻进过程中有轻微塌孔现象。"
    }
  }
};

const project = {
  "id": "hxwin-61703",
  "port": 61703,
  "framework": "react",
  "title": "岩土勘察孔位记录",
  "subtitle": "钻孔日志、标贯击数、地下水位与纵向土层剖面。",
  "stack": "React + Vite + TypeScript",
  "accent": "#4f6d3b",
  "filters": [
    "全部",
    "粉质黏土",
    "砂层",
    "强风化",
    "需补样"
  ],
  "metrics": [
    [
      "钻孔总数",
      "12孔"
    ],
    [
      "平均孔深",
      "28.6m"
    ],
    [
      "地下水位",
      "6.4m"
    ],
    [
      "待复核样品",
      "7件"
    ]
  ],
  "fields": [
    "孔号",
    "深度段",
    "岩土描述",
    "N值",
    "含水状态",
    "取样编号"
  ],
  "records": [
    [
      "ZK-01",
      "0.0-3.8m",
      "杂填土夹碎石",
      "4",
      "稍湿",
      "S01"
    ],
    [
      "ZK-01",
      "3.8-12.6m",
      "粉质黏土",
      "11",
      "湿",
      "S05"
    ],
    [
      "ZK-02",
      "12.6-24.0m",
      "中砂层",
      "28",
      "饱和",
      "S12"
    ]
  ],
  "details": [
    [
      "剖面联动",
      "表格选中深度段后，剖面图同步高亮对应土层。"
    ],
    [
      "标贯记录",
      "N值、取样深度和岩性描述放在同一行便于现场补录。"
    ],
    [
      "专业备注",
      "支持记录地下水初见水位、稳定水位和异常钻进情况。"
    ]
  ],
  "chart": [
    18,
    36,
    62,
    84,
    100
  ],
  "form": [
    "孔号",
    "取样深度",
    "标贯击数",
    "岩土层描述"
  ]
} as const;

function BoreholeDrawer({
  open,
  onClose,
  holeId,
  highlightDepth,
}: {
  open: boolean;
  onClose: () => void;
  holeId: string | null;
  highlightDepth?: string;
}) {
  if (!holeId) return null;
  const detail = boreholeDetails[holeId];
  if (!detail) return null;

  return (
    <>
      <div
        className={"drawer-overlay " + (open ? "show" : "")}
        onClick={onClose}
      />
      <aside className={"drawer " + (open ? "show" : "")}>
        <div className="drawer-header">
          <div>
            <p className="drawer-eyebrow">钻孔详情</p>
            <h2 className="drawer-title">{detail.holeId}</h2>
            <p className="drawer-subtitle">{detail.basicInfo.location} · 孔深 {detail.basicInfo.holeDepth}</p>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>

        <div className="drawer-body">
          <section className="drawer-section">
            <h3 className="drawer-section-title">基础信息</h3>
            <div className="info-grid">
              <div className="info-item">
                <span>孔位位置</span>
                <strong>{detail.basicInfo.location}</strong>
              </div>
              <div className="info-item">
                <span>钻孔深度</span>
                <strong>{detail.basicInfo.holeDepth}</strong>
              </div>
              <div className="info-item">
                <span>孔径</span>
                <strong>{detail.basicInfo.holeDiameter}</strong>
              </div>
              <div className="info-item">
                <span>孔口高程</span>
                <strong>{detail.basicInfo.elevation}</strong>
              </div>
              <div className="info-item">
                <span>开钻日期</span>
                <strong>{detail.basicInfo.startDate}</strong>
              </div>
              <div className="info-item">
                <span>终孔日期</span>
                <strong>{detail.basicInfo.endDate}</strong>
              </div>
              <div className="info-item">
                <span>钻机机长</span>
                <strong>{detail.basicInfo.driller}</strong>
              </div>
              <div className="info-item">
                <span>坐标</span>
                <strong>{detail.basicInfo.coordinate}</strong>
              </div>
            </div>
          </section>

          <section className="drawer-section">
            <h3 className="drawer-section-title">分层记录</h3>
            <table className="drawer-table">
              <thead>
                <tr>
                  <th>深度段</th>
                  <th>岩土层</th>
                  <th>层厚</th>
                  <th>描述</th>
                </tr>
              </thead>
              <tbody>
                {detail.layers.map((layer) => (
                  <tr
                    key={layer.depth}
                    className={highlightDepth === layer.depth ? "row-highlight" : ""}
                  >
                    <td className="depth-cell">{layer.depth}</td>
                    <td>{layer.soilType}</td>
                    <td>{layer.thickness}</td>
                    <td className="desc-cell">{layer.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="drawer-section">
            <h3 className="drawer-section-title">标贯击数</h3>
            <table className="drawer-table spt-table">
              <thead>
                <tr>
                  <th>试验深度</th>
                  <th>第一击(N1)</th>
                  <th>第二击(N2)</th>
                  <th>第三击(N3)</th>
                  <th>累计N值</th>
                </tr>
              </thead>
              <tbody>
                {detail.sptRecords.map((spt) => (
                  <tr key={spt.depth}>
                    <td className="depth-cell">{spt.depth}</td>
                    <td>{spt.n1}</td>
                    <td>{spt.n2}</td>
                    <td>{spt.n3}</td>
                    <td className="n-value">{spt.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="drawer-section">
            <h3 className="drawer-section-title">取样编号</h3>
            <div className="sample-grid">
              {detail.samples.map((sample) => (
                <div className="sample-card" key={sample.sampleId}>
                  <div className="sample-id">{sample.sampleId}</div>
                  <div className="sample-meta">
                    <span>取样深度：{sample.depth}</span>
                    <span>样品类型：{sample.type}</span>
                    <span>盛装方式：{sample.container}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="drawer-section">
            <h3 className="drawer-section-title">地下水位摘要</h3>
            <div className="gw-summary">
              <div className="gw-item">
                <span className="gw-label">初见水位</span>
                <strong className="gw-value">{detail.groundwater.firstSeenDepth}</strong>
              </div>
              <div className="gw-item">
                <span className="gw-label">稳定水位</span>
                <strong className="gw-value">{detail.groundwater.stableDepth}</strong>
              </div>
              <div className="gw-item">
                <span className="gw-label">量测日期</span>
                <strong className="gw-value">{detail.groundwater.measureDate}</strong>
              </div>
              <div className="gw-item gw-full">
                <span className="gw-label">地下水类型</span>
                <strong className="gw-value">{detail.groundwater.waterType}</strong>
              </div>
              <div className="gw-item gw-full">
                <span className="gw-label">备注</span>
                <p className="gw-remark">{detail.groundwater.remark}</p>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}

export default function App() {
  const [filter, setFilter] = useState<string>(project.filters[0]);
  const [selected, setSelected] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerHoleId, setDrawerHoleId] = useState<string | null>(null);
  const [drawerDepth, setDrawerDepth] = useState<string | undefined>(undefined);

  const visibleRecords = useMemo(() => {
    if (filter === project.filters[0]) return project.records;
    return project.records.filter((row) => row.join(" ").includes(filter));
  }, [filter]);
  const rows = visibleRecords.length ? visibleRecords : project.records;

  const openDrawerFromRow = (row: readonly string[]) => {
    const holeId = row[0];
    const depth = row[1];
    setDrawerHoleId(holeId);
    setDrawerDepth(depth);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <main className="app-shell" style={{ "--accent": project.accent } as CSSProperties}>
      <header className="topbar">
        <div>
          <p className="eyebrow">{project.stack}</p>
          <h1>{project.title}</h1>
          <p className="subtitle">{project.subtitle}</p>
        </div>
        <div className="port-card">
          <span>本地开发端口</span>
          <strong>{project.port}</strong>
          <span>{project.id}</span>
        </div>
      </header>

      <section className="workspace">
        <div>
          <div className="metric-grid">
            {project.metrics.map(([label, value]) => (
              <article className="metric" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>

          <section className="panel">
            <h2>专业记录列表</h2>
            <div className="filters">
              {project.filters.map((item) => (
                <button className={"chip " + (filter === item ? "active" : "")} key={item} onClick={() => setFilter(item)}>
                  {item}
                </button>
              ))}
            </div>
            <table className="data-table">
              <thead>
                <tr>{project.fields.map((field) => <th key={field}>{field}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    className={selected === index ? "selected" : ""}
                    key={row.join("-")}
                    onClick={() => setSelected(index)}
                  >
                    {row.map((cell, cellIndex) => {
                      const isClickable = cellIndex === 0 || cellIndex === 1;
                      return (
                        <td
                          key={cell}
                          className={isClickable ? "clickable-cell" : ""}
                          onClick={(e) => {
                            if (isClickable) {
                              e.stopPropagation();
                              openDrawerFromRow(row);
                            }
                          }}
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mini-note">点击"孔号"或"深度段"可查看该钻孔的完整详情。</p>
          </section>

          <section className="panel">
            <h2>指标趋势</h2>
            <div className="chart" aria-label="指标趋势图">
              {project.chart.map((value, index) => (
                <div className="bar" style={{ height: value + "%" }} key={index}>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <p className="mini-note">图表使用前端mock数据展示关键指标变化，适合作为后续接口联调的UI骨架。</p>
          </section>
        </div>

        <aside>
          <section className="panel">
            <h2>详情工作区</h2>
            <div className="detail-list">
              {project.details.map(([title, text]) => (
                <div className="detail-item" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2>快速录入</h2>
            <div className="form-grid">
              {project.form.map((field) => (
                <label key={field}>{field}<input placeholder={"填写" + field} /></label>
              ))}
              <textarea placeholder="补充专业备注" />
            </div>
            <div className="actions">
              <button className="primary">保存记录</button>
              <button className="secondary">导出JSON</button>
            </div>
          </section>
        </aside>
      </section>

      <BoreholeDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        holeId={drawerHoleId}
        highlightDepth={drawerDepth}
      />
    </main>
  );
}
