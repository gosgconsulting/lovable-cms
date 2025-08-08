export type RepoRef = { owner: string; repo: string; branch: string }

const GH = 'https://api.github.com'

function parseRepo(input: string, branch: string): RepoRef {
  const [owner, repo] = input.split('/')
  if (!owner || !repo) throw new Error('repo must be in the form owner/repo')
  return { owner, repo, branch }
}

export async function getRepoTree(repo: string, branch: string) {
  const ref = parseRepo(repo, branch)
  const url = `${GH}/repos/${ref.owner}/${ref.repo}/git/trees/${encodeURIComponent(ref.branch)}?recursive=1`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GitHub tree fetch failed: ${res.status}`)
  const data = (await res.json()) as { tree?: { path: string; type: string; url: string }[] }
  return data.tree || []
}

export async function fetchFileText(repo: string, branch: string, path: string) {
  const ref = parseRepo(repo, branch)
  const url = `https://raw.githubusercontent.com/${ref.owner}/${ref.repo}/${encodeURIComponent(ref.branch)}/${path}`
  const res = await fetch(url)
  if (!res.ok) return ''
  return await res.text()
}

export type Discovery = {
  routes: string[]
  headerCandidates: string[]
  footerCandidates: string[]
  themeCandidates: string[]
}

export async function discoverFromRepo(repo: string, branch: string, appRoot = '/'): Promise<Discovery> {
  const tree = await getRepoTree(repo, branch)
  const routes: Set<string> = new Set()
  const headerCandidates: string[] = []
  const footerCandidates: string[] = []
  const themeCandidates: string[] = []

  const relevant = tree.filter((t) => t.type === 'blob' && t.path.endsWith('.tsx') || t.path.endsWith('.ts') || t.path.endsWith('.jsx') || t.path.endsWith('.js'))

  const routeLike = relevant.filter((f) => /router|routes|App\.(t|j)sx?$/.test(f.path))

  for (const file of routeLike) {
    const text = await fetchFileText(repo, branch, file.path)
    if (!text) continue
    // match React Router patterns: <Route path="/x" ...> or { path: "/x", element: ... }
    const rx1 = /path\s*[:=]\s*["'`]([^"'`]+)["'`]/g
    const rx2 = /<Route\s+[^>]*path=\s*["'`]([^"'`]+)["'`]/g
    let m: RegExpExecArray | null
    while ((m = rx1.exec(text))) {
      const p = normalizePath(m[1])
      if (p !== null) routes.add(p)
    }
    while ((m = rx2.exec(text))) {
      const p = normalizePath(m[1])
      if (p !== null) routes.add(p)
    }
  }

  for (const f of relevant) {
    const name = f.path.toLowerCase()
    if (/(^|\/)header\.(t|j)sx?$/.test(name)) headerCandidates.push(f.path)
    if (/(^|\/)footer\.(t|j)sx?$/.test(name)) footerCandidates.push(f.path)
    if (/tailwind\.config|theme\.(t|j)s|tokens\.(t|j)s|styles?\.(css|ts)/.test(name)) themeCandidates.push(f.path)
  }

  // ensure root and common pages
  if (!routes.size) routes.add('/')
  return {
    routes: Array.from(routes).slice(0, 200),
    headerCandidates: headerCandidates.slice(0, 20),
    footerCandidates: footerCandidates.slice(0, 20),
    themeCandidates: themeCandidates.slice(0, 20),
  }
}

function normalizePath(p: string): string | null {
  if (!p) return null
  if (p === '/' || p === 'index' || p === './') return '/'
  if (p.startsWith('/')) return p
  if (p.startsWith('*')) return null
  if (p.startsWith(':')) return null
  // treat relative segments as top-level
  return '/' + p.replace(/^\/+/, '')
}


