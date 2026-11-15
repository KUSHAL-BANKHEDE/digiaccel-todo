import TaskItem from './TaskItem.jsx';
import { cn } from '../../utils/cn.js';

export default function TaskList({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  showDate = false,
  togglingId,
  className,
}) {
  return (
    <div className={cn('divide-y divide-line', className)}>
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          showDate={showDate}
          busy={togglingId === task._id}
        />
      ))}
    </div>
  );
}
