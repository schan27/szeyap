import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';

export default function Home() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar />
      <ChatArea />
    </div>
  );
}
