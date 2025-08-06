const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// File mapping for organized upload
const assetMapping = {
    // Annual Reports (PDFs)
    'Annual reports': {
        folder: 'coodu-trust/annual-reports',
        resource_type: 'raw',
        options: {
            format: 'pdf',
            flags: 'attachment'
        }
    },
    
    // Images
    'images/logos': {
        folder: 'coodu-trust/images/logos',
        resource_type: 'image',
        options: {
            quality: 'auto:good',
            fetch_format: 'auto'
        }
    },
    'images/programs': {
        folder: 'coodu-trust/images/programs', 
        resource_type: 'image',
        options: {
            quality: 'auto:good',
            fetch_format: 'auto',
            width: 800,
            height: 600,
            crop: 'fill'
        }
    },
    'images/team': {
        folder: 'coodu-trust/images/team',
        resource_type: 'image',
        options: {
            quality: 'auto:good',
            fetch_format: 'auto',
            width: 300,
            height: 400,
            crop: 'fill'
        }
    },
    'images/headers': {
        folder: 'coodu-trust/images/headers',
        resource_type: 'image',
        options: {
            quality: 'auto:good',
            fetch_format: 'auto',
            width: 1200,
            height: 400,
            crop: 'fill'
        }
    },
    'images/hero': {
        folder: 'coodu-trust/images/hero',
        resource_type: 'image',
        options: {
            quality: 'auto:good',
            fetch_format: 'auto',
            width: 1920,
            height: 1080,
            crop: 'fill'
        }
    },
    'images/icons': {
        folder: 'coodu-trust/images/icons',
        resource_type: 'image',
        options: {
            quality: 'auto:good',
            fetch_format: 'auto'
        }
    },
    'images/partners': {
        folder: 'coodu-trust/images/partners',
        resource_type: 'image',
        options: {
            quality: 'auto:good',
            fetch_format: 'auto',
            width: 200,
            height: 100,
            crop: 'fit'
        }
    },
    'images/resources': {
        folder: 'coodu-trust/images/resources',
        resource_type: 'image',
        options: {
            quality: 'auto:good',
            fetch_format: 'auto',
            width: 300,
            height: 400,
            crop: 'fill'
        }
    },
    'images/aboutus': {
        folder: 'coodu-trust/images/aboutus',
        resource_type: 'image',
        options: {
            quality: 'auto:good',
            fetch_format: 'auto',
            width: 1920,
            height: 1080,
            crop: 'fill'
        }
    },
    'images/get-involved': {
        folder: 'coodu-trust/images/get-involved',
        resource_type: 'image',
        options: {
            quality: 'auto:good',
            fetch_format: 'auto',
            width: 800,
            height: 600,
            crop: 'fill'
        }
    }
};

// Upload function
async function uploadFile(filePath, mapping) {
    try {
        const fileName = path.basename(filePath, path.extname(filePath));
        const publicId = `${mapping.folder}/${fileName}`;
        
        console.log(`Uploading: ${filePath}`);
        console.log(`Public ID: ${publicId}`);
        
        const result = await cloudinary.uploader.upload(filePath, {
            public_id: publicId,
            resource_type: mapping.resource_type,
            ...mapping.options,
            overwrite: true
        });
        
        console.log(`✅ Success: ${result.secure_url}`);
        return {
            success: true,
            originalPath: filePath,
            cloudinaryUrl: result.secure_url,
            publicId: result.public_id
        };
        
    } catch (error) {
        console.log(`❌ Error uploading ${filePath}:`, error.message);
        return {
            success: false,
            originalPath: filePath,
            error: error.message
        };
    }
}

// Scan and upload files
async function uploadAssets() {
    const assetsPath = path.join(__dirname, '../../assets');
    const results = [];
    
    console.log('🚀 Starting Cloudinary Upload Process...\n');
    
    // Process each folder mapping
    for (const [folderPath, mapping] of Object.entries(assetMapping)) {
        const fullPath = path.join(assetsPath, folderPath);
        
        if (!fs.existsSync(fullPath)) {
            console.log(`⚠️  Folder not found: ${fullPath}`);
            continue;
        }
        
        console.log(`\n📁 Processing folder: ${folderPath}`);
        console.log(`📤 Target: ${mapping.folder}\n`);
        
        const files = fs.readdirSync(fullPath);
        
        for (const file of files) {
            const filePath = path.join(fullPath, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isFile()) {
                const result = await uploadFile(filePath, mapping);
                results.push(result);
                
                // Small delay to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }
    
    // Generate summary report
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log('\n📊 UPLOAD SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successful uploads: ${successful.length}`);
    console.log(`❌ Failed uploads: ${failed.length}`);
    console.log(`📋 Total processed: ${results.length}`);
    
    if (failed.length > 0) {
        console.log('\n❌ Failed uploads:');
        failed.forEach(f => {
            console.log(`   - ${f.originalPath}: ${f.error}`);
        });
    }
    
    // Save URL mapping for frontend updates
    const urlMapping = {};
    successful.forEach(result => {
        const relativePath = result.originalPath.replace(path.join(__dirname, '../../'), '').replace(/\\/g, '/');
        urlMapping[relativePath] = result.cloudinaryUrl;
    });
    
    fs.writeFileSync(
        path.join(__dirname, 'cloudinary-urls.json'),
        JSON.stringify(urlMapping, null, 2)
    );
    
    console.log('\n💾 URL mapping saved to: scripts/cloudinary-urls.json');
    console.log('\n🎉 Upload process completed!');
}

// Run the upload
if (require.main === module) {
    uploadAssets().catch(console.error);
}

module.exports = { uploadAssets };