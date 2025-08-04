const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create a zip file with all project files
function createProjectZip() {
  const output = fs.createWriteStream('animal-welfare-platform.zip');
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level
  });

  output.on('close', function() {
    console.log('Project archived! Total bytes: ' + archive.pointer());
    console.log('Download: animal-welfare-platform.zip');
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  // Add all project files
  archive.directory('src/', 'src/');
  archive.directory('server/', 'server/');
  archive.directory('public/', 'public/');
  archive.file('package.json', { name: 'package.json' });
  archive.file('vite.config.js', { name: 'vite.config.js' });
  archive.file('tailwind.config.js', { name: 'tailwind.config.js' });
  archive.file('postcss.config.js', { name: 'postcss.config.js' });
  archive.file('eslint.config.js', { name: 'eslint.config.js' });
  archive.file('index.html', { name: 'index.html' });
  archive.file('.env', { name: '.env' });
  archive.file('README.md', { name: 'README.md' });

  archive.finalize();
}

// Alternative: Create a simple file listing
function createFileList() {
  const files = [
    'package.json',
    'vite.config.js', 
    'tailwind.config.js',
    'postcss.config.js',
    'eslint.config.js',
    'index.html',
    '.env',
    'README.md',
    'src/main.jsx',
    'src/App.jsx',
    'src/index.css',
    'src/App.css',
    'src/context/AuthContext.jsx',
    'src/pages/Home.jsx',
    'src/pages/ReportIncident.jsx',
    'src/pages/NGOListing.jsx',
    'src/pages/ReportTracker.jsx',
    'src/pages/NGOLogin.jsx',
    'src/pages/NGORegister.jsx',
    'src/pages/NGODashboard.jsx',
    'src/pages/AdminLogin.jsx',
    'src/pages/AdminDashboard.jsx',
    'src/pages/SuperAdminLogin.jsx',
    'src/pages/NgoAdminLogin.jsx',
    'src/components/common/Navbar.jsx',
    'src/components/common/Footer.jsx',
    'src/components/common/LoadingSpinner.jsx',
    'src/components/common/ProtectedRoute.jsx',
    'src/components/admin/SuperAdminDashboard.jsx',
    'src/components/admin/NgoAdminDashboard.jsx',
    'src/components/forms/FileUpload.jsx',
    'src/components/maps/MapComponent.jsx',
    'server/package.json',
    'server/server.js'
  ];

  console.log('=== ANIMAL WELFARE PLATFORM - FILE STRUCTURE ===\n');
  files.forEach(file => {
    console.log(`📁 ${file}`);
  });
  
  console.log('\n=== SETUP INSTRUCTIONS ===');
  console.log('1. Create a new directory for your project');
  console.log('2. Copy all the files shown above to their respective locations');
  console.log('3. Run: npm install');
  console.log('4. Run: npm run dev');
  console.log('\n=== FEATURES INCLUDED ===');
  console.log('✅ Complete Animal Welfare Reporting Platform');
  console.log('✅ Super Admin & NGO Admin Panels');
  console.log('✅ Interactive Maps with Mapbox');
  console.log('✅ File Upload System');
  console.log('✅ Responsive Design');
  console.log('✅ Authentication System');
  console.log('✅ Report Tracking');
  console.log('✅ NGO Management');
}

// Run the file listing
createFileList();