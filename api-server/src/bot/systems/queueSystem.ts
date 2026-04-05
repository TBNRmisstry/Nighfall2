const queue: string[] = [];

export function joinQueue(userId: string): boolean {
  if (queue.includes(userId)) return false;
  queue.push(userId);
  return true;
}

export function leaveQueue(userId: string): boolean {
  const index = queue.indexOf(userId);
  if (index === -1) return false;
  queue.splice(index, 1);
  return true;
}

export function getQueue(): string[] {
  return [...queue];
}

export function getQueueSize(): number {
  return queue.length;
}

export function startMatch(): { killer: string; survivors: string[] } | null {
  if (queue.length < 2) return null;

  const players = [...queue];
  queue.length = 0;

  const killerIndex = Math.floor(Math.random() * players.length);
  const killer = players[killerIndex]!;
  const survivors = players.filter((_, i) => i !== killerIndex);

  return { killer, survivors };
}
