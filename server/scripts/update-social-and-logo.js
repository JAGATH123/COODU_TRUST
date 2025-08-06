const fs = require('fs');
const path = require('path');

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
    '../../programs/agriculture-livelihood.html',
    '../../programs/community-development.html',
    '../../programs/environment-climate.html',
    '../../programs/health-sanitation.html',
    '../../programs/natural-resources.html',
    '../../programs/women-empowerment.html'
];

// URL mappings
const updates = [
    // Update white logo
    {
        old: /assets\/images\/logos\/coodu-trust-logo-white\.svg/g,
        new: 'https://res.cloudinary.com/dvxbg6to3/image/upload/v1754476345/coodu-trust/images/logos/logo-white.png'
    },
    // Update Facebook icon
    {
        old: /assets\/images\/icons\/social-facebook\.svg/g,
        new: 'https://res.cloudinary.com/dvxbg6to3/image/upload/v1754476344/coodu-trust/images/icons/facebook.png'
    },
    // Update Twitter icon
    {
        old: /assets\/images\/icons\/social-twitter\.svg/g,
        new: 'https://res.cloudinary.com/dvxbg6to3/image/upload/v1754476343/coodu-trust/images/icons/twitter.png'
    },
    // Update Instagram icon
    {
        old: /assets\/images\/icons\/social-instagram\.svg/g,
        new: 'https://res.cloudinary.com/dvxbg6to3/image/upload/v1754476341/coodu-trust/images/icons/instagram.png'
    }
];

function updateSocialAndLogo() {
    console.log('🔄 Updating social media icons and white logo across all pages...\n');
    
    let totalUpdates = 0;
    let filesUpdated = 0;
    
    htmlFiles.forEach(filePath => {
        const fullPath = path.join(__dirname, filePath);
        
        if (fs.existsSync(fullPath)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let fileUpdated = false;
            let fileUpdates = 0;
            
            updates.forEach(update => {
                const matches = content.match(update.old);
                if (matches) {
                    content = content.replace(update.old, update.new);
                    fileUpdates += matches.length;
                    fileUpdated = true;
                }
            });
            
            if (fileUpdated) {
                fs.writeFileSync(fullPath, content);
                console.log(`✅ Updated: ${filePath} (${fileUpdates} changes)`);
                filesUpdated++;
                totalUpdates += fileUpdates;
            }
        } else {
            console.log(`⚠️  File not found: ${filePath}`);
        }
    });
    
    console.log('\n📊 UPDATE SUMMARY');
    console.log('='.repeat(40));
    console.log(`✅ Files updated: ${filesUpdated}`);
    console.log(`🔄 Total changes: ${totalUpdates}`);
    console.log('🖼️  Updated:');
    console.log('   - White logo: logo.png');
    console.log('   - Facebook icon: facebook.png');
    console.log('   - Twitter icon: twitter.png');
    console.log('   - Instagram icon: instagram.png');
    console.log('\n🎉 Social media and logo update completed!');
}

// Run update
updateSocialAndLogo();