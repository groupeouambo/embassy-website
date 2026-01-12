import { useAuth } from '../../context/AuthContext';

function ChatWidget() {
  const { isAdmin } = useAuth();

  // Don't show chat widget for admins
  if (isAdmin()) {
    return null;
  }

  // ConnectNow app URL
  const connectNowAppUrl = 'https://studio--studio-7902627835-94ba6.us-central1.hosted.app';

  return (
    <iframe
      src={`${connectNowAppUrl}/embed`}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '400px',
        height: '600px',
        border: 'none',
        zIndex: 9999,
      }}
      title="ConnectNow Support Chat"
      allow="microphone; camera; autoplay; encrypted-media"
    />
  );
}

export default ChatWidget;
