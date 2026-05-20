export function formatChatMessageTime(timestamp: number, previousTimestamp?: number) {
  const now = new Date();
  const date = new Date(timestamp);
  if (previousTimestamp && timestamp - previousTimestamp < 5 * 60 * 1000) {
    return null;
  }
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  if (isSameDay(now, date)) return timeStr;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(yesterday, date)) return `Yesterday ${timeStr}`;
  const beforeYesterday = new Date(now);
  beforeYesterday.setDate(now.getDate() - 2);
  if (isSameDay(beforeYesterday, date)) return `2 days ago ${timeStr}`;
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  if (date > oneWeekAgo) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${days[date.getDay()]} ${timeStr}`;
  }
  if (now.getFullYear() === date.getFullYear()) {
    return `${date.getMonth() + 1}-${date.getDate()}`;
  }
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}
