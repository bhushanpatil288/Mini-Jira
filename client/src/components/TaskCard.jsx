// ============================================================
// TaskCard Component (Draggable)
// ============================================================
// Renders a single task card. Uses @dnd-kit's useSortable
// hook so it can be dragged between columns.
// ============================================================

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task, onDelete }) => {
    // useSortable gives us drag handles and transform styles
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`task-card ${isDragging ? 'dragging' : ''}`}
        >
            <div className="task-card__title">{task.title}</div>

            {task.description && (
                <div className="task-card__desc">{task.description}</div>
            )}

            <div className="task-card__footer">
                {/* Show assignee name if assigned */}
                <span className="task-card__assignee">
                    {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                </span>

                {/* Delete button — stops propagation so it doesn't trigger drag */}
                <button
                    className="task-card__delete"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => onDelete(task._id)}
                    title="Delete task"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
