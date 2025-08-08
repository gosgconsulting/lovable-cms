import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'
import { envPublic } from '@/app/../env'
import { initialData } from '@/app/../config/initial-data'

type Params = { params: Promise<{ site: string; slug: string }> }

export async function GET(_req: NextRequest, ctx: Params) {
  const { site, slug } = await ctx.params

  // Attempt to read from Supabase (published-only; RLS allows anon read if policies applied)
  try {
    // site lookup
    const { data: siteRow, error: siteErr } = await supabase
      .from('sites')
      .select('id, tenant_id, slug')
      .eq('slug', site)
      .limit(1)
      .maybeSingle()

    if (siteErr) throw siteErr

    if (siteRow) {
      const { data: page, error: pageErr } = await supabase
        .from('pages')
        .select('id, slug, published_version_id')
        .eq('site_id', siteRow.id)
        .eq('slug', slug === 'index' ? '/' : slug)
        .not('published_version_id', 'is', null)
        .limit(1)
        .maybeSingle()

      if (pageErr) throw pageErr

      if (page?.published_version_id) {
        const { data: version, error: verErr } = await supabase
          .from('page_versions')
          .select('data')
          .eq('id', page.published_version_id)
          .maybeSingle()

        if (verErr) throw verErr

        if (version?.data) {
          return NextResponse.json({
            ok: true,
            source: 'supabase',
            data: version.data,
            meta: { site: siteRow.slug, slug: page.slug },
          })
        }
      }
    }
  } catch (e) {
    // fall through to local fallback below
  }

  // Fallback to local demo data to ensure the endpoint works before DB is seeded
  const path = `/${slug === 'index' ? '' : slug}`
  const fallback = initialData[path as keyof typeof initialData]
  if (fallback?.content) {
    return NextResponse.json({ ok: true, source: 'fallback', data: fallback, meta: { site, slug } })
  }

  return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
}


