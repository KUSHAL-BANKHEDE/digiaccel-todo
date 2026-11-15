import { Outlet } from 'react-router-dom';
import TaskFormProvider from '../../context/TaskFormProvider.jsx';

export default function AppShell() {
  return (
    <div className="flex min-h-dvh justify-center">
      <div className="relative flex min-h-dvh w-full max-w-[430px] flex-col overflow-x-hidden bg-white shadow-[0_30px_80px_-45px_rgba(21,26,45,0.5)]">
        <TaskFormProvider>
          <Outlet />
        </TaskFormProvider>
      </div>
    </div>
  );
}
