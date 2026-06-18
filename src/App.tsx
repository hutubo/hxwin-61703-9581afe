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

interface ImportRecord {
  孔号: string;
  深度段: string;
  岩土描述: string;
  N值: string;
  含水状态?: string;
  取样编号: string;
}

interface ValidatedRecord extends ImportRecord {
  _errors: string[];
  _valid: boolean;
}

type ImportState =
  | { status: "idle" }
  | { status: "parsing" }
  | { status: "preview"; records: ValidatedRecord[]; fileName: string }
  | { status: "error"; message: string };

interface QuickEntryRecord {
  id: string;
  孔号: string;
  取样深度: string;
  标贯击数: string;
  岩土层描述: string;
  备注: string;
  createdAt: number;
}

const QUICK_ENTRY_STORAGE_KEY = "hxwin_quick_entry_history";
const MAX_HISTORY_RECORDS = 20;

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

function ImportPreviewPanel({
  importState,
  onConfirm,
  onCancel,
}: {
  importState: ImportState;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (importState.status === "idle") return null;

  const isOpen = true;
  const isPreview = importState.status === "preview";
  const isError = importState.status === "error";
  const isParsing = importState.status === "parsing";

  const previewFields = ["孔号", "深度段", "岩土描述", "N值", "取样编号"];

  const validCount = isPreview ? importState.records.filter((r) => r._valid).length : 0;
  const invalidCount = isPreview ? importState.records.filter((r) => !r._valid).length : 0;

  return (
    <>
      <div
        className={"drawer-overlay " + (isOpen ? "show" : "")}
        onClick={onCancel}
      />
      <aside className={"drawer import-drawer " + (isOpen ? "show" : "")}>
        <div className="drawer-header">
          <div>
            <p className="drawer-eyebrow">数据导入</p>
            <h2 className="drawer-title">导入钻孔记录</h2>
            <p className="drawer-subtitle">
              {isPreview && `文件：${importState.fileName}`}
              {isParsing && "正在解析文件..."}
              {isError && "解析错误"}
            </p>
          </div>
          <button className="drawer-close" onClick={onCancel} aria-label="关闭">
            ×
          </button>
        </div>

        <div className="drawer-body">
          {isParsing && (
            <div className="import-loading">
              <div className="loading-spinner"></div>
              <p>正在解析JSON文件...</p>
            </div>
          )}

          {isError && (
            <section className="drawer-section">
              <div className="import-error">
                <div className="error-icon">!</div>
                <h3>解析失败</h3>
                <p>{importState.message}</p>
                <div className="actions">
                  <button className="primary" onClick={onCancel}>确定</button>
                </div>
              </div>
            </section>
          )}

          {isPreview && (
            <>
              <section className="drawer-section">
                <div className="import-summary">
                  <div className="summary-item summary-valid">
                    <span>有效记录</span>
                    <strong>{validCount} 条</strong>
                  </div>
                  <div className="summary-item summary-invalid">
                    <span>问题记录</span>
                    <strong>{invalidCount} 条</strong>
                  </div>
                  <div className="summary-item summary-total">
                    <span>总计</span>
                    <strong>{importState.records.length} 条</strong>
                  </div>
                </div>
                {invalidCount > 0 && (
                  <p className="import-warning">
                    ⚠️ 存在 {invalidCount} 条格式错误的记录，导入时将被自动忽略。请修正后重新导入。
                  </p>
                )}
              </section>

              <section className="drawer-section">
                <h3 className="drawer-section-title">数据预览</h3>
                <div className="import-table-wrapper">
                  <table className="drawer-table import-table">
                    <thead>
                      <tr>
                        <th style={{ width: "48px" }}>行号</th>
                        {previewFields.map((field) => (
                          <th key={field}>{field}</th>
                        ))}
                        <th>状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importState.records.map((record, index) => (
                        <tr
                          key={index}
                          className={!record._valid ? "row-error" : ""}
                        >
                          <td className="row-index">{index + 1}</td>
                          <td>{record.孔号 || <span className="missing-field">—</span>}</td>
                          <td>{record.深度段 || <span className="missing-field">—</span>}</td>
                          <td>{record.岩土描述 || <span className="missing-field">—</span>}</td>
                          <td>{record.N值 || <span className="missing-field">—</span>}</td>
                          <td>{record.取样编号 || <span className="missing-field">—</span>}</td>
                          <td>
                            {record._valid ? (
                              <span className="status-valid">✓ 正常</span>
                            ) : (
                              <div className="status-error">
                                <span>✗ 错误</span>
                                <div className="error-list">
                                  {record._errors.map((err, i) => (
                                    <div key={i}>• {err}</div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="drawer-section">
                <h3 className="drawer-section-title">导入说明</h3>
                <div className="import-instructions">
                  <p>支持的JSON格式：</p>
                  <pre>{`// 对象数组格式
[
  {
    "孔号": "ZK-01",
    "深度段": "0.0-3.8m",
    "岩土描述": "杂填土夹碎石",
    "N值": "4",
    "含水状态": "稍湿",
    "取样编号": "S01"
  }
]

// 或二维数组格式（与导出格式一致）
[
  ["ZK-01", "0.0-3.8m", "杂填土夹碎石", "4", "稍湿", "S01"]
]

// 或包含records字段
{ "records": [...] }`}</pre>
                </div>
              </section>

              <div className="import-actions">
                <button className="secondary" onClick={onCancel}>取消</button>
                <button
                  className="primary"
                  onClick={onConfirm}
                  disabled={validCount === 0}
                >
                  确认导入 {validCount > 0 && `(${validCount}条)`}
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

function QuickEntryHistoryPanel({
  open,
  onClose,
  history,
  onFillRecord,
  onClearHistory,
  onDeleteRecord,
  formatDateTime,
}: {
  open: boolean;
  onClose: () => void;
  history: QuickEntryRecord[];
  onFillRecord: (record: QuickEntryRecord) => void;
  onClearHistory: () => void;
  onDeleteRecord: (id: string, e: React.MouseEvent) => void;
  formatDateTime: (timestamp: number) => string;
}) {
  return (
    <>
      <div
        className={"drawer-overlay " + (open ? "show" : "")}
        onClick={onClose}
      />
      <aside className={"drawer history-drawer " + (open ? "show" : "")}>
        <div className="drawer-header">
          <div>
            <p className="drawer-eyebrow">录入历史</p>
            <h2 className="drawer-title">快速录入历史</h2>
            <p className="drawer-subtitle">
              共 {history.length} 条记录，最近录入的显示在最前面
            </p>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>

        <div className="drawer-body">
          <section className="drawer-section">
            <div className="history-actions">
              <button
                className="secondary"
                onClick={onClearHistory}
                disabled={history.length === 0}
              >
                🗑️ 清空历史
              </button>
              <p className="mini-note">点击记录可一键回填到表单继续编辑</p>
            </div>
          </section>

          {history.length === 0 ? (
            <div className="history-empty">
              <div className="empty-icon">📝</div>
              <h3>暂无历史记录</h3>
              <p>提交快速录入表单后，记录将保存在这里</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="history-card"
                  onClick={() => onFillRecord(record)}
                >
                  <div className="history-card-header">
                    <div className="history-card-title">
                      <span className="history-hole-id">{record.孔号 || "未填写孔号"}</span>
                      <span className="history-time">{formatDateTime(record.createdAt)}</span>
                    </div>
                    <button
                      className="history-delete-btn"
                      onClick={(e) => onDeleteRecord(record.id, e)}
                      title="删除此记录"
                    >
                      ×
                    </button>
                  </div>
                  <div className="history-card-body">
                    <div className="history-fields">
                      <div className="history-field">
                        <span className="field-label">取样深度</span>
                        <span className="field-value">{record.取样深度 || "—"}</span>
                      </div>
                      <div className="history-field">
                        <span className="field-label">标贯击数</span>
                        <span className="field-value">{record.标贯击数 || "—"}</span>
                      </div>
                      <div className="history-field">
                        <span className="field-label">岩土层描述</span>
                        <span className="field-value">{record.岩土层描述 || "—"}</span>
                      </div>
                    </div>
                    {record.备注 && (
                      <div className="history-remark">
                        <span className="field-label">备注</span>
                        <p>{record.备注}</p>
                      </div>
                    )}
                  </div>
                  <div className="history-card-footer">
                    <span className="fill-hint">点击回填 →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

const loadHistoryFromStorage = (): QuickEntryRecord[] => {
  try {
    const stored = localStorage.getItem(QUICK_ENTRY_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load quick entry history:", e);
  }
  return [];
};

const saveHistoryToStorage = (history: QuickEntryRecord[]) => {
  try {
    localStorage.setItem(QUICK_ENTRY_STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save quick entry history:", e);
  }
};

export default function App() {
  const [filter, setFilter] = useState<string>(project.filters[0]);
  const [selected, setSelected] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerHoleId, setDrawerHoleId] = useState<string | null>(null);
  const [drawerDepth, setDrawerDepth] = useState<string | undefined>(undefined);
  const [records, setRecords] = useState<readonly (readonly string[])[]>(project.records as readonly (readonly string[])[]);
  const [importState, setImportState] = useState<ImportState>({ status: "idle" });

  const [quickForm, setQuickForm] = useState({
    孔号: "",
    取样深度: "",
    标贯击数: "",
    岩土层描述: "",
    备注: "",
  });
  const [quickEntryHistory, setQuickEntryHistory] = useState<QuickEntryRecord[]>(loadHistoryFromStorage);
  const [historyPanelOpen, setHistoryPanelOpen] = useState(false);

  const visibleRecords = useMemo(() => {
    if (filter === project.filters[0]) return records;
    return records.filter((row) => row.join(" ").includes(filter));
  }, [filter, records]);
  const rows = visibleRecords.length ? visibleRecords : records;

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

  const validateRecord = (record: ImportRecord, index: number): ValidatedRecord => {
    const errors: string[] = [];

    if (!record.孔号 || typeof record.孔号 !== "string" || record.孔号.trim() === "") {
      errors.push("孔号不能为空");
    }
    if (!record.深度段 || typeof record.深度段 !== "string" || record.深度段.trim() === "") {
      errors.push("深度段不能为空");
    }
    if (!record.岩土描述 || typeof record.岩土描述 !== "string" || record.岩土描述.trim() === "") {
      errors.push("岩土描述不能为空");
    }
    if (record.N值 === undefined || record.N值 === null || record.N值 === "") {
      errors.push("N值不能为空");
    } else if (typeof record.N值 !== "string" && typeof record.N值 !== "number") {
      errors.push("N值格式不正确");
    }
    if (!record.取样编号 || typeof record.取样编号 !== "string" || record.取样编号.trim() === "") {
      errors.push("取样编号不能为空");
    }

    const depthRegex = /^\d+(\.\d+)?-\d+(\.\d+)?m?$/;
    if (record.深度段 && !depthRegex.test(record.深度段.replace(/\s/g, ""))) {
      errors.push("深度段格式应为\"0.0-3.8m\"");
    }

    return {
      ...record,
      N值: String(record.N值 ?? ""),
      含水状态: record.含水状态 ?? "",
      _errors: errors,
      _valid: errors.length === 0,
    };
  };

  const parseJsonFile = (file: File) => {
    setImportState({ status: "parsing" });

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let data = JSON.parse(content);

        if (!Array.isArray(data)) {
          if (data.records && Array.isArray(data.records)) {
            data = data.records;
          } else if (data.rows && Array.isArray(data.rows)) {
            data = data.rows;
          } else {
            setImportState({ status: "error", message: "JSON格式错误：根节点应为数组，或包含records/rows字段" });
            return;
          }
        }

        if (data.length === 0) {
          setImportState({ status: "error", message: "JSON文件为空数组" });
          return;
        }

        const validated = data.map((item: unknown, index: number) => {
          if (Array.isArray(item)) {
            const record: ImportRecord = {
              孔号: String(item[0] ?? ""),
              深度段: String(item[1] ?? ""),
              岩土描述: String(item[2] ?? ""),
              N值: String(item[3] ?? ""),
              含水状态: String(item[4] ?? ""),
              取样编号: String(item[5] ?? ""),
            };
            return validateRecord(record, index);
          } else if (typeof item === "object" && item !== null) {
            return validateRecord(item as ImportRecord, index);
          } else {
            return {
              孔号: "",
              深度段: "",
              岩土描述: "",
              N值: "",
              含水状态: "",
              取样编号: "",
              _errors: [`第${index + 1}行数据格式不正确`],
              _valid: false,
            } as ValidatedRecord;
          }
        });

        setImportState({ status: "preview", records: validated, fileName: file.name });
      } catch (err) {
        setImportState({ status: "error", message: `JSON解析失败：${(err as Error).message}` });
      }
    };

    reader.onerror = () => {
      setImportState({ status: "error", message: "文件读取失败" });
    };

    reader.readAsText(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseJsonFile(file);
    }
    e.target.value = "";
  };

  const confirmImport = () => {
    if (importState.status !== "preview") return;

    const validRecords = importState.records
      .filter((r) => r._valid)
      .map((r) => [r.孔号, r.深度段, r.岩土描述, r.N值, r.含水状态 || "", r.取样编号] as readonly string[]);

    setRecords(validRecords);
    setImportState({ status: "idle" });
    setSelected(0);
  };

  const cancelImport = () => {
    setImportState({ status: "idle" });
  };

  const handleQuickFormChange = (field: keyof typeof quickForm, value: string) => {
    setQuickForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuickFormSubmit = () => {
    const hasContent = Object.values(quickForm).some((v) => v.trim() !== "");
    if (!hasContent) return;

    const newRecord: QuickEntryRecord = {
      id: Date.now().toString(),
      孔号: quickForm.孔号,
      取样深度: quickForm.取样深度,
      标贯击数: quickForm.标贯击数,
      岩土层描述: quickForm.岩土层描述,
      备注: quickForm.备注,
      createdAt: Date.now(),
    };

    const updatedHistory = [newRecord, ...quickEntryHistory].slice(0, MAX_HISTORY_RECORDS);
    setQuickEntryHistory(updatedHistory);
    saveHistoryToStorage(updatedHistory);

    setQuickForm({
      孔号: "",
      取样深度: "",
      标贯击数: "",
      岩土层描述: "",
      备注: "",
    });
  };

  const handleFillRecord = (record: QuickEntryRecord) => {
    setQuickForm({
      孔号: record.孔号,
      取样深度: record.取样深度,
      标贯击数: record.标贯击数,
      岩土层描述: record.岩土层描述,
      备注: record.备注,
    });
    setHistoryPanelOpen(false);
  };

  const handleClearHistory = () => {
    if (quickEntryHistory.length === 0) return;
    if (window.confirm("确定要清空所有历史记录吗？此操作不可撤销。")) {
      setQuickEntryHistory([]);
      saveHistoryToStorage([]);
    }
  };

  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistory = quickEntryHistory.filter((r) => r.id !== id);
    setQuickEntryHistory(updatedHistory);
    saveHistoryToStorage(updatedHistory);
  };

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${month}-${day} ${hours}:${minutes}`;
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
            <div className="panel-header">
              <h2>快速录入</h2>
              <button
                className="history-toggle-btn"
                onClick={() => setHistoryPanelOpen(true)}
                title="查看历史记录"
              >
                📋 历史
                {quickEntryHistory.length > 0 && (
                  <span className="history-badge">{quickEntryHistory.length}</span>
                )}
              </button>
            </div>
            <div className="form-grid">
              {project.form.map((field) => (
                <label key={field}>
                  {field}
                  <input
                    placeholder={"填写" + field}
                    value={quickForm[field as keyof typeof quickForm]}
                    onChange={(e) => handleQuickFormChange(field as keyof typeof quickForm, e.target.value)}
                  />
                </label>
              ))}
              <textarea
                placeholder="补充专业备注"
                value={quickForm.备注}
                onChange={(e) => handleQuickFormChange("备注", e.target.value)}
              />
            </div>
            <div className="actions">
              <button className="primary" onClick={handleQuickFormSubmit}>保存记录</button>
              <button className="secondary">导出JSON</button>
            </div>
            <div className="import-section">
              <label className="import-label">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
                <span className="import-btn">📥 导入JSON</span>
              </label>
              <p className="mini-note">选择本地JSON文件，预览并导入钻孔记录数据。</p>
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

      <ImportPreviewPanel
        importState={importState}
        onConfirm={confirmImport}
        onCancel={cancelImport}
      />

      <QuickEntryHistoryPanel
        open={historyPanelOpen}
        onClose={() => setHistoryPanelOpen(false)}
        history={quickEntryHistory}
        onFillRecord={handleFillRecord}
        onClearHistory={handleClearHistory}
        onDeleteRecord={handleDeleteRecord}
        formatDateTime={formatDateTime}
      />
    </main>
  );
}
