import { subscribeUser, getAudienceStats, updateUserTags } from '../utils/mailchimp.js';

/**
 * @desc Subscribe user to Mailchimp newsletter
 */
export const subscribeToNewsletter = async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const result = await subscribeUser(email, firstName, lastName);

    if (result.success) {
      res.status(200).json({ 
        message: 'Successfully subscribed to newsletter',
        data: result.data 
      });
    } else {
      res.status(400).json({ 
        message: result.error || 'Subscription failed' 
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc Get audience statistics
 */
export const getNewsletterStats = async (req, res) => {
  try {
    const stats = await getAudienceStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get audience stats', error: error.message });
  }
};

/**
 * @desc Add tags to subscriber
 */
export const addSubscriberTags = async (req, res) => {
  try {
    const { email, tags } = req.body;

    if (!email || !tags || !Array.isArray(tags)) {
      return res.status(400).json({ message: 'Email and tags array are required' });
    }

    const result = await updateUserTags(email, tags);

    if (result.success) {
      res.status(200).json({ 
        message: 'Tags updated successfully',
        data: result.data 
      });
    } else {
      res.status(400).json({ 
        message: result.error || 'Failed to update tags' 
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc Batch subscribe multiple users
 */
export const batchSubscribe = async (req, res) => {
  try {
    const { members } = req.body;

    if (!members || !Array.isArray(members)) {
      return res.status(400).json({ message: 'Members array is required' });
    }

    // You can implement batch operations using mailchimp API
    // This is a simplified example
    const results = await Promise.all(
      members.map(async (member) => {
        return await subscribeUser(member.email, member.firstName, member.lastName);
      })
    );

    const successful = results.filter(result => result.success);
    const failed = results.filter(result => !result.success);

    res.status(200).json({
      message: `Processed ${results.length} members`,
      successful: successful.length,
      failed: failed.length,
      failedDetails: failed
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};