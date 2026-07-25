import { ArchiveClient, ArchiveVolumeData, VolumeSize } from '@/components/ArchiveClient';
import { getArchivedGoals, getArchiveStats } from '@/app/actions';

function calculateSize(longestStreak: number, totalEntries: number): VolumeSize {
  if (longestStreak > 20 || totalEntries > 40) return 'featured';
  if (longestStreak < 10 && totalEntries < 15) return 'compact';
  return 'standard';
}

function generateShelfCode(category: string, index: number) {
  const prefix = category.substring(0, 2).toUpperCase();
  const num = (index + 1).toString().padStart(2, '0');
  return `${prefix}-${num}`;
}

function getRomanVol(num: number) {
  const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
  return numerals[num % numerals.length] || num.toString();
}

export default async function ArchivePage() {
  const [archivedGoals, stats] = await Promise.all([
    getArchivedGoals(),
    getArchiveStats()
  ]);

  // Transform database models into our rich archival UI data
  const volumes: ArchiveVolumeData[] = archivedGoals.map((g, i) => {
    
    // Calculate a rough duration (e.g. days between created and last entry if available)
    const firstEntry = g.entries[g.entries.length - 1];
    const lastEntry = g.entries[0];
    let duration = "Unknown";
    
    if (firstEntry && lastEntry) {
      const ms = new Date(lastEntry.createdAt).getTime() - new Date(firstEntry.createdAt).getTime();
      const days = Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
      duration = `${days} Days`;
    } else {
      duration = `${g.longestStreak || 1} Days`;
    }

    return {
      id: g.id,
      volNumber: getRomanVol(i),
      title: g.title,
      archivedDate: new Date(g.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      duration,
      totalEntries: g.entries.length,
      longestStreak: g.longestStreak,
      category: g.category || 'Uncategorized',
      excerpt: g.description || 'No excerpt available.',
      size: calculateSize(g.longestStreak, g.entries.length),
      shelfCode: generateShelfCode(g.category || 'UN', i),
      refId: `ref:${g.id.substring(0,4)}`,
      timestamp: new Date(g.createdAt).getTime()
    };
  });

  // Calculate distinct years archived
  const years = new Set(archivedGoals.map(g => new Date(g.createdAt).getFullYear()));
  stats.yearsCount = years.size;
  stats.archivedCount = archivedGoals.length;

  return <ArchiveClient volumes={volumes} stats={stats} />;
}
