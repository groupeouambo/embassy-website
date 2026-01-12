import { useAuth } from '../../context/AuthContext';

export default function ChatWidget() {
  const { isAdmin } = useAuth();

  // Don't show chat widget for admins
  if (isAdmin()) {
    return null;
  }

  return (
    <iframe
      src="https://studio--studio-7902627835-94ba6.us-central1.hosted.app/embed"
      style={{
        width: '400px',
        height: '600px',
        border: 'none'
      }}
      title="ConnectNow Chat"
      allow="microphone; camera; autoplay; encrypted-media"
    />
  );
}
