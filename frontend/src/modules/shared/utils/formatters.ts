export const formatDate = (date: string | Date): string => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export const formatDateTime = (date: string | Date): string => new Date(date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export const formatTimeAgo = (date: string | Date): string => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  const intervals = { year: 31536000, month: 2592000, week: 604800, day: 86400, hour: 3600, minute: 60 };
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
