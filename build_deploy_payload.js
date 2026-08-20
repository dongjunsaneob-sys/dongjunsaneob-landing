const fs = require('fs');
const path = require('path');

const root = '/home/ubuntu/dongjun-landing-redesign';
const files = ['index.html', 'styles.css', 'app.js', 'api/estimate.js', 'assets/support-poster.jpeg'];
const payload = {
  name: 'dongjunsaneob-landing-public',
  target: 'production',
  teamId: 'team_Hu4Tyy3zWpXYNmtl6Z4akuHl',
  projectSettings: { framework: null },
  files: files.map((file) => ({
    file,
    data: fs.readFileSync(path.join(root, file)).toString('base64'),
    encoding: 'base64',
  })),
};
fs.writeFileSync(path.join(root, 'deploy-payload.json'), JSON.stringify(payload));
