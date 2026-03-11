// ============================================================
// Board Detail Page (Scrum Board)
// ============================================================
// The core of the app — shows 3 columns (Todo, InProgress, Done)
// with drag-and-drop support via @dnd-kit.
//
// Key concepts:
// - DndContext wraps the entire board to enable drag-and-drop
// - Each Column is a droppable area using useDroppable
// - Each TaskCard is draggable using useSortable
// - On drag end, we determine which column the task was dropped
//   in and update its status via the API
// ============================================================

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import API from '../api/axios';
import Column from '../components/Column';

const STATUSES = ['Todo', 'InProgress', 'Done'];

const BoardDetailPage = () => {
    const { id: boardId } = useParams();
    const [board, setBoard] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // New task form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Add member form state
    const [memberEmail, setMemberEmail] = useState('');
    const [memberMsg, setMemberMsg] = useState('');

    // Configure drag sensors — distance threshold prevents accidental drags
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    // ---- Fetch board and tasks on mount ----
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [boardRes, tasksRes] = await Promise.all([
                    API.get(`/boards/${boardId}`),
                    API.get(`/tasks/${boardId}`),
                ]);
                setBoard(boardRes.data);
                setTasks(tasksRes.data);
            } catch (err) {
                setError('Failed to load board');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [boardId]);

    // ---- Create a new task ----
    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const res = await API.post('/tasks', {
                title,
                description,
                board: boardId,
            });
            setTasks([res.data, ...tasks]);
            setTitle('');
            setDescription('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create task');
        }
    };

    // ---- Delete a task ----
    const handleDeleteTask = async (taskId) => {
        try {
            await API.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter((t) => t._id !== taskId));
        } catch (err) {
            setError('Failed to delete task');
        }
    };

    // ---- Add a member by email ----
    const handleAddMember = async (e) => {
        e.preventDefault();
        setMemberMsg('');

        try {
            const res = await API.put(`/boards/${boardId}/members`, {
                email: memberEmail,
            });
            setBoard(res.data);
            setMemberEmail('');
            setMemberMsg('Member added!');
        } catch (err) {
            setMemberMsg(err.response?.data?.message || 'Failed to add member');
        }
    };

    // ---- Handle drag end ----
    // When a task is dropped, figure out which column it landed on
    // and update its status via the API.
    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over) return; // Dropped outside any droppable

        const taskId = active.id;
        const task = tasks.find((t) => t._id === taskId);
        if (!task) return;

        // Determine the new status:
        // - If dropped over a column, over.id is the status string
        // - If dropped over another task, find that task's status
        let newStatus = over.id;
        if (!STATUSES.includes(newStatus)) {
            const overTask = tasks.find((t) => t._id === over.id);
            if (overTask) newStatus = overTask.status;
        }

        // No change needed if status is the same
        if (task.status === newStatus) return;

        // Optimistic update: change status locally first for instant UI feedback
        const updatedTasks = tasks.map((t) =>
            t._id === taskId ? { ...t, status: newStatus } : t
        );
        setTasks(updatedTasks);

        // Then persist to the backend
        try {
            await API.put(`/tasks/${taskId}`, { status: newStatus });
        } catch (err) {
            // Revert on failure
            setTasks(tasks);
            setError('Failed to update task status');
        }
    };

    // ---- Group tasks by status for the three columns ----
    const tasksByStatus = (status) => tasks.filter((t) => t.status === status);

    if (loading) return <div className="loading">Loading board...</div>;
    if (error && !board) return <div className="error-msg">{error}</div>;

    return (
        <div className="board-detail">
            {/* Board Header */}
            <div className="board-header">
                <h1>{board?.name}</h1>
            </div>

            {/* Members Section */}
            <div className="members-section">
                <h3>Members</h3>
                <div className="members-list">
                    {/* Owner badge */}
                    <span className="member-badge">
                        👑 {board?.owner?.name} (Owner)
                    </span>
                    {/* Member badges */}
                    {board?.members?.map((m) => (
                        <span key={m._id} className="member-badge">
                            {m.name}
                        </span>
                    ))}
                </div>

                {/* Add Member Form */}
                <form className="add-member-form" onSubmit={handleAddMember}>
                    <input
                        type="email"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        placeholder="Add member by email..."
                    />
                    <button type="submit" className="btn btn-outline btn-sm">
                        Add
                    </button>
                </form>
                {memberMsg && (
                    <div style={{ marginTop: 8, fontSize: '0.85rem', color: '#64748b' }}>
                        {memberMsg}
                    </div>
                )}
            </div>

            {/* Add Task Form */}
            <div className="add-task-form">
                <h3>Add New Task</h3>
                <form onSubmit={handleCreateTask}>
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Task title"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description (optional)"
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm">
                        + Add Task
                    </button>
                </form>
            </div>

            {error && <div className="error-msg">{error}</div>}

            {/* Scrum Board — 3 Columns with Drag and Drop */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="board-columns">
                    {STATUSES.map((status) => (
                        <Column
                            key={status}
                            status={status}
                            tasks={tasksByStatus(status)}
                            onDeleteTask={handleDeleteTask}
                        />
                    ))}
                </div>
            </DndContext>
        </div>
    );
};

export default BoardDetailPage;
