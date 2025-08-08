import { NextRequest, NextResponse } from 'next/server'
import { discoverFromRepo } from '@/app/../lib/github-public'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const repo = body.repo as string | undefined
  const branch = (body.branch as string | undefined) ?? 'main'
  const appRoot = (body.appRoot as string | undefined) ?? '/'
  const tenant = (body.tenant as string | undefined) ?? 'diora'
  const site = (body.site as string | undefined) ?? 'diora'

  if (!repo) return NextResponse.json({ ok: false, error: 'repo required' }, { status: 400 })

  // Discover files and routes from public GitHub
  const discovery = await discoverFromRepo(repo, branch, appRoot)

  return NextResponse.json({
    ok: true,
    repo,
    branch,
    appRoot,
    tenant,
    site,
    discovery,
  })
}


