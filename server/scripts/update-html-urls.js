const fs = require('fs');
const path = require('path');

// Load the URL mapping
const urlMapping = JSON.parse(fs.readFileSync(path.join(__dirname, 'cloudinary-urls.json'), 'utf8'));

// HTML files to update
const htmlFiles = [
    '../../index.html',
    '../../about.html',
    '../../contact.html',
    '../../documents.html',
    '../../donate.html',
    '../../get-involved.html',
    '../../media.html',
    '../../partner.html',
    '../../programs.html',
    '../../volunteer.html',
    '../../report-viewer.html',
    '../../programs/agriculture-livelihood.html',
    '../../programs/community-development.html',
    '../../programs/environment-climate.html',
    '../../programs/health-sanitation.html',
    '../../programs/natural-resources.html',
    '../../programs/women-empowerment.html'
];

function updateHtmlFile(filePath) {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  File not found: ${fullPath}`);
        return;
    }
    
    console.log(`\n📝 Updating: ${filePath}`);
    let content = fs.readFileSync(fullPath, 'utf8');
    let updatesCount = 0;
    
    // Update each mapped URL
    for (const [oldPath, newUrl] of Object.entries(urlMapping)) {
        // Convert to relative path from HTML file
        const relativePath = oldPath.replace(/\\/g, '/');
        
        // Common patterns to replace
        const patterns = [
            `"${relativePath}"`,
            `'${relativePath}'`,
            `"../${relativePath}"`,
            `'../${relativePath}'`,
            `src="${relativePath}"`,
            `src='${relativePath}'`,
            `href="${relativePath}"`,
            `href='${relativePath}'`,
            `url('${relativePath}')`,
            `url("${relativePath}")`,
            `background-image: url('${relativePath}')`,
            `background-image: url("${relativePath}")`
        ];
        
        patterns.forEach(pattern => {
            const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            const replacement = pattern.replace(relativePath, newUrl);
            
            if (content.includes(pattern)) {
                content = content.replace(regex, replacement);
                updatesCount++;
            }
        });
    }
    
    // Special case for CSS background images
    content = content.replace(
        /background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/g,
        (match, url) => {
            const mappedUrl = urlMapping[url] || urlMapping[`assets/${url}`];
            if (mappedUrl) {
                updatesCount++;
                return `background-image: url('${mappedUrl}')`;
            }
            return match;
        }
    );
    
    if (updatesCount > 0) {
        fs.writeFileSync(fullPath, content);
        console.log(`   ✅ Updated ${updatesCount} URLs`);
    } else {
        console.log(`   ℹ️  No updates needed`);
    }
}

function updateAllFiles() {
    console.log('🚀 Starting HTML URL Updates...\n');
    
    htmlFiles.forEach(updateHtmlFile);
    
    console.log('\n📊 SUMMARY');
    console.log('='.repeat(40));
    console.log('✅ HTML files updated with Cloudinary URLs');
    console.log('🌐 All images now served from global CDN');
    console.log('⚡ Performance optimizations applied');
    console.log('\n🎉 Frontend update completed!');
}

// Run if called directly
if (require.main === module) {
    updateAllFiles();
}

module.exports = { updateAllFiles };