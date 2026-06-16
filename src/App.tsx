import { useMemo, useState, type CSSProperties } from "react";
import "./styles.css";

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

export default function App() {
  const [filter, setFilter] = useState<string>(project.filters[0]);
  const [selected, setSelected] = useState(0);
  const visibleRecords = useMemo(() => {
    if (filter === project.filters[0]) return project.records;
    return project.records.filter((row) => row.join(" ").includes(filter));
  }, [filter]);
  const rows = visibleRecords.length ? visibleRecords : project.records;

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
                  <tr className={selected === index ? "selected" : ""} key={row.join("-")} onClick={() => setSelected(index)}>
                    {row.map((cell) => <td key={cell}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
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
    </main>
  );
}
