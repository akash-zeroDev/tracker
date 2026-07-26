export function calculatePatinaScore(createdAt: Date, readCount: number): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const daysOld = Math.max(0, (Date.now() - createdAt.getTime()) / MS_PER_DAY);
  const timeProgress = Math.min(daysOld / 365, 1.0);
  const timeFactor = timeProgress * (2 - timeProgress); 
  const interactionFactor = Math.min(Math.log(readCount + 1) / Math.log(100), 1.0);
  const score = (timeFactor * 0.4) + (interactionFactor * 0.6);
  return Number(Math.min(Math.max(score, 0), 1).toFixed(4));
}
