// 資料介面
export interface PivotDataItem {
  PartNum: string
  rev: string
  Layer: string
  ProcName: string
  MachineNo: string
  Done: string
}

// Pivot Table 資料
// 為了讓最右邊兩列（SMKIPW103K 和 SMKIPW104K）都顯示1，這些 MachineNo 的 Done 設為 "否"
// 其他 MachineNo 的 Done 設為 "是"，這樣 Count Done=否 會是0
export const pivotTableData: PivotDataItem[] = [
  // Layer: -Outer
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "-Outer",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW101K",
    Done: "是"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "-Outer",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW102K",
    Done: "是"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "-Outer",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW103K",
    Done: "否"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "-Outer",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW104K",
    Done: "否"
  },
  // Layer: -Inner
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "-Inner",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW101K",
    Done: "是"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "-Inner",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW102K",
    Done: "是"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "-Inner",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW103K",
    Done: "否"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "-Inner",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW104K",
    Done: "否"
  },
  // Layer: L1
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "L1",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW101K",
    Done: "是"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "L1",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW102K",
    Done: "是"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "L1",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW103K",
    Done: "否"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "L1",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW104K",
    Done: "否"
  },
  // Layer: L2
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "L2",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW101K",
    Done: "是"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "L2",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW102K",
    Done: "是"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "L2",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW103K",
    Done: "否"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "L2",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW104K",
    Done: "否"
  },
  // 額外資料以增加數據量
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "-Outer",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW101K",
    Done: "是"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "-Outer",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW102K",
    Done: "是"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "-Inner",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW101K",
    Done: "是"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "-Inner",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW102K",
    Done: "是"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "L1",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW101K",
    Done: "是"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "L1",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW102K",
    Done: "是"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "L2",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW101K",
    Done: "是"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "L2",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW102K",
    Done: "是"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "-Outer",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW103K",
    Done: "否"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "-Outer",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW104K",
    Done: "否"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "-Inner",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW103K",
    Done: "否"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "-Inner",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW104K",
    Done: "否"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "L1",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW103K",
    Done: "否"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "L1",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW104K",
    Done: "否"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "L2",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW103K",
    Done: "否"
  },
  {
    PartNum: "3262019A",
    rev: "TT",
    Layer: "L2",
    ProcName: "SMKIPW",
    MachineNo: "SMKIPW104K",
    Done: "否"
  }
]
