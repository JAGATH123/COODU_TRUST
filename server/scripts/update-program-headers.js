const fs = require('fs');
const path = require('path');

// Load the URL mapping
const urlMappingPath = path.join(__dirname, 'background-images-urls.json');
const urlMapping = JSON.parse(fs.readFileSync(urlMappingPath, 'utf8'));

// Mapping of program HTML files to their corresponding background images
const programMapping = {
    'agricultural-technology.html': 'Agricultural Technology & Youth Engagement',
    'community-health-services.html': 'Community Health Services',
    'consultancy-hr.html': 'Consultancy and HR Management',
    'digital-literacy-it-training.html': 'Digital Literacy & IT Training',
    'disease-specific-interventions.html': 'Disease-Specific Interventions',
    'education-skilling.html': 'Education and Skilling',
    'entrepreneurship-enterprise-development.html': 'Entrepreneurship & Enterprise Development',
    'environment-resilience.html': 'Environment and Resilience',
    'farmer-collectivization.html': 'Farmer Collectivization & Agribusiness',
    'formal-higher-education-support.html': 'Formal & Higher Education Support',
    'health-sanitation.html': 'Health and Sanitation',
    'horticulture-diversified.html': 'HORICULTURE',
    'livestock-allied.html': 'Livestock & Allied Activities',
    'microfinance-financial-inclusion.html': 'Microfinance & Financial Inclusion',
    'organic-farming.html': 'Organic Farming Practices',
    'plantation-afforestation.html': 'PlantationAfforestation',
    'sanitation-hygiene-infrastructure.html': 'Sanitation & Hygiene Infrastructure',
    'school-infrastructure-development.html': 'School Infrastructure Development',
    'shg-community-mobilization.html': 'SHG & Community Mobilization',
    'social-empowerment-leadership.html': 'Social Empowerment & Leadership',
    'sustainable-agriculture.html': 'Sustainable Agriculture',
    'technology-knowledge-dissemination.html': 'Technology & Knowledge Dissemination',
    'vocational-livelihood-training.html': 'Vocational & Livelihood Training',
    'water-quality-safety.html': 'Water Quality & Safety',
    'water-resource-management.html': 'WaterResourceManagement',
    'watershed-management.html': 'Watershed Management',
    'women-empowerment.html': 'Women Empowerment',
    'biodiversity-conservation.html': 'biodiversity_conversation'
};

async function updateProgramHeaders() {
    const programsDir = path.join(__dirname, '../../programs');
    const results = [];
    
    console.log('🚀 Starting Program Header Updates...\n');
    console.log(`📁 Programs directory: ${programsDir}\n`);
    
    if (!fs.existsSync(programsDir)) {
        console.log(`❌ Programs directory not found: ${programsDir}`);
        return;
    }
    
    // Process each mapping
    for (const [htmlFile, imageName] of Object.entries(programMapping)) {
        const filePath = path.join(programsDir, htmlFile);
        
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  File not found: ${htmlFile}`);
            results.push({
                file: htmlFile,
                success: false,
                reason: 'File not found'
            });
            continue;
        }
        
        const imageUrl = urlMapping.original[imageName];
        if (!imageUrl) {
            console.log(`⚠️  Image URL not found for: ${imageName}`);
            results.push({
                file: htmlFile,
                success: false,
                reason: 'Image URL not found'
            });
            continue;
        }
        
        try {
            // Read the HTML file
            let htmlContent = fs.readFileSync(filePath, 'utf8');
            
            // Find and replace the page header background image
            const headerRegex = /<section class="page-header"[^>]*style="background-image:\s*url\([^)]+\);?"[^>]*>/i;
            const match = htmlContent.match(headerRegex);
            
            if (match) {
                const newHeader = `<section class="page-header" style="background-image: url('${imageUrl}');">`;
                htmlContent = htmlContent.replace(headerRegex, newHeader);
                
                // Write the updated content back
                fs.writeFileSync(filePath, htmlContent, 'utf8');
                
                console.log(`✅ Updated: ${htmlFile}`);
                console.log(`   Image: ${imageName}`);
                console.log(`   URL: ${imageUrl}\n`);
                
                results.push({
                    file: htmlFile,
                    success: true,
                    imageName: imageName,
                    imageUrl: imageUrl
                });
            } else {
                console.log(`⚠️  No page header found in: ${htmlFile}`);
                results.push({
                    file: htmlFile,
                    success: false,
                    reason: 'No page header found'
                });
            }
            
        } catch (error) {
            console.log(`❌ Error updating ${htmlFile}:`, error.message);
            results.push({
                file: htmlFile,
                success: false,
                reason: error.message
            });
        }
    }
    
    // Generate summary report
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log('\n📊 UPDATE SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully updated: ${successful.length}`);
    console.log(`❌ Failed updates: ${failed.length}`);
    console.log(`📋 Total processed: ${results.length}`);
    
    if (failed.length > 0) {
        console.log('\n❌ Failed updates:');
        failed.forEach(f => {
            console.log(`   - ${f.file}: ${f.reason}`);
        });
    }
    
    console.log('\n🎉 Program header updates completed!');
    return results;
}

// Run the update if this script is called directly
if (require.main === module) {
    updateProgramHeaders().catch(console.error);
}

module.exports = { updateProgramHeaders };