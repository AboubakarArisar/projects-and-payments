import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FiArrowLeft, FiPlus, FiTrash2, FiInfo } from "react-icons/fi";
import axios from "axios";
import Swal from "sweetalert2";
import { URL } from "../constant";
import { useTitle } from "../hooks/useTitle";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Modal } from "../components/ui/Modal";
import { Field, Input, Textarea, Select } from "../components/ui/Field";
import CustomLoader from "../components/tailwindLoader";
import { formatDate, formatMoney } from "../lib/format";
import { notify } from "../lib/notify";

const TASK_COLUMNS = ["TODO", "IN_PROGRESS", "DONE"];

// Group a flat task list into the three board columns, keyed by status.
const groupByStatus = (tasks) => {
  const columns = { TODO: [], IN_PROGRESS: [], DONE: [] };
  tasks.forEach((t) => {
    (columns[t.status] || columns.TODO).push(t);
  });
  return columns;
};

const reorder = (list, from, to) => {
  const result = Array.from(list);
  const [moved] = result.splice(from, 1);
  result.splice(to, 0, moved);
  return result;
};

const move = (source, dest, srcIdx, destIdx) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(dest);
  const [moved] = sourceClone.splice(srcIdx, 1);
  destClone.splice(destIdx, 0, moved);
  return { source: sourceClone, dest: destClone };
};

