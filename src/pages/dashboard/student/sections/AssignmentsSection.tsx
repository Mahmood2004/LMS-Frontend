import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCheck, Clock, Paperclip, Send, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import StatusBadge from "../../shared/components/StatusBadge";
import StarDisplay from "../../shared/components/StarDisplay";
import { assignmentsData } from "../data/mockData";
import type { AssignmentStatus } from "../types";

const AssignmentsSection = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"assignment" | "project">(
    "assignment",
  );
  const [attachedFiles, setAttachedFiles] = useState<
    Record<number, File | null>
  >({});
  const [submitTexts, setSubmitTexts] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submittedIds, setSubmittedIds] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const items = assignmentsData.filter((a) => a.type === activeTab);

  const handleSubmit = (id: number) => {
    const file = attachedFiles[id];
    const description = submitTexts[id] ?? "";

    if (!file) {
      toast({
        title: "No file attached",
        description: "Please attach a file first.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    setSubmittedIds((prev) => [...prev, id]);
    setSubmitting(null);

    setAttachedFiles((prev) => ({ ...prev, [id]: null }));
    setSubmitTexts((prev) => ({ ...prev, [id]: "" }));

    toast({
      title: "Submitted!",
      description: `Your file "${file.name}" has been submitted successfully.`,
      duration: 2000,
    });
  };

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
        Assignments <span className="text-gradient">& Projects</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Submit your work and track your grades.
      </p>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 p-1 bg-secondary rounded-xl w-fit">
        {(["assignment", "project"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-card text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "assignment" ? "Assignments" : "Projects"}
          </button>
        ))}
      </div>

      {/* Hidden file input for dropzone */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.zip"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file)
            toast({
              title: "File selected",
              description: file.name,
              duration: 2000,
            });
        }}
      />

      <div className="mt-6 space-y-4">
        {items.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <ClipboardCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Nothing here yet.</p>
          </div>
        )}
        {items.map((a) => {
          const isLocallySubmitted = submittedIds.includes(a.id);
          const effectiveStatus: AssignmentStatus = isLocallySubmitted
            ? "submitted"
            : a.status;
          return (
            <motion.div
              key={a.id}
              layout
              className="rounded-xl bg-card border border-border shadow-card overflow-hidden"
            >
              <div className="p-4 sm:p-5 flex flex-wrap items-start gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground">{a.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {a.course}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Due {a.due}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <StatusBadge status={effectiveStatus} />
                  {effectiveStatus === "pending" && (
                    <Button
                      size="sm"
                      variant="hero"
                      onClick={() =>
                        setSubmitting(submitting === a.id ? null : a.id)
                      }
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </div>

              {/* Inline submission form */}
              <AnimatePresence>
                {submitting === a.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="p-4 sm:p-6 space-y-4 bg-accent/20">
                      {/* Dropzone */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragging(false);
                          const file = e.dataTransfer.files[0];
                          if (file)
                            setAttachedFiles((prev) => ({
                              ...prev,
                              [a.id]: file,
                            }));
                          toast({
                            title: "File attached",
                            description: file.name,
                            duration: 2000,
                          });
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-colors cursor-pointer ${
                          dragging
                            ? "border-primary bg-accent/50"
                            : attachedFiles[a.id]
                              ? "border-emerald-400 bg-emerald-50"
                              : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                        {attachedFiles[a.id] ? (
                          <>
                            <p className="text-sm font-medium text-foreground">
                              <span className="flex items-center gap-2 justify-center">
                                <Paperclip className="w-6 h-6 text-muted-foreground" />
                                {attachedFiles[a.id].name}
                              </span>
                            </p>
                            <p
                              className="text-xs text-muted-foreground underline cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAttachedFiles((prev) => ({
                                  ...prev,
                                  [a.id]: null,
                                }));
                              }}
                            >
                              Remove file
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-foreground">
                              Drop your file here or{" "}
                              <span className="text-primary">browse</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PDF, DOCX, ZIP up to 20MB
                            </p>
                          </>
                        )}
                      </div>
                      {/* Hidden file input */}
                      <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAttachedFiles((prev) => ({
                              ...prev,
                              [a.id]: file,
                            }));
                            toast({
                              title: "File attached",
                              description: file.name,
                              duration: 2000,
                            });
                          }
                        }}
                      />
                      {/* Text area */}
                      <Textarea
                        placeholder="Add a note or description for your submission..."
                        value={submitTexts[a.id] ?? ""}
                        onChange={(e) =>
                          setSubmitTexts((prev) => ({
                            ...prev,
                            [a.id]: e.target.value,
                          }))
                        }
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSubmitting(null);
                            setAttachedFiles((prev) => ({
                              ...prev,
                              [a.id]: null,
                            }));
                            setSubmitTexts((prev) => ({
                              ...prev,
                              [a.id]: "",
                            }));
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="hero"
                          size="sm"
                          onClick={() => handleSubmit(a.id)}
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" /> Submit
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Graded feedback */}
              {effectiveStatus === "graded" && (
                <div className="p-4 sm:p-5 border-t border-border bg-emerald-50/50">
                  <div className="flex items-center gap-4 mb-2">
                    <StarDisplay rating={a.rating ?? 0} />
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "{a.feedback}"
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </>
  );
};

export default AssignmentsSection;
