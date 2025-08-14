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

// Upload function for original quality and size
async function uploadBackgroundImage(filePath) {
    try {
        const fileName = path.basename(filePath, path.extname(filePath));
        // Clean filename for Cloudinary public_id (replace spaces and special chars with hyphens)
        const cleanFileName = fileName
            .replace(/\s+/g, '-')           // Replace spaces with hyphens
            .replace(/&/g, 'and')           // Replace & with 'and'
            .replace(/[^a-zA-Z0-9\-_]/g, '') // Remove other special characters
            .toLowerCase();
        
        const publicId = `coodu-trust/images/programs/background-prgms/${cleanFileName}`;
        
        console.log(`Uploading: ${filePath}`);
        console.log(`Original filename: ${fileName}`);
        console.log(`Clean public ID: ${publicId}`);
        
        const result = await cloudinary.uploader.upload(filePath, {
            public_id: publicId,
            resource_type: 'image',
            // Original quality and size settings - no transformations to preserve original
            overwrite: true
        });
        
        console.log(`✅ Success: ${result.secure_url}`);
        return {
            success: true,
            originalPath: filePath,
            fileName: fileName,
            cleanFileName: cleanFileName,
            cloudinaryUrl: result.secure_url,
            publicId: result.public_id
        };
        
    } catch (error) {
        console.log(`❌ Error uploading ${filePath}:`, error.message);
        return {
            success: false,
            originalPath: filePath,
            fileName: path.basename(filePath, path.extname(filePath)),
            error: error.message
        };
    }
}

// Main upload function
async function uploadBackgroundImages() {
    const backgroundPrgmsPath = path.join(__dirname, '../../assets/images/programs/Background_prgms');
    const results = [];
    
    console.log('🚀 Starting Background Programs Images Upload...\n');
    console.log(`📁 Source folder: ${backgroundPrgmsPath}\n`);
    
    if (!fs.existsSync(backgroundPrgmsPath)) {
        console.log(`❌ Folder not found: ${backgroundPrgmsPath}`);
        return;
    }
    
    const files = fs.readdirSync(backgroundPrgmsPath);
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext);
    });
    
    console.log(`📊 Found ${imageFiles.length} image files to upload\n`);
    
    for (const file of imageFiles) {
        const filePath = path.join(backgroundPrgmsPath, file);
        const result = await uploadBackgroundImage(filePath);
        results.push(result);
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
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
            console.log(`   - ${f.fileName}: ${f.error}`);
        });
    }
    
    // Create URL mapping for HTML updates
    const urlMapping = {};
    const cleanMapping = {};
    successful.forEach(result => {
        // Map original filename to URL for easy replacement in HTML files
        urlMapping[result.fileName] = result.cloudinaryUrl;
        // Also map clean filename to URL
        cleanMapping[result.cleanFileName] = result.cloudinaryUrl;
    });
    
    // Save URL mapping
    const fullMapping = {
        original: urlMapping,
        clean: cleanMapping
    };
    
    fs.writeFileSync(
        path.join(__dirname, 'background-images-urls.json'),
        JSON.stringify(fullMapping, null, 2)
    );
    
    console.log('\n💾 URL mapping saved to: scripts/background-images-urls.json');
    console.log('\n📋 URL Mapping Preview:');
    Object.entries(urlMapping).slice(0, 5).forEach(([fileName, url]) => {
        console.log(`   ${fileName} -> ${url}`);
    });
    if (Object.keys(urlMapping).length > 5) {
        console.log(`   ... and ${Object.keys(urlMapping).length - 5} more`);
    }
    
    console.log('\n🎉 Background images upload completed!');
    return urlMapping;
}

// Run the upload if this script is called directly
if (require.main === module) {
    uploadBackgroundImages().catch(console.error);
}

module.exports = { uploadBackgroundImages };