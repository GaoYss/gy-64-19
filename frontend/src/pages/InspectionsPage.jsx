import { useMemo, useState } from "react";

import { DataTable } from "../components/DataTable.jsx";
import { RecordForm } from "../components/RecordForm.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { useAppData } from "../context/AppContext.jsx";
import { inspectionFields } from "../modules/forms.js";

const columns = [
  { key: "project_name", label: "Project" },
  { key: "inspection_type", label: "Type" },
  { key: "scheduled_date", label: "Date" },
  { key: "inspector", label: "Inspector" },
  { key: "result", label: "Result", render: (row) => <StatusBadge value={row.result} /> },
  { key: "issues", label: "Issues" },
];

export function InspectionsPage() {
  const { inspections, createRecord } = useAppData();
  const [searchProject, setSearchProject] = useState("");

  const filteredInspections = useMemo(() => {
    if (!searchProject.trim()) {
      return inspections;
    }
    const keyword = searchProject.toLowerCase().trim();
    return inspections.filter((item) =>
      item.project_name.toLowerCase().includes(keyword),
    );
  }, [inspections, searchProject]);

  return (
    <div className="page-stack">
      <RecordForm
        title="Schedule acceptance"
        fields={inspectionFields}
        onSubmit={(payload) => createRecord("inspections", payload)}
      />
      <section className="panel">
        <div className="section-heading">
          <h2>Acceptance Management</h2>
          <span>{filteredInspections.filter((item) => item.result !== "passed").length} need attention</span>
        </div>
        <div style={{ marginBottom: 14, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div className="field" style={{ minWidth: 280, margin: 0 }}>
            <input
              type="text"
              placeholder="Search by project name..."
              value={searchProject}
              onChange={(e) => setSearchProject(e.target.value)}
              style={{ minHeight: 40 }}
            />
          </div>
          {searchProject && (
            <button
              type="button"
              onClick={() => setSearchProject("")}
              style={{
                border: "1px solid #d6dee3",
                borderRadius: 8,
                background: "#ffffff",
                color: "#61717d",
                minHeight: 40,
                padding: "0 14px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          )}
          <span style={{ marginLeft: "auto", color: "#61717d", fontSize: 13 }}>
            {filteredInspections.length} of {inspections.length} records
          </span>
        </div>
        <DataTable columns={columns} rows={filteredInspections} />
      </section>
    </div>
  );
}
