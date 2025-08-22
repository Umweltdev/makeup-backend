import mailchimp from '@mailchimp/mailchimp_marketing';

// Configure Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export const subscribeUser = async (email, firstName, lastName) => {
  try {
    const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    });

    return { success: true, data: response };
  } catch (error) {
    console.error('Mailchimp error:', error.response?.body || error.message);
    return { 
      success: false, 
      error: error.response?.body?.title || 'Subscription failed' 
    };
  }
};

export const getAudienceStats = async () => {
  try {
    const response = await mailchimp.lists.getList(process.env.MAILCHIMP_AUDIENCE_ID);
    return response;
  } catch (error) {
    console.error('Mailchimp error:', error);
    throw error;
  }
};

export const updateUserTags = async (email, tags) => {
  try {
    const subscriberHash = require('crypto').createHash('md5').update(email.toLowerCase()).digest('hex');
    
    const response = await mailchimp.lists.updateListMemberTags(
      process.env.MAILCHIMP_AUDIENCE_ID,
      subscriberHash,
      { tags: tags.map(tag => ({ name: tag, status: 'active' })) }
    );

    return { success: true, data: response };
  } catch (error) {
    console.error('Mailchimp error:', error);
    return { success: false, error: error.message };
  }
};