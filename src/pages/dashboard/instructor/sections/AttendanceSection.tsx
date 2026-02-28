import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Initials from "../../shared/components/Initials";
import { coursesData, rosterData } from "../data/mockData";
import type { AttendanceStatus } from "../types";

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
          onClick={() =>
            toast({
              title: "Attendance saved!",
              description: `Recorded for ${selectedCourse}.`,
            })
          }
        >
          <Check className="w-4 h-4 mr-2" />
          Save Attendance
        </Button>
      </div>
    </>
  );
};

export default AttendanceSection;
