import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Initials from "../../shared/components/Initials";
import { coursesData, rosterData } from "../data/mockData";
import type { AttendanceStatus } from "../types";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface AttendanceSectionProps {
  selectedCourseId: number | null;
}

const AttendanceSection = ({ selectedCourseId }: AttendanceSectionProps) => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState(
    selectedCourseId ?? coursesData[0].id,
  );
  const [attendance, setAttendance] = useState<
    Record<number, AttendanceStatus>
  >(Object.fromEntries(rosterData.map((s) => [s.id, "present"])));

  const setStatus = (id: number, status: AttendanceStatus) =>
    setAttendance((prev) => ({ ...prev, [id]: status }));

  const statusColors: Record<AttendanceStatus, string> = {
    present: "bg-emerald-100 text-emerald-700 border-emerald-300",
    absent: "bg-destructive/10 text-destructive border-destructive/30",
    late: "bg-amber-100 text-amber-700 border-amber-300",
  };

  const exportToExcel = async () => {
    const courseName =
      coursesData.find((c) => c.id === selectedCourse)?.name || "Course";

    const today = new Date().toLocaleDateString("en-US");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance");

    // 🔷 Title Section
    worksheet.addRow([`Attendance Report`]);
    worksheet.addRow([]);
    worksheet.addRow(["Course:", courseName]);
    worksheet.addRow(["Date:", today]);
    worksheet.addRow([]);

    // 🔷 Header Row
    const headerRow = worksheet.addRow([
      "Student Name",
      "Student Email",
      "Status",
    ]);

    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    // Column widths
    worksheet.columns = [{ width: 25 }, { width: 30 }, { width: 15 }];

    // 🔷 Student Rows
    rosterData.forEach((student) => {
      const status = attendance[student.id];

      const row = worksheet.addRow([
        student.name,
        student.email,
        status.toUpperCase(),
      ]);

      // 🎨 Status Color Styling
      const statusCell = row.getCell(3);

      if (status === "present") {
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "C6EFCE" }, // Light green
        };
        statusCell.font = { color: { argb: "006100" }, bold: true };
      }

      if (status === "absent") {
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFC7CE" }, // Light red
        };
        statusCell.font = { color: { argb: "9C0006" }, bold: true };
      }

      if (status === "late") {
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFEB9C" }, // Light yellow
        };
        statusCell.font = { color: { argb: "9C6500" }, bold: true };
      }

      statusCell.alignment = { horizontal: "center" };
    });

    // 🔷 Summary Section
    worksheet.addRow([]);
    worksheet.addRow(["Summary"]);
    worksheet.getRow(worksheet.lastRow!.number).font = { bold: true };

    const presentCount = Object.values(attendance).filter(
      (s) => s === "present",
    ).length;
    const absentCount = Object.values(attendance).filter(
      (s) => s === "absent",
    ).length;
    const lateCount = Object.values(attendance).filter(
      (s) => s === "late",
    ).length;

    worksheet.addRow(["Present:", presentCount]);
    worksheet.addRow(["Absent:", absentCount]);
    worksheet.addRow(["Late:", lateCount]);
    worksheet.addRow(["Total Students:", rosterData.length]);

    // 🔷 Generate File
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `Attendance_${courseName.replace(/\s/g, "_")}_${today}.xlsx`);
  };

  useEffect(() => {
    if (selectedCourseId) {
      setSelectedCourse(selectedCourseId);
    }
  }, [selectedCourseId]);

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-foreground">
        Take <span className="text-gradient">Attendance</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Record student attendance for your sessions.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <label className="text-sm font-medium text-foreground">Course:</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(Number(e.target.value))}
          className="text-sm rounded-lg border border-border bg-card text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {coursesData.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground ml-auto">
          Today:{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="mt-6 rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <div className="grid grid-cols-[1fr_auto] gap-4 p-4 border-b border-border bg-secondary/30">
          <span className="text-sm font-semibold text-foreground">Student</span>
          <span className="text-sm font-semibold text-foreground">Status</span>
        </div>
        {rosterData.map((student, i) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-[1fr_auto] gap-4 items-center p-4 border-b border-border last:border-0 hover:bg-accent/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Initials name={student.name} />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {student.name}
                </p>
                <p className="text-xs text-muted-foreground">{student.email}</p>
              </div>
            </div>
            <div className="flex gap-1">
              {(["present", "absent", "late"] as AttendanceStatus[]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setStatus(student.id, status)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      attendance[student.id] === status
                        ? statusColors[status]
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ),
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant="hero"
          onClick={() => {
            exportToExcel();

            toast({
              title: "Attendance saved!",
              description: `Recorded for ${coursesData.find((c) => c.id === selectedCourse)?.name}.`,
            });
          }}
        >
          <Check className="w-4 h-4 mr-2" />
          Save Attendance
        </Button>
      </div>
    </>
  );
};

export default AttendanceSection;
