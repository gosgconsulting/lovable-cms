import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

type Params = { params: Promise<{ site: string }> }

export async function GET(_req: NextRequest, ctx: Params) {
  const { site } = await ctx.params
  try {
    const { data: s, error } = await supabase
      .from('sites')
      .select('id')
      .eq('slug', site)
      .maybeSingle()
    if (error) throw error
    if (!s) return NextResponse.json({ ok: false, error: 'Unknown site' }, { status: 404 })

    const { data } = await supabase
      .from('navigation')
      .select('header_nav, footer_nav')
      .eq('site_id', s.id)
      .maybeSingle()

    return NextResponse.json({ ok: true, data: data ?? {} })
  } catch {
    return NextResponse.json({ ok: true, data: {} })
  }
}


