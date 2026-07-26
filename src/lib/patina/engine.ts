export function calculatePatinaScore(createdAt: Date, readCount: number): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const daysOld = Math.max(0, (Date.now() - createdAt.getTime()) / MS_PER_DAY);
  
  // Time factor: reaches 1.0 after 365 days.
  // The decay is non-linear so it ages faster in the first month, then slows down.
  const timeProgress = Math.min(daysOld / 365, 1.0);
  // Simple ease-out quadratic for time
  const timeFactor = timeProgress * (2 - timeProgress); 
  
  // Interaction factor: logarithmic. Reaches 1.0 at ~100 reads.
  const interactionFactor = Math.min(Math.log(readCount + 1) / Math.log(100), 1.0);
  
  // Weight time and interaction 40/60
  // Interactions age the document more aggressively than pure time.
  const score = (timeFactor * 0.4) + (interactionFactor * 0.6);
  
  return Number(Math.min(Math.max(score, 0), 1).toFixed(4));
}
