import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function POST(req: NextRequest) {
    try {
        const { fileBase64 } = await req.json();

        const result = await cloudinary.uploader.upload(fileBase64, {
            folder: 'notes',
        });
        return NextResponse.json({ url: result.secure_url, public_id: result.public_id });
    }

    catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

}