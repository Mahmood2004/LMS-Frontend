import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import InstructorAnnouncementServices, {
  Announcement,
} from "@/services/instructor/announcementService";

const AnnouncementSection = () => {
  const { toast } = useToast();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [expandedAnnouncements, setExpandedAnnouncements] = useState<string[]>(
    [],
  );
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    message: "",
  });

  const handlePostAnnouncement = async () => {
    if (!form.title || !form.message) {
      toast({
        title: "Missing fields",
        description: "Title and message are required.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    try {
      setSubmitting(true);

      const res = await InstructorAnnouncementServices.createAnnouncement({
        title: form.title,
        message: form.message,
      });

      const newAnnouncement: Announcement = {
        announcement_id: res.announcement_id,
        title: form.title,
        message: form.message,
        created_at: new Date().toISOString(),
      };

      setAnnouncements((prev) => [newAnnouncement, ...prev]);

      setForm({
        title: "",
        message: "",
      });

      toast({
        title: "Announcement posted!",
        duration: 2000,
      });
    } catch (err) {
      console.error(err);

      toast({
        title: "Failed to post announcement",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await InstructorAnnouncementServices.deleteAnnouncement(id);

      setAnnouncements((prev) => prev.filter((a) => a.announcement_id !== id));

      toast({
        title: "Announcement deleted",
        duration: 2000,
      });
    } catch (err) {
      console.error(err);

      toast({
        title: "Failed to delete announcement",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-foreground">
        Announcements <span className="text-gradient">& Updates</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Post announcements for your students.
      </p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 p-7 rounded-2xl bg-card border border-border shadow-card space-y-5"
      >
        {/* Announcement form */}
        <h2 className="text-lg font-semibold font-display text-foreground">
          Post Announcement
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Announcement title..."
              className="mt-1"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Message
            </label>
            <Textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write your announcement..."
              className="mt-1"
            />
          </div>
        </div>

        <Button
          variant="hero"
          onClick={handlePostAnnouncement}
          disabled={submitting}
          className="gap-2"
        >
          <Send className="w-4 h-4" />
          {submitting ? "Posting..." : "Post Announcement"}
        </Button>

        {announcements.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <ClipboardCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No announcements found.</p>
          </div>
        ) : (
          announcements
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )
            .map((announcement) => (
              <div
                key={announcement.announcement_id}
                className="p-5 rounded-xl bg-accent/20 border border-border"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground">
                      {announcement.title}
                    </div>

                    <div className="text-xs text-muted-foreground mt-1">
                      Posted{" "}
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </div>

                    {(() => {
                      const isExpanded = expandedAnnouncements.includes(
                        announcement.announcement_id,
                      );

                      return (
                        <>
                          <p
                            className={`text-sm text-muted-foreground mt-3 break-words whitespace-pre-line ${
                              !isExpanded ? "line-clamp-2" : ""
                            }`}
                          >
                            {announcement.message}
                          </p>

                          {announcement.message.length > 120 && (
                            <button
                              className="text-xs text-primary mt-1 hover:underline"
                              onClick={() =>
                                setExpandedAnnouncements((prev) =>
                                  isExpanded
                                    ? prev.filter(
                                        (id) =>
                                          id !== announcement.announcement_id,
                                      )
                                    : [...prev, announcement.announcement_id],
                                )
                              }
                            >
                              {isExpanded ? "View Less" : "View More"}
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  <Button
                    size="icon"
                    variant="destructive"
                    className="shrink-0"
                    onClick={() => {
                      handleDeleteAnnouncement(announcement.announcement_id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
        )}
      </motion.div>
    </>
  );
};

export default AnnouncementSection;
