// test-mailchimp.js
import mailchimp from '@mailchimp/mailchimp_marketing';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('API Key:', process.env.MAILCHIMP_API_KEY ? '✅ Present' : '❌ Missing');
console.log('Server Prefix:', process.env.MAILCHIMP_SERVER_PREFIX ? '✅ Present' : '❌ Missing');
console.log('Audience ID:', process.env.MAILCHIMP_AUDIENCE_ID ? '✅ Present' : '❌ Missing');

if (!process.env.MAILCHIMP_AUDIENCE_ID) {
  console.log('❌ MAILCHIMP_AUDIENCE_ID is missing from your .env file');
  process.exit(1);
}

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

async function testConnection() {
  try {
    const response = await mailchimp.ping.get();
    console.log('✅ Connection successful:', response);
    
    const audience = await mailchimp.lists.getList(process.env.MAILCHIMP_AUDIENCE_ID);
    console.log('✅ Audience found:', audience.name);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', error);
  }
}

testConnection();