import { NextRequest, NextResponse } from 'next/server'

// Minimal public-repo importer stub; extend to clone and analyze
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const repo = body.repo as string | undefined
  const branch = (body.branch as string | undefined) ?? 'main'
  const appRoot = (body.appRoot as string | undefined) ?? '/'
  const tenant = (body.tenant as string | undefined) ?? 'diora'
  const site = (body.site as string | undefined) ?? 'diora'

  if (!repo) return NextResponse.json({ ok: false, error: 'repo required' }, { status: 400 })

  // For public repos we can read GitHub raw without token for simple discovery
  // This endpoint just echoes the plan; a follow-up task will perform real seeding
  return NextResponse.json({
    ok: true,
    message: 'Import scheduled',
    plan: {
      repo,
      branch,
      appRoot,
      tenant,
      site,
      detect: ['header', 'footer', 'theme tokens', 'routes'],
      seed: ['site_settings', 'navigation', 'pages (no duplicates)'],
    },
  })
}


