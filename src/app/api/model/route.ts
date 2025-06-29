import { NextResponse } from 'next/server'

const MODEL_URL = 'https://www.uec.ac.jp/about/profile/access/map/uec-all.glb'

export async function GET() {
  try {
    // 外部URLからGLBファイルを取得
    const response = await fetch(MODEL_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; UEC-3D-Map/1.0)',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // レスポンスのボディを取得
    const arrayBuffer = await response.arrayBuffer()
    
    // 適切なヘッダーを設定してGLBファイルを返す
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'model/gltf-binary',
        'Content-Length': arrayBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400', // 24時間キャッシュ
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Error fetching GLB model:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch model',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// OPTIONSメソッドのサポート（CORS対応）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}