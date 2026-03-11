// ============================================================
// Column Component (Droppable)
// ============================================================
// Represents one column on the scrum board (Todo, InProgress,
// or Done). Uses @dnd-kit's useDroppable hook so tasks can be
// dropped into it.
// ============================================================

import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

// Map status to display label and CSS modifier
const STATUS_CONFIG = {
    Todo: { label: 'To Do', modifier: 'todo' },
    InProgress: { label: 'In Progress', modifier: 'inprogress' },
    Done: { label: 'Done', modifier: 'done' },
};

const Column = ({ status, tasks, onDeleteTask }) => {
    const config = STATUS_CONFIG[status];

    // useDroppable makes this column a valid drop target
    const { setNodeRef } = useDroppable({ id: status });

    return (
        <div className="column">
            <div className="column__header">
                <span className={`column__dot column__dot--${config.modifier}`} />
                <span className="column__title">{config.label}</span>
                <span className="column__count">{tasks.length}</span>
            </div>

            {/* SortableContext provides the list of draggable IDs for this column */}
            <SortableContext
                items={tasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
            >
                <div ref={setNodeRef} className="column__tasks">
                    {tasks.map((task) => (
                        <TaskCard key={task._id} task={task} onDelete={onDeleteTask} />
                    ))}

                    {tasks.length === 0 && (
                        <div className="empty-state">
                            <p>No tasks</p>
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
};

export default Column;
