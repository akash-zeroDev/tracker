'use client';
import * as React from 'react';
import { enableAutomation, disableAutomation, rotateAutomationKey } from '@/app/actions';
export interface AutomationData {
  isEnabled: boolean;
  keyPrefix: string | null;
  requestCount: number;
  lastUsedAt: Date | null;
  createdAt: Date;
}
interface Props {
  goalId: string;
  automation: AutomationData | null;
}
type CLATab = 'curl' | 'js' | 'python' | 'bash' | 'github';
function Label({ children }: { children: React.ReactNode }) {
  return <span className="label-caps">{children}</span>;
}
function Ref({ children }: { children: React.ReactNode }) {
  return <span className="ref-id">{children}</span>;
}
function FoldRule({ className = '' }: { className?: string }) {
  return <div className={`h-px w-full bg-[var(--color-rule)] ${className}`} aria-hidden />;
}
export function CommandLineAccess({ goalId, automation: initialAutomation }: Props) {
  const [automation, setAutomation] = React.useState(initialAutomation);
  const [rawKey, setRawKey] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const [copiedKey, setCopiedKey] = React.useState(false);
  const [copiedCmd, setCopiedCmd] = React.useState(false);
  const [showKey, setShowKey] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<CLATab>('curl');
  const [host, setHost] = React.useState('your-domain.com');
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHost(window.location.host);
  }, []);
  const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const protocol = isLocalhost ? 'http' : 'https';
  const endpoint = `${protocol}://${host}/api/v1/folios/${goalId}/log`;
  const isActive = automation?.isEnabled ?? false;
  const maskedKey = rawKey
    ? (showKey ? rawKey : `${rawKey.slice(0, 16)}${'•'.repeat(38)}`)
    : (automation?.keyPrefix ? `${automation.keyPrefix}${'•'.repeat(38)}` : '<YOUR_API_KEY>');
  const handleEnable = () => {
    startTransition(async () => {
      const result = await enableAutomation(goalId);
      setRawKey(result.rawKey);
      setShowKey(true);
      setAutomation({
        isEnabled: true,
        keyPrefix: result.rawKey.slice(0, 16),
        requestCount: 0,
        lastUsedAt: null,
        createdAt: new Date(),
      });
    });
  };
  const handleDisable = () => {
    startTransition(async () => {
      await disableAutomation(goalId);
      setRawKey(null);
      setAutomation(prev => prev ? { ...prev, isEnabled: false } : null);
    });
  };
  const handleRotate = () => {
    startTransition(async () => {
      const result = await rotateAutomationKey(goalId);
      setRawKey(result.rawKey);
      setShowKey(true);
      setAutomation(prev => prev ? {
        ...prev, isEnabled: true,
        keyPrefix: result.rawKey.slice(0, 16),
        requestCount: 0, lastUsedAt: null,
      } : null);
    });
  };
  const copyKey = () => {
    if (!rawKey) return;
    navigator.clipboard.writeText(rawKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 1500);
  };
  const copyCmd = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 1500);
  };
  const keyForCmd = rawKey ?? '<YOUR_API_KEY>';
  const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC';
  const codeMap: Record<CLATab, string> = {
    curl: `curl -X POST ${endpoint} \\
  -H "Authorization: Bearer ${keyForCmd}" \\
  -H "Content-Type: application/json" \\
  -d '{"content": "Finished a deep work session. 2h focus block.", "timezone": "${tz}"}'`,
    js: `const response = await fetch('${endpoint}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${keyForCmd}',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: "Finished a deep work session.",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }),
});
const data = await response.json();
console.log(data.fragment.id);`,
    python: `import requests
response = requests.post(
    "${endpoint}",
    headers={
        "Authorization": "Bearer ${keyForCmd}",
        "Content-Type": "application/json",
    },
    json={
        "content": "Finished a deep work session.",
        "timezone": "UTC",
    },
)
print(response.json())`,
    bash: `#!/bin/bash
# Drop this in a Git post-commit hook or cron job.
pa-log() {
  curl -sX POST ${endpoint} \\
    -H "Authorization: Bearer ${keyForCmd}" \\
    -H "Content-Type: application/json" \\
    -d "{\\"content\\": \\"$1\\"}"
}
pa-log "Shipped the feature. 3 focused hours."`,
    github: `# .github/workflows/log.yml
name: Log to Precision Archive
on:
  push:
    branches: [main]
jobs:
  log:
    runs-on: ubuntu-latest
    steps:
      - name: File fragment to archive
        run: |
          curl -sX POST ${endpoint} \\
            -H "Authorization: Bearer \${{ secrets.PRECISION_ARCHIVE_KEY }}" \\
            -H "Content-Type: application/json" \\
            -d '{"content": "Pushed to main: \${{ github.event.head_commit.message }}"}'`,
  };
  const tabLabels: Record<CLATab, string> = {
    curl: 'cURL', js: 'JavaScript', python: 'Python', bash: 'Bash', github: 'GitHub Actions',
  };
  return (
    <div className="paper-sheet p-6 lg:p-8">
      {}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Label>Command Line Access</Label>
          <p className="mt-1 font-serif text-[13px] italic text-[var(--color-ink-soft)] max-w-[52ch] leading-snug">
            Pipe terminal output directly into the archive. For shell scripts,
            Git hooks, cron jobs, CI pipelines, and Raycast shortcuts.
          </p>
        </div>
        <span
          className="font-mono text-[10px] tracking-[0.18em] uppercase px-2 py-1 border"
          style={{
            color: isActive ? 'var(--color-burgundy)' : 'var(--color-ink-soft)',
            borderColor: isActive ? 'var(--color-burgundy)' : 'var(--color-rule)',
          }}
        >
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </span>
      </div>
      <FoldRule className="my-6" />
      {}
      {isActive && automation && (
        <div className="mb-6 flex flex-wrap gap-8">
          {([
            ['Requests filed', automation.requestCount.toLocaleString()],
            ['Last filed', automation.lastUsedAt
              ? new Date(automation.lastUsedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              : 'Never'],
            ['Issued', automation.createdAt
              ? new Date(automation.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              : '—'],
          ] as [string, string][]).map(([k, v]) => (
            <div key={k}>
              <Ref>{k}</Ref>
              <div className="mt-0.5 font-serif text-[15px] text-[var(--color-ink)]">{v}</div>
            </div>
          ))}
        </div>
      )}
      {}
      <div className="space-y-3">
        <Label>Authentication key</Label>
        {!isActive ? (
          <div className="mt-3">
            <p className="font-mono text-[12px] text-[var(--color-ink-soft)] mb-4 leading-relaxed">
              Command Line Access is currently disabled for this folio.
              Issue an access key to enable programmatic logging.
            </p>
            <button
              type="button"
              disabled={isPending}
              onClick={handleEnable}
              className="press border border-[var(--color-ink)] bg-transparent px-4 py-2 font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--color-ink)] disabled:opacity-50"
            >
              {isPending ? 'Issuing key…' : 'Issue access key'}
            </button>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-3 border border-[var(--color-rule)] px-4 py-3">
              <code className="flex-1 font-mono text-[11.5px] text-[var(--color-ink)] break-all leading-relaxed">
                {maskedKey}
              </code>
              <div className="flex shrink-0 items-center gap-3">
                {rawKey && (
                  <button
                    type="button"
                    onClick={() => setShowKey(s => !s)}
                    className="footnote-link text-[11px]"
                    aria-label={showKey ? 'Conceal key' : 'Reveal key'}
                  >
                    {showKey ? 'Conceal' : 'Reveal'}
                  </button>
                )}
                <button
                  type="button"
                  disabled={!rawKey}
                  onClick={copyKey}
                  className={`footnote-link text-[11px] transition-colors ${!rawKey ? 'opacity-30 cursor-not-allowed' : ''}`}
                  aria-label="Copy API key"
                >
                  {copiedKey ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
            {rawKey && (
              <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--color-burgundy)]">
                ⚠ Copy this key now. It will not be shown again after you navigate away.
              </p>
            )}
            <div className="flex flex-wrap gap-4 pt-1">
              <button
                type="button"
                disabled={isPending}
                onClick={handleRotate}
                className="footnote-link text-[13px] disabled:opacity-50"
              >
                {isPending ? 'Rotating…' : 'Rotate key'}
              </button>
              <span className="text-[var(--color-rule)]">·</span>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDisable}
                className="font-mono text-[11px] tracking-[0.12em] text-[var(--color-ink-soft)] hover:text-[var(--color-critical,#c0392b)] transition-colors disabled:opacity-50"
              >
                Revoke access
              </button>
            </div>
          </div>
        )}
      </div>
      {isActive && (
        <>
          <FoldRule className="my-6" />
          {}
          <div>
            <Label>Quick command</Label>
            <p className="mt-1 mb-2 font-serif text-[13px] italic text-[var(--color-ink-soft)] leading-snug">
              Copy a command below and change the <code className="font-mono text-[11px] not-italic">&quot;content&quot;</code> value to file your own custom log entry.
            </p>
            {}
            <div className="mt-3 flex flex-wrap gap-0 border-b border-[var(--color-rule)]">
              {(Object.keys(tabLabels) as CLATab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`font-mono text-[10px] tracking-[0.12em] px-4 py-2 border-b-2 -mb-px transition-colors ${
                    activeTab === tab
                      ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
                      : 'border-transparent text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {tabLabels[tab]}
                </button>
              ))}
            </div>
            <div className="relative border border-t-0 border-[var(--color-rule)] bg-[var(--color-paper)]">
              <pre className="overflow-x-auto p-4 font-mono text-[11.5px] leading-relaxed text-[var(--color-ink)] whitespace-pre-wrap break-all">
                <code>{codeMap[activeTab]}</code>
              </pre>
              <button
                type="button"
                onClick={() => copyCmd(codeMap[activeTab])}
                className="absolute right-3 top-3 font-mono text-[10px] tracking-[0.1em] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
                aria-label="Copy command"
              >
                {copiedCmd ? '✓ COPIED' : 'COPY'}
              </button>
            </div>
          </div>
          <FoldRule className="my-6" />
          {}
          <div>
            <Label>Reference</Label>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-ink-soft)] mb-2">Endpoint</p>
                <code className="font-mono text-[11.5px] text-[var(--color-ink)] break-all">
                  POST /api/v1/folios/[folioId]/log
                </code>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-ink-soft)] mb-2">Required fields</p>
                <dl className="space-y-1">
                  <dt className="font-mono text-[11.5px] text-[var(--color-ink)]">content</dt>
                  <dd className="font-serif text-[12px] text-[var(--color-ink-soft)] italic">String · The fragment text to file.</dd>
                </dl>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-ink-soft)] mb-2">Optional fields</p>
                <dl className="space-y-1">
                  <dt className="font-mono text-[11.5px] text-[var(--color-ink)]">timezone</dt>
                  <dd className="font-serif text-[12px] text-[var(--color-ink-soft)] italic">IANA tz string. Defaults to UTC. Affects streak calculations.</dd>
                </dl>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-ink-soft)] mb-2">Response · 201</p>
                <code className="font-mono text-[11px] text-[var(--color-ink)] leading-relaxed whitespace-pre-wrap">{`{ success: true,\n  fragment: { id, content,\n    createdAt, folioId } }`}</code>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-ink-soft)] mb-2">Authentication</p>
                <p className="font-serif text-[12px] text-[var(--color-ink-soft)] italic leading-snug">
                  Pass your key as <code className="font-mono text-[11px] not-italic text-[var(--color-ink)]">Authorization: Bearer</code>.
                  Keys are per-folio and can be rotated or revoked at any time.
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-ink-soft)] mb-2">Rate limits</p>
                <p className="font-serif text-[12px] text-[var(--color-ink-soft)] italic leading-snug">
                  No hard limit during the current period. Reasonable automation is encouraged.
                  Abuse results in immediate key revocation.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
