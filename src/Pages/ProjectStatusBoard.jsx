import { useState, useEffect } from "react";
import { useTitle } from "../hooks/useTitle";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FiTrash2, FiInfo } from "react-icons/fi";
import axios from "axios";
import Swal from "sweetalert2";
import { URL } from "../constant";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { formatDate } from "../lib/format";

const ProjectManagement = () => {
  useTitle("Projects");
  const [columns, setColumns] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${URL}/projects`);
      if (!response.ok) {
        console.error("Failed to fetch projects");
        return;
      }
      const projects = await response.json();

      const initialColumns = {
        BACKLOG: [],
        IN_PROGRESS: [],
        PENDING: [],
        COMPLETED: [],
      };

      projects.forEach((project) => {
        const formattedStartDate = new Date(
          project.startDate
        ).toLocaleDateString();
        const formattedDeadline = new Date(
          project.deadline
        ).toLocaleDateString();

        // Guard against unknown statuses (e.g. TESTING) so nothing is dropped.
        if (!initialColumns[project.status]) initialColumns[project.status] = [];

        initialColumns[project.status].push({
          id: project._id,
          title: project.name,
          description: project.description,
          startDate: formattedStartDate,
          deadline: formattedDeadline,
        });
      });

      setColumns(initialColumns);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectDetails = (title, description, startDate, deadline) => {
    Swal.fire({
      title,
      html: `<div style="text-align:left">
              <p style="margin-bottom:10px">${description}</p>
              <p><strong>Start Date:</strong> ${startDate}</p>
              <p><strong>Deadline:</strong> ${deadline}</p>
            </div>`,
      confirmButtonColor: "#3b82f6",
      showCloseButton: true,
      closeButtonAriaLabel: "Close this alert",
    });
  };

  const handleDeleteProject = async (projectId) => {
    const confirm = await Swal.fire({
      title: "Delete this project?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#334155",
      confirmButtonText: "Delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${URL}/projects/${projectId}`);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete project",
        icon: "error",
        confirmButtonColor: "#e11d48",
      });
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceStatus = source.droppableId.toUpperCase();
    const destinationStatus = destination.droppableId.toUpperCase();

    if (sourceStatus === destinationStatus) {
      const items = reorder(
        columns[sourceStatus],
        source.index,
        destination.index
      );
      setColumns({ ...columns, [sourceStatus]: items });
    } else {
      const updatedColumns = move(
        columns[sourceStatus],
        columns[destinationStatus],
        source,
        destination
      );

      setColumns({
        ...columns,
        [sourceStatus]: updatedColumns[sourceStatus],
        [destinationStatus]: updatedColumns[destinationStatus],
      });

      const projectId = result.draggableId;
      const newStatus = destinationStatus.toLowerCase();
      try {
        await updateStatus(projectId, newStatus);
      } catch (error) {
        console.error("Error updating project status:", error);
      }
    }
  };

  const updateStatus = async (projectId, newStatus) => {
    try {
      const response = await axios.patch(
        `${URL}/projects/${projectId}/status`,
        { status: newStatus.toUpperCase() }
      );
      if (!response.data) console.error("Failed to update project status");
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    return result;
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    ...draggableStyle,
  });

  return (
    <>
      <PageHeader
        title="Project board"
        subtitle="Drag a card between columns to update its status."
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Object.keys(columns).map((status, statusIndex) => (
            <motion.div
              key={statusIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 8 }}
              transition={{ duration: 0.4, delay: 0.06 * statusIndex }}
              className="flex flex-col rounded-2xl border border-line bg-surface/50 p-3"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <StatusBadge status={status} />
                <span className="rounded-md bg-elevated px-2 py-0.5 text-xs font-medium text-muted">
                  {columns[status].length}
                </span>
              </div>

              <Droppable droppableId={status} key={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[420px] flex-1 space-y-3 rounded-xl p-1 transition-colors ${
                      snapshot.isDraggingOver ? "bg-brand-500/5" : ""
                    }`}
                  >
                    {columns[status].map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                            className={`rounded-xl border bg-surface p-4 transition-shadow ${
                              snapshot.isDragging
                                ? "border-brand-500/50 shadow-glow"
                                : "border-line hover:border-brand-500/30"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate font-semibold capitalize text-ink-strong">
                                  {item.title}
                                </p>
                                <p className="mt-1 line-clamp-2 text-sm text-muted">
                                  {item.description}
                                </p>
                                <p className="mt-3 text-xs text-muted/80">
                                  Due {formatDate(item.deadline)}
                                </p>
                              </div>
                              <div className="flex shrink-0 flex-col gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => handleDeleteProject(item.id)}
                                  className="rounded-lg p-1 text-muted hover:bg-rose-500/10 hover:text-rose-400"
                                  aria-label="Delete project"
                                >
                                  <FiTrash2 className="h-5 w-5" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() =>
                                    handleProjectDetails(
                                      item.title,
                                      item.description,
                                      item.startDate,
                                      item.deadline
                                    )
                                  }
                                  className="rounded-lg p-1 text-muted hover:bg-brand-500/10 hover:text-brand-300"
                                  aria-label="Project details"
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
                        Drop projects here
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </motion.div>
          ))}
        </div>
      </DragDropContext>
    </>
  );
};

export default ProjectManagement;