const ProjectDetail = () => {
  useTitle("Project");
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [columns, setColumns] = useState({ TODO: [], IN_PROGRESS: [], DONE: [] });
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detailTask, setDetailTask] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        axios.get(`${URL}/projects/${id}`),
        axios.get(`${URL}/tasks`, { params: { project: id } }),
      ]);
      setProject(projectRes.data);
      setColumns(groupByStatus(tasksRes.data));
    } catch (error) {
      console.error("Error loading project:", error);
      notify("Could not load this project", "error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const from = source.droppableId;
    const to = destination.droppableId;

    if (from === to) {
      setColumns((prev) => ({
        ...prev,
        [from]: reorder(prev[from], source.index, destination.index),
      }));
      return;
    }

    // Cross-column move: update the board optimistically, then persist status.
    setColumns((prev) => {
      const { source: src, dest } = move(
        prev[from],
        prev[to],
        source.index,
        destination.index
      );
      return { ...prev, [from]: src, [to]: dest };
    });

    try {
      await axios.patch(`${URL}/tasks/${draggableId}/status`, { status: to });
    } catch (error) {
      console.error("Error updating task status:", error);
      notify("Failed to move task", "error");
      load(); // reconcile with the server on failure
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setSaving(true);
    const taskData = {
      name: e.target.name.value,
      description: e.target.description.value,
      deadline: e.target.deadline.value,
      status: e.target.status.value,
      project: id,
    };
    try {
      await axios.post(`${URL}/tasks`, taskData);
      setShowAdd(false);
      notify("Task added", "success");
      load();
    } catch (error) {
      console.error("Error adding task:", error);
      notify("Failed to add task", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirm = await Swal.fire({
      title: "Delete this task?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#334155",
      confirmButtonText: "Delete",
    });
    if (!confirm.isConfirmed) return;
    try {
      await axios.delete(`${URL}/tasks/${taskId}`);
      load();
    } catch (error) {
      console.error("Error deleting task:", error);
      notify("Failed to delete task", "error");
    }
  };

  // Replace a task everywhere it might live (board columns + open detail modal).
  const applyTaskUpdate = (updated) => {
    setColumns((prev) => {
      const next = {};
      for (const k of TASK_COLUMNS) {
        next[k] = prev[k].map((t) => (t._id === updated._id ? updated : t));
      }
      return next;
    });
    setDetailTask((cur) => (cur && cur._id === updated._id ? updated : cur));
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommenting(true);
    try {
      const { data } = await axios.post(
        `${URL}/tasks/${detailTask._id}/comments`,
        { text: commentText }
      );
      applyTaskUpdate(data);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
      notify("Failed to add comment", "error");
    } finally {
      setCommenting(false);
    }
  };

  if (loading) return <CustomLoader />;

  if (!project) {
    return (
      <>
        <PageHeader title="Project not found" />
        <Button variant="ghost" onClick={() => navigate("/projects")}>
          <FiArrowLeft className="h-4 w-4" /> Back to board
        </Button>
      </>
    );
  }

  const allTasks = TASK_COLUMNS.flatMap((s) => columns[s]);
  const done = columns.DONE.length;
  const pct = allTasks.length ? Math.round((done / allTasks.length) * 100) : 0;

  return (
    <>
      <PageHeader
        title={project.name}
        subtitle={project.description}
        actions={
          <>
            <Button variant="ghost" onClick={() => navigate("/projects")}>
              <FiArrowLeft className="h-4 w-4" /> Back to board
            </Button>
            <Button onClick={() => setShowAdd(true)}>
              <FiPlus className="h-4 w-4" /> Add task
            </Button>
          </>
        }
      />

      {/* Summary + progress */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <StatusBadge status={project.status} />
          <div className="text-sm text-muted">
            <span className="text-ink">Start</span> {formatDate(project.startDate)}
          </div>
          <div className="text-sm text-muted">
            <span className="text-ink">Due</span> {formatDate(project.deadline)}
          </div>
          {project.payment != null && (
            <div className="text-sm text-muted">
              <span className="text-ink">Budget</span> {formatMoney(project.payment)}
            </div>
          )}
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
            <span>Progress</span>
            <span>
              {done}/{allTasks.length} done · {pct}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Task board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {TASK_COLUMNS.map((status, statusIndex) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.06 * statusIndex }}
              className="flex flex-col rounded-2xl border border-line bg-surface/50 p-3"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <StatusBadge status={status} />
                <span className="rounded-md bg-elevated px-2 py-0.5 text-xs font-medium text-muted">
                  {columns[status].length}
                </span>
              </div>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[420px] flex-1 space-y-3 rounded-xl p-1 transition-colors ${
                      snapshot.isDraggingOver ? "bg-brand-500/5" : ""
                    }`}
                  >
                    {columns[status].map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ userSelect: "none", ...provided.draggableProps.style }}
                            className={`rounded-xl border bg-surface p-4 transition-shadow ${
                              snapshot.isDragging
                                ? "border-brand-500/50 shadow-glow"
                                : "border-line hover:border-brand-500/30"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-ink-strong">
                                  {task.name}
                                </p>
                                <p className="mt-1 line-clamp-2 text-sm text-muted">
                                  {task.description}
                                </p>
                                <p className="mt-3 text-xs text-muted/80">
                                  Due {formatDate(task.deadline)}
                                </p>
                              </div>
                              <div className="flex shrink-0 flex-col gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => handleDeleteTask(task._id)}
                                  className="rounded-lg p-1 text-muted hover:bg-rose-500/10 hover:text-rose-400"
                                  aria-label="Delete task"
                                >
                                  <FiTrash2 className="h-5 w-5" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => setDetailTask(task)}
                                  className="rounded-lg p-1 text-muted hover:bg-brand-500/10 hover:text-brand-300"
                                  aria-label="Task details"
                                >
                                  <FiInfo className="h-5 w-5" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {columns[status].length === 0 && !snapshot.isDraggingOver && (
                      <div className="rounded-xl border border-dashed border-line py-8 text-center text-xs text-muted/60">
                        No tasks
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </motion.div>
          ))}
        </div>
      </DragDropContext>

      {showAdd && (
        <Modal
          title="New task"
          subtitle="Add a task to this project."
          onClose={() => setShowAdd(false)}
        >
          <form onSubmit={handleAddTask}>
            <Field label="Task name" htmlFor="name">
              <Input id="name" name="name" type="text" placeholder="e.g. Wire up the API" required />
            </Field>
            <Field label="Description" htmlFor="description">
              <Textarea
                id="description"
                name="description"
                rows="3"
                placeholder="What needs to be done?"
                required
              />
            </Field>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <Field label="Deadline" htmlFor="deadline">
                <Input id="deadline" name="deadline" type="date" required />
              </Field>
              <Field label="Status" htmlFor="status">
                <Select id="status" name="status" defaultValue="TODO">
                  <option value="TODO">To do</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="DONE">Done</option>
                </Select>
              </Field>
            </div>
            <div className="mt-2 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Add task"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {detailTask && (
        <Modal
          title={detailTask.name}
          subtitle={`Due ${formatDate(detailTask.deadline)}`}
          onClose={() => {
            setDetailTask(null);
            setCommentText("");
          }}
        >
          <div className="space-y-4">
            <StatusBadge status={detailTask.status} />
            <p className="whitespace-pre-wrap text-sm text-ink">
              {detailTask.description}
            </p>

            <div className="border-t border-line pt-4">
              <p className="mb-3 text-sm font-medium text-ink">
                Comments{" "}
                <span className="text-muted">
                  ({detailTask.comments?.length || 0})
                </span>
              </p>

              <div className="max-h-64 space-y-3 overflow-y-auto">
                {(detailTask.comments || []).length === 0 ? (
                  <p className="text-sm text-muted">No comments yet.</p>
                ) : (
                  detailTask.comments.map((c) => (
                    <div key={c._id} className="rounded-xl border border-line p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-semibold text-ink">
                          {c.author}
                        </span>
                        <span className="text-[11px] text-muted">
                          {formatDate(c.createdAt)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-ink">
                        {c.text}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={submitComment} className="mt-3">
                <Textarea
                  rows="2"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment…"
                />
                <div className="mt-2 flex justify-end">
                  <Button type="submit" size="sm" disabled={commenting || !commentText.trim()}>
                    {commenting ? "Posting…" : "Comment"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProjectDetail;
