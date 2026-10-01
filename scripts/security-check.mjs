import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const tracked=execFileSync('git',['ls-files'],{encoding:'utf8'})
  .split(/\r?\n/).map(x=>x.trim()).filter(Boolean);

const forbiddenPath=/\.(?:jks|keystore|p12|pfx|pem|key|der|pk8)$/i;
const forbiddenNames=new Set([
  'ci/debug.keystore.b64',
  'keystore.properties',
  'signing.properties'
]);

const badPaths=tracked.filter(p=>forbiddenPath.test(p)||forbiddenNames.has(p));
if(badPaths.length){
  console.error('Forbidden signing/private-key material is tracked:');
  for(const p of badPaths)console.error(' - '+p);
  process.exit(1);
}

const pemMarkers=[
  '-----BEGIN PRIVATE KEY-----',
  '-----BEGIN RSA PRIVATE KEY-----',
  '-----BEGIN EC PRIVATE KEY-----',
  '-----BEGIN OPENSSH PRIVATE KEY-----'
];

const textCandidates=tracked.filter(p=>!/(?:package-lock\.json|LICENSE)$/i.test(p));
for(const path of textCandidates){
  let text;
  try{text=await readFile(path,'utf8')}catch{continue}
  for(const marker of pemMarkers){
    if(text.includes(marker)){
      console.error('Private-key marker found in tracked file: '+path);
      process.exit(1);
    }
  }
}

console.log('Security material check passed: no tracked private signing key files or PEM private keys.');
